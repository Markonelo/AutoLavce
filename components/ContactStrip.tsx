"use client";
import { Phone, Mail, MapPin, Navigation } from "lucide-react";
import AnimSection from "./AnimSection";
import LocationMap from "./LocationMap";
import { useLang } from "./LanguageProvider";

// Exact location: AUTO LAVCHE BITOLA (41.0634208, 21.3416528)
const MAP_LINK = "https://maps.app.goo.gl/C4cKkjaPc4HZvt5H9";

const T = {
  mk: {
    kicker: "Дојди ни во посета",
    titlePre: "Се наоѓаме во ",
    titleAccent: "Битола",
    blurb:
      "Посети го нашиот салон, разгледај ги возилата во живо и пробај ги пред да одлучиш. Нашиот тим е тука за секое прашање — без обврска.",
    address: "Горно Оризари, Битола 7000",
    directions: "Одведи ме до Auto Lavce",
    openMaps: "Отвори во Maps",
  },
  en: {
    kicker: "Come and visit us",
    titlePre: "Located in ",
    titleAccent: "Bitola",
    blurb:
      "Visit our showroom, see the vehicles in person and try them before you decide. Our team is here for any question — with no obligation.",
    address: "Gorno Orizari, Bitola 7000",
    directions: "Get directions to Auto Lavce",
    openMaps: "Open in Maps",
  },
};

export default function ContactStrip() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="section-padding px-4 bg-dark-card">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        <AnimSection direction="left">
          <p className="kicker mb-4">{t.kicker}</p>
          <h2 className="font-heading font-bold text-white text-4xl md:text-5xl uppercase leading-none mb-5">
            {t.titlePre}<span className="text-yellow">{t.titleAccent}</span>
          </h2>
          <p className="text-gray-light font-body leading-relaxed mb-8 max-w-lg">
            {t.blurb}
          </p>

          <div className="space-y-4 mb-8">
            <a href="tel:+38978889293" className="flex items-center gap-4 group">
              <Phone size={20} className="text-yellow shrink-0" />
              <span className="text-white font-body group-hover:text-yellow transition-colors">078-889-293</span>
            </a>
            <a href="mailto:autoplaclavce@hotmail.com" className="flex items-center gap-4 group">
              <Mail size={20} className="text-yellow shrink-0" />
              <span className="text-white font-body group-hover:text-yellow transition-colors">autoplaclavce@hotmail.com</span>
            </a>
            <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <MapPin size={20} className="text-yellow shrink-0" />
              <span className="text-white font-body group-hover:text-yellow transition-colors">{t.address}</span>
            </a>
          </div>

          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Navigation size={18} /> {t.directions}
          </a>
        </AnimSection>

        <AnimSection direction="right" className="min-h-[340px]">
          {/* Leaflet map (OpenStreetMap, no API key). The yellow pin is a real
              marker rendered inside the map, so it stays anchored to the exact
              location while dragging/zooming. Only the tiles are grayscaled. */}
          {/* isolate → own stacking context so Leaflet's internal high z-indexes
              (controls reach z-1000) stay trapped here and can't overlap the
              fixed header (z-50) when scrolling. */}
          <div className="relative isolate h-full min-h-[340px] rounded-2xl overflow-hidden border border-dark-border">
            <LocationMap />

            {/* Click-to-open overlay button (top-right) */}
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 z-[1000] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark/85 border border-dark-border text-white text-xs font-body hover:text-yellow hover:border-yellow-border transition-colors backdrop-blur-sm"
            >
              <Navigation size={14} /> {t.openMaps}
            </a>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}
