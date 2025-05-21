"use client";
import { useEffect, useState } from "react";
import PdfUploader from "./PdfUploader";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      // const res = await fetch("/api/chat-history", {
      //   credentials: "include", // 👈 Send cookies
      // });
      const token = localStorage.getItem("sb-ufwrynmkgilpmchhslzi-auth-token");
      console.log("(ChatInterface)token", token);
      const res = await fetch("/api/chat-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("chat history data:", data);
      if (data.messages) setMessages(data.messages || []);
    };
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
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
      { role: "assistant", content: data.response },
    ]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PdfUploader onPdfParsed={setPdfText} />
      <div className="h-96 overflow-y-auto border rounded-2xl p-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 mb-4 shadow-lg flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 animate-fadeIn ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <span className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold shadow">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="white"
                  />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="8"
                    fill="currentColor"
                    fontWeight="bold"
                    dy=".3em"
                  >
                    AI
                  </text>
                </svg>
              </span>
            )}
            <span
              className={`
                px-4 py-2 max-w-[70%] break-words rounded-2xl shadow
                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                }
                transition-all
              `}
            >
              {msg.content}
            </span>
            {msg.role === "user" && (
              <span className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="white"
                  />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="8"
                    fill="currentColor"
                    fontWeight="bold"
                    dy=".3em"
                  >
                    U
                  </text>
                </svg>
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2 animate-pulse">
            <span className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold shadow">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="white"
                />
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fontSize="8"
                  fill="currentColor"
                  fontWeight="bold"
                  dy=".3em"
                >
                  AI
                </text>
              </svg>
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-2xl shadow">
              Gemini is typing...
            </span>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 py-2">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Type your question..."
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
