import { NextResponse } from "next/server";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", // 👈 IMPORTANT : On redirige vers Groq
});

export async function POST(req: Request) {
  try {
    const { userMessage,systemMessage } = await req.json(); // On ne prend que le message de l'utilisateur

   const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // 🚀 Un modèle gratuit, ultra rapide et très puissant
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

   const reply = response.choices[0].message.content;

    return NextResponse.json({ reply });
    
  } catch (error: any) {
    console.error("Erreur Groq:", error);
    return NextResponse.json(
      { reply: "Désolé, ma connexion avec la station spatiale LOGI a été coupée ! 🛰️" },
      { status: 500 }
    );
  }
}