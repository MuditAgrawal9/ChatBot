// import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  //   console.log("Request:", req);
  const authHeader = req.headers.get("authorization");
  console.log("authHeader:", authHeader);
  //   const token = authHeader?.replace("Bearer ", "");
  //   console.log("token", token);

  let accessToken = null;
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
  console.log("access_token", accessToken);
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("(chat-history api)User:", user);

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
