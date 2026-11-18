/**
 * Mutable scroll + pointer state shared between the DOM (ScrollTrigger writes
 * it) and the stage renderers (which read it every frame). Kept outside React
 * on purpose: it changes every frame and must not trigger re-renders.
 */
export const stageState = {
  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  hero: 0,
  /** 0 to 1 through the pinned bundle section. */
  bundle: 0,
  /** Pointer position, -1 to 1 from the center of the viewport. */
  pointerX: 0,
  pointerY: 0,
};
