import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/chat
 * Handles chat requests by:
 * 1. Authenticating users via Supabase
 * 2. Storing user messages in database
 * 3. Generating AI responses using Gemini API
 * 4. Storing AI responses in database
 */
export async function POST(req: NextRequest) {
  // Extract message and PDF context from request body
  const { message, pdfText } = await req.json();

  // Handle authorization header with Bearer token
  const authHeader = req.headers.get("authorization");
  // console.log("authHeader:", authHeader);
  let accessToken = null;

  // Extract token from Authorization header
  if (authHeader?.startsWith("Bearer ")) {
    const possibleJson = authHeader.slice(7); // Remove 'Bearer '
    try {
      // Try to parse as JSON
      const obj = JSON.parse(possibleJson);
      accessToken = obj.access_token;
    } catch {
      // If not JSON, treat as plain token string
      accessToken = possibleJson;
    }
  }
  const token = accessToken;
  // console.log("access_token", accessToken);
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Initialize Supabase client with authenticated token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  // Get authenticated user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log("(chat api)User:", user);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    // Extract response text from Gemini API response
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
