// ──────────────────────────────────────────────────────────────────────────
// Lightweight i18n helpers for the in-place MK ⇄ EN switcher.
//
// Macedonian is the primary (SSR-rendered, indexed) language. English is a
// client-side convenience layer for non-Macedonian visitors. These helpers
// translate the structured car data (spec enums + the generated description)
// so car cards/detail pages read naturally in English. UI copy lives in each
// component's local `T = { mk, en }` dictionary.
// ──────────────────────────────────────────────────────────────────────────
import type { FuelType, TransmissionType, BodyType, Badge, CarStatus } from "@/data/cars";

export type Lang = "mk" | "en";

// ── Spec enum → English label ───────────────────────────────────────────────
export const FUEL_EN: Record<FuelType, string> = {
  "Бензин": "Petrol",
  "Дизел": "Diesel",
  "Хибрид": "Hybrid",
  "Електричен": "Electric",
  "ЛПГ": "LPG",
};

export const TRANS_EN: Record<TransmissionType, string> = {
  "Рачен": "Manual",
  "Автоматик": "Automatic",
  "Полуавтомат": "Semi-automatic",
};

export const BODY_EN: Record<BodyType, string> = {
  "Седан": "Sedan",
  "Хечбек": "Hatchback",
  "Комбе": "Van",
  "Џип": "SUV",
  "Купе": "Coupé",
  "Кабриолет": "Convertible",
  "Ван": "Minivan",
};

export const BADGE_EN: Record<Badge, string> = {
  "Ново": "New",
  "Популарно": "Popular",
  "Намалено": "Reduced",
};

export const STATUS_EN: Record<CarStatus, string> = {
  available: "Available",
  sold: "Sold",
  reserved: "Reserved",
};

// Country of origin used inside the generated car descriptions.
const ORIGIN_EN: Record<string, string> = {
  "Холандија": "the Netherlands",
  "Германија": "Germany",
  "Белгија": "Belgium",
  "Норвешка": "Norway",
};

// ── Convenience translators (return the MK source unchanged when lang === "mk") ─
export const tFuel = (v: FuelType, lang: Lang) => (lang === "en" ? FUEL_EN[v] ?? v : v);
export const tTrans = (v: TransmissionType, lang: Lang) => (lang === "en" ? TRANS_EN[v] ?? v : v);
export const tBody = (v: BodyType, lang: Lang) => (lang === "en" ? BODY_EN[v] ?? v : v);
export const tBadge = (v: Badge, lang: Lang) => (lang === "en" ? BADGE_EN[v] ?? v : v);
export const tStatus = (v: CarStatus, lang: Lang) => (lang === "en" ? STATUS_EN[v] ?? v : v);

// ── Car description localizer ────────────────────────────────────────────────
// The descriptions are generated from a fixed Macedonian template in
// `data/cars.ts`. For English we swap the known sentences (and the imported-from
// clause) for hand-written equivalents, leaving the car title untouched.
const MK_BODY = "Возилото е во добра состојба и подготвено за регистрација.";
const EN_BODY = "The vehicle is in good condition and ready for registration.";
const MK_TAIL =
  "За цена и повеќе детали контактирајте нѐ или посетете нѐ во Auto Lavce, Битола.";
const EN_TAIL =
  "For pricing and more details, contact us or visit Auto Lavce in Bitola.";

export function localizeCarDescription(desc: string, lang: Lang): string {
  if (lang === "mk") return desc;
  let out = desc.split(MK_BODY).join(EN_BODY).split(MK_TAIL).join(EN_TAIL);
  for (const [mk, en] of Object.entries(ORIGIN_EN)) {
    out = out.split(`, увезен од ${mk}.`).join(`, imported from ${en}.`);
  }
  // Generic fallback for any origin not in the map above.
  out = out.replace(/, увезен од ([^.]+)\./, ", imported from $1.");
  return out;
}
