import type { Metadata } from "next";
import type { Car } from "@/data/cars";

const BASE_URL = "https://autolavce.mk";
const SITE_NAME = "Auto Lavce";
const DEFAULT_DESCRIPTION =
  "Auto Lavce – автосалон во Битола. Купете, изнајмете или земете автомобил на лизинг. Широк избор на половни и нови автомобили со гаранција. Авто сервис и откуп на возила.";

export function buildMeta(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `Автосалон Битола | ${SITE_NAME} – Купи Автомобил Битола`,
      template: `%s | ${SITE_NAME} – Битола`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
      "автосалон Битола",
      "купи автомобил Битола",
      "половни автомобили Битола",
      "нови автомобили Македонија",
      "тест вожња Битола",
      "автомобили на продажба Битола",
      "авто салон Пелагонија",
      "лизинг автомобили Македонија",
      "откуп автомобили Битола",
      "avtosalon Bitola",
      "kola na prodazba Bitola",
      "avtomobili Bitola",
      "Auto Lavce",
    ],
    authors: [{ name: "Auto Lavce" }],
    creator: "Auto Lavce",
    publisher: "Auto Lavce",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "mk_MK",
      url: BASE_URL,
      siteName: SITE_NAME,
      title: `Автосалон Битола | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Auto Lavce – Автосалон Битола",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Автосалон Битола | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: BASE_URL,
    },
    ...overrides,
  };
}

export function buildCarMeta(car: Car): Metadata {
  const priceText = car.price > 0 ? `${car.price.toLocaleString()} EUR` : "Цена по договор";
  const powerText = car.power ? `, ${car.power} КС` : "";
  const title = `${car.title} – ${priceText} | ${SITE_NAME} Битола`;
  const description = `Купи ${car.title}, ${car.fuel}, ${car.transmission}${powerText}. ${priceText}. Автосалон Auto Lavce, Битола.`;
  const url = `${BASE_URL}/avtomobili/${car.slug}`;

  return buildMeta({
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: car.images.length
        ? [{ url: car.images[0], width: 1200, height: 630, alt: car.title }]
        : [{ url: "/og-image.jpg", width: 1200, height: 630, alt: car.title }],
    },
    alternates: { canonical: url },
  });
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoDealer", "LocalBusiness"],
    name: "Auto Lavce",
    url: BASE_URL,
    telephone: "+38978889293",
    email: "autoplaclavce@hotmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Битола",
      addressLocality: "Битола",
      addressRegion: "Пелагониски регион",
      postalCode: "7000",
      addressCountry: "MK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.0297,
      longitude: 21.3295,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    priceRange: "€€",
    description: DEFAULT_DESCRIPTION,
    areaServed: ["Битола", "Прилеп", "Охрид", "Скопје", "Пелагониски регион"],
    hasMap: "https://maps.app.goo.gl/C4cKkjaPc4HZvt5H9",
    sameAs: [
      "https://www.facebook.com/profile.php?id=100090385898908",
      "https://www.instagram.com/auto_lavce/",
    ],
  };
}

export function carProductSchema(car: Car) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: car.title,
    description: car.description,
    offers: {
      "@type": "Offer",
      ...(car.price > 0 ? { price: car.price, priceCurrency: "EUR" } : {}),
      availability:
        car.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      seller: {
        "@type": "AutoDealer",
        name: "Auto Lavce",
      },
    },
    brand: {
      "@type": "Brand",
      name: car.make,
    },
    vehicleModelDate: car.year,
    vehicleEngine: {
      "@type": "EngineSpecification",
      engineType: car.fuel,
      engineDisplacement: car.engine,
    },
    driveWheelConfiguration: car.drivetrain,
    vehicleTransmission: car.transmission,
    numberOfDoors: car.doors,
    numberOfForwardGears: car.transmission === "Рачен" ? 6 : undefined,
    image: car.images.length ? car.images[0] : undefined,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
