"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLang } from "./LanguageProvider";

function IconFB({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconIG({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const pageLinks = [
  { href: "/", label: { mk: "Дома", en: "Home" } },
  { href: "/avtomobili", label: { mk: "Сите Возила", en: "All Vehicles" } },
  { href: "/za-nas", label: { mk: "За Нас", en: "About Us" } },
  { href: "/lizing", label: { mk: "Лизинг & Рати", en: "Leasing & Installments" } },
  { href: "/omileni", label: { mk: "Омилени", en: "Favourites" } },
];

const serviceLinks = [
  { href: "/avtomobili", label: { mk: "Продажба", en: "Sales" } },
  { href: "/lizing", label: { mk: "Финансирање", en: "Financing" } },
  { href: "/kontakt", label: { mk: "Изнајмување", en: "Rental" } },
  { href: "/prashanja", label: { mk: "Често Прашања", en: "FAQ" } },
];

const T = {
  mk: {
    blurb:
      "Автосалон во Битола со широк избор на проверени половни и нови автомобили. Купи, изнајми или земи на лизинг — со сигурност и фер однос.",
    pages: "Страници",
    services: "Услуги",
    contact: "Контакт",
    location: "Битола, Северна Македонија",
    hours1: "Пон–Пет: 08–18",
    hours2: "Саб: 09–14",
    rights: "Сите права задржани.",
    designedBy: "Дизајнирано од ",
    privacy: "Политика на приватност",
    terms: "Услови за користење",
  },
  en: {
    blurb:
      "Car dealership in Bitola with a wide selection of inspected used and new cars. Buy, rent, or lease — with confidence and a fair deal.",
    pages: "Pages",
    services: "Services",
    contact: "Contact",
    location: "Bitola, North Macedonia",
    hours1: "Mon–Fri: 08–18",
    hours2: "Sat: 09–14",
    rights: "All rights reserved.",
    designedBy: "Designed by ",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
  },
};

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-heading font-bold text-white text-base mb-4 uppercase tracking-wide">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link, i) => (
          <li key={`${link.href}-${i}`}>
            <Link
              href={link.href}
              className="text-gray-light hover:text-yellow transition-colors text-sm font-body"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <footer className="bg-dark border-t border-dark-border">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 pt-14 pb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 lg:pr-8">
            <div className="flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lavce-lion.png"
                alt="Auto Lavce"
                className="h-12 w-auto select-none"
              />
              <span className="font-heading font-bold text-white text-2xl tracking-wide">AUTO LAVCE</span>
            </div>
            <p className="text-gray-light text-sm font-body leading-relaxed mb-5 max-w-xs">
              {t.blurb}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100090385898908"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-lighter border border-dark-border flex items-center justify-center text-gray-light hover:text-yellow hover:border-yellow-border transition-colors"
                aria-label="Facebook"
              >
                <IconFB size={16} />
              </a>
              <a
                href="https://www.instagram.com/auto_lavce/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-lighter border border-dark-border flex items-center justify-center text-gray-light hover:text-yellow hover:border-yellow-border transition-colors"
                aria-label="Instagram"
              >
                <IconIG size={16} />
              </a>
            </div>
          </div>

          <FooterColumn title={t.pages} links={pageLinks.map((l) => ({ href: l.href, label: l.label[lang] }))} />
          <FooterColumn title={t.services} links={serviceLinks.map((l) => ({ href: l.href, label: l.label[lang] }))} />

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading font-bold text-white text-base mb-4 uppercase tracking-wide">{t.contact}</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-gray-light text-sm font-body">
                <MapPin size={16} className="text-yellow mt-0.5 shrink-0" />
                {t.location}
              </li>
              <li>
                <a href="tel:+38978889293" className="flex items-center gap-3 text-gray-light hover:text-yellow transition-colors text-sm font-body">
                  <Phone size={16} className="text-yellow shrink-0" />
                  078-889-293
                </a>
              </li>
              <li>
                <a href="mailto:autoplaclavce@hotmail.com" className="flex items-center gap-3 text-gray-light hover:text-yellow transition-colors text-sm font-body">
                  <Mail size={16} className="text-yellow shrink-0" />
                  autoplaclavce@hotmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-light text-sm font-body">
                <Clock size={16} className="text-yellow mt-0.5 shrink-0" />
                <span>{t.hours1}<br />{t.hours2}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-gray-muted text-xs font-body order-2 md:order-1">
            © {new Date().getFullYear()} Auto Lavce. {t.rights}{" "}
            <span className="text-gray-light">{t.designedBy}</span>
            <span className="text-yellow font-semibold">CoreLab</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 order-1 md:order-2">
            <Link href="/uslovi" className="text-gray-muted hover:text-yellow text-xs font-body transition-colors">{t.privacy}</Link>
            <Link href="/uslovi" className="text-gray-muted hover:text-yellow text-xs font-body transition-colors">{t.terms}</Link>
            <Link href="/kontakt" className="text-gray-muted hover:text-yellow text-xs font-body transition-colors">{t.contact}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
