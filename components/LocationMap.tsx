"use client";
import { useEffect, useRef } from "react";

// Exact location: AUTO LAVCHE BITOLA
const LAT = 41.0634208;
const LNG = 21.3416528;
const MAP_LINK = "https://maps.app.goo.gl/C4cKkjaPc4HZvt5H9";

// Custom yellow pin — sharp (less rounded) bottom point, dark center.
const PIN_SVG = `
<svg width="34" height="44" viewBox="-1 -1 26 34" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.4 0 0 5.4 0 12C0 18.5 12 32 12 32C12 32 24 18.5 24 12C24 5.4 18.6 0 12 0Z"
        fill="#D4A017" stroke="#0F0F0F" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="4.3" fill="#0F0F0F"/>
</svg>`;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { L?: any }
}

function loadLeaflet(): Promise<unknown> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.L) { resolve(window.L); return; }

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    document.body.appendChild(script);
  });
}

export default function LocationMap() {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadLeaflet().then((L: any) => {
      if (cancelled || !ref.current || mapRef.current || !L) return;

      const map = L.map(ref.current, {
        center: [LAT, LNG],
        zoom: 16,
        scrollWheelZoom: true,
        attributionControl: false,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "al-pin",
        html: PIN_SVG,
        iconSize: [34, 44],
        iconAnchor: [17, 43], // bottom tip → exact location
      });

      const marker = L.marker([LAT, LNG], { icon }).addTo(map);
      marker
        .bindTooltip("Auto Lavce", {
          permanent: true,
          direction: "left",
          offset: [-18, -20],
          className: "al-tip",
        })
        .openTooltip();
      marker.on("click", () => window.open(MAP_LINK, "_blank", "noopener,noreferrer"));

      // On mobile the map container often has no real width yet at init time,
      // so Leaflet picks a center based on a 0-size box and the pin ends up
      // off-screen until the user drags. After the layout settles we recompute
      // the container size AND re-assert the view on the pin so it loads dead
      // centre every time. Run it now and once more after first paint/fonts.
      const recenter = () => {
        if (cancelled || !mapRef.current) return;
        map.invalidateSize();
        map.setView([LAT, LNG], 16, { animate: false });
      };
      setTimeout(recenter, 0);
      setTimeout(recenter, 250);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={ref} className="al-map absolute inset-0 w-full h-full" />;
}
