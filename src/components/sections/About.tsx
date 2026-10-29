import { Languages } from "lucide-react";
import type { Profile } from "@/data/profile";
import Reveal from "../animations/Reveal";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../animations/TiltCard";

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="About — My Story" title={<>A developer who <span className="text-gradient">creates</span>.</>} />
        </Reveal>

        <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <p className="text-xl leading-relaxed text-ink/90 md:text-2xl md:leading-relaxed">{profile.about}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {profile.roles.map((r) => (
                <span key={r} className="rounded-full glass px-5 py-2 font-mono text-xs uppercase tracking-widest text-cyan">
                  {r}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <TiltCard className="rounded-3xl">
              <div className="glass border-spin rounded-3xl p-6">
                {profile.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    width={480}
                    height={560}
                    loading="lazy"
                    className="mb-6 aspect-[6/7] w-full rounded-2xl object-cover"
                  />
                ) : null}
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  <Languages size={16} className="text-violet" /> Languages
                </p>
                <p className="mt-3 font-display text-2xl font-semibold">{profile.languages.join(" · ")}</p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
