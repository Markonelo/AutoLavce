import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cars, getCarBySlug, getRelatedCars } from "@/data/cars";
import { carProductSchema, breadcrumbSchema } from "@/lib/seo";
import CarDetailClient from "@/components/CarDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return {};
  const priceText = car.price > 0 ? `${car.price.toLocaleString()} EUR` : "Цена по договор";
  return {
    title: `${car.title} – ${priceText}`,
    description: `Купи ${car.title}, ${car.fuel}, ${car.transmission}. ${priceText}. Auto Lavce автосалон Битола.`,
    alternates: { canonical: `https://autolavce.mk/avtomobili/${car.slug}` },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const related = getRelatedCars(car);

  const jsonLd = [carProductSchema(car), breadcrumbSchema([
    { name: "Дома", url: "/" },
    { name: "Автомобили", url: "/avtomobili" },
    { name: car.title, url: `/avtomobili/${car.slug}` },
  ])];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CarDetailClient car={car} related={related} />
    </>
  );
}
