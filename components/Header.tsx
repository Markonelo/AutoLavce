"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  Heart,
  ChevronDown,
  Home,
  Car,
  Percent,
  HelpCircle,
  Building2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useFavourites } from "./FavouritesContext";
import { useLang } from "./LanguageProvider";
import LangSwitch from "./LangSwitch";
import FavouritesButton from "./FavouritesButton";

const mainLinks = [
  { href: "/", label: { mk: "Почетна", en: "Home" }, icon: Home },
  { href: "/avtomobili", label: { mk: "Сите Возила", en: "All Vehicles" }, icon: Car },
  { href: "/lizing", label: { mk: "Рати & Лизинг", en: "Installments & Leasing" }, icon: Percent },
  { href: "/uslugi", label: { mk: "Услуги", en: "Services" }, icon: Sparkles },
];

const menuPlus = [
  { href: "/prashanja", label: { mk: "Често Поставувани Прашања", en: "Frequently Asked Questions" }, icon: HelpCircle },
  { href: "/za-nas", label: { mk: "За Нас", en: "About Us" }, icon: Building2 },
  { href: "/kontakt", label: { mk: "Контакт", en: "Contact" }, icon: MessageSquare },
];

const T = {
  mk: {
    hours: "Понеделник – Сабота: 08:00 – 18:00ч",
    fav: "Омилени",
    favAria: "Омилени возила",
    menu: "Мени",
    menuAria: "Мени",
    vehicles: "Возила",
    browseVehicles: "Погледни Возила",
  },
  en: {
    hours: "Monday – Saturday: 08:00 – 18:00",
    fav: "Favourites",
    favAria: "Favourite vehicles",
    menu: "Menu",
    menuAria: "Menu",
    vehicles: "Vehicles",
    browseVehicles: "Browse Vehicles",
  },
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useFavourites();
  const { lang } = useLang();
  const t = T[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setPlusOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Utility bar — bare text at the top; collapses away once scrolled ── */}
      <div
        className={`hidden md:block overflow-hidden transition-all duration-300 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9 text-xs font-body">
          <div className="flex items-center gap-2 text-gray-light">
            <Clock size={13} className="text-yellow" />
            <span>{t.hours}</span>
          </div>
          <div className="flex items-center gap-5 text-gray-light">
            <a href="tel:+38978889293" className="flex items-center gap-1.5 hover:text-yellow transition-colors">
              <Phone size={13} className="text-yellow" /> 078-889-293
            </a>
            <a href="mailto:autoplaclavce@hotmail.com" className="flex items-center gap-1.5 hover:text-yellow transition-colors">
              <Mail size={13} className="text-yellow" /> autoplaclavce@hotmail.com
            </a>
            <Link href="/omileni" className="flex items-center gap-1.5 hover:text-yellow transition-colors">
              <Heart size={13} className="text-yellow" /> {t.fav}{count > 0 ? ` (${count})` : ""}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main bar — transparent (text only) at the top, then folds into a
              floating, rounded-rectangle island in the middle once scrolled ── */}
      <div className="px-3 sm:px-4">
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? "max-w-6xl mt-3 h-14 md:h-16 px-4 md:px-6 rounded-2xl bg-dark/95 border border-dark-border shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              : "max-w-7xl mt-0 h-16 md:h-[72px] px-1 md:px-2 rounded-none bg-transparent border border-transparent shadow-none"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lavce-lion.png"
              alt="Auto Lavce"
              draggable={false}
              className="h-11 w-auto select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-transform group-hover:scale-105"
            />
            <span className="font-heading font-bold text-white text-xl md:text-2xl tracking-wide leading-none flex items-center">
              AUTO<span className="text-yellow">LAVCE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-heading font-bold uppercase tracking-wide transition-all ${
                    isActive(link.href)
                      ? "text-yellow bg-yellow-muted"
                      : "text-white/80 hover:text-yellow hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  {link.label[lang]}
                </Link>
              );
            })}

            {/* Menu+ dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPlusOpen(true)}
              onMouseLeave={() => setPlusOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-heading font-bold uppercase tracking-wide transition-all ${
                  menuPlus.some((m) => isActive(m.href))
                    ? "text-yellow bg-yellow-muted"
                    : "text-white/80 hover:text-yellow hover:bg-white/5"
                }`}
              >
                {t.menu}
                <span className="text-yellow text-base leading-none">+</span>
                <ChevronDown size={14} className={`transition-transform ${plusOpen ? "rotate-180" : ""}`} />
              </button>
              {plusOpen && (
                <div className="absolute right-0 top-full pt-2 w-64">
                  <ul className="bg-dark-card border border-dark-border rounded-xl p-2 shadow-2xl shadow-black/60">
                    {menuPlus.map((m) => {
                      const Icon = m.icon;
                      return (
                        <li key={m.href}>
                          <Link
                            href={m.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                              isActive(m.href)
                                ? "text-yellow bg-yellow-muted"
                                : "text-gray-light hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <Icon size={16} className="text-yellow shrink-0" />
                            {m.label[lang]}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <LangSwitch className="hidden sm:flex" />
            <FavouritesButton className="hidden sm:flex" />
            <Link href="/avtomobili" className="btn-primary hidden lg:inline-flex !py-2.5 !px-5 text-sm">
              <Car size={16} /> {t.vehicles}
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-lg border border-dark-border flex items-center justify-center text-white"
              aria-label={t.menuAria}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-dark overflow-y-auto">
          <div className="px-5 py-6 flex flex-col gap-1">
            {[...mainLinks, ...menuPlus].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 py-3.5 px-3 rounded-lg border-b border-dark-border/60 text-lg font-heading font-bold transition-colors ${
                    isActive(link.href) ? "text-yellow" : "text-white hover:text-yellow"
                  }`}
                >
                  <Icon size={20} className="text-yellow" />
                  {link.label[lang]}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 mt-5">
              <LangSwitch className="self-center" />
              <a href="tel:+38978889293" className="flex items-center justify-center gap-2 text-gray-light font-body py-2">
                <Phone size={16} className="text-yellow" /> 078-889-293
              </a>
              <Link href="/avtomobili" className="btn-primary w-full">
                <Car size={18} /> {t.browseVehicles}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
