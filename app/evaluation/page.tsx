import QuizFinal from "@/components/QuizFinal";
import ChatbotLogi from '@/components/ChatbotLogi';

export default function EvaluationPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Effet visuel de fond */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 uppercase tracking-tighter">
          Module d'évaluation
        </h1>
        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">
          Vérification des protocoles Algorithmique & Python
        </p>
      </div>
      
      <div className="z-10 w-full max-w-2xl">
        <QuizFinal />
      </div>

    
    </main>
  );
}