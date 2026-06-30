"use client";
import Link from "next/link";
import { Users, Sparkles, Fuel, Mountain, Zap, Wallet } from "lucide-react";
import { useLang } from "./LanguageProvider";

const chips = [
  { label: { mk: "Возила со 7 седишта", en: "7-seat vehicles" }, href: "/avtomobili?seats=7", icon: Users },
  { label: { mk: "За почетници", en: "For beginners" }, href: "/avtomobili?maxPrice=12000", icon: Sparkles },
  { label: { mk: "Дизел возила", en: "Diesel cars" }, href: "/avtomobili?fuel=Дизел", icon: Fuel },
  { label: { mk: "SUV / Теренци", en: "SUVs / Off-road" }, href: "/avtomobili?body=Џип", icon: Mountain },
  { label: { mk: "Хибрид & Електрични", en: "Hybrid & Electric" }, href: "/avtomobili?fuel=Хибрид", icon: Zap },
  { label: { mk: "До 15.000 €", en: "Up to €15,000" }, href: "/avtomobili?maxPrice=15000", icon: Wallet },
];

export default function QuickFilters() {
  const { lang } = useLang();
  return (
    <div className="flex flex-wrap gap-3">
      {chips.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-light text-sm font-body hover:border-yellow-border hover:text-yellow transition-all"
          >
            <Icon size={16} className="text-yellow" />
            {c.label[lang]}
          </Link>
        );
      })}
    </div>
  );
}
