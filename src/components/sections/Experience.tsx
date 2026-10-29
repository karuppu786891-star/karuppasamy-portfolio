"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ShoppingBag, Share2 } from "lucide-react";
import type { ExperienceContent } from "@/lib/content-types";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../animations/TiltCard";

gsap.registerPlugin(ScrollTrigger);

/** Illustrated visual (CSS only) used when no real image has been provided. */
function Illustration({ kind }: { kind: "store" | "social" }) {
  if (kind === "store") {
    return (
      <div aria-hidden className="grid h-full w-full grid-cols-3 gap-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg bg-white/5 p-2">
            <div className="aspect-square rounded-md bg-gradient-to-br from-violet/50 to-cyan/30" />
            <div className="h-1.5 w-3/4 rounded bg-white/20" />
            <div className="h-1.5 w-1/3 rounded bg-violet/60" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div aria-hidden className="grid h-full w-full grid-cols-3 gap-1.5 p-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-md"
          style={{ background: `linear-gradient(${135 + i * 25}deg, ${["#22d3ee", "#8b5cf6", "#ec4899"][i % 3]}66, #11131c)` }}
        />
      ))}
    </div>
  );
}

export default function Experience({ data }: { data: ExperienceContent }) {
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!line.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: line.current!.parentElement, start: "top 70%", end: "bottom 70%", scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Experience"
          title={<><span className="text-gradient">{data.duration}</span> of hands-on work.</>}
          subtitle={data.summary}
        />

        <div className="relative pl-8 md:pl-14">
          <div className="absolute bottom-0 left-2 top-0 w-px bg-white/10 md:left-4">
            <div ref={line} className="h-full w-full bg-gradient-to-b from-violet via-cyan to-pink" />
          </div>

          <div className="mb-10">
            <span aria-hidden className="absolute -left-0.5 top-1.5 h-5 w-5 rounded-full border-4 border-bg bg-cyan shadow-[0_0_20px_#22d3ee] md:left-1.5" />
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">{data.duration}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">{data.heading}</h3>
            {data.employer && <p className="mt-1 text-muted">{data.employer}</p>}
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Two areas of work within one six-month period.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data.areas.map((area, idx) => {
              const accent = area.accent === "violet" ? "#8b5cf6" : "#22d3ee";
              const Icon = idx === 0 ? ShoppingBag : Share2;
              return (
                <TiltCard key={area.title} className="rounded-3xl">
                  <div
                    className="glass relative h-full overflow-hidden rounded-3xl p-6"
                    style={{ boxShadow: `0 0 60px -30px ${accent}` }}
                  >
                    <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-surface">
                      {area.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={area.image} alt={area.title} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <Illustration kind={idx === 0 ? "store" : "social"} />
                      )}
                    </div>
                    <h4 className="flex items-center gap-3 font-display text-xl font-semibold">
                      <Icon size={20} style={{ color: accent }} />
                      {area.title}
                    </h4>
                    <ul className="mt-4 space-y-2.5">
                      {area.points.map((p) => (
                        <li key={p} className="flex gap-3 text-muted">
                          <Check size={16} className="mt-1 shrink-0" style={{ color: accent }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
