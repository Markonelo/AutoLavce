"use client";
import Link from "next/link";
import MotionButton from "./ui/motion-button";
import { useLang } from "./LanguageProvider";

const T = {
  mk: { kicker: "Популарни модели", title: "Разгледај по тип", viewAll: "Види ги сите" },
  en: { kicker: "Popular models", title: "Browse by type", viewAll: "View all" },
};

// "Разгледај по тип" — studio cutouts the dealership provided
// (public/pick-by-type/*.png, transparent RGBA). Each links to its listing,
// except the BMW (that car is sold) which links to all BMW listings.
type Pick = { img: string; label: string; href: string; flip?: boolean };

const PICKS: Pick[] = [
  { img: "/pick-by-type/porsche-cayenne.png", label: "Porsche Cayenne", href: "/avtomobili/porsche-cayenne-3-0-tdi-2012" },
  { img: "/pick-by-type/audi-q5.png", label: "Audi Q5", href: "/avtomobili/audi-q5-3-0-tdi-quattro-sline-2011-2" },
  { img: "/pick-by-type/vw-golf-6.png", label: "VW Golf 6", href: "/avtomobili/vw-golf-6-2-0-tdi-2010", flip: true },
  { img: "/pick-by-type/bmw-120d.png", label: "BMW 120d", href: "/avtomobili?make=BMW" },
];

export default function BrowseByType() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section className="bg-dark border-b border-dark-border py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="kicker justify-center mb-3">{t.kicker}</p>
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl uppercase leading-none">
            {t.title}
          </h2>
        </div>

        {/* Static row — all four cutouts across, no scroll/drag animation */}
        <div className="grid grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
          {PICKS.map((p) => (
            <Link key={p.href} href={p.href} className="group">
              {/* Clean cutout — no card, just the PNG on the dark background.
                  Fills the cell width; the wide grid gaps keep them spaced out. */}
              <div className="relative aspect-[5/4] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.label}
                  draggable={false}
                  style={p.flip ? { transform: "scaleX(-1)" } : undefined}
                  className="w-full h-full object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)]"
                />
              </div>
              <p className="mt-3.5 text-center font-heading font-bold text-sm sm:text-base md:text-lg uppercase tracking-wide text-gray-light group-hover:text-yellow transition-colors truncate px-1">
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
