"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LINES = [
  "const creator = {",
  "  name: 'Karuppasamy',",
  "  stack: ['Next.js', 'React', 'Node'],",
  "  create: ['Video', 'Design'],",
  "  market: ['Meta Ads', 'Social'],",
  "  explore: ['AI'],",
  "};",
  "",
  "function build(idea) {",
  "  const design = imagine(idea);",
  "  const code = develop(design);",
  "  return ship(code);",
  "}",
  "",
  "await build('something extraordinary');",
  "// deploying experience...",
];

const COLORS = ["#c4b5fd", "#22d3ee", "#f9a8d4", "#a3a6b8", "#86efac"];

/** Animated code monitor screen drawn to a canvas texture (low update rate for performance). */
export default function CodeScreen({ width = 3.2, height = 2 }: { width?: number; height?: number }) {
  const { canvas, ctx, texture } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { canvas, ctx, texture };
  }, []);

  const last = useRef(0);
  const offset = useRef(0);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (t - last.current < 1 / 20) return;
    last.current = t;
    offset.current = (offset.current + 0.6) % (LINES.length * 44);

    ctx.fillStyle = "#0b0d16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // window chrome
    ctx.fillStyle = "#151827";
    ctx.fillRect(0, 0, canvas.width, 54);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(34 + i * 32, 27, 9, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = "30px ui-monospace, Menlo, Consolas, monospace";
    ctx.textBaseline = "top";
    for (let rep = 0; rep < 2; rep++) {
      LINES.forEach((line, i) => {
        const y = 80 + i * 44 + rep * LINES.length * 44 - offset.current;
        if (y < 56 || y > canvas.height) return;
        ctx.fillStyle = "#4b4f68";
        ctx.fillText(String(i + 1).padStart(2, "0"), 24, y);
        ctx.fillStyle = COLORS[(i * 3 + (line.length % 5)) % COLORS.length];
        ctx.fillText(line, 84, y);
      });
    }

    // blinking caret
    if (Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(84, canvas.height - 60, 16, 34);
    }
    texture.needsUpdate = true;
  });

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
