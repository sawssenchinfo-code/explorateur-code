"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FelicitationsPage() {
  const router = useRouter();
  const [nom, setNom] = useState("Explorateur");
  const [scoreTotal, setScoreTotal] = useState(0);

  useEffect(() => {
    const s = localStorage.getItem("score_explorateur");
    const n = localStorage.getItem("nom_explorateur");
    if (s) setScoreTotal(parseInt(s));
    if (n) setNom(n);

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

  const obtenirBadge = () => {
    if (scoreTotal >= 190) return { titre: "Maître de Logi 👑", emoji: "👑", couleur: "from-yellow-400 to-amber-600" };
    if (scoreTotal >= 150) return { titre: "Expert en Code 🚀", emoji: "💎", couleur: "from-cyan-400 to-blue-600" };
    if (scoreTotal >= 100) return { titre: "Codeur Avancé ⚡", emoji: "🥇", couleur: "from-slate-300 to-slate-500" };
    return { titre: "Explorateur 🛡️", emoji: "🥉", couleur: "from-orange-400 to-orange-700" };
  };

  const badge = obtenirBadge();

  const partagerSurClassroom = () => {
    const messageAventure = `🌟 INCROYABLE ! J'ai terminé mon exploration du code avec LOGI ! 🚀\n\n🎯 Mon score final : ${scoreTotal} points\n🏅 Badge obtenu : ${badge.titre}\n\nJe suis maintenant capable de maîtriser les structures conditionnelles. Prêt à relever le défi toi aussi ?`;
    const urlApp = window.location.origin;
    const classroomUrl = `https://classroom.google.com/share?url=${encodeURIComponent(urlApp)}&title=${encodeURIComponent(messageAventure)}`;
    window.open(classroomUrl, '_blank', 'width=600,height=600');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Badge de réussite dynamique */}
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`w-44 h-44 bg-gradient-to-tr ${badge.couleur} rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)] mb-8`}
      >
        <span className="text-7xl">{badge.emoji}</span>
        <span className="text-[10px] font-black uppercase text-white/80 mt-2 px-2 text-center">{badge.titre}</span>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-black text-center mb-4 uppercase tracking-tighter"
      >
        INCROYABLE, <span className="text-cyan-400">{nom}</span> !
      </motion.h1>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
          Tu as terminé toutes les missions avec un score de :
        </p>
        <div className="text-6xl font-black text-green-400 my-2">{scoreTotal} points</div>
        <p className="text-slate-400 italic">LOGI est désormais parfaitement programmé grâce à toi !</p>
      </motion.div>

      {/* Récapitulatif des compétences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
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

      {/* BOUTON PARTAGE UNIQUE */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mb-6"
      >
        <button
          onClick={partagerSurClassroom}
          className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase tracking-tight"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png" 
            alt="Classroom" 
            className="w-6 h-6 brightness-110" 
          />
          Partager mon exploit sur Classroom
        </button>
      </motion.div>

      {/* BOUTON CERTIFICATION FINALE */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/evaluation')}
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-12 py-5 rounded-[2rem] text-xl shadow-[0_0_30px_rgba(234,179,8,0.3)] uppercase tracking-tighter"
      >
        Passer la Certification Finale 🚀
      </motion.button>

      <p className="mt-6 text-slate-500 text-sm animate-pulse text-center">
        Prépare-toi, 10 questions t'attendent pour valider ton diplôme.
      </p>

      {/* LOGI PLACÉ À DROITE DE L'INTERFACE (Maintenant bien à l'intérieur du parent) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-10 right-10 flex flex-col items-center z-50"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5 }}
          className="mb-2 bg-cyan-500 text-white px-3 py-1.5 rounded-xl rounded-br-none shadow-lg text-xs font-bold border border-white/20 relative"
        >
          Mission accomplie, {nom} ! 🤖
          <div className="absolute -bottom-1 right-2 w-2 h-2 bg-cyan-500 transform rotate-45"></div>
        </motion.div>

        <img 
          src="/logi.png" 
          alt="LOGI" 
          className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
        />
      </motion.div>
    </div> // <-- ICI se ferme la div parente
  );
}