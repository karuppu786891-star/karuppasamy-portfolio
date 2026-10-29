import { Code2, Film, Megaphone, Sparkles } from "lucide-react";
import { capabilities } from "@/data/experience";
import Reveal from "../animations/Reveal";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../animations/TiltCard";

const ICONS = { develop: Code2, create: Film, market: Megaphone, innovate: Sparkles } as const;

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="Creative Capabilities" title={<>Develop. Create. Market. <span className="text-gradient">Innovate.</span></>} />
        </Reveal>
        <Reveal stagger={0.12} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => {
            const Icon = ICONS[c.id as keyof typeof ICONS];
            return (
              <TiltCard key={c.id} className="rounded-3xl" max={12}>
                <div className="glass relative h-full min-h-[260px] overflow-hidden rounded-3xl p-7">
                  <div aria-hidden className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full blur-3xl" style={{ background: `${c.accent}55` }} />
                  <Icon size={32} style={{ color: c.accent }} />
                  <h3 className="mt-16 font-display text-3xl font-bold">{c.label}</h3>
                  <p className="mt-3 text-muted">{c.text}</p>
                </div>
              </TiltCard>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
