"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "./scrollState";

gsap.registerPlugin(ScrollTrigger);

/**
 * Single scroll system: Lenis drives the scroll position, GSAP's ticker drives
 * Lenis, and ScrollTrigger listens to Lenis. Skipped entirely when the visitor
 * prefers reduced motion (native scrolling is used instead).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateProgress = (scroll: number, limit: number, velocity = 0) => {
      scrollState.progress = limit > 0 ? scroll / limit : 0;
      scrollState.velocity = velocity;
    };

    if (reduce) {
      const onScroll = () =>
        updateProgress(window.scrollY, document.documentElement.scrollHeight - window.innerHeight);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", (l: Lenis) => {
      ScrollTrigger.update();
      updateProgress(l.scroll, l.limit, l.velocity);
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
