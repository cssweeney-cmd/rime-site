"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True when JS is running and the visitor has not asked for reduced motion. */
export function motionOk(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("motion")
  );
}

/** Hook form of `motionOk`. False on the server and during hydration. */
export function useMotionOk(): boolean {
  return useSyncExternalStore(noop, motionOk, () => false);
}

/** Subscribes to a media query. False on the server and during hydration. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
