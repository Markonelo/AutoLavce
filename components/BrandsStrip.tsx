"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "./LanguageProvider";

const T = {
  mk: { heading: "Пребарувај по марка", vehiclesFrom: (n: string) => `Возила од ${n}`, logo: (n: string) => `${n} лого` },
  en: { heading: "Browse by brand", vehiclesFrom: (n: string) => `${n} vehicles`, logo: (n: string) => `${n} logo` },
};

// Logo wall (autowelt-style). Each logo lives in /public/brands/ as a transparent PNG.
// If an image is missing or fails to load, the tile falls back to the brand name.
// `invert: true` flips near-black monochrome logos to white so they stay
// visible on the dark background (e.g. Volvo, Kia) without altering colored marks.
//
// `h` = per-logo max-height in px. The source PNGs have wildly different amounts
// of internal transparent padding (some crop tight to the mark, some leave a wide
// margin), so a single max-height makes the actual marks look 2x different in size.
// Each `h` is tuned so every visible mark renders at the SAME height (~38px).
// Exception: Volvo and Kia are wide wordmarks that read visually larger, so they
// are set a touch smaller (~30px) to balance against the others.
//
// `pad` = per-logo horizontal padding (px, each side). Just like vertical padding,
// every PNG bakes in a DIFFERENT amount of transparent margin on the left/right
// (e.g. Renault/Nissan have huge side margins, Mazda has none). A constant padding
// would leave the *visible* gaps uneven, so each `pad` cancels out the logo's own
// internal margin to produce an even visible gap (~74px) between every mark.
const brands: { name: string; file: string; h: number; pad: number; invert?: boolean }[] = [
  { name: "Volkswagen", file: "volkswagen.png", h: 39, pad: 37 },
  { name: "BMW", file: "bmw.png", h: 39, pad: 37 },
  { name: "Audi", file: "audi.png", h: 41, pad: 36 },
  { name: "Opel", file: "opel.png", h: 52, pad: 15 },
  { name: "Ford", file: "ford.png", h: 80, pad: 16 },
  { name: "Renault", file: "renault.png", h: 43, pad: 3 },
  { name: "Peugeot", file: "peugeot.png", h: 42, pad: 34 },
  { name: "Citroën", file: "citroen.png", h: 45, pad: 34 },
  { name: "Toyota", file: "toyota.png", h: 43, pad: 35 },
  { name: "Hyundai", file: "hyundai.png", h: 48, pad: 33 },
  { name: "Kia", file: "kia.png", h: 72, pad: 36, invert: true },
  { name: "Nissan", file: "nissan.png", h: 67, pad: 6 },
  { name: "Mazda", file: "mazda.png", h: 38, pad: 37 },
  { name: "Fiat", file: "fiat.png", h: 42, pad: 19 },
  { name: "Seat", file: "seat.png", h: 58, pad: 29 },
  { name: "Volvo", file: "volvo.png", h: 33, pad: 35, invert: true },
  { name: "Mini", file: "mini.png", h: 77, pad: 14 },
];

function BrandLogo({ name, file, h, pad, invert }: { name: string; file: string; h: number; pad: number; invert?: boolean }) {
  const { lang } = useLang();
  const t = T[lang];
  const [errored, setErrored] = useState(false);
  return (
    <Link
      href={`/avtomobili?make=${encodeURIComponent(name)}`}
      style={{
        paddingLeft: `calc(${pad}px * var(--logo-scale))`,
        paddingRight: `calc(${pad}px * var(--logo-scale))`,
      }}
      className="group shrink-0 flex items-center justify-center h-12 sm:h-16"
      aria-label={t.vehiclesFrom(name)}
    >
      {errored ? (
        <span className="font-heading font-bold text-sm sm:text-base uppercase tracking-wider whitespace-nowrap text-gray-light group-hover:text-yellow transition-colors">
          {name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/brands/${file}`}
          alt={t.logo(name)}
          onError={() => setErrored(true)}
          style={{ maxHeight: `calc(${h}px * var(--logo-scale))` }}
          className={`w-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110${invert ? " invert" : ""}`}
          loading="lazy"
        />
      )}
    </Link>
  );
}

export default function BrandsStrip({ withHeading = true }: { withHeading?: boolean }) {
  const { lang } = useLang();
  return (
    <section className="brands-marquee py-4 sm:py-6 bg-dark border-y border-dark-border overflow-hidden">
      {withHeading && (
        <p className="text-center text-yellow text-sm font-heading font-bold uppercase tracking-[0.2em] mb-4 px-4">
          {T[lang].heading}
        </p>
      )}
      {/* Full-bleed marquee with a soft gradient fade on both ends */}
      <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]">
        <motion.div
          className="flex items-center shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <BrandLogo key={`${brand.name}-${i}`} name={brand.name} file={brand.file} h={brand.h} pad={brand.pad} invert={brand.invert} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
