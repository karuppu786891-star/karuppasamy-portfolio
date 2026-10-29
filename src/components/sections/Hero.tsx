"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Profile } from "@/data/profile";
import Magnetic from "../animations/Magnetic";

export default function Hero({ profile }: { profile: Profile }) {
  const [line1, line2] = profile.heroHeadline;
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center px-5 pb-16 pt-28 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
            {profile.name}
          </motion.p>

          <h1 className="font-display text-[clamp(2.6rem,7.5vw,6.2rem)] font-bold leading-[0.98] tracking-tight">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 50, rotateX: -35 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {line1}
            </motion.span>
            <motion.span
              className="text-gradient block"
              initial={{ opacity: 0, y: 50, rotateX: -35 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {line2}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
          >
            {profile.heroDescription}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-muted/80"
          >
            {profile.title.split("|").map((t) => t.trim()).join("  ·  ")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-violet px-7 py-3.5 font-medium text-white shadow-[0_0_40px_-8px_#8b5cf6] transition hover:bg-violet/90"
              >
                View My Work
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-medium transition hover:bg-white/10">
                Let&apos;s Collaborate
              </a>
            </Magnetic>
          </motion.div>
        </div>
        {/* right column intentionally empty: the fixed 3D workstation sits here */}
        <div aria-hidden className="hidden md:block" />
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted md:flex"
      >
        Scroll
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}
