"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatbotBienvenue from "@/components/ChatbotBienvenue";
import emailjs from "@emailjs/browser";

emailjs.init("Zvz_0_VehoIOgs4ju");

export default function Accueil() {
  const [nom, setNom] = useState("");
  const [identifiant, setIdentifiant] = useState("");
  const [erreur, setErreur] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (nom.trim().length < 2) {
      setErreur("Veuillez entrer un nom valide !");
      return;
    }

    if (identifiant.toUpperCase() === "COND26") {
      localStorage.setItem("nom_explorateur", nom);
      localStorage.setItem("score_explorateur", "0");
      router.push("/selection");
    } else {
      setErreur("Identifiant incorrect !!!");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 relative">
      
      {/* Icône Explorateur */}
      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-full border-4 border-white/20 flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-pulse">
          🧭
        </div>
      </div>

      {/* Titre */}
      <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center">
        L'EXPLORATEUR DE CODE
      </h1>

      {/* Carte */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-md">
        <div className="space-y-6">

          {/* Nom */}
          <div className="space-y-2">
            <label className="text-cyan-400 text-xs font-black uppercase tracking-widest ml-1">
              1. Ton Nom d'Explorateur
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
                localStorage.setItem("nom_explorateur", e.target.value);
              }}
              placeholder="Ex : Sawssen"
              className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-cyan-500 outline-none font-bold placeholder:text-slate-600"
            />
          </div>

          {/* Identifiant */}
          <div className="space-y-2">
            <label className="text-cyan-400 text-xs font-black uppercase tracking-widest ml-1">
              2. Code de la Mission
            </label>
            <input
              type="password"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              placeholder="••••••"
              className="w-full bg-slate-900/80 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-cyan-500 outline-none font-mono tracking-[0.4em] text-center"
            />
          </div>

          {/* Erreur */}
          {erreur && (
            <p className="text-red-400 text-sm font-bold text-center">
              ⚠️ {erreur}
            </p>
          )}

          {/* Bouton */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 uppercase"
          >
            COMMENCER L'EXPLORATION
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs opacity-60 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
        Développé par <span className="text-cyan-400 font-bold">Sawssen CHTIOUI</span> • © 2026
      </div>

      {/* Chatbot */}
      <ChatbotBienvenue context="accueil" />
    </main>
  );
}
