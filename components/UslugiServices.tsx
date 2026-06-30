"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, Droplets, Sparkles, Wrench, Phone, X, Expand, ArrowLeft, ArrowRight,
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
  images: string[];
}

const SERVICE_ICONS: LucideIcon[] = [Droplets, Sparkles, Wrench];

const T = {
  mk: {
    viewPhotos: "Погледни фотографии",
    book: "Закажи термин",
    close: "Затвори",
    prev: "Претходна",
    next: "Следна",
    photoWord: "фотографија",
    photoLabel: (n: number) => `Фотографија ${n}`,
    photosSoon: "Фотографиите се додаваат наскоро",
    services: [
      {
        index: "01", tag: "Перење", title: "ПЕРЕЊЕ НА ВОЗИЛА", lead: "Сјај што се забележува.",
        desc: "Внимателно рачно перење што го враќа сјајот на твоето возило — без четки што гребат, без брзање. Ја третираме секоја површина одделно, од каросеријата до интериерот.",
        specs: ["Рачно надворешно", "Чистење ентериер", "Тепихчиња", "Полирање стакла", "Сушење со микрофибер"],
        images: [],
      },
      {
        index: "02", tag: "Детајлинг", title: "ХЕМИСКО ЧИСТЕЊЕ", lead: "Како од салон.",
        desc: "Длабинско обновување на ентериерот со професионални машини и препарати. Ги вадиме дамките, прашината и непријатните миризби од местата каде обичното перење не допира.",
        specs: ["Длабинско на седишта", "Таван и врати", "Подни простори", "Дамки и миризби", "Озон дезинфекција", "Заштитен премаз"],
        images: [],
      },
      {
        index: "03", tag: "Сервис", title: "АВТО СЕРВИС", lead: "Спремно за пат.",
        desc: "Комплетна техничка поддршка во нашата работилница во Битола. Од редовен сервис до дијагностика на проблем — работата ја објаснуваме јасно и однапред, без скриени трошоци.",
        specs: ["Компјутерска дијагностика", "Сервис на мотор", "Масло и филтри", "Кочници и подвозје", "Гуми и баланс", "Поправки по потреба"],
        images: [],
      },
    ],
  },
  en: {
    viewPhotos: "View photos",
    book: "Book an appointment",
    close: "Close",
    prev: "Previous",
    next: "Next",
    photoWord: "photo",
    photoLabel: (n: number) => `Photo ${n}`,
    photosSoon: "Photos are being added soon",
    services: [
      {
        index: "01", tag: "Wash", title: "VEHICLE WASH", lead: "A shine you'll notice.",
        desc: "A careful hand wash that brings back your vehicle's shine — no scratchy brushes, no rushing. We treat every surface individually, from the bodywork to the interior.",
        specs: ["Hand exterior", "Interior cleaning", "Floor mats", "Glass polishing", "Microfibre drying"],
        images: [],
      },
      {
        index: "02", tag: "Detailing", title: "DEEP CLEANING", lead: "Showroom fresh.",
        desc: "A deep interior refresh with professional machines and products. We lift stains, dust and unpleasant odours from the places an ordinary wash can't reach.",
        specs: ["Deep seat cleaning", "Headliner & doors", "Floor areas", "Stains & odours", "Ozone disinfection", "Protective coating"],
        images: [],
      },
      {
        index: "03", tag: "Service", title: "CAR SERVICE", lead: "Ready for the road.",
        desc: "Complete technical support in our Bitola workshop. From routine servicing to fault diagnostics — we explain the work clearly and upfront, with no hidden costs.",
        specs: ["Computer diagnostics", "Engine service", "Oil & filters", "Brakes & suspension", "Tyres & balancing", "Repairs as needed"],
        images: [],
      },
    ],
  },
};

