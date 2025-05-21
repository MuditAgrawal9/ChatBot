"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-8">
      <h1 className="text-4xl font-bold mb-2 text-blue-800 text-center">
        PDF Chat Assistant
      </h1>
      <p className="text-lg text-blue-700 text-center mb-8 max-w-xl">
        Upload a PDF and chat with Gemini AI! Secure, private, and lightning
        fast.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg shadow hover:bg-blue-50 transition">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
