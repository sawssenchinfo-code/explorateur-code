import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { userMessage, systemMessage } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    });

    const botReply = completion.choices[0]?.message?.content || "Désolé, je n'ai pas compris.";

    // 🎯 Renvoie 'reply' pour correspondre au frontend ChatbotLogi.tsx
    return NextResponse.json({ reply: botReply });
  } catch (error: any) {
    console.error("Erreur Groq:", error);
    return NextResponse.json({ reply: "❌ Erreur de connexion avec LOGI." }, { status: 500 });
  }
}