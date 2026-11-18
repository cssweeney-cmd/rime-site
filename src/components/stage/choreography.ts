import type { PieceId } from "@/config/site";

/**
 * One source of truth for where each piece is at any scroll position.
 * Both renderers read it: the real-time 3D scene and the layered image
 * fallback. Units are 3D world units; the camera sees VIEW_HEIGHT of them.
 */

export const CAMERA_FOV = 35;
export const CAMERA_Z = 8;
export const VIEW_HEIGHT = 2 * CAMERA_Z * Math.tan((CAMERA_FOV * Math.PI) / 360);

export const PIECE_IDS: PieceId[] = ["beanie", "neck", "gloves"];

export type Layout = "wide" | "tall";
export const layoutFor = (aspect: number): Layout => (aspect < 0.9 ? "tall" : "wide");

export type Pose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  /** Uniform scale. */
  s: number;
  /** Gloves only: 0 = hands together, 1 = hands apart. */
  spread: number;
};

export type Poses = Record<PieceId, Pose>;

const P = (
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  s: number,
  spread = 0,
): Pose => ({ x, y, z, rx, ry, rz, s, spread });

export const makePoses = (): Poses => ({
  beanie: P(0, 0, 0, 0, 0, 0, 1),
  neck: P(0, 0, 0, 0, 0, 0, 1),
  gloves: P(0, 0, 0, 0, 0, 0, 1),
});

/** Width of each layered image, in stage units, at scale 1. */
export const IMAGE_WIDTH: Record<PieceId, number> = {
  beanie: 2.75,
  neck: 2.8,
  gloves: 2.5,
};

/** Hero: a loose floating cluster around the wordmark. */
export const HERO: Record<Layout, Poses> = {
  wide: {
    beanie: P(0, 0.12, 0.8, 0.16, -0.38, 0.1, 1.22),
    neck: P(-2.55, -0.62, -0.5, 0.42, 0.45, 0.24, 0.98),
    gloves: P(2.5, -0.5, 0, 0.1, -0.32, -0.18, 0.98, 0.25),
  },
  tall: {
    beanie: P(0, 0.72, 0.6, 0.16, -0.3, 0.08, 0.8),
    neck: P(-0.6, -0.42, -0.4, 0.42, 0.4, 0.2, 0.56),
    gloves: P(0.62, -0.4, 0, 0.1, -0.3, -0.16, 0.56, 0.2),
  },
};

/** How far the hero side pieces may sit from center, as a share of half the view width. */
export const HERO_SIDE_SHARE = { wide: 0.57, tall: 0.54 } as const;

/**
 * Bundle: the assembled set, stacked like an invisible wearer
 * (beanie on top, neck warmer under it, gloves below).
 */
const ASSEMBLY: Record<Layout, { y: number; scale: number }> = {
  wide: { y: 0, scale: 0.8 },
  tall: { y: 1.02, scale: 0.44 },
};
const SLOT: Poses = {
  beanie: P(0, 1.32, 0, 0.12, 0, 0, 1),
  neck: P(0, 0.0, 0, 0.3, 0, 0, 1),
  gloves: P(0, -1.42, 0.3, 0.05, 0, 0, 1, 1),
};

/** Scroll progress windows inside the pinned bundle section. */
export const BEATS = {
  /** Panel switch points: beanie, neck warmer, gloves, the full set. */
  panels: [0, 0.2, 0.47, 0.76] as const,
  neckIn: [0.2, 0.42] as const,
  glovesIn: [0.47, 0.69] as const,
  finale: [0.76, 0.94] as const,
};

export const panelAt = (p: number) => {
  let index = 0;
  for (let i = 0; i < BEATS.panels.length; i++) if (p >= BEATS.panels[i]) index = i;
  return index;
};

const TAU = Math.PI * 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function mix(out: Pose, a: Pose, b: Pose, t: number) {
  out.x = a.x + (b.x - a.x) * t;
  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
  out.rx = a.rx + (b.rx - a.rx) * t;
  out.ry = a.ry + (b.ry - a.ry) * t;
  out.rz = a.rz + (b.rz - a.rz) * t;
  out.s = a.s + (b.s - a.s) * t;
  out.spread = a.spread + (b.spread - a.spread) * t;
}

const scratch = { hero: makePoses(), slot: makePoses(), a: P(0, 0, 0, 0, 0, 0, 1) };

export type StageInput = {
  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  hero: number;
  /** 0 to 1 through the pinned bundle section. */
  bundle: number;
  /** Seconds, for the idle float. Pass 0 for a still frame. */
  time: number;
  /** Viewport width / height. */
  aspect: number;
};

