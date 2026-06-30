import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CTABanner from "@/components/CTABanner";
import UslugiServices from "@/components/UslugiServices";
import UslugiIntro from "@/components/UslugiIntro";

export const metadata: Metadata = {
  title: "Услуги – Перење, Хемиско Чистење и Авто Сервис | Auto Lavce Битола",
  description:
    "Целосна грижа за твоето возило на едно место во Битола: рачно перење, длабинско хемиско чистење на ентериер и комплетен авто сервис со компјутерска дијагностика.",
  alternates: { canonical: "https://autolavce.mk/uslugi" },
};

export default function UslugiPage() {
  return (
    <>
      <PageHero
        title={{ mk: "УСЛУГИ", en: "SERVICES" }}
        subtitle={{
          mk: "Перење, хемиско чистење и комплетен авто сервис — целосна грижа за твоето возило на едно место во Битола.",
          en: "Washing, deep cleaning and full car service — complete care for your vehicle, all in one place in Bitola.",
        }}
        breadcrumbs={[
          { label: { mk: "Дома", en: "Home" }, href: "/" },
          { label: { mk: "Услуги", en: "Services" } },
        ]}
        accent={{ mk: "Грижа за твоето возило", en: "Care for your vehicle" }}
      />

      {/* Editorial intro */}
      <UslugiIntro />

      {/* Service ledger — clickable rows with lightbox */}
      <UslugiServices />

      <CTABanner yellow />
    </>
  );
}
