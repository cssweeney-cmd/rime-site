"use client";

import { Component, Suspense, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Colorway } from "@/config/site";

/**
 * Procedural stand-ins for the three products. They are deliberately simple:
 * swap any of them for a real model by setting `model` on the piece in
 * src/config/site.ts.
 */

type Palette = Colorway["palette"];

/* ------------------------------------------------------------------ */
/* Knit texture + materials                                            */
/* ------------------------------------------------------------------ */

function makeKnitCanvas(): HTMLCanvasElement {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  // Two ribs per tile: bright ridge, dark groove.
  const ribs = 2;
  const w = size / ribs;
  for (let i = 0; i < ribs; i++) {
    const g = ctx.createLinearGradient(i * w, 0, (i + 1) * w, 0);
    g.addColorStop(0, "#5c5c5c");
    g.addColorStop(0.22, "#d8d8d8");
    g.addColorStop(0.5, "#ffffff");
    g.addColorStop(0.78, "#d8d8d8");
    g.addColorStop(1, "#5c5c5c");
    ctx.fillStyle = g;
    ctx.fillRect(i * w, 0, w, size);
  }
  // Stitch chevrons along each rib.
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const rows = 8;
  const rh = size / rows;
  for (let i = 0; i < ribs; i++) {
    const cx = i * w + w / 2;
    for (let r = 0; r <= rows; r++) {
      const y = r * rh;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, y - rh * 0.5);
      ctx.lineTo(cx, y);
      ctx.lineTo(cx + w * 0.3, y - rh * 0.5);
      ctx.stroke();
    }
  }
  return canvas;
}

export type Materials = {
  knit: (repeatX: number, repeatY: number) => THREE.MeshPhysicalMaterial;
  fleece: THREE.MeshPhysicalMaterial;
  pad: THREE.MeshStandardMaterial;
  dark: THREE.MeshBasicMaterial;
  /** Eases every material toward a new palette. Call once per frame. */
  update: (palette: Palette, delta: number) => void;
  dispose: () => void;
};

export function createMaterials(palette: Palette): Materials {
  const canvas = makeKnitCanvas();
  const knits: THREE.MeshPhysicalMaterial[] = [];
  const textures: THREE.Texture[] = [];

  const texture = (repeatX: number, repeatY: number, srgb: boolean) => {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
    t.anisotropy = 4;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  };

  const knit = (repeatX: number, repeatY: number) => {
    const m = new THREE.MeshPhysicalMaterial({
      color: palette.base,
      map: texture(repeatX, repeatY, true),
      bumpMap: texture(repeatX, repeatY, false),
      bumpScale: 1.4,
      roughness: 0.92,
      metalness: 0,
      sheen: 1,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color(palette.light),
    });
    knits.push(m);
    return m;
  };

  const fleece = new THREE.MeshPhysicalMaterial({
    color: palette.lining,
    roughness: 1,
    sheen: 1,
    sheenRoughness: 0.9,
    sheenColor: new THREE.Color("#ffffff"),
    side: THREE.DoubleSide,
  });
  const pad = new THREE.MeshStandardMaterial({ color: palette.pad, roughness: 0.55 });
  const dark = new THREE.MeshBasicMaterial({ color: "#05070a" });

  const target = new THREE.Color();
  const update = (p: Palette, delta: number) => {
    const k = 1 - Math.exp(-delta * 6);
    for (const m of knits) {
      m.color.lerp(target.set(p.base), k);
      m.sheenColor.lerp(target.set(p.light), k);
    }
    fleece.color.lerp(target.set(p.lining), k);
    pad.color.lerp(target.set(p.pad), k);
  };

  const dispose = () => {
    [...knits, fleece, pad, dark].forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  };

  return { knit, fleece, pad, dark, update, dispose };
}

/* ------------------------------------------------------------------ */
/* Beanie                                                              */
/* ------------------------------------------------------------------ */

