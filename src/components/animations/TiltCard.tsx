"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  max?: number;
};

/** Pointer-driven 3D tilt with a moving glare. Disabled on touch / reduced motion. */
export default function TiltCard({ children, className = "", max = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [div:hover>&]:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.12), transparent 60%)",
        }}
      />
    </div>
  );
}
