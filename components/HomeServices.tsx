"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Droplets, Sparkles, Wrench, ArrowLeft, ArrowRight, ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimSection from "./AnimSection";
import { useLang } from "./LanguageProvider";

interface Service {
  index: string;
  tag: string;
  icon: LucideIcon;
  title: string;
  lead: string;
  desc: string;
  specs: string[];
}

const SERVICE_ICONS: LucideIcon[] = [Droplets, Sparkles, Wrench];

const T = {
  mk: {
    kicker: "Повеќе од салон",
    titlePre: "Нашите ",
    titleAccent: "услуги",
    intro:
      "Не сме само автосалон. Возилото кај нас го мијеме, длабински го чистиме и го сервисираме — сè на едно место во Битола.",
    prevAria: "Претходна услуга",
    nextAria: "Следна услуга",
    goTo: (s: string) => `Оди на ${s}`,
    learnMore: "Дознај повеќе",
    services: [
      {
        index: "01", tag: "Перење", title: "ПЕРЕЊЕ НА ВОЗИЛА", lead: "Сјај што се забележува.",
        desc: "Внимателно рачно перење што го враќа сјајот на твоето возило — без четки што гребат, без брзање.",
        specs: ["Рачно надворешно", "Ентериер", "Џанти и гуми"],
      },
      {
        index: "02", tag: "Детајлинг", title: "ХЕМИСКО ЧИСТЕЊЕ", lead: "Како од салон.",
        desc: "Длабинско обновување на ентериерот со професионални машини и препарати што вадат дамки и миризби.",
        specs: ["Седишта", "Озон дезинфекција", "Заштитен премаз"],
      },
      {
        index: "03", tag: "Сервис", title: "АВТО СЕРВИС", lead: "Спремно за пат.",
        desc: "Комплетна техничка поддршка во нашата работилница во Битола — од редовен сервис до дијагностика.",
        specs: ["Дијагностика", "Масло и филтри", "Кочници"],
      },
    ],
  },
  en: {
    kicker: "More than a showroom",
    titlePre: "Our ",
    titleAccent: "services",
    intro:
      "We're more than a dealership. We wash your vehicle, deep-clean it and service it — all in one place in Bitola.",
    prevAria: "Previous service",
    nextAria: "Next service",
    goTo: (s: string) => `Go to ${s}`,
    learnMore: "Learn more",
    services: [
      {
        index: "01", tag: "Wash", title: "VEHICLE WASH", lead: "A shine you'll notice.",
        desc: "A careful hand wash that brings back your vehicle's shine — no scratchy brushes, no rushing.",
        specs: ["Hand exterior", "Interior", "Wheels & tyres"],
      },
      {
        index: "02", tag: "Detailing", title: "DEEP CLEANING", lead: "Showroom fresh.",
        desc: "A thorough interior refresh with professional machines and products that lift stains and odours.",
        specs: ["Seats", "Ozone disinfection", "Protective coating"],
      },
      {
        index: "03", tag: "Service", title: "CAR SERVICE", lead: "Ready for the road.",
        desc: "Complete technical support in our Bitola workshop — from routine servicing to diagnostics.",
        specs: ["Diagnostics", "Oil & filters", "Brakes"],
      },
    ],
  },
};

