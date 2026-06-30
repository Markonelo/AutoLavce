import type { MetadataRoute } from "next";
import { cars } from "@/data/cars";

const BASE_URL = "https://autolavce.mk";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/avtomobili`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/lizing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/uslugi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/za-nas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/prashanja`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const carPages: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${BASE_URL}/avtomobili/${car.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: car.status === "available" ? 0.85 : 0.5,
  }));

  return [...staticPages, ...carPages];
}
