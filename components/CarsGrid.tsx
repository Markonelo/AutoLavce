"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { LayoutGrid, LayoutList, ArrowUpDown } from "lucide-react";
import { cars, type Car } from "@/data/cars";
import CarCard from "./CarCard";
import AnimSection from "./AnimSection";
import { TextEffect } from "./ui/text-effect";
import { useLang } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n";

const priceRangeMap: Record<string, { min?: number; max?: number }> = {
  "До 10.000 €": { max: 10000 },
  "10.000 – 20.000 €": { min: 10000, max: 20000 },
  "20.000 – 35.000 €": { min: 20000, max: 35000 },
  "35.000 – 55.000 €": { min: 35000, max: 55000 },
  "Над 55.000 €": { min: 55000 },
};

type SortOption = "default" | "price-asc" | "price-desc" | "year-desc";

const sortLabels: Record<Lang, Record<SortOption, string>> = {
  mk: {
    default: "Стандардно",
    "price-asc": "Цена: растечки",
    "price-desc": "Цена: опаѓачки",
    "year-desc": "Најново прво",
  },
  en: {
    default: "Default",
    "price-asc": "Price: low to high",
    "price-desc": "Price: high to low",
    "year-desc": "Newest first",
  },
};

const T = {
  mk: {
    available: "достапни возила",
    total: "вкупно",
    gridView: "Мрежен приказ",
    listView: "Листа приказ",
    noResults: "Нема резултати",
    noResultsDesc: "Обидете се со пошироки критериуми за пребарување.",
    reset: "Ресетирај филтри",
    loading: "Се вчитува",
  },
  en: {
    available: "available vehicles",
    total: "total",
    gridView: "Grid view",
    listView: "List view",
    noResults: "No results",
    noResultsDesc: "Try broadening your search criteria.",
    reset: "Reset filters",
    loading: "Loading",
  },
};

const PER_PAGE = 12;

export default function CarsGrid() {
  const sp = useSearchParams();
  const router = useRouter();
  const { lang } = useLang();
  const t = T[lang];
  const [sort, setSort] = useState<SortOption>("default");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    let result: Car[] = [...cars];

    const make = sp.get("make");
    const model = sp.get("model");
    const fuel = sp.get("fuel");
    const body = sp.get("body");
    const trans = sp.get("trans");
    const status = sp.get("status");
    const priceRange = sp.get("priceRange");
    const maxPrice = sp.get("maxPrice");
    const minPrice = sp.get("minPrice");
    const seats = sp.get("seats");
    const yearFrom = sp.get("yearFrom");

    if (make) result = result.filter((c) => c.make === make);
    if (model) result = result.filter((c) => c.model === model);
    if (fuel) result = result.filter((c) => c.fuel === fuel);
    if (body) result = result.filter((c) => c.bodyType === body);
    if (trans) result = result.filter((c) => c.transmission === trans);
    if (status) result = result.filter((c) => c.status === status);
    if (priceRange === "По Договор") {
      result = result.filter((c) => c.price === 0);
    } else if (priceRange && priceRangeMap[priceRange]) {
      const { min, max } = priceRangeMap[priceRange];
      result = result.filter((c) => c.price > 0); // „По Договор" возилата не спаѓаат во ценовните распони
      if (min) result = result.filter((c) => c.price >= min);
      if (max) result = result.filter((c) => c.price <= max);
    }
    if (maxPrice) result = result.filter((c) => c.price <= Number(maxPrice));
    if (minPrice) result = result.filter((c) => c.price >= Number(minPrice));
    if (seats) result = result.filter((c) => (c.seats ?? 5) >= Number(seats));
    if (yearFrom) result = result.filter((c) => c.year >= Number(yearFrom));

    // available first always, then sold
    result.sort((a, b) => {
      const av = a.status === "available" ? 0 : 1;
      const bv = b.status === "available" ? 0 : 1;
      return av - bv;
    });

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "year-desc": result.sort((a, b) => b.year - a.year); break;
    }

    return result;
  }, [sp, sort]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset back to the first batch whenever the filters or sort change.
  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [filtered]);

  // Reveal the next batch — with a short loading beat so the animation shows.
  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          window.setTimeout(() => {
            setVisibleCount((c) => c + PER_PAGE);
            setLoadingMore(false);
          }, 650);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, visibleCount]);

  const availableCount = filtered.filter((c) => c.status === "available").length;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-gray-light text-sm font-body">
          <span className="text-yellow font-heading font-bold text-lg">{availableCount}</span>{" "}
          {t.available}
          {filtered.length !== availableCount && (
            <span className="text-gray-muted ml-2">/ {filtered.length} {t.total}</span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-dark-card border border-dark-border rounded-xl px-3 py-2">
              <ArrowUpDown size={14} className="text-yellow" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-transparent text-white text-xs font-body appearance-none cursor-pointer focus:outline-none pr-4"
              >
                {(Object.keys(sortLabels[lang]) as SortOption[]).map((k) => (
                  <option key={k} value={k} className="bg-dark-card">{sortLabels[lang][k]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="hidden sm:flex border border-dark-border rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              aria-label={t.gridView}
              className={`p-2.5 transition-colors ${view === "grid" ? "bg-yellow text-dark" : "text-gray-muted hover:text-white"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label={t.listView}
              className={`p-2.5 transition-colors ${view === "list" ? "bg-yellow text-dark" : "text-gray-muted hover:text-white"}`}
            >
              <LayoutList size={16} />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-dark-card border border-dark-border flex items-center justify-center mb-4">
            {/* Spyglass with an elongated handle (custom — Lucide's handle is too stubby) */}
            <svg
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="6.5" />
              <line x1="14.6" y1="14.6" x2="22.5" y2="22.5" />
            </svg>
          </div>
          <h3 className="font-heading font-bold text-white text-2xl mb-2">{t.noResults}</h3>
          <p className="text-gray-light text-sm font-body mb-6">{t.noResultsDesc}</p>
          <button onClick={() => router.push("/avtomobili")} className="btn-outline">
            {t.reset}
          </button>
        </div>
      ) : (
        <>
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-7" : "flex flex-col gap-4"}>
            {visibleItems.map((car, i) => (
              <AnimSection
                key={car.id}
                delay={Math.min((i % PER_PAGE) * 0.05, 0.3)}
                className={view === "grid" ? "h-full" : ""}
              >
                <CarCard car={car} />
              </AnimSection>
            ))}
          </div>

          {/* Infinite-scroll sentinel + animated loading indicator */}
          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-12">
              {loadingMore && (
                <TextEffect
                  per="char"
                  as="p"
                  preset="blur"
                  className="font-heading font-bold text-yellow text-lg uppercase tracking-[0.3em]"
                  key={t.loading}
                >
                  {t.loading}
                </TextEffect>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
