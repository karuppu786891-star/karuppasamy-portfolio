"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import CodeScreen from "./CodeScreen";
import { scrollState } from "../animations/scrollState";

/* Colour mood per page region: hero → skills → projects → experience → contact */
const MOODS = [
  { a: new THREE.Color("#8b5cf6"), b: new THREE.Color("#22d3ee") },
  { a: new THREE.Color("#ec4899"), b: new THREE.Color("#8b5cf6") },
  { a: new THREE.Color("#22d3ee"), b: new THREE.Color("#8b5cf6") },
  { a: new THREE.Color("#8b5cf6"), b: new THREE.Color("#ec4899") },
  { a: new THREE.Color("#22d3ee"), b: new THREE.Color("#ec4899") },
];

function Workstation({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = scrollState.progress;
    // workstation drifts away and tilts as the visitor scrolls
    const targetY = -p * 6;
    const targetRot = p * Math.PI * 1.4;
    g.position.y += (targetY - g.position.y) * Math.min(1, dt * 4);
    g.rotation.y += (targetRot * 0.5 - g.rotation.y) * Math.min(1, dt * 3);
    const s = Math.max(0.55, 1 - p * 0.8);
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * Math.min(1, dt * 3));
  });

  return (
    <group ref={group} position={mobile ? [0, 0.1, 0] : [1.55, 0, 0]} scale={mobile ? 0.62 : 1}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        {/* monitor body */}
        <RoundedBox args={[3.5, 2.3, 0.14]} radius={0.07} smoothness={4} position={[0, 0.9, 0]}>
          <meshStandardMaterial color="#10121c" metalness={0.8} roughness={0.25} />
        </RoundedBox>
        <group position={[0, 0.9, 0.08]}>
          <CodeScreen />
        </group>
        {/* stand */}
        <mesh position={[0, -0.45, -0.05]}>
          <cylinderGeometry args={[0.09, 0.12, 0.7, 24]} />
          <meshStandardMaterial color="#1a1d2b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* desk */}
        <RoundedBox args={[4.6, 0.12, 2]} radius={0.05} smoothness={4} position={[0, -0.85, 0.6]}>
          <meshStandardMaterial color="#141725" metalness={0.7} roughness={0.35} />
        </RoundedBox>
        {/* glowing desk edge */}
        <mesh position={[0, -0.78, 1.6]}>
          <boxGeometry args={[4.6, 0.02, 0.02]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
        {/* keyboard */}
        <RoundedBox args={[1.9, 0.06, 0.6]} radius={0.03} smoothness={3} position={[-0.3, -0.76, 0.9]}>
          <meshStandardMaterial color="#1d2133" metalness={0.5} roughness={0.5} emissive="#8b5cf6" emissiveIntensity={0.25} />
        </RoundedBox>
      </Float>
    </group>
  );
}

function FloatingShapes({ mobile }: { mobile: boolean }) {
  const shapes = useMemo(
    () => [
      { pos: [-3.4, 1.6, -1], geo: "ico", color: "#8b5cf6", s: 0.55 },
      { pos: [-2.2, -1.4, 0.5], geo: "torus", color: "#22d3ee", s: 0.45 },
      { pos: [3.9, 2, -1.5], geo: "oct", color: "#ec4899", s: 0.4 },
      { pos: [0.4, 2.7, -2], geo: "ico", color: "#22d3ee", s: 0.3 },
      { pos: [4, -1.6, -0.5], geo: "torus", color: "#8b5cf6", s: 0.35 },
      { pos: [-4.4, 0, -2], geo: "oct", color: "#8b5cf6", s: 0.35 },
    ],
    [],
  );
  const list = mobile ? shapes.slice(0, 3) : shapes;

  return (
    <>
      {list.map((s, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={s.pos as [number, number, number]} scale={s.s}>
            {s.geo === "ico" && <icosahedronGeometry args={[1, 0]} />}
            {s.geo === "torus" && <torusGeometry args={[1, 0.34, 16, 48]} />}
            {s.geo === "oct" && <octahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial
              color={s.color}
              metalness={0.9}
              roughness={0.18}
              emissive={s.color}
              emissiveIntensity={0.18}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.02;
      ref.current.position.y = scrollState.progress * 4;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#c4b5fd" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Camera follows the pointer and shifts with scroll; lights change mood per section. */
function Rig() {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);
  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const p = scrollState.progress;
    const cam = state.camera;
    const tx = state.pointer.x * 0.6;
    const ty = state.pointer.y * 0.35 + 0.3 - p * 1.2;
    const tz = 7 + p * 2.5;
    cam.position.x += (tx - cam.position.x) * Math.min(1, dt * 2.5);
    cam.position.y += (ty - cam.position.y) * Math.min(1, dt * 2.5);
    cam.position.z += (tz - cam.position.z) * Math.min(1, dt * 2.5);
    cam.lookAt(0, -p * 1.5, 0);

    // interpolate lighting mood between sections
    const f = p * (MOODS.length - 1);
    const i = Math.min(MOODS.length - 2, Math.floor(f));
    const k = f - i;
    tmpA.copy(MOODS[i].a).lerp(MOODS[i + 1].a, k);
    tmpB.copy(MOODS[i].b).lerp(MOODS[i + 1].b, k);
    l1.current?.color.lerp(tmpA, Math.min(1, dt * 3));
    l2.current?.color.lerp(tmpB, Math.min(1, dt * 3));
  });

  return (
    <>
      <pointLight ref={l1} position={[-4, 3, 4]} intensity={90} distance={24} color="#8b5cf6" />
      <pointLight ref={l2} position={[5, -2, 3]} intensity={70} distance={24} color="#22d3ee" />
    </>
  );
}

export default function Scene() {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      dpr={mobile ? [1, 1.4] : [1, 2]}
      camera={{ position: [0, 0.3, 7], fov: 42 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.35} />
      <Rig />
      <Suspense fallback={null}>
        <Workstation mobile={mobile} />
        <FloatingShapes mobile={mobile} />
        <Particles count={mobile ? 250 : 700} />
      </Suspense>
    </Canvas>
  );
}
