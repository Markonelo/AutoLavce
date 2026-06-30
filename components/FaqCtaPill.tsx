"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { useLang } from "./LanguageProvider";

const VIEWPORT = { once: true, margin: "-80px" } as const;

const T = {
  mk: {
    title: "Не го најде одговорот?",
    desc: "Нашиот тим е тука за тебе — јави се или испрати порака и ќе ти одговориме веднаш.",
    contact: "Контактирај нѐ",
  },
  en: {
    title: "Didn't find your answer?",
    desc: "Our team is here for you — call or send a message and we'll reply right away.",
    contact: "Contact us",
  },
};

export default function FaqCtaPill() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <div className="mt-16">
      {/* Pill shell — opens from the middle out to the ends */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center" }}
        className="relative overflow-hidden rounded-[2.25rem] bg-yellow"
      >
        {/* Content fades in only after the pill has fully opened */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 py-10 sm:px-10 sm:py-12 text-center"
        >
          <h3 className="font-heading font-bold text-dark text-2xl md:text-3xl uppercase mb-2">
            {t.title}
          </h3>
          <p className="text-dark/70 text-sm md:text-base font-body mb-7 max-w-md mx-auto">
            {t.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-dark text-white font-heading font-medium text-lg rounded-xl hover:bg-dark-card transition-colors"
            >
              {t.contact} <ArrowRight size={18} />
            </Link>
            <a
              href="tel:+38978889293"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-dark text-dark font-heading font-medium text-lg rounded-xl hover:bg-dark/5 transition-colors"
            >
              <Phone size={18} /> 078-889-293
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
