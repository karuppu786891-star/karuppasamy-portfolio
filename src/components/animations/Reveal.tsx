"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  /** seconds delay */
  delay?: number;
  /** animate each direct child with a stagger instead of the wrapper */
  stagger?: number;
  y?: number;
};

/** Scroll-triggered reveal with depth (translate + rotateX + fade). */
export default function Reveal({ children, className, delay = 0, stagger, y = 48 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger ? Array.from(el.children) : el;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y, rotateX: -12, transformPerspective: 900, transformOrigin: "50% 100%" },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          delay,
          stagger: stagger ?? 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
