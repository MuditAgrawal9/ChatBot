"use client";
import { useState, ChangeEvent } from "react";

interface PdfUploaderProps {
  onPdfParsed: (text: string) => void;
}

/**
 * PdfUploader Component
 * ---------------------
 * Allows users to upload a PDF file, sends it to the backend for parsing,
 * and returns the extracted text to the parent via onPdfParsed.
 *
 * Props:
 * - onPdfParsed: function called with the extracted text after parsing
 */
export default function PdfUploader({ onPdfParsed }: PdfUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /**
   * Handles file selection and triggers PDF parsing via API.
   * @param e - File input change event
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("file", file);

    // Send the file to the backend API for parsing
    const res = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Failed to parse PDF.");
      return;
    }

    // Extract parsed text from response and pass to parent
    const { text } = await res.json();
    onPdfParsed(text);
    alert("PDF uploaded and parsed!");
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-full max-w-xs h-40 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
        >
          {/* Show file info if selected, otherwise show upload prompt */}
          {selectedFile ? (
            <div className="flex flex-col items-center">
              {/* PDF Icon */}
              <svg
                className="w-12 h-12 text-green-500 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
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
                  PDF
                </text>
              </svg>
              <span className="text-green-600 font-semibold text-sm">
                {selectedFile.name}
              </span>
              <span className="text-xs text-gray-500 mt-1">File selected!</span>
            </div>
          ) : (
            <>
              {/* Upload Icon and prompt */}
              <svg
                className="w-12 h-12 text-blue-400 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-blue-600 font-semibold">
                Click to upload PDF
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PDF only, max 10MB
              </span>
            </>
          )}
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
