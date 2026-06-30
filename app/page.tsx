import type { Metadata } from "next";
import Hero from "@/components/Hero";
import BrowseByType from "@/components/BrowseByType";
import VehicleSection from "@/components/VehicleSection";
import BrandsStrip from "@/components/BrandsStrip";
import AboutUs from "@/components/AboutUs";
import HowItWorks from "@/components/HowItWorks";
import HomeServices from "@/components/HomeServices";
import ContactStrip from "@/components/ContactStrip";
import { getAvailableCars } from "@/data/cars";

export const metadata: Metadata = {
  title: "Автосалон Битола | Auto Lavce – Купи Автомобил Битола",
  description:
    "Auto Lavce автосалон во Битола – купи, изнајми или земи автомобил на лизинг. Авто сервис, откуп и замена на возила. Половни и нови автомобили во Битола и Македонија.",
  alternates: { canonical: "https://autolavce.mk" },
};

export default function HomePage() {
  const available = getAvailableCars();
  const latest = available.slice(0, 4);

  return (
    <>
      <Hero />

      {/* Browse by type — drag-to-scroll rail of featured model cutouts */}
      <BrowseByType />

      <BrandsStrip />

      <AboutUs />

      <VehicleSection
        kicker={{ mk: "Свежо на залиха", en: "Fresh in stock" }}
        title={{ mk: "Најнови возила", en: "Latest vehicles" }}
        cars={latest}
        viewAllLabel={{ mk: "Сите возила", en: "All vehicles" }}
        className="bg-dark-card"
        columns={4}
      />

      <HowItWorks />

      <HomeServices />

      <ContactStrip />
    </>
  );
}
