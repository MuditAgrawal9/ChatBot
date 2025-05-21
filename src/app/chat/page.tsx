"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import ChatInterface from "@/components/ChatInterface";

/**
 * ChatPage Component
 * ------------------
 * Main chat page for authenticated users.
 * Redirects to /login if not authenticated.
 * Provides a logout button and renders the chat interface.
 */
export default function ChatPage() {
  const router = useRouter();

  // On mount, check if the user is authenticated.
  // If not, redirect to the login page.
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
    });
  }, [router]);

  // Logout handler
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await supabase.auth.signOut();
      router.replace("/login");
    }
  };

  return (
    <main className="w-full max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-1">
          PDF Chat Assistant
        </h1>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      {/* Main chat interface */}
      <ChatInterface />
    </main>
  );
}
