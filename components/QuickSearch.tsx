"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { makes, fuelTypes, bodyTypes } from "@/data/cars";

export default function QuickSearch() {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [fuel, setFuel] = useState("");
  const [body, setBody] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (fuel) params.set("fuel", fuel);
    if (body) params.set("body", body);
    router.push(`/avtomobili${params.toString() ? "?" + params.toString() : ""}`);
  }

  const selectClass =
    "flex-1 bg-dark-lighter border border-dark-border rounded-xl px-4 py-3 text-white text-sm font-body focus:outline-none focus:border-yellow-border transition-colors appearance-none cursor-pointer";

  return (
    <section className="py-8 px-4 bg-dark-card border-b border-dark-border">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            {/* Make */}
            <div className="relative flex-1">
              <select value={make} onChange={(e) => setMake(e.target.value)} className={selectClass}>
                <option value="">Сите марки</option>
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Fuel */}
            <div className="relative flex-1">
              <select value={fuel} onChange={(e) => setFuel(e.target.value)} className={selectClass}>
                <option value="">Вид гориво</option>
                {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Body */}
            <div className="relative flex-1">
              <select value={body} onChange={(e) => setBody(e.target.value)} className={selectClass}>
                <option value="">Тип каросерија</option>
                {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-yellow text-dark font-heading font-bold text-sm rounded-xl hover:bg-yellow-light transition-colors shrink-0"
            >
              <Search size={16} />
              Барај
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
