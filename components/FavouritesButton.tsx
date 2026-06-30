"use client";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavourites } from "./FavouritesContext";
import { useLang } from "./LanguageProvider";

/**
 * Header favourites control. Collapsed it's a 40×40 icon button that harmonizes
 * with its siblings, but it carries real state + delight:
 *  - the heart FILLS gold once you've saved a vehicle (so the icon itself
 *    communicates "you have favourites", not just the badge);
 *  - it gives a quick double heartbeat on hover;
 *  - the count badge springs in and wears a dark "cut-out" ring so it reads
 *    crisply off the heart instead of muddying into it.
 * Honors prefers-reduced-motion (no beat / no spring).
 */
const ARIA: Record<"mk" | "en", string> = {
  mk: "Омилени возила",
  en: "Favourite vehicles",
};

export default function FavouritesButton({ className = "" }: { className?: string }) {
  const { count } = useFavourites();
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const active = count > 0;

  return (
    <Link
      href="/omileni"
      aria-label={ARIA[lang]}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-200 ${
        active
          ? "border-yellow-border bg-yellow-muted text-yellow"
          : "border-dark-border text-white/80 hover:border-yellow-border hover:text-yellow"
      } ${className}`}
    >
      <motion.span
        className="flex items-center justify-center"
        whileHover={reduce ? undefined : { scale: [1, 1.22, 0.94, 1.12, 1] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heart
          size={18}
          className={active ? "fill-yellow text-yellow" : "fill-none"}
        />
      </motion.span>

      <AnimatePresence>
        {active && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            transition={
              reduce
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 520, damping: 24 }
            }
            className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow px-1 text-[12px] font-heading font-bold leading-none text-dark ring-2 ring-dark"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
