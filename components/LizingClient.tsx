"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, IdCard, Receipt, Banknote, Car } from "lucide-react";
import PageHero from "./PageHero";
import AnimSection from "./AnimSection";
import LeasingCalculator from "./LeasingCalculator";
import DocumentsConnect from "./DocumentsConnect";
import { useLang } from "./LanguageProvider";

const DOC_ICONS = [IdCard, Receipt, Banknote, Car];

const partners = ["Halkbank", "Komercijalna Banka", "NLB Banka", "Stopanska Banka", "ProCredit", "Sparkasse"];

const T = {
  mk: {
    heroTitle: "ЛИЗИНГ & РАТИ",
    heroSubtitle: "Земи го саканиот автомобил денес — плати со удобни месечни рати прилагодени на твојот буџет.",
    crumbHome: "Дома",
    crumbLeasing: "Лизинг & Рати",
    heroAccent: "Флексибилно Финансирање",
    calcKicker: "Калкулатор",
    calcTitle: "ПРЕСМЕТАЈ РАТИ",
    calcCta: "Побарај Конкретна Понуда",
    processKicker: "Едноставен процес",
    processTitle: "ПРОЦЕСОТ",
    docsKicker: "Брзо и едноставно",
    docsTitle: "ПОТРЕБНИ ДОКУМЕНТИ",
    partnersNote: "Соработуваме со водечките банки и лизинг куќи",
    faqKicker: "Чести прашања",
    faqTitle: "ПРАШАЊА & ОДГОВОРИ",
    documents: [
      { title: "Лична карта", desc: "Важечка лична карта или пасош." },
      { title: "Потврда за приходи", desc: "Платен список или М1/М2 образец за последните 3 месеци." },
      { title: "Извод од трансакциска сметка", desc: "Банкарски извод за последните 3-6 месеци." },
      { title: "Возачка дозвола", desc: "Важечка возачка дозвола (категорија Б)." },
    ],
    steps: [
      { n: "01", title: "Избери Автомобил", desc: "Погледни ја нашата понуда и избери го автомобилот кој ти одговара." },
      { n: "02", title: "Консултација", desc: "Нашиот тим ти помага да го избереш најповолниот начин на финансирање." },
      { n: "03", title: "Документи", desc: "Помагаме со целата документација за кредит или лизинг." },
      { n: "04", title: "Возиш!", desc: "По одобрување, го преземаш автомобилот и возиш!" },
    ],
    faqs: [
      { q: "Кои документи се потребни?", a: "Лична карта, потврда за приходи, и евентуално извод од банка. Нашиот тим ве води низ целата процедура." },
      { q: "Колкав е минималниот аванс?", a: "Аванс зависи од банката и вашиот кредитен рејтинг — обично 10-30% од вредноста на возилото." },
      { q: "На кој период може лизинг?", a: "Лизинг може да се склучи на 12, 24, 36, 48 или 60 месеци во зависност од вашите можности." },
      { q: "Дали нудите лизинг и за странски државјани?", a: "Да, со соодветна документација можеме да помогнеме и на нерезиденти во Македонија." },
      { q: "Дали може и без аванс?", a: "Во некои случаи е можен нулт аванс, зависно од одобрување на банката и кредитниот профил." },
    ],
  },
  en: {
    heroTitle: "LEASING & INSTALMENTS",
    heroSubtitle: "Get the car you want today — pay in comfortable monthly instalments tailored to your budget.",
    crumbHome: "Home",
    crumbLeasing: "Leasing & Instalments",
    heroAccent: "Flexible Financing",
    calcKicker: "Calculator",
    calcTitle: "CALCULATE INSTALMENTS",
    calcCta: "Request a Tailored Offer",
    processKicker: "A simple process",
    processTitle: "THE PROCESS",
    docsKicker: "Quick and simple",
    docsTitle: "REQUIRED DOCUMENTS",
    partnersNote: "We work with leading banks and leasing houses",
    faqKicker: "Frequently asked",
    faqTitle: "QUESTIONS & ANSWERS",
    documents: [
      { title: "ID card", desc: "Valid ID card or passport." },
      { title: "Proof of income", desc: "Payslip or M1/M2 form for the last 3 months." },
      { title: "Bank account statement", desc: "Bank statement for the last 3–6 months." },
      { title: "Driving licence", desc: "Valid driving licence (category B)." },
    ],
    steps: [
      { n: "01", title: "Choose a Car", desc: "Browse our offer and pick the car that suits you." },
      { n: "02", title: "Consultation", desc: "Our team helps you choose the most favourable way to finance it." },
      { n: "03", title: "Documents", desc: "We help with all the paperwork for the loan or lease." },
      { n: "04", title: "Drive!", desc: "Once approved, you collect the car and drive off!" },
    ],
    faqs: [
      { q: "Which documents are required?", a: "ID card, proof of income and possibly a bank statement. Our team guides you through the entire procedure." },
      { q: "What is the minimum down payment?", a: "The down payment depends on the bank and your credit rating — usually 10–30% of the vehicle's value." },
      { q: "What terms are available for leasing?", a: "A lease can be arranged over 12, 24, 36, 48 or 60 months, depending on your means." },
      { q: "Do you offer leasing to foreign nationals?", a: "Yes, with the right documentation we can help non-residents in Macedonia too." },
      { q: "Is it possible without a down payment?", a: "In some cases a zero down payment is possible, subject to the bank's approval and your credit profile." },
    ],
  },
};

