"use client";

import { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  /** When provided, renders as a Next.js link to this route. */
  href?: string;
  classes?: string;
  /**
   * "text" (default): plain yellow text at rest, fills into a pill on hover.
   * "outline": a yellow-outlined rectangle at rest that fills yellow on hover.
   */
  variant?: "text" | "outline";
}

/**
 * At rest: either plain yellow text or a yellow-outlined rectangle (see `variant`).
 * On hover: a yellow fill grows in from the left behind the text and the label
 * flips to dark, so it "becomes" a solid yellow button.
 */
const MotionButton: FC<Props> = ({ label, href, classes, variant = "text" }) => {
  const isOutline = variant === "outline";
  const className = cn(
    "group relative inline-block cursor-pointer px-5 py-2 outline-none",
    isOutline ? "rounded-lg border border-yellow" : "rounded-full",
    classes
  );

  const content = (
    <>
      {/* Yellow fill — hidden at rest (scaled to 0), expands on hover */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 origin-left scale-x-0 bg-yellow transition-transform duration-500 ease-out group-hover:scale-x-100",
          isOutline ? "rounded-md" : "rounded-full"
        )}
      />
      {/* Label + arrow — yellow at rest, inverts to dark once the fill arrives */}
      <span className="relative inline-flex items-center gap-1.5 font-heading text-sm font-bold uppercase tracking-wide text-yellow transition-colors duration-500 group-hover:text-dark">
        {label}
        <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
};

export default MotionButton;
