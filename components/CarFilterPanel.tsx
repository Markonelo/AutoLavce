"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cars, makes, fuelTypes, transmissions, bodyTypes } from "@/data/cars";
import type { FuelType, TransmissionType, BodyType } from "@/data/cars";
import { useLang } from "./LanguageProvider";
import { tFuel, tTrans, tBody, type Lang } from "@/lib/i18n";

// Filter VALUES stay in Macedonian (they are the URL query keys used across the
// app); only the visible labels are localized.
const priceRanges: { value: string; label: Record<Lang, string> }[] = [
  { value: "До 10.000 €", label: { mk: "До 10.000 €", en: "Up to €10,000" } },
  { value: "10.000 – 20.000 €", label: { mk: "10.000 – 20.000 €", en: "€10,000 – €20,000" } },
  { value: "20.000 – 35.000 €", label: { mk: "20.000 – 35.000 €", en: "€20,000 – €35,000" } },
  { value: "35.000 – 55.000 €", label: { mk: "35.000 – 55.000 €", en: "€35,000 – €55,000" } },
  { value: "Над 55.000 €", label: { mk: "Над 55.000 €", en: "Over €55,000" } },
  { value: "По Договор", label: { mk: "По Договор", en: "On request" } },
];

const years = Array.from({ length: 2025 - 2014 + 1 }, (_, i) => 2025 - i);
const seatOptions = [2, 4, 5, 7];

const APPLIED_KEYS = [
  "make", "model", "priceRange", "maxPrice", "yearFrom", "body", "fuel", "trans", "seats",
] as const;

const T = {
  mk: {
    filters: "Филтри",
    filter: "Филтрирај",
    applied: "Применети филтри",
    clearAll: "Исчисти сѐ",
    noneSelected: "Нема избрани филтри",
    noOptions: "Нема опции",
    selectMakeFirst: "Прво избери марка",
    s_price: "Цена",
    s_make: "Марка",
    s_model: "Модел",
    s_year: "Година",
    s_body: "Каросерија",
    s_fuel: "Гориво",
    s_trans: "Менувач",
    s_seats: "Седишта",
    yearAndNewer: (y: number) => `${y} и понови`,
    seatsPlus: (s: number | string) => `${s}+ седишта`,
    upTo: (n: string) => `до ${n} €`,
    from: (v: string) => `од ${v}`,
  },
  en: {
    filters: "Filters",
    filter: "Filter",
    applied: "Applied filters",
    clearAll: "Clear all",
    noneSelected: "No filters selected",
    noOptions: "No options",
    selectMakeFirst: "Select a make first",
    s_price: "Price",
    s_make: "Make",
    s_model: "Model",
    s_year: "Year",
    s_body: "Body type",
    s_fuel: "Fuel",
    s_trans: "Transmission",
    s_seats: "Seats",
    yearAndNewer: (y: number) => `${y} and newer`,
    seatsPlus: (s: number | string) => `${s}+ seats`,
    upTo: (n: string) => `up to €${n}`,
    from: (v: string) => `from ${v}`,
  },
};

// Turns a raw query value into a localized chip label.
function localizeApplied(key: string, raw: string, lang: Lang, t: (typeof T)[Lang]): string {
  switch (key) {
    case "priceRange":
      return priceRanges.find((p) => p.value === raw)?.label[lang] ?? raw;
    case "maxPrice":
      return t.upTo(Number(raw).toLocaleString(lang === "en" ? "en-US" : "de-DE"));
    case "yearFrom":
      return t.from(raw);
    case "body":
      return tBody(raw as BodyType, lang);
    case "fuel":
      return tFuel(raw as FuelType, lang);
    case "trans":
      return tTrans(raw as TransmissionType, lang);
    case "seats":
      return t.seatsPlus(raw);
    default:
      return raw; // make / model — Latin brand names, unchanged
  }
}

