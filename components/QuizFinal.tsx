"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import ChatbotLogi from "@/components/ChatbotLogi";
import FeedbackForm from "@/components/FeedbackForm";

// 1. LES 10 QUESTIONS AVEC INDICES ET RATIONALE
const questions = [
  { id: 1, question: "En Python, quel mot-clé permet d'ouvrir une structure conditionnelle ?", options: ["when", "if", "si", "test"], answer: "if", hint: "LOGI : Pense au mot anglais pour 'si' utilisé par tous les codeurs." },
  { id: 2, question: "[PYTHON] Quel symbole termine obligatoirement la ligne d'un 'if', 'elif' ou 'else' ?", options: [";", ".", ":", ")"], answer: ":", hint: "LOGI : C'est un signe de ponctuation double, comme pour annoncer une liste." },
  { id: 3, question: "Comment appelle-t-on le décalage à gauche du code sous un 'if' ?", options: ["Marge", "Indentation", "Alignement", "Retrait"], answer: "Indentation", hint: "LOGI : C'est ce qui permet à l'ordinateur de savoir quel code appartient au 'Si'." },
  { id: 4, question: "[ALGORITHME] Quel mot-clé utilise-t-on pour tester une condition dans un algorithme ?", options: ["Si", "If", "Quand", "Test"], answer: "Si", hint: "LOGI : Rappelle-toi de la boite à logique." },
  { id: 5, question: "[ALGORITHME] Si la condition d'un 'si' est fausse, quel bloc est exécuté ?", options: ["sinon", "if", "si", "aucun"], answer: "sinon", hint: "LOGI : Pense au deuxième bloc." },
  { id: 6, question: "[PYTHON] Que se passe-t-il si j'oublie d'indenter le code sous un 'if' ?", options: ["Rien", "Le code est plus rapide", "Une erreur s'affiche", "Le code change"], answer: "Une erreur s'affiche", hint: "LOGI : Python est très strict sur le décalage vers la droite !" },
  { id: 7, question: "Quand le bloc 'else' est-il activé ?", options: ["Si le if est vrai", "Si tout est faux", "Aléatoirement", "Au début"], answer: "Si tout est faux", hint: "LOGI : Le 'else' est le dernier recours de la cascade." },
  { id: 8, question: "Que signifie l'opérateur '!=' ?", options: ["Égal à", "Supérieur", "Différent de", "Environ"], answer: "Différent de", hint: "LOGI : Le point d'exclamation signifie 'NON' ou 'Négation'." },
  { id: 9, question: "[LOGIQUE] Si une condition est fausse et qu'il n'y a pas de 'Sinon', que fait le programme ?", options: ["Il s'arrête", "Il saute le bloc", "Il recommence", "Il affiche une erreur"], answer: "Il saute le bloc", hint: "LOGI : Il continue simplement son chemin vers la suite du code." },
  { id: 10, question: "Si A = 10, quel est le résultat de : if A > 5: print('Ok') ?", options: ["Ok", "Erreur", "Rien", "No"], answer: "Ok", hint: "LOGI : Compare 10 et 5, est-ce que 10 est plus grand ?" }
];

