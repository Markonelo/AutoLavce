"use client";
import { useState } from "react";
import { Phone, Mail, Clock, MapPin, Send, CheckCircle, ArrowRight } from "lucide-react";
import AnimSection from "./AnimSection";
import LocationMap from "./LocationMap";
import { useLang } from "./LanguageProvider";

// Exact location: AUTO LAVCHE BITOLA (Горно Оризари, Битола 7000)
const MAP_LINK = "https://maps.app.goo.gl/C4cKkjaPc4HZvt5H9";

const T = {
  mk: {
    kicker: "Контакт",
    titleA: "Стапи во контакт",
    titleB: "со нашиот ",
    titleAccent: "тим",
    intro:
      "Тука сме за сите твои прашања — избор на возило, тест вожња, лизинг или сервис. Јави се и заедно ќе го најдеме вистинското возило за тебе.",
    sentTitle: "Пратено!",
    sentDesc: "Ви благодариме за пораката. Ќе ви одговориме наскоро.",
    formTitle: "Кажи ни како да помогнеме",
    nameLabel: "Име и презиме",
    namePh: "Твоето име",
    emailLabel: "Е-маил адреса",
    emailPh: "Каде да ти одговориме",
    phoneLabel: "Телефон",
    subjectLabel: "Наслов",
    subjectPh: "За што се работи?",
    messageLabel: "Порака",
    messagePh: "Кажи ни како можеме да помогнеме",
    send: "Прати порака",
    directTitleA: "Сакаш директен ",
    directAccent: "контакт",
    directTitleB: "?",
    hours: "Понеделник – Петок, 08:00 – 18:00",
    visit: "Посети нѐ",
    address: "Горно Оризари, Битола 7000",
    directions: "Насоки",
  },
  en: {
    kicker: "Contact",
    titleA: "Get in touch",
    titleB: "with our ",
    titleAccent: "team",
    intro:
      "We're here for all your questions — choosing a vehicle, a test drive, leasing or service. Get in touch and together we'll find the right vehicle for you.",
    sentTitle: "Sent!",
    sentDesc: "Thank you for your message. We'll get back to you soon.",
    formTitle: "Tell us how we can help",
    nameLabel: "Full name",
    namePh: "Your name",
    emailLabel: "Email address",
    emailPh: "Where should we reply",
    phoneLabel: "Phone",
    subjectLabel: "Subject",
    subjectPh: "What is it about?",
    messageLabel: "Message",
    messagePh: "Tell us how we can help",
    send: "Send message",
    directTitleA: "Prefer direct ",
    directAccent: "contact",
    directTitleB: "?",
    hours: "Monday – Friday, 08:00 – 18:00",
    visit: "Visit us",
    address: "Gorno Orizari, Bitola 7000",
    directions: "Directions",
  },
};

export default function KontaktClient() {
  const { lang } = useLang();
  const t = T[lang];
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder submit – integrate with API/email service
    setSent(true);
  }

  const inputClass =
    "w-full bg-dark-lighter border border-dark-border rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-gray-muted focus:outline-none focus:border-yellow-border transition-colors";
  const labelClass = "block text-sm text-white font-body mb-2";

  return (
    <section className="relative section-padding px-4 bg-dark overflow-hidden">
      {/* Ambient gold glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 12% 12%, rgba(212,160,23,0.16) 0%, transparent 55%),
                            radial-gradient(circle at 90% 85%, rgba(212,160,23,0.08) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* ── Heading block ── */}
        <AnimSection className="max-w-3xl">
          <p className="kicker mb-3">{t.kicker}</p>
          <h1 className="font-heading font-bold text-white text-4xl md:text-5xl lg:text-6xl uppercase leading-[0.95]">
            {t.titleA}<br />{t.titleB}<span className="text-yellow">{t.titleAccent}</span>
          </h1>
          <p className="mt-5 text-gray-light text-base md:text-lg font-body leading-relaxed max-w-2xl">
            {t.intro}
          </p>
        </AnimSection>

        {/* ── Two columns, aligned by height ── */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left — form card */}
          <AnimSection direction="left" className="h-full">
            <div className="h-full flex flex-col bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8">
              {sent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <CheckCircle size={48} className="text-yellow mb-4" />
                  <h3 className="font-heading font-bold text-white text-3xl uppercase mb-2">{t.sentTitle}</h3>
                  <p className="text-gray-light font-body text-sm">{t.sentDesc}</p>
                </div>
              ) : (
                <>
                  <h2 className="font-heading font-bold text-white text-xl md:text-2xl uppercase">
                    {t.formTitle}
                  </h2>
                  <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col">
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>{t.nameLabel}</label>
                        <input type="text" required placeholder={t.namePh}
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t.emailLabel}</label>
                        <input type="email" required placeholder={t.emailPh}
                          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t.phoneLabel}</label>
                        <input type="tel" placeholder="078-889-293"
                          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t.subjectLabel}</label>
                        <input type="text" placeholder={t.subjectPh}
                          value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t.messageLabel}</label>
                        <textarea required rows={4} placeholder={t.messagePh}
                          value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className={`${inputClass} resize-none`} />
                      </div>
                    </div>
                    <button type="submit"
                      className="mt-auto pt-6 w-full">
                      <span className="flex w-full items-center justify-center gap-2 py-3.5 bg-yellow text-dark font-heading font-bold text-base rounded-xl hover:bg-yellow-light transition-colors">
                        <Send size={18} /> {t.send}
                      </span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </AnimSection>

          {/* Right — direct contact + map */}
          <AnimSection direction="right" delay={0.1} className="h-full">
            <div className="h-full flex flex-col">
              <h2 className="font-heading font-bold text-white text-xl md:text-2xl uppercase">
                {t.directTitleA}<span className="text-yellow">{t.directAccent}</span>{t.directTitleB}
              </h2>

              <div className="mt-5 space-y-4">
                <a href="tel:+38978889293" className="group flex items-center gap-3 w-fit">
                  <Phone size={18} className="text-yellow shrink-0" />
                  <span className="text-gray-light font-body group-hover:text-white transition-colors">078-889-293</span>
                </a>
                <a href="mailto:autoplaclavce@hotmail.com" className="group flex items-center gap-3 w-fit">
                  <Mail size={18} className="text-yellow shrink-0" />
                  <span className="text-gray-light font-body group-hover:text-white transition-colors">autoplaclavce@hotmail.com</span>
                </a>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-yellow shrink-0" />
                  <span className="text-gray-light font-body">{t.hours}</span>
                </div>
              </div>

              {/* Grayscale Leaflet map with real anchored yellow pin (same as homepage).
                  isolate → traps Leaflet's high z-indexes in their own stacking context. */}
              <div className="relative isolate mt-6 flex-1 min-h-[320px] rounded-3xl overflow-hidden border border-dark-border">
                <LocationMap />
                <div className="absolute left-4 right-4 bottom-4 z-[1000] bg-dark-card/95 backdrop-blur-sm border border-dark-border rounded-2xl p-5">
                  <p className="font-heading font-bold text-white text-lg uppercase mb-2">{t.visit}</p>
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin size={16} className="text-yellow mt-0.5 shrink-0" />
                    <span className="text-gray-light text-sm font-body">{t.address}</span>
                  </div>
                  <a href={MAP_LINK} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-yellow text-dark font-heading font-bold text-sm uppercase px-4 py-2.5 rounded-xl hover:bg-yellow-light transition-colors">
                    {t.directions} <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </AnimSection>
        </div>
      </div>
    </section>
  );
}
