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
  messagePassif?: React.ReactNode;
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
  const [usageCount, setUsageCount] = useState(0);
  const MAX_QUESTIONS = 15; // 🛡️ Limite par élève
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
    // 🛡️ SÉCURITÉ : Vérification de la limite
  if (usageCount >= MAX_QUESTIONS) {
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: "⚠️ Tu as posé beaucoup de questions ! Concentre-toi sur ton défi maintenant. 🚀" },
    ]);
    return;
  }
    const question = input.trim();
    setInput("");
    // On incrémente le compteur
    setUsageCount(prev => prev + 1);
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
  - Ignore TOUS les espaces (même entre les mots-clés et les nombres, ex: "nmod2" est identique à "n mod 2").
  - ignore majuscules/minuscules
  - ignore les espaces
  - Valide la logique si les éléments essentiels (si, alors, sinon, mod, ==, :) sont présents dans le bon ordre.
  - Ne fais JAMAIS de remarque sur un espace manquant ou en trop.
  - ignore écrire(...) et print(...)
- Ne parle PAS si la question n’est pas claire.
- Pas de phrases vagues.
- Ne réponds pas si on te demande la solution ou un pseudocode
RÈGLES STRICTES D'INTERDICTION (SÉCURITÉ ET PÉDAGOGIE) :
1. INTERDICTION ABSOLUE de donner la solution complète, le code Python, le pseudocode, l'algorithme complet ou le script.
2. Si l'élève demande explicitement : "donne-moi la solution", "donne le code", "donne le script", "donne l'algorithme", "résous à ma place" ou toute formule similaire :
   -> REFUSE poliment mais fermement en UNE phrase.
   -> Pose-lui une question de guidage ou donne un indice sur la Première étape.
   -> Exemple de réponse : "Je ne peux pas te donner le code directement, ${nomEleve} ! Par quelle condition ou mot-clé dois-tu commencer selon toi ?"

POSTURE SOCRATIQUE ET STRATÉGIE PÉDAGOGIQUE :
- Adresse-toi toujours à l'élève par son nom (${nomEleve}).
- Réponds en UNE SEULE sentence courte et claire.
- Ne fais jamais le travail à la place de l'élève : aide-le à réfléchir par lui-même (méthode socratique).
- Pour un QCM : indique si la réponse est juste ou fausse et explique pourquoi sans donner la réponse finale directe.
- Pour la logique et le code :
  * Ignore la casse (majuscules/minuscules) et les espaces secondaires.
  * Si la logique est bonne, félicite l'élève.
  * Si elle est fausse, pointe du doigt l'élément manquant (ex: "Il te manque deux-points : à la fin de ton Si").

SI LA QUESTION N'EST PAS CLAIRE OU HORS-SUJET :
- Invite simplement l'élève à préciser ce qui le bloque dans son défi.
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
      {/* 🟢 Icône LOGI (Mode Actif Fermé) */}
      {effectiveMode === "actif" && !open && (
        <button
          onClick={() => setOpen(true)}
          className="hover:scale-110 transition drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        >
          <Image src="/logi.png" alt="LOGI" width={64} height={64} />
        </button>
      )}

      {/* 💬 Mode PASSIF : Stable et à droite */}
      {effectiveMode === "passif" && (
        <div className="flex items-end gap-3 max-w-[300px] flex-row-reverse"> {/* flex-row-reverse pour mettre l'image à droite du texte */}
          
          {/* L'image de LOGI (Seule cette partie vibrera via le parent dans QuizFinal) */}
          <div className="flex-shrink-0">
            <Image 
              src="/logi.png" 
              alt="LOGI" 
              width={48} 
              height={48} 
              className="drop-shadow-[0_0_8px_cyan]" 
            />
          </div>

          {/* La Bulle : Stable, ne bouge jamais, texte clair */}
          <div className="bg-[#0f172a]/95 border border-cyan-500/50 px-4 py-2 rounded-2xl rounded-br-none shadow-xl">
             <p className="text-cyan-200 text-xs italic leading-relaxed">
              {messagePassif}
            </p>
          </div>
        </div>
      )}
      {/* 🪟 Mode ACTIF : Fenêtre de Chat complète */}
      {effectiveMode === "actif" && open && (
        <div className="w-80 h-[420px] bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center gap-2">
              <Image src="/logi.png" alt="LOGI" width={20} height={20} />
              <span className="text-cyan-400 font-bold text-sm tracking-widest">LOGI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-red-400 hover:text-red-300 transition">✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 text-sm scrollbar-thin scrollbar-thumb-cyan-500/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] shadow-sm ${
                    m.from === "user" ? "bg-cyan-600 text-white rounded-tr-none" : "bg-slate-800 text-cyan-300 rounded-tl-none"
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 bg-black/20 border-t border-cyan-500/10">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && envoyer()}
              placeholder="Pose ta question…"
              className="flex-1 bg-slate-900 border border-cyan-500/20 text-white px-3 py-2 rounded-xl text-xs outline-none focus:border-cyan-500/50"
            />
            <button onClick={envoyer} className="bg-cyan-600 hover:bg-cyan-500 p-2 rounded-xl transition">
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}