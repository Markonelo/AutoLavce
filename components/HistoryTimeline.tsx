"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { Flag, ArrowUpRight } from "lucide-react";
import { useLang } from "./LanguageProvider";

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

const T = {
  mk: {
    kicker: "Нашиот пат досега",
    titleA: "Нашата ",
    titleAccent: "историја",
    viewCars: "Погледни возила",
    contact: "Контакт",
    scrollHint: "Скролај за да го поминеш патот →",
    roadGoesOn: "Патот продолжува",
    milestones: [
      { year: "2018", title: "Отворен салон", desc: "Auto Lavce ги отвора вратите во Битола — првите возила на плацот и првите задоволни клиенти." },
      { year: "2020", title: "100 продадени возила", desc: "За само две години ја поминавме бројката од 100 испорачани возила низ цела Македонија." },
      { year: "2023", title: "Сопствен авто сервис", desc: "Отворивме сопствена работилница — комплетна грижа за возилото пред и по продажбата." },
      { year: "2025", title: "Нова локација", desc: "Се преселивме во нов, поголем и помодерен салон со проширена понуда возила." },
      { year: "2026", title: "500+ продадени возила", desc: "Над 500 возила пронајдоа нов дом преку Auto Lavce — и бројката само продолжува да расте." },
    ],
  },
  en: {
    kicker: "Our journey so far",
    titleA: "Our ",
    titleAccent: "history",
    viewCars: "View vehicles",
    contact: "Contact",
    scrollHint: "Scroll to travel the road →",
    roadGoesOn: "The road goes on",
    milestones: [
      { year: "2018", title: "Showroom opened", desc: "Auto Lavce opens its doors in Bitola — the first vehicles on the lot and the first happy customers." },
      { year: "2020", title: "100 vehicles sold", desc: "In just two years we passed the mark of 100 vehicles delivered across all of Macedonia." },
      { year: "2023", title: "Our own car service", desc: "We opened our own workshop — complete care for your vehicle before and after the sale." },
      { year: "2025", title: "New location", desc: "We moved into a new, larger and more modern showroom with an expanded range of vehicles." },
      { year: "2026", title: "500+ vehicles sold", desc: "Over 500 vehicles found a new home through Auto Lavce — and the number just keeps growing." },
    ],
  },
};