export function Beanie({ materials }: { materials: Materials }) {
  const { dome, cuff, domeMat, cuffMat } = useMemo(() => {
    const domePts: THREE.Vector2[] = [];
    const R = 0.86;
    const H = 1.02;
    for (let i = 0; i <= 28; i++) {
      const a = ((1 - i / 28) * Math.PI) / 2; // bottom (wide) to top (closed)
      domePts.push(
        new THREE.Vector2(
          Math.max(0.001, R * Math.pow(Math.sin(a), 0.8)),
          H * Math.pow(Math.cos(a), 0.86),
        ),
      );
    }
    const cuffPts = [
      [0.8, -0.5],
      [0.9, -0.49],
      [0.945, -0.42],
      [0.955, -0.25],
      [0.95, -0.08],
      [0.92, 0.0],
      [0.86, 0.03],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return {
      dome: new THREE.LatheGeometry(domePts, 56),
      cuff: new THREE.LatheGeometry(cuffPts, 56),
      domeMat: materials.knit(30, 4),
      cuffMat: materials.knit(30, 2),
    };
  }, [materials]);

  return (
    <group position={[0, -0.26, 0]} scale={0.92}>
      <mesh geometry={dome} material={domeMat} />
      <mesh geometry={cuff} material={cuffMat} />
      {/* Closes the opening so you never see through the hat. */}
      <mesh position={[0, -0.47, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.dark}>
        <circleGeometry args={[0.82, 40]} />
      </mesh>
      {/* Woven label on the cuff. */}
      <mesh position={[0, -0.25, 0.945]} material={materials.pad}>
        <boxGeometry args={[0.36, 0.18, 0.04]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Neck warmer                                                         */
/* ------------------------------------------------------------------ */

export function NeckWarmer({ materials }: { materials: Materials }) {
  const { outer, inner, outerMat } = useMemo(() => {
    const outerPts = [
      [0.6, -0.5],
      [0.655, -0.47],
      [0.675, -0.3],
      [0.66, 0.0],
      [0.67, 0.3],
      [0.655, 0.46],
      [0.61, 0.5],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const innerPts = [
      [0.61, 0.5],
      [0.585, 0.44],
      [0.575, 0.0],
      [0.585, -0.44],
      [0.6, -0.5],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return {
      outer: new THREE.LatheGeometry(outerPts, 56),
      inner: new THREE.LatheGeometry(innerPts, 56),
      outerMat: materials.knit(26, 3),
    };
  }, [materials]);

  return (
    <group scale={[1.08, 1, 0.94]}>
      <mesh geometry={outer} material={outerMat} />
      <mesh geometry={inner} material={materials.fleece} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Gloves                                                              */
/* ------------------------------------------------------------------ */

const FINGERS = [
  { x: -0.225, length: 0.36, pad: true },
  { x: -0.075, length: 0.44, pad: false },
  { x: 0.075, length: 0.4, pad: false },
  { x: 0.225, length: 0.28, pad: false },
];
const FINGER_R = 0.07;
const PALM_TOP = 0.27;

function Hand({ materials, mirror }: { materials: Materials; mirror: boolean }) {
  const { body, cuffMat } = useMemo(
    () => ({ body: materials.knit(6, 6), cuffMat: materials.knit(10, 2) }),
    [materials],
  );
  return (
    <group scale={[mirror ? -0.92 : 0.92, 0.92, 0.92]} position={[0, -0.1, 0]}>
      <RoundedBox args={[0.62, 0.62, 0.2]} radius={0.095} smoothness={4} material={body} />
      {FINGERS.map((f) => (
        <group key={f.x} position={[f.x, PALM_TOP + f.length / 2, 0]}>
          <mesh material={body} scale={[1, 1, 0.92]}>
            <capsuleGeometry args={[FINGER_R, f.length, 6, 14]} />
          </mesh>
          {f.pad && (
            <mesh position={[0, f.length / 2 - 0.01, 0]} scale={[1, 1, 0.92]} material={materials.pad}>
              <sphereGeometry args={[FINGER_R + 0.006, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
            </mesh>
          )}
        </group>
      ))}
      {/* Thumb */}
      <group position={[-0.37, -0.02, 0.01]} rotation={[0, 0, 0.62]}>
        <mesh material={body} scale={[1, 1, 0.92]}>
          <capsuleGeometry args={[0.08, 0.26, 6, 14]} />
        </mesh>
        <mesh position={[0, 0.12, 0]} scale={[1, 1, 0.92]} material={materials.pad}>
          <sphereGeometry args={[0.086, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        </mesh>
      </group>
      {/* Ribbed cuff */}
      <mesh position={[0, -0.47, 0]} scale={[1, 1, 0.4]} material={cuffMat}>
        <cylinderGeometry args={[0.27, 0.3, 0.36, 28, 1]} />
      </mesh>
    </group>
  );
}

/** A pair of gloves. `spreadRef.current` (0 to 1) moves the hands apart. */
export function Gloves({
  materials,
  spreadRef,
}: {
  materials: Materials;
  spreadRef: { current: number };
}) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  useFrame(() => {
    const s = spreadRef.current;
    const x = 0.36 + s * 0.62;
    const tilt = 0.2 - s * 0.08;
    if (left.current) {
      left.current.position.x = -x;
      left.current.rotation.z = tilt;
    }
    if (right.current) {
      right.current.position.x = x;
      right.current.rotation.z = -tilt;
    }
  });
  return (
    <group>
      <group ref={left}>
        <Hand materials={materials} mirror />
      </group>
      <group ref={right}>
        <Hand materials={materials} mirror={false} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Drop-in .glb models                                                 */
/* ------------------------------------------------------------------ */

function GlbModel({ url, size }: { url: string; size: number }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => scene.clone(true), [scene]);
  // Center the model and scale it so its largest side matches `size`.
  useLayoutEffect(() => {
    object.position.set(0, 0, 0);
    object.scale.setScalar(1);
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const k = size / Math.max(dims.x, dims.y, dims.z, 0.0001);
    object.scale.setScalar(k);
    object.position.copy(center).multiplyScalar(-k);
  }, [object, size]);
  return <primitive object={object} />;
}

class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[stage] Could not load a .glb model, using the placeholder instead.", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Renders `model` when the config provides one, and the procedural
 * placeholder otherwise (also while the model loads, or if it fails).
 */
export function PieceModel({
  model,
  size,
  children,
}: {
  model: string | null;
  size: number;
  children: ReactNode;
}) {
  if (!model) return <>{children}</>;
  return (
    <ModelBoundary fallback={children}>
      <Suspense fallback={children}>
        <GlbModel url={model} size={size} />
      </Suspense>
    </ModelBoundary>
  );
}
