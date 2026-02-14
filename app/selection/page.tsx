"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatbotLogi from "@/components/ChatbotLogi";

const missions = [
  {
    id: "simple",
    title: "Structure Simple",
    condition: "IF (Si)",
    description: "Apprends à donner un ordre simple à LOGI.",
    icon: "🚀",
  },
  {
    id: "complete",
    title: "Structure Complète",
    condition: "IF / ELSE (Si / Sinon)",
    description: "Gère les alternatives quand la condition est fausse.",
    icon: "🌓",
  },
  {
    id: "generalisee",
    title: "Structure Généralisée",
    condition: "ELIF (Sinon Si)",
    description: "Maîtrise les choix multiples complexes.",
    icon: "🌈",
  },
];

export default function SelectionMission() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [missionsFinies, setMissionsFinies] = useState<string[]>([]);

  useEffect(() => {
    setNom(localStorage.getItem("nom_explorateur") || "Explorateur");

    // Vérification des missions réussies
    const terminees: string[] = [];
    if (localStorage.getItem("mission_simple_faite") === "true") terminees.push("simple");
    if (localStorage.getItem("mission_complete_faite") === "true") terminees.push("complete");
    if (localStorage.getItem("mission_generalisee_faite") === "true") terminees.push("generalisee");

    setMissionsFinies(terminees);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0f172a] p-8 flex flex-col items-center justify-center overflow-hidden">

      {/* 🌌 Effets visuels bleu foncé */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-800/30 rounded-full blur-3xl"></div>
      </div>

      {/* 🧭 En-tête */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter">
          Tableau de Bord : <span className="text-cyan-400">{nom}</span>
        </h1>
        <p className="text-slate-400 italic">
          Complète toutes les missions pour débloquer l'évaluation finale.
        </p>
      </div>

      {/* 📘 Texte pédagogique */}
      <div className="max-w-3xl text-center text-slate-300 mb-12 bg-slate-900/40 border border-white/10 rounded-2xl px-6 py-5 backdrop-blur">
        <p className="font-semibold text-cyan-400 mb-2">
          🎯 Objectif
        </p>
        <p className="text-sm leading-relaxed">
          Tu vas parcourir toutes les missions pour apprendre à utiliser les structures
          conditionnelles.
        </p>

        <p className="text-sm leading-relaxed mt-3">
          ✅ Une mission peut apparaître comme <strong>validée</strong> si tu l’as
          déjà explorée auparavant. Tu peux toujours la refaire pour t’entraîner
          ou renforcer ta compréhension.
        </p>
      </div>

      {/* 🧩 Cartes des missions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {missions.map((mission, index) => {
          const estFait = missionsFinies.includes(mission.id);

          return (
            <motion.button
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/jeu/${mission.id}/1`)}
              className={`relative group overflow-hidden bg-slate-900 border ${
                estFait ? "border-green-500/50" : "border-white/10"
              } p-8 rounded-[2.5rem] hover:border-cyan-500 transition-all text-left shadow-2xl`}
            >
              {/* Badge validé */}
              {estFait && (
                <div className="absolute top-6 right-6 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full text-center shadow-lg">
                  VALIDÉ ✅
                  <div className="text-[9px] font-normal opacity-90">
                    Mission déjà explorée
                  </div>
                </div>
              )}

              <div className="text-5xl mb-6">{mission.icon}</div>
              <h3 className="text-2xl font-black text-white mb-2">
                {mission.title}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {mission.description}
              </p>

              <div
                className={`text-xs font-bold uppercase tracking-widest ${
                  estFait ? "text-green-400" : "text-cyan-400"
                }`}
              >
                {estFait ? "Recommencer la mission" : "Lancer la mission →"}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 🎓 Certification finale */}
      {missionsFinies.length === 3 && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => router.push("/felicitations")}
          className="mt-14 bg-yellow-500 hover:bg-yellow-400 text-black font-black px-12 py-5 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)] uppercase tracking-tighter"
        >
          🎓 Passer la Certification Finale
        </motion.button>
      )}

      
    </div>
  );
}
