"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { site } from "@/config/site";
import { FINE_POINTER, useMediaQuery, useMotionOk } from "@/lib/env";
import { useColorway } from "@/components/providers/ColorwayProvider";
import { LayeredProducts } from "./LayeredProducts";
import { stageState } from "./store";

// three.js is the heaviest thing on the page, so it lives in its own chunk
// and never blocks first paint.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

const FIRST_INTERACTION = [
  "touchstart",
  "pointerdown",
  "keydown",
  "scroll",
] as const;

/**
 * Catches a failed 3D start (no WebGL, lost context, blocked GPU) so the page
 * simply stays on the layered images. We deliberately do not probe for WebGL
 * up front: creating a throwaway context can block the main thread for
 * hundreds of milliseconds on slower devices.
 */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[stage] 3D is unavailable, staying on the layered images.", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The product stage behind the hero and bundle sections.
 *
 * It always server-renders the layered product images. Then, when motion is
 * allowed, it loads the 3D scene and crossfades to it once it has drawn:
 * right away on desktop, after the first touch or scroll on phones.
 */
export function Stage() {
  const { colorway } = useColorway();
  const motion = useMotionOk();
  const fine = useMediaQuery(FINE_POINTER);
  const root = useRef<HTMLDivElement>(null);
  const [interacted, setInteracted] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  const can3d = motion && site.stage.mode === "auto";
  const waitForTouch = can3d && !fine && site.stage.mobile3d && !interacted;
  const want3d = can3d && (fine || (site.stage.mobile3d && interacted));

  useEffect(() => {
    if (!waitForTouch) return;
    const go = () => setInteracted(true);
    FIRST_INTERACTION.forEach((type) =>
      window.addEventListener(type, go, { once: true, passive: true }),
    );
    return () =>
      FIRST_INTERACTION.forEach((type) => window.removeEventListener(type, go));
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
    const io = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // The outer box spans the whole hero + bundle zone; the inner one sticks to
    // the viewport inside it, so the stage scrolls away exactly when the zone ends.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    >
      <div ref={root} className="relative h-lvh motion:sticky motion:top-0">
        <div className="stage-in absolute inset-0">
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
          >
            <LayeredProducts
              colorway={colorway.id}
              active={motion && inView && !ready}
            />
          </div>
          {want3d && (
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            >
              <SceneBoundary>
                <Scene
                  colorway={colorway}
                  active={inView}
                  coarse={!fine}
                  onReady={() => setReady(true)}
                />
              </SceneBoundary>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
