"use client";
import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

interface FeedbackFormProps {
  onClose?: () => void;
}

export default function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [nom, setNom] = useState("Anonyme");
  const [form, setForm] = useState({
    avis_jeu: "",
    avis_boite: "",
    note: 8, // number maintenant
    commentaire: ""
  });

  // récupérer le nom depuis localStorage uniquement côté client
 useEffect(() => {
  if (typeof window !== "undefined") {
    setNom(localStorage.getItem("nom_explorateur") || "Anonyme");
  }
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

   try {
  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    // ⚠️ ICI : on change TEMPLATE_ID par FEEDBACK_TEMPLATE_ID
    process.env.NEXT_PUBLIC_EMAILJS_FEEDBACK_TEMPLATE_ID!, 
    {
      from_name: nom,
      avis_jeu: form.avis_jeu,
      avis_boite: form.avis_boite,
      note: String(form.note),
      commentaire: form.commentaire
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
  setSent(true);
  setTimeout(() => onClose?.(), 2000); // On laisse 2s pour que l'élève voie le succès

    } catch (error:any) {
      console.error("EMAILJS ERROR 👉", error);
      alert(error?.text || "Erreur EmailJS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/90 p-6 rounded-3xl border border-white/10 shadow-xl">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Donne ton avis sur le jeu</h2>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-slate-300 font-bold">Qu'as-tu pensé du jeu ? 🧠</label>
        <textarea
          value={form.avis_jeu}
          onChange={(e) => setForm({ ...form, avis_jeu: e.target.value })}
          placeholder="Ton avis ici..."
          className="p-3 rounded-xl bg-slate-800 text-white outline-none"
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-slate-300 font-bold">Comment as-tu trouvé la boite à logique ? 📦</label>
        <textarea
          value={form.avis_boite}
          onChange={(e) => setForm({ ...form, avis_boite: e.target.value })}
          placeholder="Ton avis sur la boîte à logique..."
          className="p-3 rounded-xl bg-slate-800 text-white outline-none"
        />
      </div>

      {/* Note sur 10 */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-bold text-slate-300">Note globale : ⭐</label>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] text-slate-400 font-bold">0</span>
          <span className="text-[14px] text-yellow-400 font-black">{form.note}/10</span>
          <span className="text-[12px] text-slate-400 font-bold">10</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: Number(e.target.value) })}
          className="w-full h-2 rounded-lg appearance-none accent-cyan-500 cursor-pointer"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-bold text-slate-300">Commentaires supplémentaires : 💬</label>
        <textarea
          value={form.commentaire}
          onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
          placeholder="Si tu veux ajouter quelque chose..."
          className="p-3 rounded-xl bg-slate-800 text-white outline-none"
        />
      </div>

     <button
  type="submit"
  disabled={loading || sent}
  className={`w-full py-3 font-black rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg 
    ${sent 
      ? "bg-green-600 text-white cursor-default" 
      : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white active:scale-95"
    }`}
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <span className="animate-spin">🌀</span> Transmission...
    </span>
  ) : sent ? (
    "Mission accomplie ! ✅"
  ) : (
    "Partager mon aventure 🚀"
  )}
</button>
    </form>
  );
}
