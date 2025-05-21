import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/chat-history
 * Retrieves authenticated user's chat history from Supabase database
 * Requires valid access token in Authorization header
 */

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
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

  //   console.log("(chat-history api)User:", user);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}
