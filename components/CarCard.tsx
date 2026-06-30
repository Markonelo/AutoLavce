"use client";
import Link from "next/link";
import { Heart, Camera } from "lucide-react";
import type { Car } from "@/data/cars";
import { eur } from "@/lib/format";
import { useFavourites } from "./FavouritesContext";
import { useLang } from "./LanguageProvider";
import { tFuel, tTrans, tBadge } from "@/lib/i18n";

interface Props {
  car: Car;
}

const T = {
  mk: {
    soldOverlay: { sold: "ПРОДАДЕНО", reserved: "РЕЗЕРВИРАНО" },
    photoSoon: "Фотографија наскоро",
    sold: "Продадено",
    onRequest: "По Договор",
    rateFrom: "рата од",
    perMonth: "€/мес",
    hp: "КС",
    favAdd: "Додади во омилени",
    favRemove: "Отстрани од омилени",
  },
  en: {
    soldOverlay: { sold: "SOLD", reserved: "RESERVED" },
    photoSoon: "Photo coming soon",
    sold: "Sold",
    onRequest: "On request",
    rateFrom: "from",
    perMonth: "€/mo",
    hp: "HP",
    favAdd: "Add to favourites",
    favRemove: "Remove from favourites",
  },
};

export default function CarCard({ car }: Props) {
  const { has, toggle } = useFavourites();
  const { lang } = useLang();
  const t = T[lang];
  const fav = has(car.id);
  const sold = car.status !== "available";

  const specs = [
    `${car.year}`,
    tTrans(car.transmission, lang),
    tFuel(car.fuel, lang),
    ...(car.power ? [`${car.power} ${t.hp}`] : []),
  ];

  return (
    <article className="car-card relative bg-dark-card border border-dark-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Favourite */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(car.id);
        }}
        aria-label={fav ? t.favRemove : t.favAdd}
        className="absolute top-3 right-3 z-10 text-white/90 hover:text-yellow transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
      >
        <Heart size={24} className={fav ? "fill-yellow text-yellow" : ""} />
      </button>

      <Link href={`/avtomobili/${car.slug}`} className="block group flex-1 flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-dark-lighter overflow-hidden">
          {car.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#1a1a1a,#222222)]">
              <Camera size={28} className="text-dark-border" />
              <span className="text-gray-muted text-xs font-body">{t.photoSoon}</span>
            </div>
          )}

          {sold && (
            <div className="absolute inset-0 bg-dark/70 flex items-center justify-center">
              <span className="font-heading font-bold text-2xl text-white/90 tracking-widest rotate-[-10deg] border-2 border-white/80 px-4 py-1 rounded">
                {car.status === "reserved" ? t.soldOverlay.reserved : t.soldOverlay.sold}
              </span>
            </div>
          )}

          {car.badge && !sold && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-yellow text-dark text-xs font-heading font-bold uppercase tracking-wide rounded-md">
              {tBadge(car.badge, lang)}
            </span>
          )}
        </div>

        {/* Info — clean, no icons, centered */}
        <div className="p-5 flex flex-col flex-1 text-center">
          <h3 className="font-heading font-bold text-white text-2xl md:text-[1.7rem] leading-tight mb-3 group-hover:text-yellow transition-colors line-clamp-1">
            {car.title}
          </h3>

          {/* Specs in one row, divider-separated, max two lines */}
          <div className="flex flex-wrap items-center justify-center gap-y-1 text-gray-light text-xs font-body">
            {specs.map((s, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span className="mx-2.5 w-px h-3 bg-dark-border inline-block" />}
                {s}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="mt-auto pt-4">
            {sold ? (
              <span className="font-heading font-bold text-gray-light text-2xl">{t.sold}</span>
            ) : car.price > 0 ? (
              <>
                <span className="font-heading font-bold text-yellow text-3xl leading-none">{eur(car.price)}</span>
                {car.monthlyPayment && (
                  <span className="block text-gray-muted text-xs font-body mt-1.5">
                    {t.rateFrom} <span className="text-gray-light font-semibold">{car.monthlyPayment} {t.perMonth}</span>
                  </span>
                )}
              </>
            ) : (
              <span className="font-heading font-bold text-white text-2xl">{t.onRequest}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