export default function HistoryTimeline() {
  const { lang } = useLang();
  const t = T[lang];
  const milestones: Milestone[] = t.milestones;
  const COUNT = milestones.length;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [thresholds, setThresholds] = useState<number[]>([]);

  // Measure pan distance + the scroll point at which each marker reaches
  // the car (viewport centre), so popups fire exactly as the car passes.
  useEffect(() => {
    const calc = () => {
      const track = trackRef.current;
      if (!track) return;
      const dist = Math.max(1, track.scrollWidth - window.innerWidth);
      setDistance(dist);

      const center = window.innerWidth / 2;
      const slots = Array.from(
        track.querySelectorAll<HTMLElement>("[data-ms]")
      );
      setThresholds(
        slots.map((s) => {
          const c = s.offsetLeft + s.offsetWidth / 2;
          return Math.min(1, Math.max(0, (c - center) / dist));
        })
      );
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll progress. A mouse wheel fires coarse, chunky deltas;
  // mapping x straight off scroll makes the road teleport between ticks (reads
  // as ~10fps). The spring interpolates toward the target every frame → 60fps.
  // Drive BOTH the road and the card reveals off this so they stay in sync.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.4,
    restDelta: 0.0005,
  });

  const x = useTransform(smooth, [0, 1], [0, -distance]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-card"
      style={{ height: "440vh" }}
    >
      {/* Pinned stage — sits just below the fixed site header */}
      <div className="sticky top-16 md:top-[108px] h-[calc(100vh-4rem)] md:h-[calc(100vh-108px)] overflow-hidden border-y border-dark-border">
        {/* Scroll progress bar */}
        <motion.div
          style={{ scaleX: smooth }}
          className="absolute top-0 left-0 right-0 h-1 bg-yellow origin-left z-40"
        />

        {/* Header overlay (thin top band) */}
        <div className="absolute top-0 inset-x-0 z-30 px-5 md:px-10 pt-8 pointer-events-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="kicker mb-2 md:mb-3">{t.kicker}</p>
              <h2 className="font-heading font-bold text-white text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9]">
                {t.titleA}<span className="text-yellow">{t.titleAccent}</span>
              </h2>
            </div>
            <div className="flex gap-3 pointer-events-auto">
              <Link
                href="/avtomobili"
                className="inline-flex items-center gap-2 bg-yellow text-dark font-heading font-bold text-sm md:text-base uppercase tracking-wide px-8 py-4 rounded-xl hover:bg-yellow/90 transition-colors"
              >
                {t.viewCars} <ArrowUpRight size={18} />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 border border-dark-border text-white font-heading font-bold text-sm md:text-base uppercase tracking-wide px-8 py-4 rounded-xl hover:border-yellow hover:text-yellow transition-colors"
              >
                {t.contact}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-7 inset-x-0 z-30 flex justify-center pointer-events-none">
          <span className="font-heading font-bold text-gray-light text-xs uppercase tracking-[0.3em] animate-pulse">
            {t.scrollHint}
          </span>
        </div>

        {/* The driving car — top-down view, fixed at viewport centre, on the road.
            Nose already faces the direction of travel (→), so no flip needed. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brands/history-car-driving.png"
            alt="Auto Lavce возило"
            draggable={false}
            className="w-52 md:w-72 h-auto select-none"
            style={{
              filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.6))",
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          />
        </div>

        {/* Panning track (grows to content width) */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="absolute top-0 left-0 h-full flex items-center pl-[14vw] pr-[18vw] gap-[9vw] md:gap-[7vw] will-change-transform"
        >
          {/* Horizontal asphalt road (spans the whole track) */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[180px] rounded-[26px] overflow-hidden"
            style={{
              background: "linear-gradient(to bottom,#0d0d0d 0%,#303030 50%,#0d0d0d 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 70px rgba(0,0,0,0.6)",
            }}
          >
            {/* dashed gold lane marking */}
            <div
              className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[6px]"
              style={{
                background:
                  "repeating-linear-gradient(to right, var(--color-yellow) 0 30px, transparent 30px 60px)",
                opacity: 0.85,
              }}
            />
            {/* edge lines */}
            <div className="absolute inset-x-0 top-[20px] h-px bg-white/10" />
            <div className="absolute inset-x-0 bottom-[20px] h-px bg-white/10" />
          </div>

          {/* Milestones */}
          {milestones.map((m, i) => (
            <MilestoneSlot
              key={m.year}
              m={m}
              index={i}
              total={COUNT}
              threshold={thresholds[i] ?? i / (COUNT - 1)}
              progress={smooth}
            />
          ))}

          {/* Finish — pops up as a card */}
          <EndSlot threshold={thresholds[COUNT] ?? 1} progress={smooth} label={t.roadGoesOn} />
        </motion.div>
      </div>
    </section>
  );
}

/* ── A single milestone planted on the road ── */
function MilestoneSlot({
  m,
  index,
  total,
  threshold,
  progress,
}: {
  m: Milestone;
  index: number;
  total: number;
  threshold: number;
  progress: MotionValue<number>;
}) {
  // Reveal completes just as the car reaches this marker.
  const end = Math.min(1, threshold + 0.01);
  const start = Math.max(0, end - 0.07);

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [34, 0]);
  const scale = useTransform(progress, [start, end], [0.92, 1]);

  return (
    <div data-ms className="relative flex-shrink-0 h-full w-[76vw] md:w-[34vw]">
      {/* Milestone flag crossing the road */}
      <FlagMarker year={m.year} />

      {/* Card pops up below the road as the car passes */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 mt-24 w-[74vw] md:w-[30vw] max-w-sm">
        <motion.div style={{ opacity, y, scale }}>
          {/* Body card — flat editorial panel, no gradient */}
          <div className="relative w-full bg-dark-lighter border border-dark-border rounded-xl pl-6 pr-5 py-4 md:py-5 text-left transition-colors duration-300 hover:border-yellow/60">
            {/* solid brand rule down the left edge */}
            <span
              aria-hidden
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-yellow"
            />
            {/* milestone index */}
            <span className="block font-heading text-xs font-semibold tracking-[0.3em] text-yellow mb-2">
              {String(index + 1).padStart(2, "0")}
              <span className="text-gray-light">/{String(total).padStart(2, "0")}</span>
            </span>
            <h3 className="font-heading font-bold text-white text-2xl md:text-[1.7rem] uppercase leading-[1.05] tracking-tight">
              {m.title}
            </h3>
            <p className="mt-2.5 text-gray-light text-sm md:text-[0.95rem] font-body leading-relaxed">
              {m.desc}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Route marker — a line crossing the road with a shine at the middle ── */
function LineMarker() {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none block w-[3px] h-[180px] rounded-full"
      style={{
        background:
          "linear-gradient(to bottom, transparent, var(--color-yellow) 22%, var(--color-yellow) 78%, transparent)",
      }}
    />
  );
}

/* ── Milestone marker — a waving year-flag on a pole crossing the road ── */
function FlagMarker({ year }: { year: string }) {
  return (
    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
      {/* pole — covers the road from top to bottom */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-[-118px] w-[4px] h-[208px] rounded-full"
        style={{
          background:
            "linear-gradient(to bottom, #F2D058, var(--color-yellow) 45%, rgba(212,160,23,0.5))",
          boxShadow: "0 0 10px rgba(212,160,23,0.5)",
        }}
      />
      {/* finial — golden ball perched on the very top of the pole */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-[-125px] w-3.5 h-3.5 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #FCE89A 0%, #E8B92E 55%, #B5810F 100%)",
          boxShadow: "0 0 12px rgba(212,160,23,0.85)",
        }}
      />
      {/* flag — swallowtail pennant carrying the year, gently waving */}
      <motion.span
        className="absolute top-[-108px] left-1/2 ml-[2px] flex items-center justify-center w-20 h-10 origin-left [clip-path:polygon(0_0,100%_0,80%_50%,100%_100%,0_100%)]"
        style={{
          background: "linear-gradient(135deg, #F2D058 0%, #C9921A 100%)",
          boxShadow: "0 6px 16px rgba(212,160,23,0.4)",
        }}
        animate={{ skewY: [0, -3.5, 0, 3.5, 0], scaleX: [1, 0.97, 1, 0.97, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="relative pr-2.5 font-heading font-bold text-dark text-xl md:text-2xl leading-none select-none tracking-tight">
          {year}
        </span>
      </motion.span>
    </span>
  );
}

/* ── Finish — line marker + card that pops up ── */
function EndSlot({
  threshold,
  progress,
  label,
}: {
  threshold: number;
  progress: MotionValue<number>;
  label: string;
}) {
  const end = Math.min(1, threshold + 0.01);
  const start = Math.max(0, end - 0.07);

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [36, 0]);
  const scale = useTransform(progress, [start, end], [0.9, 1]);

  return (
    <div data-ms className="relative flex-shrink-0 h-full w-[60vw] md:w-[24vw]">
      <LineMarker />

      {/* Card pops up below the road */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 mt-28 w-[58vw] md:w-[20vw] max-w-xs">
        <motion.div style={{ opacity, y, scale }}>
          {/* Finish card — flat solid gold, no gradient */}
          <div
            className="relative w-full rounded-xl bg-yellow text-dark pl-6 pr-5 py-5 text-left"
            style={{ boxShadow: "0 14px 30px rgba(212,160,23,0.28)" }}
          >
            {/* dark rule down the left edge — mirrors the milestone cards */}
            <span
              aria-hidden
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-dark/60"
            />
            {/* flag mark */}
            <Flag className="w-5 h-5 mb-2.5" strokeWidth={2.6} />
            <h3 className="font-heading font-bold text-2xl md:text-[1.7rem] uppercase leading-[1.05] tracking-tight">
              {label}
            </h3>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
