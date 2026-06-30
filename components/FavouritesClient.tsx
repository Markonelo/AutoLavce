"use client";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { cars } from "@/data/cars";
import { useFavourites } from "./FavouritesContext";
import { useLang } from "./LanguageProvider";
import CarCard from "./CarCard";
import AnimSection from "./AnimSection";

const T = {
  mk: {
    emptyTitle: "Немаш зачувани возила",
    emptyDesc: "Кликни на срцето на било кое возило за да го зачуваш тука и полесно да го споредиш подоцна.",
    browse: "Разгледај возила",
    saved: "зачувани возила",
  },
  en: {
    emptyTitle: "No saved vehicles yet",
    emptyDesc: "Tap the heart on any vehicle to save it here and compare it more easily later.",
    browse: "Browse vehicles",
    saved: "saved vehicles",
  },
};

export default function FavouritesClient() {
  const { ids, ready } = useFavourites();
  const { lang } = useLang();
  const t = T[lang];
  const favCars = cars.filter((c) => ids.includes(c.id));

  return (
    <section className="px-4 py-10 bg-dark min-h-[60vh]">
      <div className="max-w-6xl mx-auto">
        {!ready ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-dark-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : favCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="w-16 h-16 rounded-full bg-dark-card border border-dark-border flex items-center justify-center mb-5">
              <Heart size={26} className="text-yellow" />
            </span>
            <h2 className="font-heading font-bold text-white text-2xl mb-2 uppercase">{t.emptyTitle}</h2>
            <p className="text-gray-light text-sm font-body mb-6 max-w-md">
              {t.emptyDesc}
            </p>
            <Link href="/avtomobili" className="btn-primary">
              {t.browse} <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <p className="flex items-baseline gap-2 mb-6">
              <span className="text-yellow font-heading font-bold text-3xl leading-none">{favCars.length}</span>
              <span className="text-gray-light text-sm font-body uppercase tracking-wide">{t.saved}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {favCars.map((car, i) => (
                <AnimSection key={car.id} delay={Math.min(i * 0.05, 0.3)}>
                  <CarCard car={car} />
                </AnimSection>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
