"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import ChatbotLogi from "@/components/ChatbotLogi";
import FeedbackForm from "@/components/FeedbackForm";
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';

const questions = [
  { id: 1, question: "En Python, quel mot-clé permet d'ouvrir une structure conditionnelle ?", options: ["when", "if", "si", "test"], answer: "if", hint: "LOGI : Pense au mot anglais pour 'si' utilisé par tous les codeurs." },
  { id: 2, question: "[PYTHON] Quel symbole termine obligatoirement la ligne d'un 'if', 'elif' ou 'else' ?", options: [";", ".", ":", ")"], answer: ":", hint: "LOGI : C'est un signe de ponctuation double, comme pour annoncer une liste." },
  { id: 3, question: "Comment appelle-t-on le décalage à gauche du code sous un 'if' ?", options: ["Marge", "Indentation", "Alignement", "Retrait"], answer: "Indentation", hint: "LOGI : C'est ce qui permet à l'ordinateur de savoir quel code appartient au 'Si'." },
  { id: 4, question: "[ALGORITHME] Quel mot-clé utilise-t-on pour tester une condition dans un algorithme ?", options: ["Si", "If", "Quand", "Test"], answer: "Si", hint: "LOGI : Rappelle-toi de la boite à logique." },
  { id: 5, question: "[ALGORITHME] Si la condition d'un 'si' est fausse, quel bloc est exécuté ?", options: ["sinon", "if", "si", "aucun"], answer: "sinon", hint: "LOGI : Pense au deuxième bloc." },
  { id: 6, question: "[PYTHON] Que se passe-t-is si j'oublie d'indenter le code sous un 'if' ?", options: ["Rien", "Le code est plus rapide", "Une erreur s'affiche", "Le code change"], answer: "Une erreur s'affiche", hint: "LOGI : Python est très strict sur le décalage vers la droite !" },
  { id: 7, question: "Quand le bloc 'else' est-il activé ?", options: ["Si le if est vrai", "Si tout est faux", "Aléatoirement", "Au début"], answer: "Si tout est faux", hint: "LOGI : Le 'else' est le dernier recours de la cascade." },
  { id: 8, question: "Que signifie l'opérateur '!=' ?", options: ["Égal à", "Supérieur", "Différent de", "Environ"], answer: "Différent de", hint: "LOGI : Le point d'exclamation signifie 'NON' ou 'Négation'." },
  { id: 9, question: "[LOGIQUE] Si une condition est fausse et qu'il n'y a pas de 'Sinon', que fait le programme ?", options: ["Il s'arrête", "Il saute le bloc", "Il recommence", "Il affiche une erreur"], answer: "Il saute le bloc", hint: "LOGI : Il continue simplement son chemin vers la suite du code." },
  { id: 10, question: "Si A = 10, quel est le résultat de : if A > 5: print('Ok') ?", options: ["Ok", "Erreur", "Rien", "No"], answer: "Ok", hint: "LOGI : Compare 10 et 5, est-ce que 10 est plus grand ?" }
];

