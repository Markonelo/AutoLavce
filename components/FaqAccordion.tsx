"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ShoppingBag, Wallet, RefreshCw, Wrench, type LucideIcon } from "lucide-react";
import { useLang } from "./LanguageProvider";

export interface Bilingual {
  mk: string;
  en: string;
}
export interface FaqItem {
  q: Bilingual;
  a: Bilingual;
}
export interface FaqGroup {
  category: Bilingual;
  items: FaqItem[];
}

const T = {
  mk: {
    categories: "Категории",
    searchPlaceholder: "Пребарај прашање тука",
    searchAria: "Пребарај прашање",
    noResults: (q: string) => `Нема резултати за „${q}“.`,
  },
  en: {
    categories: "Categories",
    searchPlaceholder: "Search a question here",
    searchAria: "Search a question",
    noResults: (q: string) => `No results for “${q}”.`,
  },
};

// Icons cycle per category (by original order) — purely decorative.
const CATEGORY_ICONS: LucideIcon[] = [ShoppingBag, Wallet, RefreshCw, Wrench];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

export default function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const { lang } = useLang();
  const t = T[lang];

  // Resolve to current language while keeping a STABLE id (the MK category)
  // so accordion state / scrollspy keys don't break when the language flips.
  const resolved = useMemo(
    () =>
      groups.map((g) => ({
        id: g.category.mk,
        category: g.category[lang],
        items: g.items.map((it) => ({ q: it.q[lang], a: it.a[lang] })),
      })),
    [groups, lang]
  );

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(
    resolved.length ? `${resolved[0].id}-0` : null
  );
  const [active, setActive] = useState(resolved.length ? resolved[0].id : "");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Stable id → original index map (so icons don't shuffle while filtering).
  const catIndex = useMemo(
    () => Object.fromEntries(resolved.map((g, i) => [g.id, i] as const)),
    [resolved]
  );

  // Filter items by search query
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resolved;
    return resolved
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) =>
            it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [resolved, query]);

  // Scrollspy — highlight the category currently in view
  useEffect(() => {
    if (query.trim()) return; // disable while searching
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const cat = visible[0].target.getAttribute("data-cat");
          if (cat) setActive(cat);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [query, filteredGroups]);

  const scrollTo = (id: string) => {
    setActive(id);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-8 lg:gap-14">
      {/* Category nav */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="hidden lg:block kicker mb-4">{t.categories}</p>

        {/* Desktop vertical list */}
        <nav className="hidden lg:flex flex-col gap-1">
          {resolved.map((g, i) => {
            const isActive = active === g.id && !query.trim();
            const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
            return (
              <button
                key={g.id}
                onClick={() => scrollTo(g.id)}
                className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-body text-[15px] transition-colors ${
                  isActive
                    ? "bg-yellow-muted text-yellow font-bold"
                    : "text-gray-light hover:bg-dark-card hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-yellow" />
                )}
                <Icon
                  size={16}
                  className={isActive ? "text-yellow" : "text-gray-muted group-hover:text-gray-light"}
                />
                <span className="flex-1">{g.category}</span>
                <span className={`text-xs tabular-nums ${isActive ? "text-yellow/70" : "text-gray-muted"}`}>
                  {g.items.length}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Mobile horizontal tab bar */}
        <nav className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {resolved.map((g, i) => {
            const isActive = active === g.id && !query.trim();
            const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
            return (
              <button
                key={g.id}
                onClick={() => scrollTo(g.id)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-body text-sm transition-colors ${
                  isActive
                    ? "border-yellow-border bg-yellow-muted text-yellow font-bold"
                    : "border-dark-border text-gray-light hover:text-white"
                }`}
              >
                <Icon size={15} />
                {g.category}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div>
        {/* Search */}
        <div className="group relative mb-10">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted transition-colors group-focus-within:text-yellow"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-xl border border-dark-border bg-dark-card pl-11 pr-4 py-3.5 text-sm font-body text-white placeholder:text-gray-muted outline-none transition-all focus:border-yellow-border focus:shadow-[0_0_0_4px_rgba(212,160,23,0.08)]"
            aria-label={t.searchAria}
          />
        </div>

        {filteredGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-dark-border bg-dark-card/40 py-14 text-center">
            <Search size={28} className="mx-auto mb-3 text-gray-muted" />
            <p className="font-body text-sm text-gray-light">
              {t.noResults(query)}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredGroups.map((group) => {
              const gi = catIndex[group.id] ?? 0;
              const Icon = CATEGORY_ICONS[gi % CATEGORY_ICONS.length];
              return (
                <div
                  key={group.id}
                  data-cat={group.id}
                  ref={(el) => {
                    sectionRefs.current[group.id] = el;
                  }}
                  id={slugify(group.id)}
                  className="scroll-mt-40"
                >
                  {/* Category header */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-yellow-border bg-yellow-muted text-yellow">
                      <Icon size={18} />
                    </span>
                    <h2 className="font-heading font-bold text-white text-2xl md:text-3xl uppercase leading-none">
                      {group.category}
                    </h2>
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-dark-border to-transparent sm:block" />
                  </div>

                  {/* Question cards */}
                  <div className="space-y-3">
                    {group.items.map((faq, i) => {
                      const key = `${group.id}-${i}`;
                      const isOpen = open === key;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{
                            duration: 0.4,
                            delay: Math.min(i * 0.06, 0.3),
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                            isOpen
                              ? "border-yellow-border bg-dark-card shadow-[0_0_0_1px_rgba(212,160,23,0.12),0_16px_40px_rgba(0,0,0,0.4)]"
                              : "border-dark-border bg-dark-card/50 hover:border-yellow-border/60 hover:bg-dark-card"
                          }`}
                        >
                          {/* Left accent — appears when open */}
                          <span
                            aria-hidden
                            className={`absolute left-0 top-0 bottom-0 w-1 bg-yellow transition-opacity duration-300 ${
                              isOpen ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <button
                            onClick={() => setOpen(isOpen ? null : key)}
                            className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                          >
                            <span
                              className={`font-heading font-bold text-base md:text-lg transition-colors ${
                                isOpen ? "text-yellow" : "text-white group-hover:text-yellow"
                              }`}
                            >
                              {faq.q}
                            </span>
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${
                                isOpen
                                  ? "rotate-45 border-yellow bg-yellow text-dark"
                                  : "border-yellow-border text-yellow group-hover:bg-yellow-muted"
                              }`}
                            >
                              <Plus size={16} />
                            </span>
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="overflow-hidden"
                              >
                                <p className="max-w-2xl px-5 pb-5 pr-10 font-body text-sm leading-relaxed text-gray-light md:px-6 md:text-[15px]">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
