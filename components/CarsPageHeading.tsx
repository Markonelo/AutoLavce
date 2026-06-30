"use client";
import { useLang } from "./LanguageProvider";

const T = {
  mk: {
    kicker: "Нашата понуда",
    title: "Нашите возила",
    available: "достапни возила во моментов",
  },
  en: {
    kicker: "Our offer",
    title: "Our vehicles",
    available: "vehicles available right now",
  },
};

export default function CarsPageHeading({ availableCount }: { availableCount: number }) {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <div className="bg-dark border-b border-dark-border px-4 lg:px-8 pt-10 pb-8">
      <div className="flex items-stretch gap-5">
        <span aria-hidden className="w-1.5 shrink-0 rounded-full bg-yellow" />
        <div>
          <p className="text-yellow font-heading font-bold text-xs uppercase tracking-widest mb-2">
            {t.kicker}
          </p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase leading-none">
            {t.title}
          </h1>
          <p className="mt-3 text-gray-light text-sm font-body">
            <span className="font-heading font-bold text-yellow">{availableCount}</span> {t.available}
          </p>
        </div>
      </div>
    </div>
  );
}