export default function CarFilterPanel() {
  const router = useRouter();
  const sp = useSearchParams();
  const { lang } = useLang();
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["make", "priceRange"]);

  const toggleSection = (k: string) =>
    setOpenSections((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const isSectionOpen = (k: string) => openSections.includes(k);

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(sp.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      if (key === "make") params.delete("model");
      router.push(`/avtomobili?${params.toString()}`, { scroll: false });
    },
    [sp, router]
  );

  const clearAll = () => router.push("/avtomobili", { scroll: false });

  const selectedMake = sp.get("make") ?? "";
  const models = useMemo(() => {
    const pool = selectedMake ? cars.filter((c) => c.make === selectedMake) : cars;
    return [...new Set(pool.map((c) => c.model))].sort();
  }, [selectedMake]);

  const applied = APPLIED_KEYS.filter((k) => sp.get(k)).map((k) => ({
    key: k,
    value: localizeApplied(k, sp.get(k)!, lang, t),
  }));

  return (
    <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-[120px] lg:self-start lg:max-h-[calc(100vh-130px)] lg:overflow-y-auto lg:pr-1">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="lg:hidden w-full flex items-center justify-between bg-dark-card border border-dark-border rounded-xl px-4 py-3 mb-4"
      >
        <span className="flex items-center gap-2 font-heading font-bold text-white uppercase text-sm">
          <SlidersHorizontal size={16} className="text-yellow" /> {t.filters}
          {applied.length > 0 && (
            <span className="bg-yellow text-dark text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {applied.length}
            </span>
          )}
        </span>
        <ChevronDown size={18} className={`text-gray-light transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div className={`${open ? "block" : "hidden"} lg:block lg:pt-4`}>
        {/* Header */}
        <div className="flex items-end justify-between pb-4 mb-1 border-b border-dark-border">
          <h2 className="font-heading font-bold text-white text-2xl uppercase tracking-wide leading-none">
            {t.filter}
          </h2>
          <SlidersHorizontal size={18} className="text-yellow mb-0.5" />
        </div>

        {/* Applied filters */}
        <div className="py-4 border-b border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-gray-muted">
              {t.applied}
            </span>
            {applied.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-gray-muted hover:text-yellow transition-colors font-body"
              >
                {t.clearAll}
              </button>
            )}
          </div>
          {applied.length === 0 ? (
            <p className="text-xs text-gray-muted font-body italic">{t.noneSelected}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {applied.map((a) => (
                <button
                  key={a.key}
                  onClick={() => update(a.key, null)}
                  className="group flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full bg-yellow/10 border border-yellow-border text-yellow text-xs font-body transition-colors hover:bg-yellow hover:text-dark"
                >
                  {a.value}
                  <X size={12} className="opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion sections */}
        <Section label={t.s_price} sectionKey="priceRange" isOpen={isSectionOpen("priceRange")} hasActive={!!sp.get("priceRange")} onToggle={toggleSection}>
          <OptionList
            options={priceRanges.map((p) => ({ label: p.label[lang], value: p.value }))}
            current={sp.get("priceRange")}
            onSelect={(v) => update("priceRange", v)}
          />
        </Section>

        <Section label={t.s_make} sectionKey="make" isOpen={isSectionOpen("make")} hasActive={!!sp.get("make")} onToggle={toggleSection}>
          <OptionList
            options={makes.map((m) => ({ label: m, value: m }))}
            current={sp.get("make")}
            onSelect={(v) => update("make", v)}
          />
        </Section>

        <Section label={t.s_model} sectionKey="model" isOpen={isSectionOpen("model")} hasActive={!!sp.get("model")} onToggle={toggleSection}>
          <OptionList
            options={models.map((m) => ({ label: m, value: m }))}
            current={sp.get("model")}
            onSelect={(v) => update("model", v)}
            empty={t.selectMakeFirst}
          />
        </Section>

        <Section label={t.s_year} sectionKey="yearFrom" isOpen={isSectionOpen("yearFrom")} hasActive={!!sp.get("yearFrom")} onToggle={toggleSection}>
          <OptionList
            options={years.map((y) => ({ label: t.yearAndNewer(y), value: String(y) }))}
            current={sp.get("yearFrom")}
            onSelect={(v) => update("yearFrom", v)}
          />
        </Section>

        <Section label={t.s_body} sectionKey="body" isOpen={isSectionOpen("body")} hasActive={!!sp.get("body")} onToggle={toggleSection}>
          <OptionList
            options={bodyTypes.map((b) => ({ label: tBody(b, lang), value: b }))}
            current={sp.get("body")}
            onSelect={(v) => update("body", v)}
          />
        </Section>

        <Section label={t.s_fuel} sectionKey="fuel" isOpen={isSectionOpen("fuel")} hasActive={!!sp.get("fuel")} onToggle={toggleSection}>
          <OptionList
            options={fuelTypes.map((f) => ({ label: tFuel(f, lang), value: f }))}
            current={sp.get("fuel")}
            onSelect={(v) => update("fuel", v)}
          />
        </Section>

        <Section label={t.s_trans} sectionKey="trans" isOpen={isSectionOpen("trans")} hasActive={!!sp.get("trans")} onToggle={toggleSection}>
          <OptionList
            options={transmissions.map((tr) => ({ label: tTrans(tr, lang), value: tr }))}
            current={sp.get("trans")}
            onSelect={(v) => update("trans", v)}
          />
        </Section>

        <Section label={t.s_seats} sectionKey="seats" isOpen={isSectionOpen("seats")} hasActive={!!sp.get("seats")} onToggle={toggleSection} last>
          <OptionList
            options={seatOptions.map((s) => ({ label: t.seatsPlus(s), value: String(s) }))}
            current={sp.get("seats")}
            onSelect={(v) => update("seats", v)}
          />
        </Section>
      </div>
    </aside>
  );
}

/* ---- Accordion row ---- */
function Section({
  label,
  sectionKey,
  isOpen,
  hasActive,
  onToggle,
  children,
  last = false,
}: {
  label: string;
  sectionKey: string;
  isOpen: boolean;
  hasActive: boolean;
  onToggle: (k: string) => void;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "border-b border-dark-border"}>
      <button
        onClick={() => onToggle(sectionKey)}
        className="group w-full flex items-center justify-between py-4 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="font-heading font-bold text-white text-sm uppercase tracking-wide group-hover:text-yellow transition-colors">
            {label}
          </span>
          {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-yellow" />}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-muted group-hover:text-yellow transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-80" : "max-h-0"}`}
      >
        <div className="overflow-y-auto max-h-72 pb-4 pr-1">{children}</div>
      </div>
    </div>
  );
}

/* ---- Option list (single select, click again to clear) ---- */
function OptionList({
  options,
  current,
  onSelect,
  empty,
}: {
  options: { label: string; value: string }[];
  current: string | null;
  onSelect: (value: string | null) => void;
  empty?: string;
}) {
  if (options.length === 0) {
    return <p className="text-xs text-gray-muted font-body italic py-1">{empty ?? "Нема опции"}</p>;
  }
  return (
    <div className="flex flex-col">
      {options.map((o) => {
        const active = current === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onSelect(active ? null : o.value)}
            className={`flex items-center gap-2 text-left text-sm font-body py-1.5 transition-colors ${
              active ? "text-yellow font-semibold" : "text-gray-light hover:text-white"
            }`}
          >
            <span
              className={`flex items-center justify-center w-3.5 h-3.5 rounded-full border transition-colors ${
                active ? "border-yellow bg-yellow" : "border-dark-border"
              }`}
            >
              {active && <span className="w-1.5 h-1.5 rounded-full bg-dark" />}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
