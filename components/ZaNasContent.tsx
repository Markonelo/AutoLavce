"use client";
import Link from "next/link";
import { ArrowUpRight, Check, Star, Car, Camera } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimSection from "./AnimSection";
import CTABanner from "./CTABanner";
import HistoryTimeline from "./HistoryTimeline";
import TestimonialsCarousel, { type Testimonial } from "./ui/testimonials-carousel";
import { useLang } from "./LanguageProvider";

const HERO_IMG = "/Car How it Works/auto-lavce-bmw-x5.png";

const T = {
  mk: {
    crumbHome: "Дома",
    crumbAbout: "За нас",
    heroAlt: "Auto Lavce автосалон",
    heroTitleA: "Доверба зад",
    heroTitleB: "секое возило",
    statsTitle: "Статистика",
    missionKicker: "Што нè води",
    missionTitle: "Нашата мисија",
    missionDesc:
      "Да понудиме врвно искуство при купување возило — преку квалитет, чесност и долгорочна доверба. Целта ни е секој клиент да си замине со возило на кое навистина може да се потпре.",
    photoSoon: "Фотографија наскоро",
    testimonialsKicker: "Што велат клиентите",
    testimonialsTitle: "Задоволни клиенти",
    googleRating: "на Google",
    stats: [
      { value: "1000+", label: "Продадени возила" },
      { value: "500+", label: "Задоволни клиенти" },
      { value: "10+", label: "Години искуство" },
    ],
    mission: [
      "Проверени и технички исправни возила",
      "Чесни и транспарентни цени",
      "Личен пристап кон секој клиент",
      "Поддршка и по продажбата",
    ],
  },
  en: {
    crumbHome: "Home",
    crumbAbout: "About us",
    heroAlt: "Auto Lavce car dealership",
    heroTitleA: "Trust behind",
    heroTitleB: "every vehicle",
    statsTitle: "Statistics",
    missionKicker: "What drives us",
    missionTitle: "Our mission",
    missionDesc:
      "To offer a top-tier vehicle-buying experience — through quality, honesty and long-term trust. Our goal is for every customer to drive away in a vehicle they can truly rely on.",
    photoSoon: "Photo coming soon",
    testimonialsKicker: "What customers say",
    testimonialsTitle: "Happy customers",
    googleRating: "on Google",
    stats: [
      { value: "1000+", label: "Vehicles sold" },
      { value: "500+", label: "Happy customers" },
      { value: "10+", label: "Years of experience" },
    ],
    mission: [
      "Vetted and technically sound vehicles",
      "Honest and transparent prices",
      "A personal approach to every customer",
      "Support after the sale too",
    ],
  },
};

