"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion, AnimatePresence, useReducedMotion, useInView,
  useMotionValue, useSpring, useTransform, animate,
} from "framer-motion";
import {
  Fuel, Settings, Calendar, Zap, Palette, Car as CarIcon, Users,
  DoorOpen, Phone, MessageCircle, CheckCircle, ChevronRight, ChevronLeft,
  ArrowRight, Gauge, ArrowLeft, X,
} from "lucide-react";
import type { Car } from "@/data/cars";
import { eur, mkd, engineCC } from "@/lib/format";
import CarCard from "./CarCard";
import LeasingCalculator from "./LeasingCalculator";
import { useLang } from "./LanguageProvider";
import { tFuel, tTrans, tBody, tBadge, localizeCarDescription, type Lang } from "@/lib/i18n";

interface Props {
  car: Car;
  related: Car[];
}

const T = {
  mk: {
    close: "Затвори",
    prevImg: "Претходна слика",
    nextImg: "Следна слика",
    zoomOut: "Кликни за намалување",
    zoomIn: "Кликни на сликата за зум",
    photoWord: "фотографија",
    home: "Дома",
    cars: "Автомобили",
    back: "Назад",
    sold: "Продадено",
    reserved: "Резервирано",
    photosSoon: "Фотографиите се додаваат наскоро",
    price: "Цена",
    or: "или",
    perMonth: "/месец",
    inInstallments: "на рати",
    onRequest: "По Договор",
    enquire: "Контактирај за Возилото",
    call: "Јави се",
    viber: "Вибер",
    soldBox: "Ова возило е продадено",
    reservedBox: "Ова возило е резервирано",
    descTitle: "Опис",
    equipTitle: "Опрема",
    calcTitle: "Калкулатор за рати",
    fullSpecs: "Целосни Спецификации",
    similar: "Слични Возила",
    allVehicles: "Сите Возила",
    l_year: "Година",
    l_fuel: "Гориво",
    l_trans: "Менувач",
    l_engine: "Мотор",
    l_power: "Моќност",
    l_colour: "Боја",
    l_type: "Тип",
    l_drivetrain: "Погон",
    l_seats: "Седишта",
    l_doors: "Врати",
    hp: "КС",
  },
  en: {
    close: "Close",
    prevImg: "Previous image",
    nextImg: "Next image",
    zoomOut: "Click to zoom out",
    zoomIn: "Click image to zoom",
    photoWord: "photo",
    home: "Home",
    cars: "Cars",
    back: "Back",
    sold: "Sold",
    reserved: "Reserved",
    photosSoon: "Photos coming soon",
    price: "Price",
    or: "or",
    perMonth: "/month",
    inInstallments: "in installments",
    onRequest: "On request",
    enquire: "Enquire about this vehicle",
    call: "Call",
    viber: "Viber",
    soldBox: "This vehicle has been sold",
    reservedBox: "This vehicle is reserved",
    descTitle: "Description",
    equipTitle: "Equipment",
    calcTitle: "Installment calculator",
    fullSpecs: "Full specifications",
    similar: "Similar vehicles",
    allVehicles: "All vehicles",
    l_year: "Year",
    l_fuel: "Fuel",
    l_trans: "Transmission",
    l_engine: "Engine",
    l_power: "Power",
    l_colour: "Colour",
    l_type: "Type",
    l_drivetrain: "Drivetrain",
    l_seats: "Seats",
    l_doors: "Doors",
    hp: "HP",
  },
};