export default function LizingClient() {
  const { lang } = useLang();
  const t = T[lang];
  const documents = t.documents.map((d, i) => ({ ...d, icon: DOC_ICONS[i] }));
  const steps = t.steps;
  const faqs = t.faqs;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PageHero
        title={{ mk: T.mk.heroTitle, en: T.en.heroTitle }}
        subtitle={{ mk: T.mk.heroSubtitle, en: T.en.heroSubtitle }}
        breadcrumbs={[
          { label: { mk: T.mk.crumbHome, en: T.en.crumbHome }, href: "/" },
          { label: { mk: T.mk.crumbLeasing, en: T.en.crumbLeasing } },
        ]}
        accent={{ mk: T.mk.heroAccent, en: T.en.heroAccent }}
      />

      {/* Calculator */}
      <section className="py-16 px-4 bg-dark border-b border-dark-border">
        <div className="max-w-6xl mx-auto">
          <AnimSection className="text-center mb-10">
            <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-3">{t.calcKicker}</p>
            <h2 className="font-heading font-bold text-white text-4xl uppercase">{t.calcTitle}</h2>
          </AnimSection>

          <AnimSection delay={0.1}>
            <LeasingCalculator defaultPrice={20000} />
            <div className="text-center mt-6">
              <Link href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow text-dark font-heading font-bold rounded-xl hover:bg-yellow-light transition-colors">
                {t.calcCta} <ArrowRight size={16} />
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding px-4 bg-dark-card border-y border-dark-border">
        <div className="max-w-3xl mx-auto">
          <AnimSection className="text-center mb-14">
            <p className="kicker justify-center mb-3">{t.processKicker}</p>
            <h2 className="font-heading font-bold text-white text-4xl uppercase">{t.processTitle}</h2>
          </AnimSection>

          <div className="space-y-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group flex items-center gap-5 bg-dark border border-dark-border rounded-2xl p-5 hover:border-yellow-border transition-colors"
              >
                {/* Number circle — centered alongside the card content */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.15 + 0.1, ease: "backOut" }}
                  className="shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-dark-card border border-yellow-border font-heading font-bold text-yellow text-xl group-hover:bg-yellow group-hover:text-dark transition-colors"
                >
                  {s.n}
                </motion.span>
                <div>
                  <h3 className="font-heading font-bold text-white text-xl mb-1 uppercase">{s.title}</h3>
                  <p className="text-gray-light text-sm font-body leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Required documents */}
      <section className="section-padding px-4 bg-dark">
        <div className="max-w-5xl mx-auto">
          <AnimSection className="text-center mb-12">
            <p className="kicker justify-center mb-3">{t.docsKicker}</p>
            <h2 className="font-heading font-bold text-white text-4xl uppercase">{t.docsTitle}</h2>
          </AnimSection>
          <DocumentsConnect documents={documents} />
        </div>
      </section>

      {/* Partners */}
      <section className="py-14 px-4 bg-dark-card border-y border-dark-border">
        <div className="max-w-5xl mx-auto text-center">
          <AnimSection>
            <p className="text-gray-muted font-body text-sm uppercase tracking-widest mb-8">
              {t.partnersNote}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {partners.map((p) => (
                <span key={p} className="font-heading font-bold text-xl md:text-2xl text-gray-light/70 uppercase tracking-wide hover:text-yellow transition-colors">
                  {p}
                </span>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding px-4 bg-dark">
        <div className="max-w-3xl mx-auto">
          <AnimSection className="text-center mb-14">
            <p className="kicker justify-center mb-3">{t.faqKicker}</p>
            <h2 className="font-heading font-bold text-white text-4xl uppercase">{t.faqTitle}</h2>
          </AnimSection>
          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <AnimSection key={i} delay={i * 0.08}>
                  <div
                    className={`rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-yellow bg-yellow-muted shadow-[0_0_24px_rgba(212,160,23,0.10)]"
                        : "border-dark-border bg-dark-card hover:border-yellow-border"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center gap-4 p-6 text-left"
                    >
                      <span
                        className={`shrink-0 font-heading font-bold text-lg leading-none transition-colors ${
                          isOpen ? "text-yellow" : "text-gray-muted"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-heading font-bold text-white text-lg leading-snug">
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                          isOpen ? "bg-yellow text-dark" : "bg-dark text-yellow border border-yellow-border"
                        }`}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-gray-light text-sm md:text-base font-body leading-relaxed border-l-2 border-yellow pl-4">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
