"use client";
import { useState } from "react";
import PdfUploader from "./PdfUploader";
// import { supabase } from "@/lib/supabase-client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pdfText, setPdfText] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, pdfText }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.response },
    ]);
    setInput("");
  };

  return (
    <div>
      <PdfUploader onPdfParsed={setPdfText} />
      <div className="h-80 overflow-y-auto border rounded-lg p-4 bg-white mb-4 text-black">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.role === "user" ? "text-right" : ""}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-400" : "bg-gray-300"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 border rounded"
          placeholder="Type your question..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
