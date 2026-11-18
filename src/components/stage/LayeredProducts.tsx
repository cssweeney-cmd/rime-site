"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { site, type ColorwayId } from "@/config/site";
import { gsap } from "@/lib/gsap";
import {
  HERO,
  HERO_SIDE_SHARE,
  IMAGE_WIDTH,
  PIECE_IDS,
  VIEW_HEIGHT,
  computePoses,
  makePoses,
  type Layout,
  type Pose,
} from "./choreography";
import { stageState } from "./store";

/**
 * Server-rendered resting pose, written as CSS variables so the hero looks
 * right before (or without) JavaScript. `x` is capped in vw so side pieces
 * never leave a narrow screen.
 */
function restingVars(id: (typeof PIECE_IDS)[number]): CSSProperties {
  const vars: Record<string, string | number> = { "--w": IMAGE_WIDTH[id] };
  (["tall", "wide"] as Layout[]).forEach((layout) => {
    const pose = HERO[layout][id];
    const k = layout === "tall" ? "t" : "w";
    const cap = HERO_SIDE_SHARE[layout] * 50;
    const x = `min(calc(var(--u) * ${Math.abs(pose.x)}), ${cap}vw)`;
    vars[`--x-${k}`] = pose.x < 0 ? `calc(${x} * -1)` : x;
    vars[`--y-${k}`] = pose.y;
    vars[`--r-${k}`] = pose.rz;
    vars[`--s-${k}`] = pose.s * (1 + pose.z * DEPTH_SCALE);
  });
  return vars as CSSProperties;
}

/** How much nearer pieces grow, and how much more they follow the pointer. */
const DEPTH_SCALE = 0.05;
/** Paint order, back to front. */
const ORDER = ["neck", "gloves", "beanie"] as const;

/**
 * The image tier of the stage: three product cutouts positioned by the same
 * choreography as the 3D scene. This is also where real product photos go.
 *
 * `active` turns the per-frame animation on. When it is off the images hold
 * their server-rendered hero pose.
 */
export function LayeredProducts({
  colorway,
  active,
}: {
  colorway: ColorwayId;
  active: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !active) return;
    const nodes = Object.fromEntries(
      PIECE_IDS.map((id) => [id, el.querySelector<HTMLElement>(`[data-piece="${id}"]`)]),
    );
    const target = makePoses();
    const current = makePoses();
    let primed = false;

    // Measure on resize only. Reading layout inside the frame loop would
    // force a reflow every frame.
    let width = el.clientWidth;
    let height = el.clientHeight;
    const ro = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    ro.observe(el);

    const tick = (time: number, deltaMs: number) => {
      if (!width || !height) return;
      const unit = height / VIEW_HEIGHT;
      computePoses(
        { hero: stageState.hero, bundle: stageState.bundle, time, aspect: width / height },
        target,
      );
      const k = primed ? 1 - Math.exp(-(deltaMs / 1000) * 9) : 1;
      primed = true;
      for (const id of PIECE_IDS) {
        const node = nodes[id];
        if (!node) continue;
        const c = current[id];
        const t = target[id];
        (Object.keys(c) as (keyof Pose)[]).forEach((key) => {
          c[key] += (t[key] - c[key]) * k;
        });
        const depth = 1 + c.z * DEPTH_SCALE;
        const px = c.x * unit + stageState.pointerX * unit * 0.07 * depth;
        const py = -c.y * unit + stageState.pointerY * unit * 0.05 * depth;
        node.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) rotate(${(-c.rz).toFixed(4)}rad) scale(${(c.s * depth).toFixed(4)})`;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
    };
  }, [active]);

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {ORDER.map((id) => {
        const piece = site.pieces.find((p) => p.id === id)!;
        return (
          <div key={id} data-piece={id} className="stage-piece" style={restingVars(id)}>
            {/* Decorative here: the copy beside it carries the meaning. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={piece.images[colorway]}
              alt=""
              width={800}
              height={800}
              decoding="async"
              draggable={false}
              className="h-full w-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] select-none"
            />
          </div>
        );
      })}
    </div>
  );
}
