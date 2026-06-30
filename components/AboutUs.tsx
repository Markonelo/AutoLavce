"use client";
import Link from "next/link";
import { MapPin, ArrowRight, Check } from "lucide-react";
import AnimSection from "./AnimSection";
import { useLang } from "./LanguageProvider";

const INSTAGRAM_URL = "https://www.instagram.com/auto_lavce/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100090385898908";

const T = {
  mk: {
    yearsExp: "Години Искуство",
    kicker: "За Нас",
    brand: "АВТО ЛАВЧЕ",
    blurb:
      "Auto Lavce е автосалон од Битола со долгогодишно искуство во продажба на проверени половни и нови возила. Секое возило што го нудиме е внимателно одбрано и проверено — за да добиете автомобил на кој можете да се потпрете.",
    bullets: [
      "Проверени и технички исправни возила",
      "Купување, рати, лизинг и замена старо за ново",
      "Откуп на возила и фер транспарентни цени",
    ],
    location: "Битола, Северна Македонија",
    browse: "Разгледај возила",
    stats: [
      { value: "500+", label: "Задоволни клиенти" },
      { value: "1000+", label: "Продадени возила" },
      { value: "100%", label: "Проверени возила" },
    ],
  },
  en: {
    yearsExp: "Years of experience",
    kicker: "About us",
    brand: "AUTO LAVCE",
    blurb:
      "Auto Lavce is a car dealership in Bitola with many years of experience selling vetted used and new vehicles. Every car we offer is carefully selected and inspected — so you drive away in a vehicle you can rely on.",
    bullets: [
      "Vetted, mechanically sound vehicles",
      "Cash, instalments, leasing and trade-in",
      "Vehicle buy-back and fair, transparent prices",
    ],
    location: "Bitola, North Macedonia",
    browse: "Browse vehicles",
    stats: [
      { value: "500+", label: "Happy customers" },
      { value: "1000+", label: "Vehicles sold" },
      { value: "100%", label: "Inspected vehicles" },
    ],
  },
};

// Brand glyphs as inline SVGs (lucide no longer ships trademarked brand icons).
function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

export default function AboutUs() {
  const { lang } = useLang();
  const t = T[lang];
  const bullets = t.bullets;
  const stats = t.stats;
  return (
    <section className="section-padding px-4 bg-dark-card border-y border-dark-border overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        {/* Left — image frame with experience badge */}
        <AnimSection direction="left" className="relative h-full">
          <div className="relative h-full min-h-[420px] aspect-[3/4] lg:aspect-auto rounded-2xl overflow-hidden border border-dark-border bg-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Car How it Works/fa_300000000_bmw-x5-2018-front-view_4x.png"
              alt="Auto Lavce автосалон"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
          </div>

          {/* Yellow circle experience badge */}
          <div className="absolute -bottom-6 -right-2 sm:right-6 w-32 h-32 md:w-36 md:h-36 rounded-full bg-yellow text-dark flex flex-col items-center justify-center text-center shadow-2xl border-4 border-dark-card">
            <span className="font-heading font-bold text-4xl md:text-5xl leading-none">10+</span>
            <span className="font-heading font-bold text-xs md:text-sm uppercase tracking-wide mt-1 px-3 leading-tight">
              {t.yearsExp}
            </span>
          </div>
        </AnimSection>

        {/* Right — text, bullets, button, stats */}
        <AnimSection direction="right" delay={0.1}>
          <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-3">
            {t.kicker}
          </p>
          <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase mb-5">
            {t.brand}
          </h2>
          <p className="text-gray-light text-base md:text-lg font-body leading-relaxed mb-5">
            {t.blurb}
          </p>

          <ul className="space-y-3 mb-7">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-gray-light text-sm md:text-base font-body">
                <Check size={20} className="text-yellow shrink-0 mt-0.5" strokeWidth={3} />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="text-gray-muted text-sm font-body inline-flex items-center gap-2 mb-7">
            <MapPin size={15} className="text-yellow" /> {t.location}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 border-t border-dark-border pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-heading font-bold text-yellow text-3xl md:text-4xl leading-none">{s.value}</p>
                <p className="text-gray-light text-xs font-body mt-1.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4">
            <Link href="/avtomobili" className="btn-primary w-full sm:w-auto">
              {t.browse} <ArrowRight size={16} />
            </Link>
            <div className="flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 rounded-xl bg-dark border border-dark-border flex items-center justify-center text-yellow hover:border-yellow-border hover:scale-105 transition-all"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-12 h-12 rounded-xl bg-dark border border-dark-border flex items-center justify-center text-yellow hover:border-yellow-border hover:scale-105 transition-all"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}
