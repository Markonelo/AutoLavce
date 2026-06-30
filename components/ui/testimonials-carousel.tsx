"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  name: string;
  text: string;
  sub?: string;
  highlight?: string;
  image?: string;
  /** star rating 1–5 (defaults to 5) */
  rating?: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  direction?: "left" | "right";
  /** seconds per loop — larger = slower */
  speed?: number;
  /** px min-height for cards */
  cardHeight?: number;
  className?: string;
}

/** Bold an exact substring of the body in brand gold. */
function renderBody(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.indexOf(highlight);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-yellow font-semibold">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

function Card({ t, cardHeight }: { t: Testimonial; cardHeight: number }) {
  const rating = t.rating ?? 5;
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "group/card relative shrink-0 w-[270px] sm:w-[330px] mr-4 sm:mr-6 flex flex-col overflow-hidden",
        "rounded-2xl bg-dark-card border border-dark-border p-5 sm:p-6",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-yellow-border hover:shadow-[0_18px_45px_-12px_rgba(212,160,23,0.28)]"
      )}
      style={{ minHeight: cardHeight }}
    >
      {/* gold accent rail down the left edge — lights up on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full bg-yellow/30 group-hover/card:bg-yellow transition-colors duration-300"
      />

      {/* top row — star rating */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? "text-yellow fill-yellow" : "text-yellow/25"}
          />
        ))}
      </div>

      <p className="text-gray-light text-[0.95rem] font-body leading-relaxed mb-5 line-clamp-5">
        {renderBody(t.text, t.highlight)}
      </p>

      <div className="flex items-center gap-3 mt-auto">
        <span
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0",
            t.image
              ? "bg-yellow-muted border border-yellow-border"
              : "bg-yellow text-dark font-heading font-bold text-base"
          )}
        >
          {t.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
          ) : (
            t.name.charAt(0)
          )}
        </span>
        <div>
          <p className="font-heading font-bold text-white text-sm leading-tight">{t.name}</p>
          {t.sub && <p className="text-gray-muted text-xs font-body mt-0.5">{t.sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsCarousel({
  testimonials,
  direction = "left",
  speed = 35,
  cardHeight = 210,
  className,
}: TestimonialsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  // Measure one set's width (content is duplicated → scrollWidth / 2).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setCarouselWidth(el.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [testimonials]);

  // Drive the loop on a motion value so we can pause/resume on hover.
  useEffect(() => {
    if (prefersReduced || carouselWidth === 0) return;
    const from = direction === "left" ? 0 : -carouselWidth;
    const to = direction === "left" ? -carouselWidth : 0;
    x.set(from);
    const controls = animate(x, to, {
      duration: speed,
      ease: "linear",
      repeat: Infinity,
    });
    controlsRef.current = controls;
    return () => controls.stop();
  }, [carouselWidth, speed, direction, prefersReduced, x]);

  if (testimonials.length === 0) return null;

  const loop = [...testimonials, ...testimonials];

  return (
    <div
      className={cn("group relative overflow-hidden py-6", className)}
      onMouseEnter={() => controlsRef.current?.pause()}
      onMouseLeave={() => controlsRef.current?.play()}
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 inset-y-0 z-10 w-10 sm:w-16 md:w-24 bg-gradient-to-r from-dark to-transparent" />
      <div className="pointer-events-none absolute right-0 inset-y-0 z-10 w-10 sm:w-16 md:w-24 bg-gradient-to-l from-dark to-transparent" />

      <motion.div ref={containerRef} className="flex w-max" style={{ x }}>
        {loop.map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} cardHeight={cardHeight} />
        ))}
      </motion.div>
    </div>
  );
}
