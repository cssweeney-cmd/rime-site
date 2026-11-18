"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { site } from "@/config/site";
import { FINE_POINTER, useMediaQuery, useMotionOk, useWebgl } from "@/lib/env";
import { useColorway } from "@/components/providers/ColorwayProvider";
import { LayeredProducts } from "./LayeredProducts";
import { stageState } from "./store";

// three.js is the heaviest thing on the page, so it lives in its own chunk
// and never blocks first paint.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

const FIRST_INTERACTION = ["touchstart", "pointerdown", "keydown", "scroll"] as const;

/**
 * The product stage behind the hero and bundle sections.
 *
 * It always server-renders the layered product images. Then, when motion is
 * allowed and WebGL works, it loads the 3D scene and crossfades to it:
 * right away on desktop, after the first touch or scroll on phones.
 */
export function Stage() {
  const { colorway } = useColorway();
  const motion = useMotionOk();
  const fine = useMediaQuery(FINE_POINTER);
  const webgl = useWebgl();
  const root = useRef<HTMLDivElement>(null);
  const [interacted, setInteracted] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  const can3d = motion && webgl && site.stage.mode === "auto";
  const waitForTouch = can3d && !fine && site.stage.mobile3d && !interacted;
  const want3d = can3d && (fine || (site.stage.mobile3d && interacted));

  useEffect(() => {
    if (!waitForTouch) return;
    const go = () => setInteracted(true);
    FIRST_INTERACTION.forEach((type) =>
      window.addEventListener(type, go, { once: true, passive: true }),
    );
    return () => FIRST_INTERACTION.forEach((type) => window.removeEventListener(type, go));
  }, [waitForTouch]);

  useEffect(() => {
    if (!motion || !fine) return;
    const onMove = (e: PointerEvent) => {
      stageState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      stageState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motion, fine]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-lvh motion:sticky motion:-mb-[100lvh]"
    >
      <div className="stage-in absolute inset-0">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        >
          <LayeredProducts colorway={colorway.id} active={motion && inView && !ready} />
        </div>
        {want3d && (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          >
            <Scene
              colorway={colorway}
              active={inView}
              coarse={!fine}
              onReady={() => setReady(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
