"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatbotLogi from "@/components/ChatbotLogi";
import FelicitationsPage from "@/app/felicitations/FelicitationsPage";

interface PageProps {
  params: Promise<{
    rubrique: string;
    niveau: string;
  }>;
}

const baseDeDonnees = {
  simple: {
    "1": {
      titre: "L'alarme de LOGI",
      contexte: "Il est 7h du matin.",
      code: "Si (heure == 7) Alors\n  Sonner()\nFinSi",
      question: "L'alarme sonne-t-elle ?",
      options: ["Oui", "Non"],
      correcte: "Oui",
    },
    "2": {
      titre: "Le capteur de lumière",
      contexte: "La luminosité est à 10%.",
      code: "Si (lumiere < 20) Alors\n  Allumer_Lampe()\nFinSi",
      question: "La lampe s'allume-t-elle ?",
      options: ["Oui", "Non"],
      correcte: "Oui",
    },
    "3": {
      titre: "Accès VIP",
      contexte: "Tu as 50 points.",
      code: "Si (points >= 100) Alors\n  Ouvrir_Porte_VIP()\nFinSi",
      question: "La porte VIP s'ouvre-t-elle ?",
      options: ["Oui", "Non"],
      correcte: "Non",
    },
    "4": {
      type: "algorithme",
      titre: "Mission : Arrosage Automatique",
      consigne:
        "Écris un algorithme 'arrosage' qui permet de saisir la valeur de l'humidité H et d'afficher 'arroser' si H < 30.",
      solution:
        "algorithme arrosage\ndébut\nécrire('donner la valeur de l'humidité:')\nlire(H)\nsi H < 30 alors\nécrire('arroser')\nfin si\nfin",
    },
    "5": {
      type: "python",
      titre: "Traduction : Jardinier Python",
      consigne: `Traduis l'algorithme obtenu en Python :

algorithme arrosage
début
  écrire("donner la valeur de l'humidité :")
  lire(H)
  si H < 30 alors
    écrire("arroser")
  fin si
fin`,
      solution: "H=int(input('donner la valeur de l'humidité:'))\nif H<30:\nprint('arroser')",
    },
  },
  complete: {
    "1": { titre: "Le mot de passe", contexte: "Tu as saisi le mot de passe '1234'.", code: "Si (mdp == '0000') Alors\n  Acces_Ok()\nSinon\n  Refuse()\nFinSi", question: "Quel est le résultat ?", options: ["Acces_Ok()", "Refuse()"], correcte: "Refuse()" },
    "2": { titre: "Le Parapluie", contexte: "Il pleut.", code: "Si (meteo == 'pluie') Alors\n  Prendre_Parapluie()\nSinon\n  Prendre_Lunettes()\nFinSi", question: "Que prend l'explorateur ?", options: ["Parapluie", "Lunettes"], correcte: "Parapluie" },
    "3": { titre: "Majorité", contexte: "L'âge est 16 ans.", code: "Si (age >= 18) Alors\n  Majeur()\nSinon\n  Mineur()\nFinSi", question: "Résultat ?", options: ["Majeur()", "Mineur()"], correcte: "Mineur()" },
    "4": { type: "algorithme", titre: "Mission : Pair ou Impair", consigne: "Écris un algorithme 'parité' qui permet de saisir un nombre entier N et d'afficher si N est pair ou impair.", solution: "algorithme parité\ndébut\nécrire('donner un nombre N:')\nlire(N)\nsi N mod 2 = 0 alors\nécrire('pair')\nsinon\nécrire('impair')\nfin si\nfin" },
    "5": { 
      type: "python", 
      titre: "Traduction : Pair ou Impair Python", 
      consigne: `Code l'algorithme précédent en Python :

algorithme parité
début
  écrire('donner un nombre N:')
  lire(N)
  si N mod 2 = 0 alors
    écrire('pair')
  sinon
    écrire('impair')
  fin si
fin`, 
      solution: "N=int(input('donner un nombre N:'))\nif N%2==0:\nprint('pair')\nelse:\nprint('impair')" 
    }
  },
  generalisee: {
    "1": { titre: "Le Feu de signalisation", contexte: "Le feu est Orange.", code: "Si (feu == 'Vert') Alors\n  Passer()\nSinon Si (feu == 'Orange') Alors\n  Ralentir()\nSinon\n  Arreter()\nFinSi", question: "Que fait la voiture ?", options: ["Passer()", "Ralentir()", "Arreter()"], correcte: "Ralentir()" },
    "2": { titre: "Le Thermostat", contexte: "Il fait 25°C.", code: "Si (temp < 18) Alors\n  Chauffer()\nSinon Si (temp > 24) Alors\n  Climatiser()\nSinon\n  Rien()\nFinSi", question: "Action du thermostat ?", options: ["Chauffer()", "Climatiser()", "Rien()"], correcte: "Climatiser()" },
    "3": { titre: "La Mention", contexte: "La moyenne est 11.", code: "Si (moy < 10) Alors\n  Refaire()\nSinon Si (moy < 12) Alors\n  Passable()\nSinon\n  Bien()\nFinSi", question: "Quelle est la mention ?", options: ["Refaire()", "Passable()", "Bien()"], correcte: "Passable()" },
    "4": { type: "algorithme", titre: "Mission : État de l'Eau", consigne: "Écris un algorithme 'etat' qui permet de saisir la température T et d'afficher 'glace' si la température est inférieure à 0, 'liquide' si la température est inférieure à 100 ou 'vapeur' sinon.", solution: "algorithme etat\ndébut\nécrire('donner la température de l'eau:')\nlire(T)\nsi T < 0 alors\nécrire('glace')\nsinon si T < 100 alors\nécrire('liquide')\nsinon\nécrire('vapeur')\nfin si\nfin" },
    "5": { 
      type: "python", 
      titre: "Traduction : Thermomètre Python", 
      consigne: `Implémente l'état de l'eau en Python :

algorithme etat
début
  écrire('donner la température de l'eau:')
  lire(T)
  si T < 0 alors
    écrire('glace')
  sinon si T < 100 alors
    écrire('liquide')
  sinon
    écrire('vapeur')
  fin si
fin`,
      solution: "T=int(input('donner la température de l'eau:'))\nif T < 0:\nprint('glace')\nelif T < 100:\nprint('liquide')\nelse:\nprint('vapeur')" 
    }
  }
};

