"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface DocItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

/**
 * Required-documents steps (01–04).
 * Scroll-triggered cascade: for each card the big number lights up first,
 * then the card itself appears — one after another down the row.
 */

const STEP = 0.55; // seconds between consecutive cards

export default function DocumentsConnect({ documents }: { documents: DocItem[] }) {
  const docs = documents.slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {docs.map((d, i) => {
        const Icon = d.icon;
        const base = i * STEP;
        return (
          <div key={d.title} className="relative">
            {/* Big step number — lights up first */}
            <motion.span
              className="absolute top-5 right-5 z-10 font-heading font-bold text-yellow text-4xl leading-none"
              initial={{ opacity: 0.1, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: base, duration: 0.45, ease: "backOut" }}
            >
              {String(i + 1).padStart(2, "0")}
            </motion.span>

            {/* Card — appears just after the number lights */}
            <motion.div
              className="h-full flex flex-col bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-yellow-border transition-colors"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: base + 0.25, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Icon size={28} strokeWidth={1.75} className="text-yellow mb-4" />
              <h3 className="font-heading font-bold text-white text-base mb-1.5 uppercase leading-tight">{d.title}</h3>
              <p className="text-gray-light text-xs font-body leading-relaxed">{d.desc}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
