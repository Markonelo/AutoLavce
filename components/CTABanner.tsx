"use client";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import AnimSection from "./AnimSection";
import { useLang } from "./LanguageProvider";

const T = {
  mk: {
    kicker: "Подготвен за нов авто?",
    titleA: "ПОСЕТИ НЕ ВО БИТОЛА",
    titleB: "ДЕНЕС",
    blurb: "Посети не во Битола или контактирај не и ние ќе ти помогнеме да го најдеш вистинскиот автомобил. Без обврски.",
    contact: "Контактирај не",
  },
  en: {
    kicker: "Ready for a new car?",
    titleA: "VISIT US IN BITOLA",
    titleB: "TODAY",
    blurb: "Visit us in Bitola or get in touch and we'll help you find the right car. No obligation.",
    contact: "Contact us",
  },
};

export default function CTABanner({ yellow = false }: { yellow?: boolean }) {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="section-padding px-4 bg-dark">
      <div className="max-w-6xl mx-auto">
        <AnimSection>
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
            style={
              yellow
                ? { background: "linear-gradient(135deg, #E8B820 0%, #D4A017 100%)" }
                : {
                    background:
                      "linear-gradient(135deg, #1A1A1A 0%, #222222 50%, #1A1A1A 100%)",
                    border: "1px solid rgba(212,160,23,0.2)",
                  }
            }
          >
            {/* Glow */}
            {!yellow && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,160,23,0.08) 0%, transparent 70%)",
                }}
              />
            )}
            <div className="relative">
              <p
                className={`font-heading font-bold text-sm uppercase tracking-widest mb-4 ${
                  yellow ? "text-dark/70" : "text-yellow"
                }`}
              >
                {t.kicker}
              </p>
              <h2
                className={`font-heading font-bold text-4xl md:text-6xl uppercase mb-6 leading-none ${
                  yellow ? "text-dark" : "text-white"
                }`}
              >
                {t.titleA}
                <br />
                <span className={yellow ? "text-dark" : "gradient-text"}>{t.titleB}</span>
              </h2>
              <p
                className={`text-base font-body max-w-lg mx-auto mb-10 ${
                  yellow ? "text-dark/75" : "text-gray-light"
                }`}
              >
                {t.blurb}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/kontakt"
                  className={`group inline-flex items-center justify-center gap-2 px-8 py-4 font-heading font-bold text-base rounded-xl transition-all hover:gap-3 ${
                    yellow
                      ? "bg-dark text-white hover:bg-dark-card"
                      : "bg-yellow text-dark hover:bg-yellow-light"
                  }`}
                >
                  {t.contact}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:+38978889293"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-heading font-bold text-base rounded-xl transition-all ${
                    yellow
                      ? "border-dark text-dark hover:bg-dark/5"
                      : "border-dark-border text-white hover:border-yellow-border hover:text-yellow"
                  }`}
                >
                  <Phone size={18} />
                  078-889-293
                </a>
              </div>
            </div>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}
