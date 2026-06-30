// Formatting + small domain helpers shared across the site.

import type { Car } from "@/data/cars";

// Denar peg used by Macedonian dealers (≈ fixed to EUR).
export const MKD_RATE = 61.5;

export function eur(value: number): string {
  return `${value.toLocaleString("mk-MK")} €`;
}

export function mkd(value: number): string {
  return `${Math.round(value * MKD_RATE).toLocaleString("mk-MK")} ден`;
}

// Derive engine displacement in cm³ from the engine/variant string (e.g. "2.0 TDI" -> 1968).
const CC_MAP: Record<string, number> = {
  "1.0": 999,
  "1.2": 1197,
  "1.4": 1395,
  "1.5": 1498,
  "1.6": 1598,
  "1.8": 1798,
  "2.0": 1968,
  "2.5": 2480,
  "3.0": 2967,
};

export function engineCC(car: Car): number | null {
  if (car.engineCC) return car.engineCC;
  const source = `${car.engine} ${car.variant}`;
  const match = source.match(/(\d\.\d)/);
  if (match && CC_MAP[match[1]]) return CC_MAP[match[1]];
  return null;
}

// A simple flat-rate monthly estimate (annuity) used by the leasing calculators.
export function monthlyInstalment(price: number, downPct: number, years: number, annualRate = 0.069): number {
  const principal = price * (1 - downPct / 100);
  const months = years * 12;
  const r = annualRate / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  const m = (principal * r) / (1 - Math.pow(1 + r, -months));
  return Math.round(m);
}
