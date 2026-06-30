"use client";
import { Phone } from "lucide-react";
import { useLang } from "./LanguageProvider";

export default function FloatingCall() {
  const { lang } = useLang();
  return (
    <a
      href="tel:+38978889293"
      aria-label={lang === "en" ? "Call us" : "Јави се"}
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-yellow text-dark flex items-center justify-center shadow-xl shadow-yellow/30 hover:bg-yellow-light transition-colors"
    >
      <Phone size={22} className="relative" />
    </a>
  );
}
