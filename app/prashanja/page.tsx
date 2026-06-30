import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FaqAccordion, { type FaqGroup } from "@/components/FaqAccordion";
import FaqCtaPill from "@/components/FaqCtaPill";

export const metadata: Metadata = {
  title: "Често Поставувани Прашања – Auto Lavce Битола",
  description:
    "Одговори на најчестите прашања за купување автомобил, рати и лизинг, замена старо за ново, гаранција и сервис во Auto Lavce Битола.",
  alternates: { canonical: "https://autolavce.mk/prashanja" },
};

const groups: FaqGroup[] = [
  {
    category: { mk: "Купување", en: "Buying" },
    items: [
      {
        q: { mk: "Дали возилата имаат проверена историја?", en: "Do the vehicles have a verified history?" },
        a: { mk: "Да. Секое возило поминува техничка проверка и проверка на километража и историја пред да биде објавено за продажба.", en: "Yes. Every vehicle goes through a technical inspection and a mileage and history check before it is listed for sale." },
      },
      {
        q: { mk: "Можам ли да го пробам автомобилот пред да купам?", en: "Can I test drive the car before buying?" },
        a: { mk: "Секако. Закажи тест вожња со јавување — возилото ти го подготвуваме за пробна вожња во салонот во Битола.", en: "Of course. Book a test drive with a call — we'll prepare the vehicle for a test drive at our showroom in Bitola." },
      },
      {
        q: { mk: "Дали давате гаранција?", en: "Do you offer a warranty?" },
        a: { mk: "Да, на дел од возилата нудиме гаранција, а за останатите детална техничка проверка и можност за проверка кај независен механичар.", en: "Yes, we offer a warranty on some vehicles, and for the rest a detailed technical inspection and the option to have it checked by an independent mechanic." },
      },
      {
        q: { mk: "Што е вклучено во цената?", en: "What is included in the price?" },
        a: { mk: "Цените се транспарентни и без скриени трошоци. Трошоците за пренос на сопственост и регистрација се пресметуваат посебно и однапред.", en: "Prices are transparent with no hidden costs. The costs for transfer of ownership and registration are calculated separately and upfront." },
      },
    ],
  },
  {
    category: { mk: "Рати & Лизинг", en: "Instalments & Leasing" },
    items: [
      {
        q: { mk: "Како функционира купувањето на рати?", en: "How does buying in instalments work?" },
        a: { mk: "Соработуваме со повеќе банки и лизинг куќи. По избор на возило, ти помагаме да го избереш најповолниот модел на финансирање според твоите можности.", en: "We work with several banks and leasing houses. Once you choose a vehicle, we help you pick the most favourable financing option for your budget." },
      },
      {
        q: { mk: "Колкав аванс е потребен?", en: "How big a down payment is required?" },
        a: { mk: "Обично 10–30% од вредноста, но во одредени случаи е можно и пониско или нулто учество — зависно од одобрување.", en: "Usually 10–30% of the value, but in certain cases a lower or even zero down payment is possible — subject to approval." },
      },
      {
        q: { mk: "Колку трае одобрувањето?", en: "How long does approval take?" },
        a: { mk: "Најчесто 24–48 часа по поднесување на потребната документација.", en: "Usually 24–48 hours after the required documentation is submitted." },
      },
    ],
  },
  {
    category: { mk: "Замена & Откуп", en: "Trade-in & Buyout" },
    items: [
      {
        q: { mk: "Може ли да го заменам моето старо возило?", en: "Can I trade in my old vehicle?" },
        a: { mk: "Да. Донеси го возилото на бесплатна проценка — фер пазарна понуда добиваш на самото место, а разликата ја доплаќаш или финансираш на рати.", en: "Yes. Bring your vehicle in for a free valuation — you get a fair market offer on the spot, and you pay the difference or finance it in instalments." },
      },
      {
        q: { mk: "Откупувате ли возила?", en: "Do you buy vehicles?" },
        a: { mk: "Да, откупуваме возила во добра состојба по реална пазарна цена, со можност за исплата веднаш.", en: "Yes, we buy vehicles in good condition at a fair market price, with the option of immediate payment." },
      },
    ],
  },
  {
    category: { mk: "Сервис & Гаранција", en: "Service & Warranty" },
    items: [
      {
        q: { mk: "Нудите ли сервис?", en: "Do you offer service?" },
        a: { mk: "Да, на нашата локација во Битола вршиме дијагностика, сервисирање и поправка на возила.", en: "Yes, at our location in Bitola we carry out diagnostics, servicing and vehicle repairs." },
      },
      {
        q: { mk: "Дали помагате со регистрација?", en: "Do you help with registration?" },
        a: { mk: "Да, целосно ја средуваме документацијата за пренос на сопственост и регистрација.", en: "Yes, we fully handle the paperwork for transfer of ownership and registration." },
      },
    ],
  },
];

export default function FaqPage() {
  // SEO schema stays in Macedonian (the indexed/canonical language).
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q.mk,
        acceptedAnswer: { "@type": "Answer", text: item.a.mk },
      }))
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHero
        title={{ mk: "ПРАШАЊА", en: "FAQ" }}
        subtitle={{
          mk: "Најчестите прашања за купување, финансирање, замена и сервис — на едно место.",
          en: "The most common questions about buying, financing, trade-in and service — all in one place.",
        }}
        breadcrumbs={[
          { label: { mk: "Дома", en: "Home" }, href: "/" },
          { label: { mk: "Прашања", en: "FAQ" } },
        ]}
        accent={{ mk: "Помош & Информации", en: "Help & Info" }}
      />
      <section className="relative px-4 py-12 bg-dark">
        {/* Soft gold atmosphere — clipped in its own layer so it doesn't break
            the sticky category sidebar (overflow-hidden on an ancestor would). */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-yellow/5 blur-[130px]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <FaqAccordion groups={groups} />

          {/* Still have questions */}
          <FaqCtaPill />
        </div>
      </section>
    </>
  );
}
