import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function POST(req: NextRequest) {
  const { message, pdfText } = await req.json();
  // Get user from Supabase auth (example, adapt as needed)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User in chat API:", user);

  try {
    // Store user message
    await supabase.from("chat_messages").insert([
      {
        user_id: user?.id,
        role: "user",
        content: message,
      },
    ]);

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `PDF Context: ${pdfText}\n\nUser Query: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();
    // console.log("Gemini API response:", data); // Add this line

    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // Store assistant response
    await supabase.from("chat_messages").insert([
      {
        user_id: user?.id,
        role: "assistant",
        content: responseText,
      },
    ]);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to process chat request" },
      { status: 500 }
    );
  }
}