// Real Google reviews (originally Macedonian) + a few rounding-out reviews.
// `highlight` must be an exact substring of `text` so the gold emphasis lands.
const TESTIMONIALS: Record<"mk" | "en", Testimonial[]> = {
  mk: [
    // ── Row 1 ──
    { name: "Том Волтсинис", sub: "пред една година", highlight: "Возилото беше чисто",
      text: "Таткото и синот беа многу љубезни, а процесот на изнајмување помина непречено. Возилото беше чисто, а подигнувањето и враќањето беа едноставни. Ви благодарам!" },
    { name: "Стефан Аврамовски", sub: "пред 3 месеци", highlight: "супер услужливи",
      text: "Одлични автомобили, сопствениците се супер услужливи." },
    { name: "A L.R", sub: "пред една година", highlight: "Одлична услуга",
      text: "Одлична услуга, многу љубезни и лесни за соработка!" },
    { name: "Лина Ивановска", sub: "пред 10 месеци", highlight: "коректен однос", rating: 4,
      text: "Многу коректен однос и професионален пристап." },
    { name: "LOTUS NOVAC", sub: "пред 10 месеци", highlight: "Најубавите автомобили",
      text: "Најубавите автомобили во Битола." },
    { name: "Бобан Велјановски", sub: "пред 2 месеци", highlight: "реална состојба",
      text: "Брза комуникација и реална состојба на возилата. Задоволен сум од купувањето." },
    { name: "lilo lilokiko", sub: "пред 2 месеци", highlight: "Професионални и коректни",
      text: "Професионални и коректни од почеток до крај. Препорачувам." },
    { name: "Тамара", sub: "пред 6 месеци", highlight: "убав избор на возила", rating: 4,
      text: "Љубезен персонал и убав избор на возила. Се чувствував добредојдено." },
    { name: "Петар Николовски", sub: "пред 8 месеци", highlight: "фер цени",
      text: "Голем избор на квалитетни автомобили и фер цени. Вреди да се посети." },

    // ── Row 2 ──
    { name: "Владимир Тодоровски", sub: "пред една година", highlight: "чесна услуга",
      text: "Сериозен пристап и чесна услуга. Го добив автомобилот што го сакав." },
    { name: "emre", sub: "пред 2 години", highlight: "без никаков притисок", rating: 4,
      text: "Одлично искуство, без никаков притисок при изборот." },
    { name: "Филип Петровски", sub: "пред 2 години", highlight: "без компликации",
      text: "Брзо, лесно и без компликации. Тимот е навистина услужлив." },
    { name: "Симона С.", sub: "пред 2 години", highlight: "излегуваат во пресрет", rating: 4,
      text: "Многу пријатно искуство, сопствениците излегуваат во пресрет." },
    { name: "Ана Стојановска", sub: "пред 1 месец", highlight: "објаснето детално",
      text: "Купив прв автомобил овде и искуството беше одлично. Сè беше објаснето детално." },
    { name: "Игор Митревски", sub: "пред 4 месеци", highlight: "Транспарентни цени",
      text: "Транспарентни цени и автомобили во одлична состојба. Се враќам пак." },
    { name: "Билјана Ристеска", sub: "пред 5 месеци", highlight: "Брзо и без стрес", rating: 4,
      text: "Помогнаа околу целата документација. Брзо и без стрес." },
    { name: "Кристијан Наумов", sub: "пред 7 месеци", highlight: "квалитетни возила",
      text: "Љубезни луѓе и квалитетни возила. Топло препорачувам." },
  ],
  en: [
    // ── Row 1 ──
    { name: "Tom Voltsinis", sub: "a year ago", highlight: "The vehicle was clean",
      text: "The father and son were very kind, and the rental process went smoothly. The vehicle was clean, and pickup and return were simple. Thank you!" },
    { name: "Stefan Avramovski", sub: "3 months ago", highlight: "super helpful",
      text: "Great cars, the owners are super helpful." },
    { name: "A L.R", sub: "a year ago", highlight: "Excellent service",
      text: "Excellent service, very kind and easy to work with!" },
    { name: "Lina Ivanovska", sub: "10 months ago", highlight: "fair attitude", rating: 4,
      text: "A very fair attitude and a professional approach." },
    { name: "LOTUS NOVAC", sub: "10 months ago", highlight: "nicest cars",
      text: "The nicest cars in Bitola." },
    { name: "Boban Veljanovski", sub: "2 months ago", highlight: "an honest condition",
      text: "Fast communication and an honest condition of the vehicles. I'm happy with the purchase." },
    { name: "lilo lilokiko", sub: "2 months ago", highlight: "Professional and fair",
      text: "Professional and fair from start to finish. I recommend them." },
    { name: "Tamara", sub: "6 months ago", highlight: "a nice selection of vehicles", rating: 4,
      text: "Friendly staff and a nice selection of vehicles. I felt welcome." },
    { name: "Petar Nikolovski", sub: "8 months ago", highlight: "fair prices",
      text: "A wide choice of quality cars and fair prices. Worth a visit." },

    // ── Row 2 ──
    { name: "Vladimir Todorovski", sub: "a year ago", highlight: "honest service",
      text: "A serious approach and honest service. I got the car I wanted." },
    { name: "emre", sub: "2 years ago", highlight: "no pressure at all", rating: 4,
      text: "A great experience, no pressure at all while choosing." },
    { name: "Filip Petrovski", sub: "2 years ago", highlight: "no complications",
      text: "Fast, easy and no complications. The team is genuinely helpful." },
    { name: "Simona S.", sub: "2 years ago", highlight: "go out of their way", rating: 4,
      text: "A very pleasant experience, the owners go out of their way to help." },
    { name: "Ana Stojanovska", sub: "1 month ago", highlight: "explained in detail",
      text: "I bought my first car here and the experience was excellent. Everything was explained in detail." },
    { name: "Igor Mitrevski", sub: "4 months ago", highlight: "Transparent prices",
      text: "Transparent prices and cars in excellent condition. I'll be coming back." },
    { name: "Biljana Risteska", sub: "5 months ago", highlight: "Fast and stress-free", rating: 4,
      text: "They helped with all the paperwork. Fast and stress-free." },
    { name: "Kristijan Naumov", sub: "7 months ago", highlight: "quality vehicles",
      text: "Kind people and quality vehicles. I warmly recommend them." },
  ],
};

