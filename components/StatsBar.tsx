"use client";
import { useEffect, useRef, useState } from "react";
import { Car, BadgeCheck, Users, Wrench } from "lucide-react";

const stats = [
  { icon: Car, value: 60, suffix: "+", label: "Возила на залиха" },
  { icon: BadgeCheck, value: 1200, suffix: "+", label: "Продадени возила" },
  { icon: Users, value: 980, suffix: "+", label: "Задоволни клиенти" },
  { icon: Wrench, value: 15, suffix: "", label: "Години искуство" },
];

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return val;
}

function Stat({ icon: Icon, value, suffix, label, run }: (typeof stats)[number] & { run: boolean }) {
  const n = useCountUp(value, run);
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-yellow-muted border border-yellow-border flex items-center justify-center shrink-0">
        <Icon size={22} className="text-yellow" />
      </div>
      <div>
        <div className="font-heading font-extrabold text-white text-3xl md:text-4xl leading-none">
          {n.toLocaleString("mk-MK")}
          <span className="text-yellow">{suffix}</span>
        </div>
        <div className="text-gray-light text-xs md:text-sm font-body mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-dark-card border-y border-dark-border">
      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <Stat key={s.label} {...s} run={run} />
        ))}
      </div>
    </section>
  );
}
