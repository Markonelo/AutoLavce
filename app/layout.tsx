import type { Metadata } from "next";
import { Barlow_Condensed, Roboto_Condensed, Outfit } from "next/font/google";
import "./globals.css";
import { localBusinessSchema } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCall from "@/components/FloatingCall";
import { FavouritesProvider } from "@/components/FavouritesContext";
import { LanguageProvider } from "@/components/LanguageProvider";

// Barlow Condensed — the tall condensed font we like, but Latin-only (no Cyrillic).
// In globals.css we reference the literal "Barlow Condensed" face (not the
// --font-barlow var, which carries an Arial fallback that has Cyrillic) so that
// Macedonian letters fall through to Roboto Condensed instead of Arial.
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

// Roboto Condensed — used ONLY as a per-glyph fallback for Macedonian/Cyrillic
// letters that Barlow lacks. Tall & condensed to match, lighter than Oswald.
const robotoCondensed = Roboto_Condensed({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cyr",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://autolavce.mk"),
  title: {
    default: "Автосалон Битола | Auto Lavce – Купи Автомобил Битола",
    template: "%s | Auto Lavce – Битола",
  },
  description:
    "Auto Lavce – автосалон во Битола. Купете, изнајмете или земете автомобил на лизинг. Широк избор на половни и нови автомобили со гаранција. Авто сервис и откуп на возила.",
  keywords: [
    "автосалон Битола", "купи автомобил Битола", "половни автомобили Битола",
    "нови автомобили Македонија", "тест вожња Битола", "авто салон Пелагонија",
    "лизинг автомобили Македонија", "откуп автомобили Битола",
    "avtosalon Bitola", "kola na prodazba Bitola", "avtomobili Bitola", "Auto Lavce",
  ],
  openGraph: {
    type: "website",
    locale: "mk_MK",
    url: "https://autolavce.mk",
    siteName: "Auto Lavce",
    title: "Автосалон Битола | Auto Lavce",
    description: "Auto Lavce – автосалон во Битола со широк избор на автомобили.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Auto Lavce – Автосалон Битола" }],
  },
  twitter: { card: "summary_large_image", title: "Автосалон Битола | Auto Lavce" },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://autolavce.mk" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mk" className={`${barlow.variable} ${robotoCondensed.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
      </head>
      <body className="font-body">
        <LanguageProvider>
          <FavouritesProvider>
            <Header />
            <main className="pt-16 md:pt-[108px]">{children}</main>
            <Footer />
            <FloatingCall />
          </FavouritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
