"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, useMediaQuery, useMotionOk } from "@/lib/env";

const INTERACTIVE = "a, button, [role='radio'], input, summary, [data-cursor]";

/**
 * Custom cursor: a dot that tracks the pointer exactly (so aiming stays
 * precise) and a ring that trails it and swells over interactive elements.
 * Only rendered for real mice, and never with reduced motion.
 */
export function Cursor() {
  const fine = useMediaQuery(FINE_POINTER);
  const motion = useMotionOk();
  const enabled = fine && motion;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = dot.current;
    const r = ring.current;
    if (!enabled || !d || !r) return;

    document.documentElement.classList.add("has-cursor");
    const setX = gsap.quickSetter(d, "x", "px");
    const setY = gsap.quickSetter(d, "y", "px");
    const ringX = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;

    const show = (on: boolean) => {
      if (shown === on) return;
      shown = on;
      gsap.to([d, r], { opacity: on ? 1 : 0, duration: 0.25, overwrite: "auto" });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setX(e.clientX);
      setY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      show(true);
    };
    const onOver = (e: PointerEvent) => {
      const hit = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      r.dataset.active = hit ? "true" : "false";
      d.dataset.active = hit ? "true" : "false";
    };
    const onDown = () => gsap.to(r, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[70]">
      <div ref={ring} className="group absolute top-0 left-0 opacity-0 will-change-transform">
        <div className="-mt-5 -ml-5 size-10 rounded-full border border-frost/50 transition-[scale,background-color,border-color] duration-300 ease-out-expo group-data-[active=true]:scale-[1.7] group-data-[active=true]:border-accent group-data-[active=true]:bg-accent/15" />
      </div>
      <div ref={dot} className="group absolute top-0 left-0 opacity-0 will-change-transform">
        <div className="-mt-[3px] -ml-[3px] size-1.5 rounded-full bg-frost transition-transform duration-300 group-data-[active=true]:scale-[1.6] group-data-[active=true]:bg-accent" />
      </div>
    </div>
  );
}
