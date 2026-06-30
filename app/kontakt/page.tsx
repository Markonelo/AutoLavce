import type { Metadata } from "next";
import KontaktClient from "@/components/KontaktClient";

export const metadata: Metadata = {
  title: "Контакт – Auto Lavce Автосалон Битола",
  description:
    "Контактирај го Auto Lavce автосалон во Битола. Адреса, телефон, работно време. Закажи тест вожња или добиј понуда. avtosalon Bitola kontakt.",
  alternates: { canonical: "https://autolavce.mk/kontakt" },
};

export default function KontaktPage() {
  return <KontaktClient />;
}
