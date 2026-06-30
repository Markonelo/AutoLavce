"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import MotionButton from "./ui/motion-button";
import { useLang } from "./LanguageProvider";

const T = {
  mk: { kicker: "Популарни модели", title: "Разгледај по тип", viewAll: "Види ги сите" },
  en: { kicker: "Popular models", title: "Browse by type", viewAll: "View all" },
};

// "Разгледај по тип" rail — five studio cutouts the dealership provided
// (public/pick-by-type/*.png, transparent RGBA), each linking to the matching
// real listing. No card chrome — just the clean cutout and its name.
type Pick = { img: string; label: string; slug: string };

const PICKS: Pick[] = [
  { img: "/pick-by-type/bmw-120d.png", label: "BMW 120d", slug: "bmw-120d-2011" },
  { img: "/pick-by-type/vw-golf-6.png", label: "VW Golf 6", slug: "vw-golf-6-2-0-tdi-2009" },
  { img: "/pick-by-type/audi-a4.png", label: "Audi A4", slug: "audi-a4-2-0-tdi-2010" },
  { img: "/pick-by-type/vw-passat-cc.png", label: "VW Passat CC", slug: "vw-passat-cc-2-0-tdi-2011" },
  { img: "/pick-by-type/vw-touareg.png", label: "VW Touareg", slug: "vw-touareg-4-2-tdi-2012" },
];

export default function BrowseByType() {
  const { lang } = useLang();
  const t = T[lang];
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: 0, raf: 0, targetLeft: 0 });

  // Clean up any in-flight rAF on unmount.
  useEffect(() => {
    const d = drag.current;
    return () => { if (d.raf) cancelAnimationFrame(d.raf); };
  }, []);

  // On touch devices we do NOTHING here and let the browser's native horizontal
  // scrolling take over — that path is GPU-composited with real momentum/inertia,
  // i.e. a smooth 60fps flick. Hijacking it with manual scrollLeft writes (as the
  // old code did for every pointer type) is exactly what made it stutter on phones.
  // The custom click-drag below is therefore mouse/pen only.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current.down = true;
    drag.current.startX = e.clientX;
    drag.current.startScroll = el.scrollLeft;
    drag.current.moved = 0;
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = trackRef.current;
    const d = drag.current;
    if (!el || !d.down) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    d.targetLeft = d.startScroll - dx;
    // Coalesce writes into one rAF tick so we touch layout at most once per frame.
    if (!d.raf) {
      d.raf = requestAnimationFrame(() => {
        d.raf = 0;
        if (trackRef.current) trackRef.current.scrollLeft = d.targetLeft;
      });
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (d.raf) { cancelAnimationFrame(d.raf); d.raf = 0; }
    trackRef.current?.releasePointerCapture?.(e.pointerId);
  };
  // Swallow the click that follows a real drag so we don't navigate by accident.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="bg-dark border-b border-dark-border py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="kicker justify-center mb-3">{t.kicker}</p>
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl uppercase leading-none">
            {t.title}
          </h2>
        </div>

        {/* Draggable rail — all five fit across on desktop; scroll on smaller screens */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className="flex gap-6 lg:gap-8 overflow-x-auto overscroll-x-contain touch-pan-x pb-2 cursor-grab active:cursor-grabbing select-none snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {PICKS.map((p) => (
            <Link
              key={p.slug}
              href={`/avtomobili/${p.slug}`}
              draggable={false}
              className="group shrink-0 snap-start basis-[calc((100%-24px)/2)] sm:basis-[calc((100%-48px)/3)] lg:basis-[calc((100%-128px)/5)]"
            >
              {/* Clean cutout — no card, just the PNG on the dark background */}
              <div className="relative aspect-[5/4] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.label}
                  draggable={false}
                  className="w-full h-full object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.06]"
                />
              </div>
              <p className="mt-3.5 text-center font-heading font-bold text-base md:text-lg uppercase tracking-wide text-gray-light group-hover:text-yellow transition-colors truncate px-1">
                {p.label}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <MotionButton href="/avtomobili" label={t.viewAll} variant="outline" />
        </div>
      </div>
    </section>
  );
}
