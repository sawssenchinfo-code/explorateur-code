"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ChatbotBienvenueProps {
  context: string;
}

export default function ChatbotBienvenue({ context }: ChatbotBienvenueProps) {
  const fullMessage =
    context === "accueil"
      ? "👋 Salut Explorateur ! Bienvenue dans le Serious Game L'Explorateur de Code. Avant de commencer, insère ton nom et le code que tu as reçu dans la carte finale de la boîte à logique."
      : "💡 Tu es maintenant dans le jeu, bon courage !";

  const [displayedMessage, setDisplayedMessage] = useState("");
  const [index, setIndex] = useState(0);
  
  // 📱 Détecteur de mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Vérifie la taille de l'écran au chargement et quand on redimensionne
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); // Test initial
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (index < fullMessage.length) {
      const timer = setTimeout(() => {
        setDisplayedMessage((prev) => prev + fullMessage[index]);
        setIndex(index + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [index, fullMessage]);

  return (
    <div
      style={{
        position: "fixed",
        // --- LOGIQUE RESPONSIVE ---
        // Si mobile (isMobile) : on le met en haut (top). Si PC : on reste en bas (bottom).
        bottom: isMobile ? "auto" : "20px",
        top: isMobile ? "20px" : "auto", 
        right: "20px",
        left: isMobile ? "20px" : "auto", // Prend plus de largeur sur mobile
        width: isMobile ? "calc(100% - 40px)" : "320px",
        maxWidth: "350px",
        // ---------------------------
        
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
      <div style={{ flexShrink: 0 }}>
        <Image
          src="/logi.png"
          alt="Chatbot LOGI"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      </div>

      <div>
        <strong>💬 LOGI ChatBot</strong>
        <p style={{ marginTop: "5px", lineHeight: 1.4 }}>{displayedMessage}</p>
      </div>
    </div>
  );
}