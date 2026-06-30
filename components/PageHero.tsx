"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n";

type Bilingual = Record<Lang, string>;

interface Breadcrumb {
  label: Bilingual;
  href?: string;
}

interface Props {
  title: Bilingual;
  subtitle?: Bilingual;
  breadcrumbs?: Breadcrumb[];
  accent?: Bilingual;
}

export default function PageHero({ title, subtitle, breadcrumbs, accent }: Props) {
  const { lang } = useLang();
  return (
    <section className="relative pt-12 md:pt-16 pb-14 px-4 overflow-hidden bg-dark border-b border-dark-border">
      <div className="relative max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-gray-muted font-body flex-wrap">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={12} className="text-gray-muted/50" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-yellow transition-colors">
                      {crumb.label[lang]}
                    </Link>
                  ) : (
                    <span className="text-gray-light">{crumb.label[lang]}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-stretch gap-5"
        >
          {/* Bold yellow accent bar */}
          <span aria-hidden className="w-1.5 shrink-0 rounded-full bg-yellow" />

          <div>
            {accent && (
              <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-3">
                {accent[lang]}
              </p>
            )}
            <h1 className="font-heading font-bold text-white text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
              {title[lang]}
            </h1>
            {subtitle && (
              <p className="mt-4 text-gray-light text-base md:text-lg font-body max-w-2xl leading-relaxed">
                {subtitle[lang]}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
