"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
let confetti: any;
//if (typeof window !== "undefined") {
  // Import dynamique uniquement dans le navigateur
  confetti = require("canvas-confetti");
//}

export default function FelicitationsPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [scoreTotal, setScoreTotal] = useState(0);

  useEffect(() => {
  const lancerConfetti = async () => {
    const confettiModule = await import("canvas-confetti");
    const confetti = confettiModule.default;

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  lancerConfetti();
}, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Badge de réussite géant */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-40 h-40 bg-gradient-to-tr from-yellow-500 to-amber-300 rounded-full flex items-center justify-center text-7xl shadow-[0_0_50px_rgba(234,179,8,0.4)] mb-8"
      >
        🏆
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-black text-center mb-4 uppercase tracking-tighter"
      >
        INCROYABLE, <span className="text-cyan-400">{nom}</span> !
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-400 text-xl text-center max-w-2xl mb-12 leading-relaxed"
      >
        Tu as terminé toutes les missions avec un score total de <span className="text-green-400 font-bold">{scoreTotal} points</span>. 
        LOGI est désormais parfaitement programmé grâce à toi !
      </motion.p>

      {/* Récapitulatif des compétences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-12">
        {[
          { label: "Structure Simple", desc: "Action conditionnelle" },
          { label: "Structure Complète", desc: "Gestion des alternatives" },
          { label: "Structure Généralisée", desc: "Logique multi-choix" }
        ].map((skill, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + (i * 0.2) }}
            className="bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-center"
          >
            <div className="text-cyan-500 text-xs font-black uppercase mb-1 tracking-widest">{skill.label}</div>
            <div className="text-white text-sm font-medium italic">Maîtrisée ✅</div>
          </motion.div>
        ))}
      </div>

      {/* Bouton vers le Quiz Final */}
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/evaluation')}
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-12 py-5 rounded-[2rem] text-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] uppercase tracking-tighter"
      >
        Commencer la Certification Finale 🚀
      </motion.button>

      <p className="mt-6 text-slate-500 text-sm animate-pulse">
        Prépare-toi, 10 questions t'attendent pour valider ton diplôme.
      </p>

    </div>
  );
}