type Rubrique = keyof typeof baseDeDonnees;
type Niveau = keyof (typeof baseDeDonnees)[Rubrique];

const nettoyer = (str: string) => {
  return str
    .toLowerCase()
    // 1. Normalisation des caractères (accents)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // 2. Harmonisation des guillemets et apostrophes
    .replace(/['’]/g, '"')
    // 3. VIDER le contenu de TOUTES les parenthèses de communication
    // On cible : ecrire(...), print(...), lire(...), input(...)
    .replace(/(ecrire|print|lire|input)\s*\((.*?)\)/g, "$1()")
    // 4. Nettoyage des espaces et caractères spéciaux de fin
    .replace(/\s+/g, "")
    .replace(/;/g, "")
    .trim();
};
const playSound = (type: "success" | "error") => {
  const audio = new Audio(type === "success" ? "/success.mp3" : "/error.mp3");
  audio.volume = 0.4;
  audio.play();
};

export default function JeuPage() {
  const params = useParams();
  const router = useRouter();
  const [choixEleve, setChoixEleve] = useState<string | null>(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState<"bravo" | "erreur" | null>(null);
  const [score, setScore] = useState(0);
  const [temps, setTemps] = useState(0);
  const [showFelicitations, setShowFelicitations] = useState(false);
  
  const rubrique = params.rubrique as Rubrique;
  const niveau = params.niveau as Niveau;
  const defi = baseDeDonnees[rubrique]?.[niveau];

  const [nomEleve, setNomEleve] = useState("Explorateur");

  useEffect(() => {
    const s = localStorage.getItem("score_explorateur");
    if (s) setScore(parseInt(s));

    const n = localStorage.getItem("nom_explorateur");
    if (n) setNomEleve(n);

    const t = setInterval(() => setTemps((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!defi) {
    return (
      <div className="p-10 text-center text-white">
        Défi introuvable ❌
      </div>
    );
  }

  const verifierQCM = (rep: string) => {
    setChoixEleve(rep);

    if ("correcte" in defi && rep === defi.correcte) {
      playSound("success");
      setFeedback("bravo");

      const ns = score + 10;
      setScore(ns);
      localStorage.setItem("score_explorateur", ns.toString());

      if (rubrique === "generalisee" && parseInt(niveau) === 5) {
        setShowFelicitations(true);
        return;
      }
    } else {
      playSound("error");
      setFeedback("erreur");

      const ns = Math.max(0, score - 5);
      setScore(ns);
      localStorage.setItem("score_explorateur", ns.toString());
    }
  };

  const verifierCode = () => {
  if (!("solution" in defi)) return;

  if (nettoyer(userCode) === nettoyer(defi.solution) && userCode.trim() !== "") {
    playSound("success");
    setFeedback("bravo");

    // MODIFICATION : +20 points pour les exercices de code (niveaux 4 et 5)
    const ns = score + 20;
    setScore(ns);
    localStorage.setItem("score_explorateur", ns.toString());

    if (rubrique === "generalisee" && parseInt(niveau) === 5) {
      setShowFelicitations(true);
      return;
    }
  } else {
    playSound("error");
    setFeedback("erreur");

    const ns = Math.max(0, score - 5);
    setScore(ns);
    localStorage.setItem("score_explorateur", ns.toString());
  }
};

  const suivant = () => {
    const n = parseInt(niveau);
    
    // Ajout : Enregistrer la mission comme faite quand on finit le niveau 5
    if (n === 5) {
      localStorage.setItem(`mission_${rubrique}_faite`, "true");
    }

    if (rubrique === "generalisee" && n === 5) {
      setShowFelicitations(true);
      return;
    }

    if (n < 5) {
      router.push(`/jeu/${rubrique}/${n + 1}`);
    } else {
      // Retour à la sélection si c'est fini
      router.push("/selection");
    }
    
    setFeedback(null);
    setChoixEleve(null);
    setUserCode("");
  };

  const progress = (parseInt(niveau) / 5) * 100;
  const titreExploration = {
    simple: "Structures conditionnelles simples",
    complete: "Structures conditionnelles complètes",
    generalisee: "Structures conditionnelles généralisées",
  }[rubrique];

  const defiAny = defi as any;

  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-6">
      {showFelicitations ? (
        <FelicitationsPage />
      ) : (
        <>
          <div className="max-w-4xl mx-auto mb-6 text-center">
            <h1 className="text-xl md:text-2xl font-black text-cyan-400 uppercase tracking-widest">
              Exploration : {titreExploration}
            </h1>
          </div>

          <div className="max-w-4xl mx-auto flex justify-between mb-4">
            <span>⏱ {temps}s</span>
            <span>🏆 Score : {score}</span>
          </div>

          <div className="max-w-4xl mx-auto mb-6">
            <div className="h-2 bg-slate-700 rounded">
              <div className="h-2 bg-cyan-500 rounded" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-900 p-8 rounded-2xl shadow-xl">
            <h1 className="text-2xl font-black mb-2">{defiAny.titre}</h1>
            
            <div className="mb-6">
              {defiAny.consigne ? (
                <div 
                  className="text-slate-300 leading-relaxed"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {/* On sépare par double saut de ligne pour détecter le bloc algo */}
                  {defiAny.consigne.split('\n\n').map((bloc: string, index: number) => {
                    const estUnAlgorithme = bloc.toLowerCase().includes('algorithme');
                    return (
                      <p 
                        key={index}
                        className={estUnAlgorithme 
                          ? "mt-4 p-4 bg-black/30 border-l-4 border-cyan-500 font-mono text-cyan-200 rounded-r-lg" 
                          : "italic mb-2"
                        }
                      >
                        {bloc}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p className="italic text-slate-300 mb-4">{defiAny.contexte}</p>
              )}
            </div>

            {defiAny.code && (
              <pre className="bg-black/40 p-4 rounded mb-4 text-cyan-300">{defiAny.code}</pre>
            )}

            {defiAny.options ? (
              <>
                <p className="mb-4 font-bold">{defiAny.question}</p>
                <div className="grid grid-cols-2 gap-4">
                  {defiAny.options.map((o: string) => {
                    const isCorrect = "correcte" in defiAny && o === defiAny.correcte;
                    const isSelected = o === choixEleve;
                    let classes = "p-4 rounded-xl font-bold transition-all border";
                    if (feedback === "bravo" && isCorrect) classes += " bg-green-600 border-green-400 scale-105";
                    else if (feedback === "erreur" && isSelected) classes += " bg-red-600 border-red-400";
                    else classes += " bg-slate-800 hover:bg-cyan-600 border-white/10";
                    return (
                      <button key={o} onClick={() => verifierQCM(o)} className={classes}>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <textarea
                  className="w-full h-40 bg-black/40 p-4 rounded font-mono"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="Écris ton code ici..."
                />
                <button onClick={verifierCode} className="mt-4 w-full bg-indigo-600 py-3 rounded-xl font-black">
                  Vérifier
                </button>
              </>
            )}
          </div>

          {feedback === "bravo" && !(rubrique === "generalisee" && niveau === "5") && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-slate-800 p-10 rounded-3xl text-center border border-green-500">
                <h2 className="text-3xl font-black text-green-400 mb-4">🎉 Bravo !</h2>
                <p className="text-slate-300 mb-6">
                  {rubrique === "simple" && niveau === "5"
                    ? `${nomEleve}, tu as terminé le premier défi des structures conditionnelles simples.`
                    : `Bonne réponse, ${nomEleve} !`}
                </p>
                <button onClick={suivant} className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-xl font-black uppercase">
                  {rubrique === "simple" && niveau === "5" ? "Retour à la sélection" : "Étape suivante →"}
                </button>
              </div>
            </div>
          )}

          <ChatbotLogi rubrique={rubrique} niveau={niveau} defiEnCours={defi} userAnswer={userCode} nomEleve={nomEleve} />
        </>
      )}
    </main>
  );
}