"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { NeutralToneMapping } from "three";
import type * as THREE from "three";
import { site, type Colorway, type PieceId } from "@/config/site";
import {
  CAMERA_FOV,
  CAMERA_Z,
  PIECE_IDS,
  computePoses,
  makePoses,
  type Pose,
} from "./choreography";
import { Beanie, Gloves, NeckWarmer, PieceModel, createMaterials } from "./pieces";
import { stageState } from "./store";

const modelFor = (id: PieceId) => site.pieces.find((p) => p.id === id)?.model ?? null;
const POSE_KEYS: (keyof Pose)[] = ["x", "y", "z", "rx", "ry", "rz", "s", "spread"];

function Rig({ colorway, onReady }: { colorway: Colorway; onReady: () => void }) {
  const [materials] = useState(() => createMaterials(colorway.palette));
  useEffect(() => () => materials.dispose(), [materials]);

  const beanie = useRef<THREE.Group>(null);
  const neck = useRef<THREE.Group>(null);
  const gloves = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const spread = useRef(0);
  const poses = useRef({ target: makePoses(), current: makePoses(), frames: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const { target, current } = poses.current;
    computePoses(
      {
        hero: stageState.hero,
        bundle: stageState.bundle,
        time: state.clock.elapsedTime,
        aspect: state.size.width / state.size.height,
      },
      target,
    );

    const k = poses.current.frames === 0 ? 1 : 1 - Math.exp(-dt * 9);
    const groups = { beanie: beanie.current, neck: neck.current, gloves: gloves.current };
    for (const id of PIECE_IDS) {
      const c = current[id];
      const t = target[id];
      for (const key of POSE_KEYS) c[key] += (t[key] - c[key]) * k;
      const group = groups[id];
      if (!group) continue;
      group.position.set(c.x, c.y, c.z);
      group.rotation.set(c.rx, c.ry, c.rz);
      group.scale.setScalar(c.s);
    }
    spread.current = current.gloves.spread;

    if (parallax.current) {
      const pk = 1 - Math.exp(-dt * 4);
      parallax.current.rotation.y += (stageState.pointerX * 0.14 - parallax.current.rotation.y) * pk;
      parallax.current.rotation.x += (stageState.pointerY * 0.08 - parallax.current.rotation.x) * pk;
    }

    materials.update(colorway.palette, dt);

    // Tell the page we have real pixels on screen (shaders compiled, first frames drawn).
    poses.current.frames += 1;
    if (poses.current.frames === 3) onReady();
  });

  return (
    <group ref={parallax}>
      <group ref={beanie}>
        <PieceModel model={modelFor("beanie")} size={1.8}>
          <Beanie materials={materials} />
        </PieceModel>
      </group>
      <group ref={neck}>
        <PieceModel model={modelFor("neck")} size={1.45}>
          <NeckWarmer materials={materials} />
        </PieceModel>
      </group>
      <group ref={gloves}>
        <PieceModel model={modelFor("gloves")} size={1.9}>
          <Gloves materials={materials} spreadRef={spread} />
        </PieceModel>
      </group>
    </group>
  );
}

export type SceneProps = {
  colorway: Colorway;
  /** Render frames only while the stage is on screen. */
  active: boolean;
  /** Phones and tablets get a lower pixel-ratio cap. */
  coarse: boolean;
  onReady: () => void;
};

export default function Scene({ colorway, active, coarse, onReady }: SceneProps) {
  return (
    <Canvas
      dpr={[1, coarse ? 1.5 : 2]}
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // Neutral tone mapping keeps product colors true to the swatches.
        toneMapping: NeutralToneMapping,
      }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={1.05} color="#c9d6ea" />
      {/* Cold key from the upper left. */}
      <directionalLight position={[-4, 6, 6]} intensity={3.1} color="#f2f6ff" />
      {/* Accent rim from behind, the one warm note in the scene. */}
      <directionalLight position={[5, 1.5, -3.5]} intensity={3.4} color={site.theme.colors.accent} />
      {/* Soft blue fill from below. */}
      <directionalLight position={[2, -4, 4]} intensity={0.55} color="#6f9fd8" />
      <Rig colorway={colorway} onReady={onReady} />
    </Canvas>
  );
}