export default function QuizFinal() {
  const [startTime] = useState(Date.now());
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const nomEleve = typeof window !== "undefined" ? localStorage.getItem("nom_explorateur") || "Explorateur" : "Explorateur";

  useEffect(() => {
    if (isFinished || selectedAnswer) {
      setShowReminder(false);
      return;
    }
    const timer = setTimeout(() => setShowReminder(true), 20000);
    return () => clearTimeout(timer);
  }, [currentStep, isFinished, selectedAnswer]);

  const envoyerResultats = async () => {
    setIsSending(true);

    // Préparation des données à envoyer dans le mail
    const templateParams = {
      to_name: "Mme Sawssen",
      from_name: nomEleve,
      score: `${score}/10`,
      temps: formatTime(finalTime),
      grade: currentGrade.titre,
      message: `L'élève ${nomEleve} a terminé le quiz final avec un score de ${score}/10 en un temps de ${formatTime(finalTime)}.`
    };

    try {
      // REMPLACE LES CHAÎNES CI-DESSOUS PAR TES VRAIES CLÉS EMAILJS
      await emailjs.send(
        'service_bch26yj', 
        'template_1xew0v2', 
        templateParams, 
        'Zvz_0_VehoIOgs4ju'
      );

      setShowModal(true);
    } catch (error) {
      console.error("Erreur EmailJS:", error);
      alert("Mince, il y a eu un petit problème technique lors de l'envoi. Réessaie ou fais une capture d'écran !");
    } finally {
      setIsSending(false);
    }
  };

  const messageLogiActuel = isFinished 
    ? (
      <span className="text-left block leading-relaxed">
        Bravo {nomEleve} ! 🎓 Ton certificat est prêt.<br />
        1. Télécharge-le 💾<br />
        2. Donne ton avis 💬<br />
        3. Envoie tes résultats ! 🚀
      </span>
    )
    : (showReminder 
        ? "Besoin d'un coup de main ? 🤖 L'INDICE DE LOGI 💡 est là !" 
        : "LOGI est avec toi ! 🚀 Donne le meilleur de toi-même. 🛰️ Reste concentré. 💻 Montre-moi tes talents de codeur. Si tu bloques, L'INDICE DE LOGI 💡 est là pour t'aider !");

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (choice: string) => {
    if (selectedAnswer) return;
    const correct = choice === questions[currentStep].answer;
    setSelectedAnswer(choice);
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentStep + 1 < questions.length) {
        setCurrentStep(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowHint(false);
      } else {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        setFinalTime(duration);
        setIsFinished(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }, 1500);
  };

  const telechargerCertificat = async () => {
    const element = document.getElementById('diplome-visual');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0a1224' });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Certificat_LOGI_${nomEleve}.png`;
    link.click();
  };

  const grade = (s: number) => {
    if (s === 10) return { titre: "Légende de LOGI-CODE", emoji: "👑", couleur: "text-yellow-400" };
    if (s >= 9) return { titre: "Maître de la Logique", emoji: "💎", couleur: "text-cyan-400" };
    if (s >= 8) return { titre: "Expert Algorithmes", emoji: "🚀", couleur: "text-blue-400" };
    return { titre: "Apprenti Codeur", emoji: "🎖️", couleur: "text-slate-400" };
  };

  const currentGrade = grade(score);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans relative overflow-x-hidden">
      
      {isFinished && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div key={i} className="absolute text-2xl" initial={{ top: -50, left: `${Math.random() * 100}%` }} animate={{ top: "110%", rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
              {['🎊', '🎉', '✨', '⭐'][i % 4]}
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10">
        {isFinished ? (
          <div className="flex flex-col items-center justify-start pt-2 w-full max-w-3xl mx-auto min-h-screen text-center">
            
            <motion.div 
              id="diplome-visual" 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-[#0a1224] border-[5px] border-double border-cyan-500 p-5 rounded-xl relative w-full shadow-[0_0_40px_rgba(6,182,212,0.2)] mb-4 overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div key={i} className="absolute text-yellow-500/30 text-base" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}>⭐</motion.div>
                ))}
              </div>

              <div className="relative z-10">
                <div className="text-cyan-400 font-black uppercase mb-1 text-[9px] tracking-widest">Certificat de Réussite</div>
                <h2 className="text-2xl font-serif text-white mb-1 uppercase tracking-tight">Explorateur de Code</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-2"></div>
                <p className="text-slate-400 italic text-xs mb-1">Ce diplôme est fièrement décerné à</p>
                <h3 className="text-4xl font-black text-[#ffcc00] mb-2 uppercase drop-shadow-md">{nomEleve}</h3>
                
                <p className="text-slate-200 text-xs max-w-md mx-auto leading-tight mb-3">
                  pour avoir complété avec succès la <span className="text-cyan-400 font-bold">certification finale</span> sur :<br/>
                  <span className="text-white font-black tracking-widest uppercase text-[13px]">LES STRUCTURES CONDITIONNELLES</span>
                </p>

                <div className="flex justify-center gap-6 mb-4 bg-white/5 py-2 rounded-xl border border-white/10 max-w-[250px] mx-auto">
                  <div className="text-center">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Score</p>
                    <p className="text-xl font-black text-cyan-400">{score}/10</p>
                  </div>
                  <div className="w-px bg-slate-700 h-8 self-center"></div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Temps</p>
                    <p className="text-xl font-black text-red-500 italic">{formatTime(finalTime)}</p>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 ${currentGrade.couleur} font-black text-[10px] uppercase mb-4`}>
                  <span>{currentGrade.emoji}</span> <span>{currentGrade.titre}</span>
                </div>

                <div className="flex justify-between items-end px-6 mt-2">
                  <div className="text-left">
                    <div className="w-16 h-px bg-slate-700 mb-1"></div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase italic">Mme Sawssen CHTIOUI</p>
                  </div>
                  <motion.img src="/logi.png" alt="Logi" className="w-12 h-12" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                  <div className="text-right">
                    <p className="text-cyan-500 font-black text-lg leading-none">2026</p>
                    <p className="text-[7px] text-slate-500 font-bold uppercase">Logi-Code Avicenne</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BOUTONS D'ACTION ÉPURÉS */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <button 
                onClick={telechargerCertificat} 
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-[11px] uppercase shadow-xl transition-transform active:scale-95"
              >
                💾 TÉLÉCHARGER DIPLÔME
              </button>
              
              <button 
                onClick={() => setShowFeedback(true)} 
                className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-6 py-2 rounded-xl font-bold border border-cyan-500/30 text-[11px] uppercase shadow-xl transition-transform active:scale-95"
              >
                💬 DONNER MON AVIS
              </button>

              <button 
                onClick={envoyerResultats} 
                disabled={isSending}
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase shadow-xl transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSending ? "ENVOI EN COURS..." : "🚀 ENVOYER ET QUITTER"}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-8 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl mt-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Etape {currentStep + 1} / {questions.length}</span>
              <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div className="h-full bg-cyan-500" initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-[350px]">
                <h3 className="text-2xl text-white font-bold mb-8">{questions[currentStep].question}</h3>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {questions[currentStep].options.map((option) => (
                    <button key={option} disabled={!!selectedAnswer} onClick={() => handleAnswer(option)} className={`w-full p-4 text-left border rounded-2xl transition-all flex items-center justify-between font-bold ${selectedAnswer ? (option === questions[currentStep].answer ? "bg-green-500/20 border-green-500 text-green-400" : (selectedAnswer === option ? "bg-red-500/20 border-red-500 text-red-400" : "opacity-30")) : "bg-slate-800/50 border-white/5 text-slate-200"}`}>
                      <span>{option}</span>
                      {selectedAnswer && option === questions[currentStep].answer && <span>✅</span>}
                      {selectedAnswer && selectedAnswer === option && option !== questions[currentStep].answer && <span>❌</span>}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col items-center mt-4">
                  {!showHint && !selectedAnswer ? (
                    <motion.button onClick={() => setShowHint(true)} animate={showReminder ? { scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(6,182,212,0.5)"] } : {}} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] text-cyan-400 font-black uppercase tracking-widest">L'INDICE DE LOGI {showReminder ? "💡" : "❓"}</motion.button>
                  ) : showHint && !selectedAnswer ? (
                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full p-4 bg-slate-800 border-l-4 border-cyan-500 rounded-r-xl text-cyan-100 text-sm italic">🤖 {questions[currentStep].hint}</motion.div>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
      {showModal && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 2000,
    padding: '20px'
  }}>
    <div style={{
      backgroundColor: '#0e172a', border: '2px solid #00ffff',
      borderRadius: '20px', padding: '30px', maxWidth: '400px',
      textAlign: 'center', boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
    }}>
      <div style={{ fontSize: '50px', marginBottom: '20px' }}>🚀</div>
      
      <h2 style={{ color: '#00ffff', marginBottom: '15px', fontSize: '20px' }}>
        Félicitations {nomEleve} !
      </h2>
      
      <p style={{ color: '#fff', marginBottom: '25px', lineHeight: '1.5' }}>
        Tes résultats ont été envoyés avec succès à <strong>Mme Sawssen</strong>. 
        Ton aventure s'arrête ici pour aujourd'hui !
      </p>

      <button
        onClick={() => window.location.href = "/"}
        style={{
          backgroundColor: '#00ffff', color: '#0e172a',
          border: 'none', padding: '12px 25px', borderRadius: '10px',
          fontWeight: 'bold', cursor: 'pointer', fontSize: '16px',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Retour à l'accueil
      </button>
    </div>
  </div>
)}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotLogi mode="passif" messagePassif={messageLogiActuel} />
      </div>

      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-md border border-cyan-500 relative">
              <button onClick={() => setShowFeedback(false)} className="absolute top-6 right-6 text-red-400 font-bold">✖</button>
              <FeedbackForm onClose={() => setShowFeedback(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    
  );
}