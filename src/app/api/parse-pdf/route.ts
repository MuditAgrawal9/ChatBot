import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // Ensure Node.js runtime

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Dynamically import pdf-parse (server-side only)
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);

  return NextResponse.json({ text: data.text });
}