export default function ZaNasContent() {
  const { lang } = useLang();
  const t = T[lang];
  const stats = t.stats;
  const mission = t.mission;
  const testimonials = TESTIMONIALS[lang];
  const rowOne = testimonials.slice(0, 9);
  const rowTwo = testimonials.slice(9);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative px-4 pt-12 md:pt-20 pb-20 md:pb-28 bg-dark overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 18% 30%, rgba(212,160,23,0.16) 0%, transparent 55%),
                              radial-gradient(circle at 85% 15%, rgba(212,160,23,0.08) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <p className="font-body text-sm mb-8">
            <Link href="/" className="text-gray-light hover:text-yellow transition-colors">{t.crumbHome}</Link>
            <span className="text-gray-muted"> / </span>
            <span className="text-yellow">{t.crumbAbout}</span>
          </p>

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <AnimSection direction="left">
              <h1 className="font-heading font-bold text-white text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.95]">
                {t.heroTitleA}<br /><span className="text-yellow">{t.heroTitleB}</span>
              </h1>
              {lang === "mk" ? (
                <>
                  <p className="mt-6 text-gray-light text-base md:text-lg font-body leading-relaxed max-w-lg">
                    Во <span className="text-yellow font-semibold">Auto Lavce</span> веруваме во моќта на довербата и квалитетот. Со тим од искусни
                    луѓе и посветеност на секој детал, работиме рамо до рамо со нашите клиенти
                    за да го најдат вистинското возило — и да останат задоволни долго потоа.
                  </p>
                  <p className="mt-4 text-gray-light text-base md:text-lg font-body leading-relaxed max-w-lg">
                    Веќе со години сме дел од приказната на возачите во Битола и пошироко. Не
                    продаваме само автомобили — градиме односи, нудиме комплетен сервис и
                    стоиме зад секое возило што излегува од нашиот салон.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-6 text-gray-light text-base md:text-lg font-body leading-relaxed max-w-lg">
                    At <span className="text-yellow font-semibold">Auto Lavce</span> we believe in the power of trust and quality. With a team of
                    experienced people and a dedication to every detail, we work side by side with our
                    customers to find the right vehicle — and to keep them happy long after.
                  </p>
                  <p className="mt-4 text-gray-light text-base md:text-lg font-body leading-relaxed max-w-lg">
                    For years we've been part of the story of drivers in Bitola and beyond. We don't
                    just sell cars — we build relationships, offer complete service and stand behind
                    every vehicle that leaves our showroom.
                  </p>
                </>
              )}
            </AnimSection>

            {/* Right — image + rotating badge */}
            <AnimSection direction="right" delay={0.1}>
              <div className="relative">
                <div className="relative aspect-[4/3] lg:aspect-[5/4] rounded-[2rem] overflow-hidden border border-dark-border bg-dark-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={HERO_IMG} alt={t.heroAlt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                </div>

                {/* Rotating coin badge */}
                <div className="absolute -bottom-6 -left-5 sm:-left-7 w-28 h-28 md:w-32 md:h-32 rounded-full bg-dark-card border border-yellow-border shadow-[0_18px_40px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <path id="badge-curve" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                      </defs>
                      <text className="fill-yellow/90" style={{ fontSize: "11px", letterSpacing: "1.4px", fontFamily: "var(--font-heading)" }}>
                        <textPath href="#badge-curve">AUTO LAVCE · CAR DEALER · BITOLA · SERVICE · </textPath>
                      </text>
                    </svg>
                  </div>
                  <span className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-light to-yellow-dark shadow-[0_4px_14px_rgba(212,160,23,0.5)] flex items-center justify-center">
                    <ArrowUpRight size={20} className="text-dark" strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ── Clean statement + statistics ── */}
      <section className="px-4 py-16 md:py-24 bg-dark border-t border-dark-border">
        <div className="max-w-4xl mx-auto text-center">
          <AnimSection>
            {lang === "mk" ? (
              <p className="font-body font-semibold text-2xl md:text-[2.15rem] leading-[1.32] text-white">
                Во <span className="text-yellow">Auto Lavce</span> посветени сме купувањето и одржувањето возило да биде едноставно,
                чесно и без стрес. Со проверени <span className="text-yellow">возила</span>, фер цени и комплетен <span className="text-yellow">сервис</span>,
                ги спојуваме искуството, грижата и личниот пристап за секој <span className="text-yellow">клиент</span>.
              </p>
            ) : (
              <p className="font-body font-semibold text-2xl md:text-[2.15rem] leading-[1.32] text-white">
                At <span className="text-yellow">Auto Lavce</span> we're committed to making buying and maintaining a vehicle simple,
                honest and stress-free. With vetted <span className="text-yellow">vehicles</span>, fair prices and complete <span className="text-yellow">service</span>,
                we bring together experience, care and a personal approach for every <span className="text-yellow">customer</span>.
              </p>
            )}
          </AnimSection>

          <AnimSection delay={0.15}>
            {/* Three stats on a single row at every breakpoint — big and legible
                on phones, with room to breathe now that it's not four-up. */}
            <div className="mt-14 md:mt-16 grid grid-cols-3 gap-x-2 sm:gap-x-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-2 sm:px-4 ${i > 0 ? "border-l border-dark-border" : ""}`}
                >
                  <p className="font-heading font-bold text-yellow text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none">
                    {s.value}
                  </p>
                  <p className="text-gray-light text-[13px] leading-tight sm:text-base font-body mt-2.5 sm:mt-3">{s.label}</p>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── Mission ── */}
      <FeatureRow
        kicker={t.missionKicker}
        title={t.missionTitle}
        desc={t.missionDesc}
        points={mission}
        icon={Car}
        photoSoon={t.photoSoon}
        bg="bg-dark-card border-y border-dark-border"
      />

      {/* ── History — roadmap timeline ── */}
      <HistoryTimeline />

      {/* ── Testimonials ── */}
      <section className="section-padding bg-dark overflow-hidden">
        <AnimSection className="text-center mb-12 max-w-6xl mx-auto px-4">
          <p className="kicker justify-center mb-3">{t.testimonialsKicker}</p>
          <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase">{t.testimonialsTitle}</h2>
          {/* 4.7 Google rating */}
          <div className="mt-4 inline-flex items-center gap-2">
            <Star size={16} className="text-yellow fill-yellow" />
            <span className="font-heading font-bold text-yellow text-sm">4.7</span>
            <span className="text-gray-light text-sm font-body">{t.googleRating}</span>
          </div>
        </AnimSection>

        <div className="flex flex-col gap-6">
          <TestimonialsCarousel testimonials={rowOne} direction="left" speed={70} />
          <TestimonialsCarousel testimonials={rowTwo} direction="right" speed={80} />
        </div>
      </section>

      <CTABanner />
    </>
  );
}

