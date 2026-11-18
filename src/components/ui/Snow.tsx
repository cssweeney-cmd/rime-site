"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { FINE_POINTER, motionOk } from "@/lib/env";

type Flake = { x: number; y: number; r: number; vy: number; vx: number; phase: number; o: number };

/**
 * Lightweight falling snow on a 2D canvas. It only animates while on screen,
 * uses fewer flakes on phones, and does nothing with reduced motion.
 */
export function Snow({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !motionOk()) return;

    const coarse = !window.matchMedia(FINE_POINTER).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let running = false;

    const make = (anywhere: boolean): Flake => {
      const depth = Math.random();
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -8,
        r: 0.6 + depth * 2,
        vy: 16 + depth * 46,
        vx: -6 + Math.random() * 12,
        phase: Math.random() * Math.PI * 2,
        o: 0.18 + depth * 0.5,
      };
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h || (w === width && Math.abs(h - height) < 120)) return;
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((coarse ? 34 : 80) * density * Math.min(w, 1600)) / 1200) + 14;
      flakes = Array.from({ length: count }, () => make(true));
    };

    const tick = (time: number, deltaMs: number) => {
      if (!running || !width) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = site.theme.colors.frost;
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.vy * dt;
        f.x += (f.vx + Math.sin(time * 0.9 + f.phase) * 14) * dt;
        if (f.y > height + 8) flakes[i] = make(false);
        else if (f.x < -8) f.x = width + 8;
        else if (f.x > width + 8) f.x = -8;
        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    io.observe(canvas);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