export default function QuizFinal() {
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSending, setIsSending] = useState(false);
  const nomEleve = typeof window !== "undefined" ? localStorage.getItem("nom_explorateur") || "Explorateur" : "Explorateur";
  const [showFeedback, setShowFeedback] = useState(false);
  const envoyerResultats = async () => {
  setIsSending(true);

  const nomExplorateur =
    localStorage.getItem("nom_explorateur") || "Anonyme";

  const templateParams = {
    nom_explorateur: nomExplorateur,
    score: score,
  };

  try {
    await emailjs.send(
      "service_bch26yj",
      "template_1xew0v2",
      templateParams,
      "Zvz_0_VehoIOgs4ju"
    );

    console.log("Résultats envoyés !");
  } catch (error) {
    console.error("Erreur d'envoi :", error);
    alert("Erreur lors de l'envoi. Réessaie.");
    return;
  } finally {
    setIsSending(false);
  }

  // Nettoyage + redirection
  localStorage.clear();
  window.location.href = "/";
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
        setIsFinished(true);
        if (score + (correct ? 1 : 0) >= 7) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
      }
    }, 1500);
  };

  // --- FIN DU QUIZ ---
  if (isFinished) {
    return (
      <>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center p-10 bg-slate-900 border-2 border-cyan-500 rounded-[3rem] shadow-2xl text-white text-center max-w-lg mx-auto"
        >
          <div className="text-6xl mb-4">🎖️</div>
          <h2 className="text-3xl font-black mb-2 text-cyan-400 uppercase tracking-tighter">
            Certification Terminée
          </h2>

          <div className="bg-slate-800 p-6 rounded-2xl w-full mb-4">
            <p className="text-slate-400 text-xs uppercase font-bold mb-2 tracking-widest">Votre score</p>
            <span className="text-6xl font-black text-yellow-400">{score}/{questions.length}</span>
          </div>

          <button 
            onClick={envoyerResultats} 
            disabled={isSending}
            className="w-full px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest shadow-lg disabled:opacity-50 mb-4"
          >
            {isSending ? "Transmission..." : "Terminer et Envoyer les résultats"}
          </button>

          <button
  onClick={() => setShowFeedback(true)}
  className="w-full px-6 py-2 border border-cyan-500 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/10 transition-all mb-4"
>
  Donnez votre avis
</button>
{showFeedback && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-900 p-6 rounded-3xl w-[90%] max-w-lg shadow-2xl relative"
              >
                <button onClick={() => setShowFeedback(false)} className="absolute top-4 right-4 text-red-400 font-bold text-xl">✖</button>
                <FeedbackForm onClose={() => setShowFeedback(false)} />
              </motion.div>
            </div>
               )}
              </motion.div>

        {/* Chatbot lecture seule à la fin */}
        <ChatbotLogi
          mode="passif"
          messagePassif="Avant de terminer 🛰️, clique sur Donnez votre avis , remplis le formulaire puis clique sur Terminer et Envoyer les résultats."
        />
      </>
    );
  }

  // --- QUIZ EN COURS ---
  return (
    <>
      <div className="max-w-2xl mx-auto p-8 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl relative">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em]">
            Etape {currentStep + 1} / {questions.length}
          </span>
          <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[350px]"
          >
            <h3 className="text-2xl text-white font-bold mb-8 leading-tight">{questions[currentStep].question}</h3>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {questions[currentStep].options.map((option) => {
                const isThisSelected = selectedAnswer === option;
                const isThisCorrect = option === questions[currentStep].answer;
                let buttonStyle = "bg-slate-800/50 border-white/5 text-slate-200 hover:border-cyan-500";

                if (selectedAnswer) {
                  if (isThisCorrect) buttonStyle = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                  else if (isThisSelected) buttonStyle = "bg-red-500/20 border-red-500 text-red-400";
                  else buttonStyle = "opacity-30 border-white/5 text-slate-500";
                }

                return (
                  <button
                    key={option}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left border rounded-2xl transition-all flex items-center justify-between font-bold ${buttonStyle}`}
                  >
                    <span>{option}</span>
                    {selectedAnswer && isThisCorrect && <span>✅</span>}
                    {selectedAnswer && isThisSelected && !isThisCorrect && <span>❌</span>}
                  </button>
                );
              })}
            </div>

            <div className="h-6 flex justify-center mb-6">
              {selectedAnswer && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs font-black uppercase tracking-widest ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isCorrect ? "Analyse correcte 🛰️" : "Mauvaise réponse ⚠️"}
                </motion.span>
              )}
            </div>

            <div className="flex flex-col items-center">
              {!showHint && !selectedAnswer ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] text-cyan-400 font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <span>L'INDICE DE LOGI</span> <span className="animate-pulse">💡</span>
                </button>
              ) : showHint && !selectedAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 bg-slate-800/80 border-l-4 border-cyan-500 rounded-r-xl shadow-lg flex items-start gap-3"
                >
                  <span className="text-xl">🤖</span>
                  <p className="text-cyan-100 text-sm italic leading-relaxed">{questions[currentStep].hint}</p>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chatbot fixe en bas à gauche pendant le quiz */}
      <ChatbotLogi
        mode="passif"
        messagePassif="LOGI t'encourage pendant cette évaluation. Donne le meilleur de toi-même. Si tu veux que je t'aide un peu, clique sur L'INDICE DE LOGI 💡"
      />
    </>
  );
}
