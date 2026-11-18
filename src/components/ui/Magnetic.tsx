"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, motionOk } from "@/lib/env";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * Only active with a real mouse and when motion is allowed.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionOk() || !window.matchMedia(FINE_POINTER).matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.45)" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // Measure from the resting position, not the displaced one.
      const cx = rect.left + rect.width / 2 - Number(gsap.getProperty(el, "x"));
      const cy = rect.top + rect.height / 2 - Number(gsap.getProperty(el, "y"));
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
