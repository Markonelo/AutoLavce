import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FavouritesClient from "@/components/FavouritesClient";

export const metadata: Metadata = {
  title: "Омилени Возила – Зачувани Автомобили",
  description:
    "Твоите зачувани омилени возила во Auto Lavce Битола. Спореди ги автомобилите што ти се допаѓаат на едно место.",
  alternates: { canonical: "https://autolavce.mk/omileni" },
  robots: { index: false, follow: true },
};

export default function FavouritesPage() {
  return (
    <>
      <PageHero
        title={{ mk: "ОМИЛЕНИ", en: "FAVOURITES" }}
        subtitle={{
          mk: "Возилата што ги зачува на едно место — спореди и одлучи без брзање.",
          en: "The vehicles you saved, all in one place — compare and decide at your own pace.",
        }}
        breadcrumbs={[{ label: { mk: "Дома", en: "Home" }, href: "/" }, { label: { mk: "Омилени", en: "Favourites" } }]}
        accent={{ mk: "Твојата листа", en: "Your list" }}
      />
      <FavouritesClient />
    </>
  );
}
