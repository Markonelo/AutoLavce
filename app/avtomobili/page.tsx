import type { Metadata } from "next";
import { Suspense } from "react";
import CarFilterPanel from "@/components/CarFilterPanel";
import CarsGrid from "@/components/CarsGrid";
import CarsPageHeading from "@/components/CarsPageHeading";
import { getAvailableCars } from "@/data/cars";

export const metadata: Metadata = {
  title: "Автомобили на Продажба – Битола",
  description:
    "Погледни ги сите автомобили на продажба во Auto Lavce Битола. Филтрирај по марка, гориво, цена. Половни и нови автомобили со гаранција во Македонија.",
  alternates: { canonical: "https://autolavce.mk/avtomobili" },
};

export default function CarsPage() {
  const availableCount = getAvailableCars().length;

  return (
    <section className="bg-dark min-h-screen">
      {/* Title band — dark with yellow accent (no gradient) */}
      <CarsPageHeading availableCount={availableCount} />

      {/* Full-bleed: sidebar filters + cards grid */}
      <div className="px-4 lg:px-8 py-8 flex flex-col lg:flex-row lg:items-start gap-8">
        <Suspense fallback={<div className="w-full lg:w-72 shrink-0 h-96 bg-dark-card rounded-2xl animate-pulse" />}>
          <CarFilterPanel />
        </Suspense>
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">{Array.from({length:6}).map((_,i)=><div key={i} className="aspect-[4/3] bg-dark-card rounded-2xl animate-pulse" />)}</div>}>
            <CarsGrid />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