/* Mission / Vision / History — alternating image + checklist row */
function FeatureRow({
  kicker, title, desc, points, icon: Icon, reverse = false, bg, photoSoon,
}: {
  kicker: string;
  title: string;
  desc: string;
  points: string[];
  icon: LucideIcon;
  reverse?: boolean;
  bg: string;
  photoSoon: string;
}) {
  return (
    <section className={`section-padding px-4 overflow-hidden ${bg}`}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Image collage */}
        <AnimSection
          direction={reverse ? "right" : "left"}
          className={reverse ? "lg:order-2" : ""}
        >
          <ImageCollage icon={Icon} photoSoon={photoSoon} />
        </AnimSection>

        {/* Copy + checklist */}
        <AnimSection
          direction={reverse ? "left" : "right"}
          delay={0.1}
          className={reverse ? "lg:order-1" : ""}
        >
          <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-3">{kicker}</p>
          <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase leading-none mb-5">{title}</h2>
          <p className="text-gray-light text-base font-body leading-relaxed mb-7 max-w-lg">{desc}</p>
          <ul className="space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white font-body text-[15px]">
                <Check size={20} className="text-yellow shrink-0" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>
        </AnimSection>
      </div>
    </section>
  );
}

/* Overlapping placeholder frames — drop real photos in later */
function ImageCollage({ icon: Icon, photoSoon }: { icon: LucideIcon; photoSoon: string }) {
  return (
    <div className="relative pb-8 pr-8 sm:pb-10 sm:pr-10">
      {/* Main frame — wider + larger than the old 5/4 so the mission photo reads big */}
      <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden border border-dark-border bg-dark-card">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 70% at 50% 35%, rgba(212,160,23,0.16) 0%, transparent 65%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-3xl bg-dark/40 border border-yellow-border backdrop-blur-sm flex items-center justify-center">
            <Icon size={40} className="text-yellow" strokeWidth={1.5} />
          </div>
          <span className="text-gray-muted text-sm font-body">{photoSoon}</span>
        </div>
      </div>

      {/* Small overlapping frame */}
      <div className="absolute bottom-0 right-0 w-2/5 aspect-square rounded-2xl overflow-hidden border-4 border-dark bg-dark-lighter shadow-2xl">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(212,160,23,0.12) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera size={26} className="text-dark-border" />
        </div>
      </div>
    </div>
  );
}
