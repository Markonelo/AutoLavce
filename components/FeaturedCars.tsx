import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cars } from "@/data/cars";
import CarCard from "./CarCard";
import AnimSection from "./AnimSection";

export default function FeaturedCars() {
  const featured = cars.filter((c) => c.status === "available" && c.badge).slice(0, 3);
  const fallback = cars.filter((c) => c.status === "available").slice(0, 3);
  const display = featured.length >= 3 ? featured : fallback;

  return (
    <section className="section-padding px-4 bg-dark">
      <div className="max-w-6xl mx-auto">
        <AnimSection className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-2">
              Истакнати Возила
            </p>
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase">
              НОВИ ПРИСТИГНУВАЊА
            </h2>
          </div>
          <Link
            href="/avtomobili"
            className="group flex items-center gap-2 text-yellow font-heading font-bold text-sm uppercase tracking-wide hover:gap-3 transition-all"
          >
            Погледни Сите
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((car, i) => (
            <AnimSection key={car.id} delay={i * 0.1}>
              <CarCard car={car} />
            </AnimSection>
          ))}
        </div>
      </div>
    </section>
  );
}
