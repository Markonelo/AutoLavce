import Link from "next/link";
import { ShoppingCart, Key, CreditCard, Wrench, Repeat, HandCoins, ArrowRight } from "lucide-react";
import AnimSection from "./AnimSection";

const services = [
  {
    icon: ShoppingCart,
    title: "Продажба",
    desc: "Широк избор на внимателно одбрани возила со проверена историја. Транспарентни цени без скриени трошоци.",
    href: "/avtomobili",
    cta: "Погледни Возила",
  },
  {
    icon: CreditCard,
    title: "Рати & Лизинг",
    desc: "Земи го саканиот автомобил на рати со брзо одобрување. Лизинг, кредит или одложено плаќање — го наоѓаме најдоброто за тебе.",
    href: "/lizing",
    cta: "Пресметај Рата",
  },
  {
    icon: Repeat,
    title: "Замена – Старо за Ново",
    desc: "Донеси го твоето возило на проценка и замени го за подобро. Брза проценка и фер понуда на самото место.",
    href: "/kontakt",
    cta: "Контактирај",
  },
  {
    icon: Key,
    title: "Изнајмување (Rent-a-Car)",
    desc: "Краткорочно и долгорочно изнајмување на возила. Флексибилни услови, проверени автомобили, брза достава.",
    href: "/kontakt",
    cta: "Контактирај",
  },
  {
    icon: Wrench,
    title: "Авто Сервис",
    desc: "Целосен авто сервис на нашата локација во Битола. Дијагностика, сервисирање и поправка — сè на едно место.",
    href: "/kontakt",
    cta: "Закажи Сервис",
  },
  {
    icon: HandCoins,
    title: "Откуп на Возила",
    desc: "Сакаш да продадеш? Откупуваме возила во добра состојба по реална пазарна цена, со исплата веднаш.",
    href: "/kontakt",
    cta: "Понуди Возило",
  },
];

export default function Services() {
  return (
    <section className="section-padding px-4 bg-dark-card border-y border-dark-border">
      <div className="max-w-6xl mx-auto">
        <AnimSection className="text-center mb-14">
          <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-3">
            Нашите Услуги
          </p>
          <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase">
            ШТО НУДИМЕ
          </h2>
        </AnimSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <AnimSection key={s.title} delay={i * 0.1}>
              <div className="group h-full bg-dark border border-dark-border rounded-2xl p-6 hover:border-yellow-border transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-yellow-muted border border-yellow-border flex items-center justify-center mb-5 group-hover:bg-yellow group-hover:border-yellow transition-all duration-300">
                  <s.icon size={22} className="text-yellow group-hover:text-dark transition-colors duration-300" />
                </div>
                <h3 className="font-heading font-bold text-white text-2xl mb-3 uppercase">{s.title}</h3>
                <p className="text-gray-light text-sm font-body leading-relaxed flex-1">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-5 flex items-center gap-1.5 text-yellow text-sm font-heading font-bold uppercase tracking-wide hover:gap-3 transition-all group-hover:gap-3"
                >
                  {s.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </AnimSection>
          ))}
        </div>
      </div>
    </section>
  );
}
