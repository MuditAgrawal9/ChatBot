"use client";
import { ChangeEvent } from "react";

interface PdfUploaderProps {
  onPdfParsed: (text: string) => void;
}

export default function PdfUploader({ onPdfParsed }: PdfUploaderProps) {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    console.log("(PdfUploader) response:", res);

    if (!res.ok) {
      alert("Failed to parse PDF.");
      return;
    }

    const { text } = await res.json();
    onPdfParsed(text);
    alert("PDF uploaded and parsed!");
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block"
      />
    </div>
  );
}
