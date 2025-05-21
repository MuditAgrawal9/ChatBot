"use client";
import { useEffect, useRef, useState } from "react";
import PdfUploader from "./PdfUploader";

interface Message {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("sb-ufwrynmkgilpmchhslzi-auth-token");
      const res = await fetch("/api/chat-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.messages) setMessages(data.messages || []);
    };
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input, created_at: new Date().toISOString() },
    ]);
    setLoading(true);

    const token = localStorage.getItem("sb-ufwrynmkgilpmchhslzi-auth-token");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: input, pdfText }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.response,
        created_at: data.created_at || new Date().toISOString(),
      },
    ]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PdfUploader onPdfParsed={setPdfText} />
      <div className="h-[30rem] overflow-y-auto border rounded-2xl p-4 bg-gradient-to-br from-white via-blue-50 to-blue-100 mb-4 shadow-lg flex flex-col gap-2 transition-all">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-20">
            Start the conversation by asking a question!
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 group ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow text-sm">
                AI
              </div>
            )}
            <div className="flex flex-col max-w-[70%]">
              <span
                className={`
                  px-4 py-2 rounded-2xl shadow transition-all
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-blue-100 rounded-bl-md"
                  }
                  group-hover:scale-[1.02]
                `}
              >
                {msg.content}
              </span>
              {msg.created_at && (
                <span className="text-xs text-gray-400 mt-1 self-end">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow text-sm">
                U
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2 animate-pulse">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow text-sm">
              AI
            </div>
            <span className="px-4 py-2 bg-white text-gray-400 rounded-2xl shadow">
              Gemini is typing...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 py-2 z-10">
        <form
          className="flex gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Type your question..."
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              loading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
