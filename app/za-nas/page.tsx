import type { Metadata } from "next";
import ZaNasContent from "@/components/ZaNasContent";

export const metadata: Metadata = {
  title: "За Нас – Auto Lavce Автосалон Битола",
  description:
    "Дознај повеќе за Auto Lavce – автосалон во Битола со долгогодишно искуство. Нашата мисија, визија и приказна: квалитетни возила со сигурност и поддршка.",
  alternates: { canonical: "https://autolavce.mk/za-nas" },
};

export default function ZaNasPage() {
  return <ZaNasContent />;
}
