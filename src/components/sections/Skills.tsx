import { Code2, Film, Megaphone, Sparkles } from "lucide-react";
import type { SkillCategory } from "@/data/skills";
import Reveal from "../animations/Reveal";
import TiltCard from "../animations/TiltCard";
import SectionHeading from "../ui/SectionHeading";
import SkillLogo from "../ui/SkillLogo";

const CATEGORY_ICON = { fullstack: Code2, creative: Film, marketing: Megaphone, ai: Sparkles } as const;

/** Distinct visual per category, drawn with CSS only (no fake brand artwork). */
function CategoryVisual({ id }: { id: SkillCategory["id"] }) {
  if (id === "creative") {
    return (
      <div aria-hidden className="absolute inset-x-6 bottom-5 hidden h-10 items-center gap-1 opacity-40 md:flex">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="h-full flex-1 rounded-sm"
            style={{ background: i % 7 === 0 ? "#ec4899" : i % 3 === 0 ? "#8b5cf6" : "#ffffff22", height: `${30 + ((i * 37) % 70)}%` }}
          />
        ))}
      </div>
    );
  }
  if (id === "fullstack") {
    return (
      <div aria-hidden className="absolute bottom-4 right-6 hidden font-mono text-xs leading-5 text-violet/40 md:block">
        {"<Experience />"}
        <br />
        {"  <Build /> <Ship />"}
        <br />
        {"</Experience>"}
      </div>
    );
  }
  if (id === "marketing") {
    return (
      <div aria-hidden className="absolute bottom-5 right-6 hidden items-end gap-2 opacity-50 md:flex">
        {[30, 55, 42, 78, 64, 96].map((h, i) => (
          <span key={i} className="w-3 rounded-t bg-gradient-to-t from-cyan/10 to-cyan" style={{ height: h * 0.6 }} />
        ))}
      </div>
    );
  }
  return (
    <div aria-hidden className="absolute -bottom-10 right-6 hidden h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl md:block" />
  );
}

export default function Skills({ categories }: { categories: SkillCategory[] }) {
  return (
    <section id="skills" className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Skills — Technology Exhibition"
            title={<>Tools I <span className="text-gradient">build</span> with.</>}
            subtitle="Hover or tap a card to explore. Four disciplines, one creative workflow."
          />
        </Reveal>

        <div className="space-y-10 md:space-y-16">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICON[cat.id];
            return (
              <Reveal key={cat.id}>
                <div className="glass relative overflow-hidden rounded-[2rem] p-6 md:p-10">
                  <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                  <CategoryVisual id={cat.id} />
                  <div className="relative">
                    <div className="mb-8 flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/5 text-violet">
                        <Icon size={24} />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-semibold md:text-3xl">{cat.label}</h3>
                        <p className="mt-1 text-muted">{cat.tagline}</p>
                      </div>
                    </div>

                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                      {cat.skills.map((skill, i) => (
                        <li key={skill.name}>
                          <TiltCard className="h-full rounded-2xl" max={14}>
                            <div
                              tabIndex={0}
                              className="group/card border-spin relative flex h-full min-h-[150px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-bg/50 p-4 text-center backdrop-blur-sm transition-colors hover:bg-bg/30 focus-visible:bg-bg/30"
                            >
                              <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
                                style={{ background: `radial-gradient(circle at 50% 30%, #${skill.color}33, transparent 70%)` }}
                              />
                              <div
                                className="float relative transition-transform duration-500 group-hover/card:scale-110 group-hover/card:[transform:translateZ(30px)]"
                                style={{ animationDelay: `${(i % 6) * 0.45}s` }}
                              >
                                <SkillLogo skill={skill} />
                              </div>
                              <span className="relative text-sm font-medium">{skill.name}</span>
                            </div>
                          </TiltCard>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
