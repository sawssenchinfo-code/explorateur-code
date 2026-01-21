"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // pour afficher l'image du chatbot

export default function ChatbotBienvenue() {
  const fullMessage =
    "👋 Salut Explorateur ! Bienvenue dans le Serious Game L'Explorateur de Code. " +
                  "Avant de commencer, insère ton nom et le code que tu as reçu dans la carte finale de la boîte à logique.";

  const [displayedMessage, setDisplayedMessage] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullMessage.length) {
      const timer = setTimeout(() => {
        setDisplayedMessage((prev) => prev + fullMessage[index]);
        setIndex(index + 1);
      }, 30); // vitesse de frappe (30ms par caractère)
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "320px",
        backgroundColor: "#0e172a",
        border: "1px solid #00ffff",
        borderRadius: "15px",
        padding: "15px",
        color: "#00ffff",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        boxShadow: "0 0 20px rgba(0,255,255,0.2)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      {/* Image du chatbot */}
      <div style={{ flexShrink: 0 }}>
        <Image
          src="/logi.png" // Remplace par le chemin de ton image
          alt="Chatbot LOGI"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      </div>

      {/* Texte animé */}
      <div>
        <strong>💬 LOGI ChatBot</strong>
        <p style={{ marginTop: "5px", lineHeight: 1.4 }}>{displayedMessage}</p>
      </div>
    </div>
  );
}
