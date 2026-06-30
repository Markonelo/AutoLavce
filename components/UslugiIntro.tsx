"use client";
import AnimSection from "./AnimSection";
import { useLang } from "./LanguageProvider";

const T = {
  mk: {
    kicker: "Што нудиме",
    titleA: "ТРИ УСЛУГИ.",
    titleB: "ЕДНА АДРЕСА.",
    blurb:
      "Не возиш од перална до мајстор и назад. Кај нас возилото влегува валкано и неисправно — а излегува чисто, средено и спремно. Сè на едно место, со чесна цена договорена однапред.",
  },
  en: {
    kicker: "What we offer",
    titleA: "THREE SERVICES.",
    titleB: "ONE ADDRESS.",
    blurb:
      "No driving from the car wash to the mechanic and back. Here your vehicle comes in dirty and faulty — and leaves clean, sorted and ready. All in one place, at a fair price agreed upfront.",
  },
};

export default function UslugiIntro() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="px-4 pt-10 md:pt-16 bg-dark">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <AnimSection direction="left" className="lg:col-span-7">
            <p className="kicker mb-5">{t.kicker}</p>
            <h2 className="font-heading font-bold text-white uppercase leading-[0.9] text-5xl md:text-7xl">
              {t.titleA}
              <br />
              <span className="text-yellow">{t.titleB}</span>
            </h2>
          </AnimSection>
          <AnimSection direction="right" className="lg:col-span-5">
            <p className="text-gray-light text-base md:text-lg font-body leading-relaxed">
              {t.blurb}
            </p>
          </AnimSection>
        </div>
      </div>
    </section>
  );
}
