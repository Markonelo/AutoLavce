"use client";
import type { Car } from "@/data/cars";
import CarCard from "./CarCard";
import AnimSection from "./AnimSection";
import MotionButton from "./ui/motion-button";
import { useLang } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n";

type Bilingual = Record<Lang, string>;

interface Props {
  kicker: Bilingual;
  title: Bilingual;
  cars: Car[];
  viewAllHref?: string;
  viewAllLabel?: Bilingual;
  className?: string;
  /** Cards per row on large screens. Defaults to 3. */
  columns?: 3 | 4;
}

const DEFAULT_VIEW_ALL: Bilingual = { mk: "Сите возила", en: "All vehicles" };

export default function VehicleSection({
  kicker,
  title,
  cars,
  viewAllHref = "/avtomobili",
  viewAllLabel = DEFAULT_VIEW_ALL,
  className = "bg-dark",
  columns = 3,
}: Props) {
  const { lang } = useLang();
  const gridCols = columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section className={`section-padding px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <AnimSection className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="kicker mb-3">{kicker[lang]}</p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase leading-none">
              {title[lang]}
            </h2>
          </div>
          <MotionButton href={viewAllHref} label={viewAllLabel[lang]} classes="hidden sm:inline-block" />
        </AnimSection>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-7`}>
          {cars.map((car, i) => (
            <AnimSection key={car.id} delay={(i % columns) * 0.06}>
              <CarCard car={car} />
            </AnimSection>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <MotionButton href={viewAllHref} label={viewAllLabel[lang]} />
        </div>
      </div>
    </section>
  );
}
