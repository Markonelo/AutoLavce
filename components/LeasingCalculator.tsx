"use client";
import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { eur, monthlyInstalment } from "@/lib/format";
import { useLang } from "./LanguageProvider";

interface Props {
  defaultPrice?: number;
  /** Lock the price field (used on a car detail page). */
  lockPrice?: boolean;
  compact?: boolean;
}

const T = {
  mk: {
    title: "Калкулатор за рати",
    price: "Цена на возилото",
    down: "Учество",
    term: "Период",
    months: "мес",
    monthly: "Месечна рата",
    perMonth: "/мес",
    rateNote: "приближна камата 6,9% годишно",
    financed: "Финансирано",
    interestTotal: "Камата (вкупно)",
    totalToPay: "Вкупно за плаќање",
    disclaimer:
      "* Пресметката е информативна. Конечните услови зависат од банката/лизинг куќата и кредитната способност.",
  },
  en: {
    title: "Instalment calculator",
    price: "Vehicle price",
    down: "Down payment",
    term: "Term",
    months: "mo",
    monthly: "Monthly instalment",
    perMonth: "/mo",
    rateNote: "approx. 6.9% interest per year",
    financed: "Financed",
    interestTotal: "Interest (total)",
    totalToPay: "Total to pay",
    disclaimer:
      "* This calculation is for guidance only. Final terms depend on the bank / leasing company and your creditworthiness.",
  },
};

const TERMS = [12, 24, 36, 48, 60, 72, 84];

const PRICE_MIN = 3000;
const PRICE_MAX = 90000;
const DOWN_MAX = 70;

export default function LeasingCalculator({ defaultPrice = 20000, lockPrice = false, compact = false }: Props) {
  const { lang } = useLang();
  const t = T[lang];
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(30);
  const [months, setMonths] = useState(60);

  const years = months / 12;
  const monthly = useMemo(() => monthlyInstalment(price, downPct, years), [price, downPct, years]);
  const downAmount = Math.round((price * downPct) / 100);
  const financed = price - downAmount;
  const totalPaid = downAmount + monthly * months;
  const overpay = Math.max(0, totalPaid - price);

  const pricePct = ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const downSliderPct = (downPct / DOWN_MAX) * 100;

  // Two-column layout on wide screens — but only when not embedded in the narrow car sidebar.
  const wide = !compact;

  return (
    <div className={`bg-dark-card rounded-2xl ${compact ? "p-5 border border-dark-border" : "p-7 md:p-10 border-2 border-yellow-border shadow-[0_0_0_1px_rgba(212,160,23,0.12),0_24px_64px_rgba(0,0,0,0.45)]"}`}>
    <div className={`grid ${wide ? "gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-stretch" : "gap-8"}`}>
      {/* Controls */}
      <div>
        <div className={`flex items-center gap-2.5 ${compact ? "mb-7" : "mb-9"}`}>
          <Calculator size={compact ? 20 : 24} className="text-yellow" strokeWidth={2.25} />
          <h3 className={`font-heading font-bold text-white uppercase tracking-wide ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>{t.title}</h3>
        </div>

        {/* Price */}
        {!lockPrice && (
          <Field label={t.price} value={eur(price)}>
            <input
              type="range" min={PRICE_MIN} max={PRICE_MAX} step={500}
              value={price} onChange={(e) => setPrice(Number(e.target.value))}
              className="range-yellow"
              style={{ background: `linear-gradient(to right, #D4A017 ${pricePct}%, #2A2A2A ${pricePct}%)` }}
            />
          </Field>
        )}

        {/* Down payment */}
        <Field label={t.down} value={`${downPct}% · ${eur(downAmount)}`}>
          <input
            type="range" min={0} max={DOWN_MAX} step={5}
            value={downPct} onChange={(e) => setDownPct(Number(e.target.value))}
            className="range-yellow"
            style={{ background: `linear-gradient(to right, #D4A017 ${downSliderPct}%, #2A2A2A ${downSliderPct}%)` }}
          />
        </Field>

        {/* Term */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-heading font-bold text-gray-light uppercase tracking-wider">{t.term}</span>
            <span className="text-yellow text-sm font-body font-bold">{months} {t.months}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                onClick={() => setMonths(t)}
                className={`rounded-lg font-heading font-bold transition-all ${compact ? "px-3.5 py-2 text-sm" : "px-4 py-2 text-sm"} ${
                  months === t
                    ? "bg-yellow text-dark"
                    : "bg-dark border border-dark-border text-gray-light hover:border-yellow-border hover:text-yellow"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className={`rounded-2xl bg-dark flex flex-col justify-center ${compact ? "border border-yellow-border p-6" : "border-2 border-yellow/60 p-7 md:p-8 shadow-[0_0_24px_rgba(212,160,23,0.10)]"}`}>
        <p className={`text-gray-light font-body uppercase tracking-[0.2em] mb-2 ${compact ? "text-sm" : "text-xs"}`}>{t.monthly}</p>
        <p className={`font-heading font-bold text-yellow leading-none ${compact ? "text-5xl" : "text-6xl md:text-7xl"}`}>
          {eur(monthly)}
          <span className={`text-gray-muted font-body font-normal ${compact ? "text-lg" : "text-lg"}`}> {t.perMonth}</span>
        </p>
        <p className={`text-gray-muted font-body mt-2 ${compact ? "text-sm" : "text-xs"}`}>{t.rateNote}</p>

        <div className={`border-t border-dark-border ${compact ? "mt-6 pt-5 space-y-3" : "mt-7 pt-6 space-y-3.5"}`}>
          <Row label={t.financed} value={eur(financed)} big={!compact} />
          <Row label={t.down} value={eur(downAmount)} big={!compact} />
          <Row label={t.interestTotal} value={eur(overpay)} big={!compact} />
          <Row label={t.totalToPay} value={eur(totalPaid)} strong big={!compact} />
        </div>

        <p className={`text-gray-muted font-body mt-5 leading-relaxed ${compact ? "text-xs" : "text-[11px]"}`}>
          {t.disclaimer}
        </p>
      </div>
    </div>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-heading font-bold text-gray-light uppercase tracking-wider">{label}</span>
        <span className="text-yellow text-sm font-body font-bold">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, strong = false, big = false }: { label: string; value: string; strong?: boolean; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`font-body text-sm ${big ? "" : ""} ${strong ? "text-white font-semibold" : "text-gray-muted"}`}>{label}</span>
      <span className={`font-heading font-bold ${strong ? "text-yellow text-lg" : `text-white ${big ? "text-base" : "text-base"}`}`}>{value}</span>
    </div>
  );
}