/* ── Animated count-up (price) ── */
function CountUp({ value, className, lang }: { value: number; className?: string; lang: Lang }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  // Start on the real value so SSR / no-JS shows the correct price (no "0 €" flash).
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduce) { setDisplay(value); return; }
    setDisplay(0);
    const controls = animate(0, value, {
      duration: 2.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return <span ref={ref} className={className}>{display.toLocaleString(lang === "en" ? "en-US" : "mk-MK")} €</span>;
}

/* ── Editorial section heading: index + title + drawing underline ── */
function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3">
        <span className="font-heading font-bold text-yellow/35 text-xl tabular-nums">{index}</span>
        <h2 className="font-heading font-bold text-white text-2xl md:text-3xl uppercase tracking-wide">{title}</h2>
      </div>
      <motion.div
        className="mt-3 h-1 w-full rounded-full bg-yellow origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/* ── Fullscreen image lightbox (click image → near-fullscreen popup, click again → zoom) ── */
function Lightbox({
  images, index, setIndex, title, onClose, labels,
}: {
  images: string[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  onClose: () => void;
  labels: { close: string; prevImg: string; nextImg: string; zoomOut: string; zoomIn: string; photoWord: string };
}) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const go = (dir: number) => {
    setIndex((i) => (i + dir + images.length) % images.length);
    setZoom(false);
    setOrigin("50% 50%");
  };

  // Zoom toward wherever the user clicked.
  const toggleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (!zoom) {
      const r = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      setOrigin(`${x}% ${y}%`);
    }
    setZoom((z) => !z);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/95 p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* close */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label={labels.close}
        className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-dark/80 border border-dark-border flex items-center justify-center text-white hover:bg-yellow hover:text-dark hover:border-yellow transition-all"
      >
        <X size={20} />
      </button>

      {/* counter */}
      {images.length > 1 && (
        <div className="absolute top-6 left-6 z-20 px-3 py-1.5 rounded-md bg-dark/80 border border-dark-border text-sm font-heading font-bold tabular-nums tracking-wider">
          <span className="text-yellow">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-gray-muted"> / {String(images.length).padStart(2, "0")}</span>
        </div>
      )}

      {/* image */}
      <motion.img
        key={index}
        src={images[index]}
        alt={`${title} — ${labels.photoWord} ${index + 1}`}
        onClick={toggleZoom}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: zoom ? 2.2 : 1 }}
        transition={{ opacity: { duration: 0.25 }, scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
        style={{ transformOrigin: origin }}
        className={`max-h-[85vh] max-w-[92vw] object-contain rounded-lg shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        draggable={false}
      />

      {/* arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label={labels.prevImg}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-dark/80 border border-dark-border flex items-center justify-center text-white hover:bg-yellow hover:text-dark hover:border-yellow transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label={labels.nextImg}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-dark/80 border border-dark-border flex items-center justify-center text-white hover:bg-yellow hover:text-dark hover:border-yellow transition-all"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* hint */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-muted text-xs font-body tracking-wide select-none pointer-events-none">
        {zoom ? labels.zoomOut : labels.zoomIn}
      </p>
    </motion.div>
  );
}

export default function CarDetailClient({ car, related }: Props) {
  const { lang } = useLang();
  const t = T[lang];
  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduce = useReducedMotion();

  // Always open a car page scrolled to the very top (also when switching between cars).
  useEffect(() => {
    window.scrollTo(0, 0);
    // Re-assert after paint in case a late layout shift nudges the position.
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(raf);
  }, [car.id]);

  const cc = engineCC(car);

  // Big background watermark spells the full brand name (VW → Volkswagen).
  const watermarkMake = car.make === "VW" ? "Volkswagen" : car.make;

  // Full spec list (right-hand table)
  const specs = [
    { icon: Calendar, label: t.l_year, value: car.year.toString() },
    { icon: Fuel, label: t.l_fuel, value: tFuel(car.fuel, lang) },
    { icon: Settings, label: t.l_trans, value: tTrans(car.transmission, lang) },
    { icon: Zap, label: t.l_engine, value: cc ? `${car.engine} · ${cc} cc` : car.engine },
    ...(car.power ? [{ icon: Gauge, label: t.l_power, value: `${car.power} ${t.hp}` }] : []),
    ...(car.color ? [{ icon: Palette, label: t.l_colour, value: car.color }] : []),
    { icon: CarIcon, label: t.l_type, value: tBody(car.bodyType, lang) },
    ...(car.drivetrain ? [{ icon: CarIcon, label: t.l_drivetrain, value: car.drivetrain }] : []),
    ...(car.seats ? [{ icon: Users, label: t.l_seats, value: car.seats.toString() }] : []),
    ...(car.doors ? [{ icon: DoorOpen, label: t.l_doors, value: car.doors.toString() }] : []),
    ...(car.co2 ? [{ icon: CarIcon, label: "CO₂", value: `${car.co2} g/km` }] : []),
  ];

  // Instrument cluster (4 headline specs)
  const keySpecs = [
    { icon: Calendar, label: t.l_year, value: car.year.toString() },
    { icon: Fuel, label: t.l_fuel, value: tFuel(car.fuel, lang) },
    { icon: Settings, label: t.l_trans, value: tTrans(car.transmission, lang) },
    car.power
      ? { icon: Gauge, label: t.l_power, value: `${car.power} ${t.hp}` }
      : { icon: Zap, label: t.l_engine, value: cc ? `${cc} cc` : car.engine },
  ];

  // ── Gallery navigation ──
  const next = () => setImgIndex((i) => (i + 1) % car.images.length);
  const prev = () => setImgIndex((i) => (i - 1 + car.images.length) % car.images.length);

  useEffect(() => {
    if (car.images.length < 2 || lightboxOpen) return; // lightbox handles its own keys
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setImgIndex((i) => (i + 1) % car.images.length);
      if (e.key === "ArrowLeft") setImgIndex((i) => (i - 1 + car.images.length) % car.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [car.images.length, lightboxOpen]);

  // Keep the active thumbnail in view — scroll the strip (not the page) when it goes off-edge.
  const thumbStripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const active = strip.children[imgIndex] as HTMLElement | undefined;
    if (!active) return;
    const sRect = strip.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    const margin = 16;
    if (aRect.left < sRect.left) {
      strip.scrollBy({ left: aRect.left - sRect.left - margin, behavior: "smooth" });
    } else if (aRect.right > sRect.right) {
      strip.scrollBy({ left: aRect.right - sRect.right + margin, behavior: "smooth" });
    }
  }, [imgIndex]);

  // ── Pointer-tilt for the hero ──
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 140, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(mx, [-0.5, 0.5], [2, -2]);
  const rotateX = useTransform(my, [-0.5, 0.5], [-2, 2]);

  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mxRaw.set((e.clientX - r.left) / r.width - 0.5);
    myRaw.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onTiltLeave = () => { mxRaw.set(0); myRaw.set(0); };

  return (
    <div className="relative bg-dark min-h-screen pt-8 overflow-hidden">
      {/* ── Ambient atmosphere ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-center">
          {/* Make watermark: flashes in brighter first, then settles faint behind the content. */}
          <motion.span
            className="mt-24 font-heading font-bold text-white text-[16rem] md:text-[24rem] leading-none whitespace-nowrap select-none uppercase"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
            animate={{ opacity: [0, 0.12, 0.03], scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", times: [0, 0.45, 1] }}
          >
            {watermarkMake}
          </motion.span>
        </div>
      </div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Breadcrumb + back */}
        <div className="max-w-6xl mx-auto px-4 mb-6 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-muted font-body flex-wrap">
            <Link href="/" className="hover:text-yellow transition-colors">{t.home}</Link>
            <ChevronRight size={12} />
            <Link href="/avtomobili" className="hover:text-yellow transition-colors">{t.cars}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-light truncate max-w-[180px] sm:max-w-none">{car.title}</span>
          </nav>
          <Link href="/avtomobili"
            className="group hidden sm:flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-gray-light hover:text-yellow transition-colors shrink-0">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t.back}
          </Link>
        </div>

        {/* ── HERO ── */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:items-start">
            {/* Gallery */}
            <div className="lg:col-span-3">
              <div style={{ perspective: 1400 }}>
                <motion.div
                  onMouseMove={onTilt}
                  onMouseLeave={onTiltLeave}
                  style={{ rotateX, rotateY }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative aspect-[4/3] bg-dark-card rounded-2xl overflow-hidden border border-dark-border shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                >
                  {car.images.length > 0 ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={imgIndex}
                          src={car.images[imgIndex]}
                          alt={`${car.title} – ${t.photoWord} ${imgIndex + 1}`}
                          onClick={() => setLightboxOpen(true)}
                          className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                          initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                          draggable={false}
                        />
                      </AnimatePresence>

                      {/* cinematic vignette — lifts on hover to reveal the car */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/10 to-dark/20 transition-opacity duration-500 group-hover:opacity-40" />

                      {/* badge / status (top-left) */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        {car.badge && car.status === "available" && (
                          <span className="px-3 py-1 bg-yellow text-dark text-xs font-heading font-bold rounded-md uppercase tracking-wide shadow-lg">
                            {tBadge(car.badge, lang)}
                          </span>
                        )}
                        {car.status !== "available" && (
                          <span className="px-3 py-1 bg-dark/90 border border-white/20 text-white text-xs font-heading font-bold rounded-md uppercase tracking-widest">
                            {car.status === "sold" ? t.sold : t.reserved}
                          </span>
                        )}
                      </div>

                      {/* counter (top-right) */}
                      {car.images.length > 1 && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-dark/85 border border-dark-border text-xs font-heading font-bold tabular-nums tracking-wider text-white">
                          <span className="text-yellow">{String(imgIndex + 1).padStart(2, "0")}</span>
                          <span className="text-gray-muted"> / {String(car.images.length).padStart(2, "0")}</span>
                        </div>
                      )}

                      {/* title overlay (bottom-left) — fades out on hover to reveal the car */}
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
                        <p className="kicker mb-1 text-[0.65rem]">{car.make} · {tBody(car.bodyType, lang)}</p>
                        <h1 className="font-heading font-bold text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[0.95] line-clamp-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                          {car.title}
                        </h1>
                      </div>

                      {/* arrows */}
                      {car.images.length > 1 && (
                        <>
                          <button onClick={prev} aria-label={t.prevImg}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/75 border border-dark-border flex items-center justify-center text-white hover:bg-yellow hover:text-dark hover:border-yellow transition-all">
                            <ChevronLeft size={18} />
                          </button>
                          <button onClick={next} aria-label={t.nextImg}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/75 border border-dark-border flex items-center justify-center text-white hover:bg-yellow hover:text-dark hover:border-yellow transition-all">
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-dark-border flex items-center justify-center text-4xl">🚗</div>
                      <p className="text-gray-muted text-sm font-body">{t.photosSoon}</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Thumbnail strip */}
              {car.images.length > 1 && (
                <div ref={thumbStripRef} className="flex gap-2.5 overflow-x-auto py-2 mt-2 no-scrollbar">
                  {car.images.map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`shrink-0 w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? "border-yellow" : "border-dark-border opacity-70 hover:opacity-100 hover:border-yellow-border"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky action rail */}
            <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                {/* Price */}
                <div className="relative bg-dark-card border border-dark-border rounded-2xl p-6 overflow-hidden">
                  <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-yellow/[0.08] blur-3xl" />
                  <p className="text-gray-muted text-xs font-body uppercase tracking-[0.2em] mb-2">{t.price}</p>
                  {car.price > 0 ? (
                    <>
                      <CountUp value={car.price} lang={lang} className="block font-heading font-bold text-5xl md:text-6xl gradient-text leading-none" />
                      <p className="text-gray-muted text-xs font-body mt-2">≈ {mkd(car.price)}</p>
                      {car.monthlyPayment && car.status === "available" && (
                        <p className="text-gray-light text-sm font-body mt-3">
                          {t.or} <span className="text-yellow font-bold">{eur(car.monthlyPayment)}{t.perMonth}</span> {t.inInstallments}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="font-heading font-bold text-3xl md:text-4xl text-yellow leading-none">{t.onRequest}</p>
                  )}
                </div>

                {/* Contact actions */}
                {car.status === "available" ? (
                  <div className="flex flex-col gap-3 mt-4">
                    <Link href="/kontakt"
                      className="w-full py-4 bg-yellow text-dark font-heading font-bold text-base rounded-xl text-center hover:bg-yellow-light hover:-translate-y-0.5 transition-all uppercase tracking-wide">
                      {t.enquire}
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                      <a href="tel:+38978889293"
                        className="py-3.5 border border-dark-border text-white font-heading font-bold text-sm rounded-xl text-center hover:border-yellow-border hover:text-yellow transition-colors flex items-center justify-center gap-2">
                        <Phone size={16} /> {t.call}
                      </a>
                      <a href="viber://chat?number=%2B38978889293"
                        className="py-3.5 bg-dark-lighter border border-dark-border text-white font-heading font-bold text-sm rounded-xl text-center hover:border-yellow-border hover:text-yellow transition-colors flex items-center justify-center gap-2">
                        <MessageCircle size={16} /> {t.viber}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 px-4 py-4 bg-dark-card border border-dark-border rounded-xl text-center">
                    <span className="font-heading font-bold text-white/60 text-sm uppercase tracking-widest">
                      {car.status === "sold" ? t.soldBox : t.reservedBox}
                    </span>
                  </div>
                )}

                {/* Instrument cluster */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {keySpecs.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.05 * i }}
                      whileHover={{ y: -3 }}
                      className="group relative bg-dark-card border border-dark-border rounded-xl p-4 overflow-hidden hover:border-yellow-border transition-colors"
                    >
                      <div className="absolute inset-0 bg-yellow/0 group-hover:bg-yellow/[0.04] transition-colors" />
                      <s.icon size={16} className="text-yellow mb-2" />
                      <p className="text-gray-muted text-[11px] font-body uppercase tracking-wider">{s.label}</p>
                      <p className="text-white font-heading font-bold text-lg">{s.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="max-w-6xl mx-auto px-4 pb-16 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:items-start">
            {/* Left column */}
            <div className="lg:col-span-3">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <SectionHead index="01" title={t.descTitle} />
                <p className="text-gray-light text-sm md:text-base font-body leading-relaxed">{localizeCarDescription(car.description, lang)}</p>
              </motion.div>

              {/* Features */}
              {car.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="mt-12"
                >
                  <SectionHead index="02" title={t.equipTitle} />
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {car.features.map((feat, i) => (
                      <motion.li
                        key={feat}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.03 * i }}
                        className="flex items-center gap-2.5 text-gray-light text-sm font-body bg-dark-card/50 border border-dark-border rounded-lg px-3.5 py-2.5"
                      >
                        <CheckCircle size={15} className="text-yellow shrink-0" />
                        {feat}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Leasing calculator */}
              {car.status === "available" && car.price > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="mt-12"
                >
                  <SectionHead index={car.features.length > 0 ? "03" : "02"} title={t.calcTitle} />
                  <LeasingCalculator defaultPrice={car.price} lockPrice compact />
                </motion.div>
              )}
            </div>

            {/* Right column — full specs */}
            <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                <h3 className="font-heading font-bold text-white text-lg uppercase mb-5 flex items-center gap-2.5">
                  <span className="slash" /> {t.fullSpecs}
                </h3>
                <dl>
                  {specs.map((s) => (
                    <div key={s.label} className="flex justify-between items-center py-2.5 border-b border-dark-border last:border-0 group">
                      <dt className="flex items-center gap-2 text-gray-muted text-xs font-body uppercase tracking-wide">
                        <s.icon size={13} className="text-yellow/60 group-hover:text-yellow transition-colors" />
                        {s.label}
                      </dt>
                      <dd className="text-white text-sm font-heading font-bold">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>
          </div>

          {/* Related cars */}
          {related.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading font-bold text-white text-3xl uppercase flex items-center gap-2.5">
                  <span className="slash" /> {t.similar}
                </h2>
                <Link href="/avtomobili" className="group shrink-0 inline-flex items-center gap-2 rounded-lg border border-yellow-border bg-yellow-muted px-4 py-2 text-yellow text-sm md:text-base font-heading font-bold uppercase tracking-wide hover:bg-yellow hover:text-dark hover:border-yellow transition-all">
                  {t.allVehicles} <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {related.map((c) => <CarCard key={c.id} car={c} />)}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Fullscreen lightbox (rendered at root → no transformed ancestor, so fixed works) ── */}
      <AnimatePresence>
        {lightboxOpen && car.images.length > 0 && (
          <Lightbox
            images={car.images}
            index={imgIndex}
            setIndex={setImgIndex}
            title={car.title}
            onClose={() => setLightboxOpen(false)}
            labels={{
              close: t.close,
              prevImg: t.prevImg,
              nextImg: t.nextImg,
              zoomOut: t.zoomOut,
              zoomIn: t.zoomIn,
              photoWord: t.photoWord,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
