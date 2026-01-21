"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Props {
  rubrique?: string;
  niveau?: string;
  defiEnCours?: any;
  userAnswer?: string;
  nomEleve?: string;

  mode?: "actif" | "passif";
  messagePassif?: string;
}

export default function ChatbotLogi({
  rubrique,
  niveau,
  defiEnCours,
  userAnswer,
  nomEleve = "Explorateur",
  mode,
  messagePassif,
}: Props) {
  const effectiveMode: "actif" | "passif" = mode ?? "actif";

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([]);

  const endRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false); // évite le double message

  /* 🔽 Scroll automatique */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 👋 Message automatique à l’ouverture */
  useEffect(() => {
    if (open && effectiveMode === "actif" && !greetedRef.current) {
      setMessages([
        {
          from: "bot",
          text: `👋 Bonjour ${nomEleve} ! Comment je peux t’aider ?`,
        },
      ]);
      greetedRef.current = true;
    }
  }, [open, effectiveMode, nomEleve]);

  const envoyer = async () => {
    if (effectiveMode === "passif") return;
    if (!input.trim()) return;

    const question = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { from: "user", text: question },
      { from: "bot", text: "…" },
    ]);

    const systemMessage = `
Tu es LOGI, assistant pédagogique.

Élève : ${nomEleve}
Rubrique : ${rubrique}
Niveau : ${niveau}

Défi :
${JSON.stringify(defiEnCours)}

Réponse élève :
${userAnswer ?? "Aucune"}

Règles :
- Adresses-toi à l'élève par son nom.
- Réponds en UNE SEULE phrase courte.
- Réponds UNIQUEMENT à la question posée par l'élève.
- Sois précis et pédagogique.
- NE DONNE JAMAIS la solution complète.
- Pour QCM : dis si c’est juste ou faux et pourquoi.
- Pour algorithme / Python :
  - ignore majuscules/minuscules
  - ignore les espaces
  - ignore écrire(...) et print(...)
- Ne parle PAS si la question n’est pas claire.
- Pas de phrases vagues.
`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemMessage,
          userMessage: question,
        }),
      });

      const data = await res.json();

      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, text: data.reply } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, text: "❌ Erreur de connexion avec LOGI." }
            : m
        )
      );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 🟢 Icône LOGI */}
      {effectiveMode === "actif" && !open && (
        <button
          onClick={() => setOpen(true)}
          className="hover:scale-110 transition"
        >
          <Image src="/logi.png" alt="LOGI" width={64} height={64} />
        </button>
      )}

      {/* 🪟 Fenêtre */}
      {(open || effectiveMode === "passif") && (
        <div className="w-80 h-[420px] bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-cyan-500/20">
            <span className="text-cyan-400 font-bold">LOGI</span>
            {effectiveMode === "actif" && (
              <button
                onClick={() => setOpen(false)}
                className="text-red-400"
              >
                ✖
              </button>
            )}
          </div>

          {/* Messages (SCROLL) */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm scrollbar-thin scrollbar-thumb-cyan-500/40">
            {effectiveMode === "passif" ? (
              <div className="flex gap-2 items-start">
                <Image src="/logi.png" alt="LOGI" width={32} height={32} />
                <div className="bg-cyan-500/10 text-cyan-200 px-3 py-2 rounded-2xl">
                  {messagePassif}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[85%] ${
                      m.from === "user"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-cyan-300"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          {effectiveMode === "actif" && (
            <div className="flex gap-2 p-3 border-t border-cyan-500/20">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && envoyer()}
                placeholder="Pose ta question…"
                className="flex-1 bg-black/40 text-white px-3 py-2 rounded-lg outline-none"
              />
              <button
                onClick={envoyer}
                className="bg-cyan-600 hover:bg-cyan-500 px-3 rounded-lg font-bold"
              >
                ➤
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
