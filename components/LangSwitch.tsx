"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Languages, Check } from "lucide-react";
import { useLang } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n";

/**
 * Compact language picker. Collapsed it's just a single translate-glyph button
 * in the header (clean). On hover — or tap/click on touch — a themed dropdown
 * reveals the available languages. Macedonian is the primary language; English
 * is a client-side convenience layer for non-Macedonian visitors.
 */
const LANGS: { code: Lang; label: string }[] = [
  { code: "mk", label: "Македонски" },
  { code: "en", label: "English" },
];

export default function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on Escape or any click/tap outside the widget.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const choose = (code: Lang) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      // Hover opens on desktop; the click handler covers touch devices.
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`relative ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={lang === "mk" ? "Избери јазик" : "Choose language"}
        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-200 ${
          open
            ? "border-yellow-border bg-yellow-muted text-yellow"
            : "border-dark-border text-white/80 hover:border-yellow-border hover:text-yellow"
        }`}
      >
        <Languages size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            // top-full + pt-2 leaves a transparent "bridge" so the hover isn't
            // lost in the gap between the button and the card.
            className="absolute right-0 top-full z-50 pt-2"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
          >
            <div className="min-w-[160px] overflow-hidden rounded-xl border border-dark-border bg-dark-card/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md">
              {LANGS.map(({ code, label }) => {
                const active = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    role="menuitem"
                    onClick={() => choose(code)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-heading font-bold tracking-wide transition-colors duration-150 ${
                      active
                        ? "bg-yellow-muted text-yellow"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {label}
                    {active && <Check size={15} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
