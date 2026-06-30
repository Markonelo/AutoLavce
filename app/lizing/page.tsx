import type { Metadata } from "next";
import LizingClient from "@/components/LizingClient";

export const metadata: Metadata = {
  title: "Лизинг & Рати – Купи Автомобил на Рати",
  description:
    "Купи автомобил на рати со поволни услови во Auto Lavce Битола. Лизинг, кредит и одложено плаќање за сите буџети. Лизинг автомобили Македонија.",
  alternates: { canonical: "https://autolavce.mk/lizing" },
};

export default function LizingPage() {
  return <LizingClient />;
}
