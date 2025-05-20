import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, pdfText } = await req.json();

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ response: responseText });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to process chat request" },
      { status: 500 }
    );
  }
}
