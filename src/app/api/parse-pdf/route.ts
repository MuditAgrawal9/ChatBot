import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    // For debugging: log the file
    // console.log("Received file:", file);

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamically import pdf-parse (server-side only)
    const pdfParse = (await import("pdf-parse-debugging-disabled")).default;
    const data = await pdfParse(buffer);
    console.log("Parsing done");
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("(route)PDF Parse Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "PDF parsing failed" },
      { status: 500 }
    );
  }
}
