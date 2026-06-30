"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "./LanguageProvider";

/** Seconds of lead-in to skip. Playback starts — and loops back — here.
 *  Set to 1s so the hero begins immediately from the 2nd second (cuts the 1st). */
const START_AT = 1;

const T = {
  mk: {
    tagline: "Најпремиум возила во Битола,\nсо гаранција, доверба и врвен квалитет.",
    cta1: "Погледни возила",
    cta2: "Услуги",
    scroll: "Скролај надолу",
  },
  en: {
    tagline: "The most premium vehicles in Bitola",
    cta1: "View cars",
    cta2: "Services",
    scroll: "Scroll down",
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const { lang } = useLang();
  const t = T[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false);

  // ── Pointer-tilt for the wordmark (same feel as the car-detail hero) ──
  const reduce = useReducedMotion();
  const txRaw = useMotionValue(0);
  const tyRaw = useMotionValue(0);
  const tx = useSpring(txRaw, { stiffness: 140, damping: 18 });
  const ty = useSpring(tyRaw, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(tx, [-0.5, 0.5], [22, -22]);
  const rotateX = useTransform(ty, [-0.5, 0.5], [-20, 20]);
  const onTilt = (e: MouseEvent<HTMLImageElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    txRaw.set((e.clientX - r.left) / r.width - 0.5);
    tyRaw.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onTiltLeave = () => {
    txRaw.set(0);
    tyRaw.set(0);
  };

  /** Jump past the black intro as early as the browser allows. */
  const skipIntro = (v: HTMLVideoElement) => {
    if (v.currentTime < START_AT) {
      try {
        v.currentTime = START_AT;
      } catch {
        /* not seekable yet — a later event retries */
      }
    }
  };

  /** Kick off autoplay as robustly as the browser allows. Browsers only permit
   *  muted autoplay, and React's `muted` JSX prop doesn't always reach the DOM
   *  node — so we set `.muted` imperatively before every play() attempt. We also
   *  retry on the media-ready events and on the first user gesture, because a
   *  single play() right after mount can be rejected while the tab is warming up. */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let done = false; // becomes true once playback has actually started

    const tryPlay = () => {
      if (done) return;
      vid.muted = true; // imperative — guarantees the DOM flag is set
      const p = vid.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          done = true;
        }).catch(() => {
          /* rejected (autoplay policy / not ready) — a later event retries */
        });
      }
    };

    tryPlay();

    // Retry on each readiness milestone the browser emits.
    const readyEvents = ["loadeddata", "canplay", "canplaythrough"] as const;
    readyEvents.forEach((ev) => vid.addEventListener(ev, tryPlay));

    // Last-resort: the first user interaction satisfies the gesture requirement.
    const onGesture = () => {
      tryPlay();
      if (done) removeGestureListeners();
    };
    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    window.addEventListener("touchstart", onGesture, { passive: true });

    // Re-arm playback when the tab becomes visible again.
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      readyEvents.forEach((ev) => vid.removeEventListener(ev, tryPlay));
      removeGestureListeners();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  /** Pause the video while the hero is off-screen so it costs no GPU during the
   *  rest of the page — keeps scrolling smooth. Resumes (muted) when back in view. */
  useEffect(() => {
    const sec = sectionRef.current;
    const vid = videoRef.current;
    if (!sec || !vid) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.muted = true;
          void vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  /** Safety net for the opacity reveal: the video is hidden (opacity-0) until
   *  `revealed` flips true, normally via onSeeked after skipping the black intro.
   *  If that seek path is flaky the video would play but stay invisible — so we
   *  force the reveal after a short timeout no matter what. */
  useEffect(() => {
    const id = window.setTimeout(() => setRevealed(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-16 flex min-h-screen items-center overflow-hidden bg-dark md:-mt-[108px]"
    >
      {/* ── Ambient background video — clean, no blur/grain; lightly darkened
            so the gold logo reads on top. The footage does the talking. ── */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-700 ease-out ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
        style={{ filter: "saturate(1.05) brightness(0.78)" }}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedMetadata={(e) => skipIntro(e.currentTarget)}
        onLoadedData={(e) => skipIntro(e.currentTarget)}
        onSeeked={() => setRevealed(true)}
        onPlaying={() => setRevealed(true)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (!revealed && v.currentTime >= START_AT - 0.05) setRevealed(true);
          if (v.duration && v.currentTime >= v.duration - 0.3) v.currentTime = START_AT;
        }}
        onEnded={(e) => {
          const v = e.currentTarget;
          v.currentTime = START_AT;
          void v.play();
        }}
      >
        <source src="/hero-intro.mp4" type="video/mp4" />
      </video>

      {/* Clean scrim — darker at the very top (nav) and bottom (scroll cue +
          blend into the page), the footage breathing through the middle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(15,15,15,0.60) 0%, rgba(15,15,15,0.20) 20%, rgba(15,15,15,0.20) 56%, rgba(15,15,15,0.80) 84%, var(--color-dark) 100%)",
        }}
      />
      {/* Soft focus pool so the gold mark always reads against busy footage. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[58rem] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{ background: "radial-gradient(ellipse at center, rgba(15,15,15,0.50) 0%, transparent 68%)" }}
      />

      {/* ── Foreground content ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 md:px-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } } }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.h1 variants={fadeUp} className="leading-none [perspective:1100px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/hero-logo.png"
              alt="Auto Lavce — Автосалон во Битола"
              draggable={false}
              onMouseMove={onTilt}
              onMouseLeave={onTiltLeave}
              style={{ rotateX, rotateY }}
              className="mx-auto h-auto w-[88%] max-w-md select-none [transform-style:preserve-3d] sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
            />
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl whitespace-pre-line font-body text-base font-light leading-relaxed tracking-wide text-gray-light md:text-lg"
          >
            {t.tagline}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/avtomobili" className="btn-primary text-sm md:text-base">
              {t.cta1} <ArrowUpRight size={18} />
            </Link>
            <Link href="/uslugi" className="btn-outline text-sm md:text-base">
              {t.cta2}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-heading text-[0.7rem] uppercase tracking-[0.3em] text-gray-light">
          {t.scroll}
        </span>
        <motion.span
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 w-px bg-gradient-to-b from-yellow to-transparent"
        />
      </div>
    </section>
  );
}
