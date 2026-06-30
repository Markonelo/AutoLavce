import { Shield, Star, Clock, MapPin, CheckCircle, Users } from "lucide-react";
import AnimSection from "./AnimSection";

const reasons = [
  { icon: Shield, title: "Гаранција на Квалитет", desc: "Сите возила поминуваат низ детален технички преглед пред продажба." },
  { icon: Star, title: "Проверена Историја", desc: "Целосна документација и транспарентна историја за секој автомобил." },
  { icon: Clock, title: "Брза Процедура", desc: "Целиот процес на купување завршува за неколку часа — без чекање." },
  { icon: CreditCard2, title: "Поволен Лизинг", desc: "Флексибилни услови на плаќање прилагодени на вашиот буџет." },
  { icon: MapPin, title: "Локација во Битола", desc: "Centralno лоцирани во Битола, лесно достапни за целиот регион." },
  { icon: Users, title: "Личен Пристап", desc: "Секој клиент е индивидуален — ви помагаме да го најдете вистинскиот авто." },
];

function CreditCard2(props: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

export default function WhyUs() {
  return (
    <section className="section-padding px-4 bg-dark relative overflow-hidden">
      {/* Decorative */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-5"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(212,160,23,1) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <AnimSection direction="left" className="mb-14">
          <p className="text-yellow font-heading font-bold text-sm uppercase tracking-widest mb-3">
            Зошто Ние
          </p>
          <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase max-w-lg">
            ЗОШТО АВТО ЛАВЧЕ?
          </h2>
        </AnimSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <AnimSection key={r.title} delay={i * 0.08}>
              <div className="flex gap-4 p-5 bg-dark-card border border-dark-border rounded-xl hover:border-yellow-border transition-all duration-300">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-yellow-muted border border-yellow-border flex items-center justify-center">
                  <r.icon size={20} className="text-yellow" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-1">{r.title}</h3>
                  <p className="text-gray-light text-sm font-body leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>

        {/* Checklist */}
        <AnimSection className="mt-12 p-8 bg-dark-card border border-dark-border rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Сервисна книшка",
              "Без скриени трошоци",
              "Тест вожња достапна",
              "Технички преглед вклучен",
              "Помош со документи",
              "Откуп на вашиот авто",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-yellow shrink-0" />
                <span className="text-gray-light text-sm font-body">{item}</span>
              </div>
            ))}
          </div>
        </AnimSection>
      </div>
    </section>
  );
}
