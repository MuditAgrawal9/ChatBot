import { NextRequest, NextResponse } from "next/server";

// Specify Node.js runtime for this route (required for Buffer and some Node APIs)
export const runtime = "nodejs";

/**
 * POST /api/pdf-parse
 * Handles PDF file uploads, parses the PDF, and returns extracted text.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse incoming multipart/form-data to get the uploaded file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamically import pdf-parse (server-side only)
    const pdfParse = (await import("pdf-parse-debugging-disabled")).default;

    // Parse the PDF buffer to extract text content
    const data = await pdfParse(buffer);
    console.log("Parsing done");

    // Return the extracted text as JSON
    return NextResponse.json({ text: data.text });
  } catch (error) {
    // Log and return any errors encountered during parsing
    // console.error("(route)PDF Parse Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "PDF parsing failed" },
      { status: 500 }
    );
  }
}
