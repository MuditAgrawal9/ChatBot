"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
    });
  }, [router]);

  return (
    <main className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        PDF Chat Assistant
      </h1>
      <ChatInterface />
    </main>
  );
}
