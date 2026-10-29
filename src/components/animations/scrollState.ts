/**
 * Shared, mutable scroll state. One system (Lenis + GSAP ScrollTrigger) writes
 * to it; the 3D scene reads it every frame. No React re-renders involved.
 */
export const scrollState = {
  /** 0 → 1 across the whole page */
  progress: 0,
  /** px/frame-ish velocity, smoothed */
  velocity: 0,
};