export default function UslugiServices() {
  const { lang } = useLang();
  const t = T[lang];
  const services: Service[] = t.services.map((s, i) => ({ ...s, icon: SERVICE_ICONS[i] }));
  const [active, setActive] = useState<number | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const current = active !== null ? services[active] : null;

  const close = useCallback(() => setActive(null), []);
  const open = (i: number) => { setActive(i); setImgIndex(0); };

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (!current.images.length) return;
      if (e.key === "ArrowRight") setImgIndex((n) => (n + 1) % current.images.length);
      if (e.key === "ArrowLeft") setImgIndex((n) => (n - 1 + current.images.length) % current.images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [current, close]);

  return (
    <>
      {/* Service ledger */}
      <section className="px-4 pt-12 md:pt-16 pb-4 bg-dark">
        <div className="max-w-6xl mx-auto">
          {services.map((s, i) => (
            <AnimSection key={s.title} delay={i * 0.06}>
              <article
                role="button"
                tabIndex={0}
                onClick={() => open(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
                }}
                className="group relative border-t border-dark-border last:border-b cursor-pointer outline-none focus-visible:bg-white/[0.02]"
              >
                {/* Hover accent rail */}
                <span className="hidden lg:block absolute left-0 top-0 bottom-0 w-[3px] bg-yellow origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-7 lg:gap-x-12 py-12 md:py-16 lg:pl-10 transition-colors">
                  {/* Index + icon rail */}
                  <div className="lg:col-span-3 flex items-center lg:items-start gap-5">
                    <span
                      className="font-heading font-bold leading-[0.8] text-transparent text-7xl md:text-8xl select-none transition-all duration-300 group-hover:text-yellow"
                      style={{ WebkitTextStroke: "1.5px rgba(212,160,23,0.45)" }}
                    >
                      {s.index}
                    </span>
                    <span className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-yellow-muted border border-yellow-border flex items-center justify-center shrink-0 group-hover:bg-yellow group-hover:border-yellow transition-colors duration-300">
                      <s.icon size={24} className="text-yellow group-hover:text-dark transition-colors duration-300" strokeWidth={1.7} />
                    </span>
                  </div>

                  {/* Title + copy */}
                  <div className="lg:col-span-5">
                    <p className="font-heading font-bold text-yellow text-sm uppercase tracking-[0.2em] mb-2">
                      {s.lead}
                    </p>
                    <h3 className="font-heading font-bold text-white uppercase leading-[0.92] text-4xl md:text-5xl mb-5 group-hover:text-yellow transition-colors duration-300">
                      {s.title}
                    </h3>
                    <p className="text-gray-light text-[15px] font-body leading-relaxed max-w-md mb-5">
                      {s.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-yellow text-sm font-heading font-bold uppercase tracking-wide">
                      <Expand size={15} />
                      {t.viewPhotos}
                    </span>
                  </div>

                  {/* Specs + actions */}
                  <div className="lg:col-span-4">
                    <div className="flex flex-wrap gap-2 mb-7">
                      {s.specs.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1.5 rounded-full border border-dark-border text-gray-light text-[12px] font-body group-hover:border-yellow-border transition-colors duration-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href="/kontakt"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-yellow text-dark font-heading font-bold text-sm uppercase tracking-wide rounded-xl hover:bg-yellow-light transition-colors"
                      >
                        {t.book} <ArrowUpRight size={16} />
                      </Link>
                      <a
                        href="tel:+38978889293"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-gray-light hover:text-yellow font-body text-sm transition-colors"
                      >
                        <Phone size={15} className="text-yellow" /> 078-889-293
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* Lightbox / image frame */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-dark/92 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[96vw] max-w-7xl h-[88vh] rounded-3xl overflow-hidden border border-yellow-border bg-dark-card"
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-4 p-4 sm:p-5 bg-gradient-to-b from-dark/80 to-transparent">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-3 py-1 rounded-full bg-yellow text-dark text-[11px] font-heading font-bold uppercase tracking-widest shrink-0">
                    {current.tag}
                  </span>
                  <h3 className="font-heading font-bold text-white text-lg sm:text-2xl uppercase truncate">
                    {current.title}
                  </h3>
                </div>
                <button
                  onClick={close}
                  aria-label={t.close}
                  className="shrink-0 w-11 h-11 rounded-full bg-dark/70 border border-dark-border text-white hover:bg-yellow hover:text-dark hover:border-yellow flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Image / placeholder */}
              {current.images.length > 0 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.images[imgIndex]}
                    alt={`${current.title} — ${t.photoWord} ${imgIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {current.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIndex((n) => (n - 1 + current.images.length) % current.images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-dark/70 border border-dark-border text-white hover:bg-yellow hover:text-dark flex items-center justify-center transition-colors"
                        aria-label={t.prev}
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <button
                        onClick={() => setImgIndex((n) => (n + 1) % current.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-dark/70 border border-dark-border text-white hover:bg-yellow hover:text-dark flex items-center justify-center transition-colors"
                        aria-label={t.next}
                      >
                        <ArrowRight size={18} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {current.images.map((_, n) => (
                          <button
                            key={n}
                            onClick={() => setImgIndex(n)}
                            className={`h-1.5 rounded-full transition-all ${n === imgIndex ? "w-6 bg-yellow" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
                            aria-label={t.photoLabel(n + 1)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* Intentional framed placeholder until real photos are added */
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse 60% 55% at 50% 42%, rgba(212,160,23,0.16) 0%, transparent 62%)" }}
                  />
                  <span
                    className="absolute font-heading font-bold leading-none text-white/[0.03] select-none pointer-events-none"
                    style={{ fontSize: "clamp(14rem, 40vw, 34rem)" }}
                  >
                    {current.index}
                  </span>
                  <div className="relative">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-dark/40 border border-yellow-border backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                      <current.icon size={64} className="text-yellow" strokeWidth={1.4} />
                    </div>
                    <p className="font-heading font-bold text-white text-2xl sm:text-3xl uppercase">{current.title}</p>
                    <p className="text-gray-muted text-sm font-body mt-2">{t.photosSoon}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