const n = T.mk.services.length;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HomeServices() {
  const { lang } = useLang();
  const t = T[lang];
  const services: Service[] = t.services.map((s, i) => ({ ...s, icon: SERVICE_ICONS[i] }));
  const [active, setActive] = useState(0);
  const [vw, setVw] = useState(1200);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = (dir: number) => setActive((a) => (a + dir + n) % n);

  // Center is the biggest/widest; side cards are thinner & taller.
  const centerW = Math.min(560, vw * 0.9);
  const centerH = vw < 640 ? 480 : 560;
  const sideW = Math.min(190, vw * 0.32);
  const sideH = vw < 640 ? 400 : 470;
  const offset = centerW / 2 + sideW / 2 - 42; // overlap so sides peek from behind

  return (
    <section className="section-padding px-4 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimSection>
          <div className="mb-12 md:mb-16 max-w-2xl">
            <p className="kicker mb-4">{t.kicker}</p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-6xl uppercase leading-[0.9]">
              {t.titlePre}<span className="text-yellow">{t.titleAccent}</span>
            </h2>
            <p className="text-gray-light font-body leading-relaxed mt-5 max-w-md">
              {t.intro}
            </p>
          </div>
        </AnimSection>

        {/* Coverflow stage */}
        <div className="relative grid place-items-center h-[520px] sm:h-[580px]">
          {/* Arrows — flanking the cards */}
          <button
            onClick={() => go(-1)}
            aria-label={t.prevAria}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-dark/70 backdrop-blur-sm border border-dark-border text-white flex items-center justify-center hover:bg-yellow hover:text-dark hover:border-yellow transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label={t.nextAria}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-dark/70 backdrop-blur-sm border border-dark-border text-white flex items-center justify-center hover:bg-yellow hover:text-dark hover:border-yellow transition-colors"
          >
            <ArrowRight size={20} />
          </button>

          {services.map((s, i) => {
            let rel = (i - active + n) % n;
            if (rel > n / 2) rel -= n; // -1 (left) · 0 (center) · 1 (right)
            const isCenter = rel === 0;

            return (
              <motion.div
                key={s.title}
                onClick={() => !isCenter && go(rel)}
                // initial={false} → render straight at the resting target values on
                // mount instead of animating up from framer's default (which on some
                // devices left the card at 0×0 until the first rAF, i.e. "nothing
                // showing up"). Also pin a base width/height in inline style so the
                // card always has a real size even before/without the animation loop.
                initial={false}
                style={{
                  width: isCenter ? centerW : sideW,
                  height: isCenter ? centerH : sideH,
                }}
                animate={{
                  x: rel * offset,
                  width: isCenter ? centerW : sideW,
                  height: isCenter ? centerH : sideH,
                  filter: isCenter ? "grayscale(0)" : "grayscale(1)",
                  opacity: isCenter ? 1 : 0.5,
                  zIndex: isCenter ? 20 : 10 - Math.abs(rel),
                }}
                transition={{ duration: 0.55, ease: EASE }}
                className={`[grid-area:1/1] ${isCenter ? "" : "cursor-pointer"}`}
              >
                <ServiceCard service={s} center={isCenter} />
              </motion.div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-10">
          {services.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              aria-label={t.goTo(s.title)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-8 bg-yellow" : "w-2 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, center }: { service: Service; center: boolean }) {
  const { lang } = useLang();
  const Icon = service.icon;
  return (
    <div
      className={`@container relative w-full h-full rounded-3xl overflow-hidden flex flex-col bg-dark-card transition-shadow ${
        center
          ? "border-2 border-yellow-border shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
          : "border border-dark-border"
      }`}
    >
      {/* Visual zone — photos go here */}
      <div className="relative h-[54%] overflow-hidden border-b border-dark-border">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 80% at 50% 30%, rgba(212,160,23,0.20) 0%, transparent 65%)",
          }}
        />
        <span className="absolute -top-3 right-1 @[300px]:-top-6 @[300px]:right-2 font-heading font-bold leading-none text-white/[0.04] select-none pointer-events-none text-[5rem] @[300px]:text-[11rem]">
          {service.index}
        </span>
        <span className="absolute top-3 left-3 @[300px]:top-4 @[300px]:left-4 px-2.5 py-1 rounded-full bg-yellow text-dark text-[9px] @[300px]:text-[11px] font-heading font-bold uppercase tracking-widest">
          {service.tag}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 @[300px]:w-24 @[300px]:h-24 rounded-2xl @[300px]:rounded-3xl bg-dark/40 border border-yellow-border backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-7 h-7 @[300px]:w-12 @[300px]:h-12 text-yellow" strokeWidth={1.4} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 @[300px]:p-6 flex flex-col flex-1 min-h-0">
        <p className="font-heading font-bold text-yellow text-[10px] @[300px]:text-xs uppercase tracking-[0.2em] mb-1.5 @[300px]:mb-2 truncate">
          {service.lead}
        </p>
        <h3 className="font-heading font-bold text-white uppercase leading-[0.95] text-2xl @[420px]:text-3xl mb-2 @[300px]:mb-3 line-clamp-3">
          {service.title}
        </h3>
        <p className="hidden @[300px]:block text-gray-light text-[14px] font-body leading-relaxed mb-4">
          {service.desc}
        </p>

        <div className="hidden @[340px]:flex flex-wrap gap-2 mb-5">
          {service.specs.map((spec) => (
            <span
              key={spec}
              className="px-2.5 py-1 rounded-full border border-dark-border text-gray-light text-[11px] font-body"
            >
              {spec}
            </span>
          ))}
        </div>

        <Link
          href="/uslugi"
          className="hidden @[300px]:inline-flex mt-auto items-center gap-2 text-yellow font-heading font-bold text-sm uppercase tracking-wide relative z-10 hover:gap-3 transition-all"
        >
          {T[lang].learnMore} <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
