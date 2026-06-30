"use client";
import { Search, CalendarCheck, Gauge, FileText, CreditCard, KeyRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimSection from "./AnimSection";
import { useLang } from "./LanguageProvider";

interface Step {
  icon: LucideIcon;
  num: string;
  title: string;
  desc: string;
}

const T = {
  mk: {
    kicker: "Едноставно и брзо",
    title: "Како функционира",
    left: [
      { num: "01", title: "Разгледај ја понудата", desc: "Избери возило од нашата проверена понуда онлајн." },
      { num: "02", title: "Закажи термин", desc: "Контактирај нѐ и закажи термин кој ти одговара." },
      { num: "03", title: "Тест возење", desc: "Увери се во состојбата на возилото пред да одлучиш." },
    ],
    right: [
      { num: "04", title: "Договор и плаќање", desc: "Избери: кеш, рати или лизинг по твоја мерка." },
      { num: "05", title: "Документација", desc: "Ние ја средуваме целата документација за тебе." },
      { num: "06", title: "Преземи го возилото", desc: "Земи ги клучевите — возилото е твое." },
    ],
  },
  en: {
    kicker: "Simple and fast",
    title: "How it works",
    left: [
      { num: "01", title: "Browse the offer", desc: "Pick a vehicle from our vetted selection online." },
      { num: "02", title: "Book an appointment", desc: "Get in touch and book a time that suits you." },
      { num: "03", title: "Test drive", desc: "See the vehicle's condition for yourself before you decide." },
    ],
    right: [
      { num: "04", title: "Agreement & payment", desc: "Choose: cash, instalments or leasing — on your terms." },
      { num: "05", title: "Paperwork", desc: "We handle all the documentation for you." },
      { num: "06", title: "Drive it home", desc: "Take the keys — the vehicle is yours." },
    ],
  },
};

const LEFT_ICONS: LucideIcon[] = [Search, CalendarCheck, Gauge];
const RIGHT_ICONS: LucideIcon[] = [CreditCard, FileText, KeyRound];

function StepItem({ step, align }: { step: Step; align: "left" | "right" }) {
  return (
    <div className={`flex items-start gap-4 ${align === "right" ? "md:flex-row-reverse md:text-right" : ""}`}>
      <div className="shrink-0">
        <step.icon size={34} className="text-yellow" />
      </div>
      <div>
        <div className={`flex items-center gap-2 mb-1.5 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
          <span className="font-heading font-bold text-yellow/40 text-base">{step.num}</span>
          <h3 className="font-heading font-bold text-white text-xl md:text-2xl leading-tight">{step.title}</h3>
        </div>
        <p className="text-gray-light text-base font-body leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { lang } = useLang();
  const t = T[lang];
  const leftSteps: Step[] = t.left.map((s, i) => ({ ...s, icon: LEFT_ICONS[i] }));
  const rightSteps: Step[] = t.right.map((s, i) => ({ ...s, icon: RIGHT_ICONS[i] }));
  return (
    <section className="section-padding px-4 bg-dark relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <AnimSection className="text-center mb-14">
          <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-3">
            {t.kicker}
          </p>
          <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase">
            {t.title}
          </h2>
        </AnimSection>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-10 lg:gap-12 items-center">
          {/* Left steps */}
          <div className="space-y-12 order-2 lg:order-1">
            {leftSteps.map((s, i) => (
              <AnimSection key={s.num} direction="left" delay={i * 0.1}>
                <StepItem step={s} align="right" />
              </AnimSection>
            ))}
          </div>

          {/* Center car — hidden on mobile/tablet (it dwarfs the stacked steps
              and adds dead scroll); only shown on the lg 3-column layout. */}
          <AnimSection direction="up" delay={0.1} className="hidden lg:block order-1 lg:order-2">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(212,160,23,0.45) 0%, transparent 70%)" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Car How it Works/auto-lavce-bmw-x5.png"
                alt="Auto Lavce возило"
                className="relative w-full max-w-[45rem] object-contain drop-shadow-2xl"
              />
            </div>
          </AnimSection>

          {/* Right steps */}
          <div className="space-y-12 order-3">
            {rightSteps.map((s, i) => (
              <AnimSection key={s.num} direction="right" delay={i * 0.1}>
                <StepItem step={s} align="left" />
              </AnimSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