/** Resting hero pose for a given aspect (also used for server rendering). */
export function heroPoses(aspect: number, out: Poses = makePoses()): Poses {
  const layout = layoutFor(aspect);
  const base = HERO[layout];
  const halfW = (VIEW_HEIGHT * aspect) / 2;
  // On roomy portrait screens (tablets) the tall cluster can grow.
  const k = layout === "tall" ? Math.min(1.45, Math.max(1, halfW / 1.17)) : 1;
  const maxSide = halfW * HERO_SIDE_SHARE[layout];
  for (const id of PIECE_IDS) {
    const b = base[id];
    mix(out[id], b, b, 0);
    out[id].x = Math.sign(b.x) * Math.min(Math.abs(b.x) * k, maxSide);
    out[id].s = b.s * k;
  }
  return out;
}

function slotPoses(aspect: number, out: Poses): Poses {
  const layout = layoutFor(aspect);
  const halfW = (VIEW_HEIGHT * aspect) / 2;
  const { y, scale } = ASSEMBLY[layout];
  const k = layout === "tall" ? Math.min(1.5, Math.max(1, halfW / 1.17)) : 1;
  const gs = scale * k;
  const gx = layout === "wide" ? halfW * 0.5 : 0;
  for (const id of PIECE_IDS) {
    const b = SLOT[id];
    mix(out[id], b, b, 0);
    out[id].x = gx + b.x * gs;
    out[id].y = y + b.y * gs;
    out[id].s = gs;
  }
  return out;
}

/**
 * Fills `out` with the pose of every piece for the given scroll state.
 *
 * Story: the beanie travels straight from the hero into its slot while the
 * hero scrolls away. The neck warmer and gloves fly off, then return one at a
 * time during the pinned section. The finale gives the full set a slow turn.
 */
export function computePoses(input: StageInput, out: Poses): Poses {
  const { hero: h, bundle: p, time: t, aspect } = input;
  const layout = layoutFor(aspect);
  const halfW = (VIEW_HEIGHT * aspect) / 2;
  const halfH = VIEW_HEIGHT / 2;
  const hero = heroPoses(aspect, scratch.hero);
  const slot = slotPoses(aspect, scratch.slot);
  const a = scratch.a;
  const inBundle = h >= 1;

  // Beanie: hero to slot, with one full turn on the way.
  const eb = easeInOut(h);
  mix(out.beanie, hero.beanie, slot.beanie, eb);
  out.beanie.ry += eb * TAU;

  // Neck warmer.
  let en = 0;
  if (!inBundle) {
    mix(a, hero.neck, hero.neck, 0);
    a.x = -(halfW + 2.2);
    a.y = hero.neck.y + 1.4;
    mix(out.neck, hero.neck, a, easeIn(h));
    out.neck.rz += h * 0.8;
    out.neck.ry += h * 1.5;
  } else {
    en = easeOut(range(p, BEATS.neckIn[0], BEATS.neckIn[1]));
    mix(a, slot.neck, slot.neck, 0);
    if (layout === "wide") {
      a.x = slot.neck.x - 0.8;
      a.y = -(halfH + 1.6);
    } else {
      a.x = -(halfW + 1.2);
      a.y = slot.neck.y + 0.3;
    }
    a.z = 1.2;
    mix(out.neck, a, slot.neck, en);
    out.neck.ry += (1 - en) * 3.2;
    out.neck.rz += (1 - en) * 0.7;
    out.neck.s *= 1 + (1 - en) * 0.25;
  }

  // Gloves.
  let eg = 0;
  if (!inBundle) {
    mix(a, hero.gloves, hero.gloves, 0);
    a.x = halfW + 2.2;
    a.y = hero.gloves.y + 1.2;
    mix(out.gloves, hero.gloves, a, easeIn(h));
    out.gloves.rz -= h * 0.8;
    out.gloves.ry -= h * 1.5;
  } else {
    eg = easeOut(range(p, BEATS.glovesIn[0], BEATS.glovesIn[1]));
    mix(a, slot.gloves, slot.gloves, 0);
    a.x = halfW + 1.8;
    a.y = slot.gloves.y + (layout === "wide" ? -0.6 : 0.5);
    a.z = 1.2;
    a.spread = 0.2;
    mix(out.gloves, a, slot.gloves, eg);
    out.gloves.ry -= (1 - eg) * 3.2;
    out.gloves.rz -= (1 - eg) * 0.7;
    out.gloves.s *= 1 + (1 - eg) * 0.25;
  }

  // Finale: the set breathes in and takes a slow turn.
  const f = inBundle ? easeInOut(range(p, BEATS.finale[0], BEATS.finale[1])) : 0;
  const settle = [eb, en, eg];
  PIECE_IDS.forEach((id, i) => {
    const pose = out[id];
    const amp = 0.075 * (1 - 0.55 * settle[i]);
    pose.y += Math.sin(t * 0.9 + i * 2.1) * amp;
    pose.rz += Math.sin(t * 0.7 + i * 1.7) * 0.028;
    pose.rx += Math.cos(t * 0.6 + i * 1.3) * 0.03;
    pose.ry += Math.sin(t * 0.45 + i * 0.4) * (0.1 + 0.2 * f);
    pose.s *= 1 + 0.05 * f;
  });

  return out;
}
