"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GradientMenuItem {
  title: string;
  icon: React.ReactNode;
  /** optional link; renders an <a>, otherwise a <button> */
  href?: string;
  /** override the default brand-gold gradient */
  gradientFrom?: string;
  gradientTo?: string;
}

// Brand gold gradient (replaces the original rainbow palette)
const GOLD_FROM = "#F2D058";
const GOLD_TO = "#A87D0F";

interface GradientMenuProps {
  items: GradientMenuItem[];
  className?: string;
  /** px the pill expands to on hover */
  expandWidth?: number;
}

export default function GradientMenu({
  items,
  className,
  expandWidth = 190,
}: GradientMenuProps) {
  return (
    <ul className={cn("flex flex-wrap gap-4", className)}>
      {items.map(
        ({ title, icon, href, gradientFrom = GOLD_FROM, gradientTo = GOLD_TO }, idx) => {
          const style = {
            "--gradient-from": gradientFrom,
            "--gradient-to": gradientTo,
            "--expand-w": `${expandWidth}px`,
          } as React.CSSProperties;

          // Only `width` triggers layout; everything else is opacity/transform
          // (compositor) so the whole interaction stays buttery at 60fps.
          const pillClass =
            "group relative flex h-[60px] w-[60px] hover:w-[var(--expand-w)] items-center justify-center rounded-full " +
            "bg-dark-card border border-dark-border shadow-lg cursor-pointer overflow-hidden " +
            "transition-[width,box-shadow,border-color] duration-500 ease-out will-change-[width] " +
            "hover:shadow-none hover:border-transparent " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dark";

          const inner = (
            <>
              {/* Gold fill on hover */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
              {/* Blur glow */}
              <span
                aria-hidden
                className="absolute top-2.5 inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[15px] opacity-0 -z-10 transition-opacity duration-500 ease-out group-hover:opacity-50"
              />
              {/* Icon — scales out on hover */}
              <span className="relative z-10 text-2xl text-yellow transition-transform duration-500 ease-out will-change-transform group-hover:scale-0">
                {icon}
              </span>
              {/* Title — scales in on hover */}
              <span className="absolute z-10 scale-0 font-heading font-bold uppercase tracking-wide text-sm text-dark whitespace-nowrap transition-transform duration-500 ease-out will-change-transform group-hover:scale-100 delay-150">
                {title}
              </span>
            </>
          );

          return (
            <li key={idx} className="flex">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={title}
                  style={style}
                  className={pillClass}
                >
                  {inner}
                </a>
              ) : (
                <button type="button" aria-label={title} style={style} className={pillClass}>
                  {inner}
                </button>
              )}
            </li>
          );
        }
      )}
    </ul>
  );
}
