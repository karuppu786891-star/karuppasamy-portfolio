import { GraduationCap } from "lucide-react";
import type { EducationContent } from "@/lib/content-types";
import Reveal from "../animations/Reveal";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../animations/TiltCard";

export default function Education({ data }: { data: EducationContent }) {
  return (
    <section id="education" className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading eyebrow="Education — Academic Journey" title={<>Where it <span className="text-gradient">started</span>.</>} />
        </Reveal>
        <Reveal>
          <TiltCard className="rounded-[2rem]" max={5}>
            <div className="glass border-spin relative overflow-hidden rounded-[2rem] p-8 md:p-12">
              <div aria-hidden className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-violet/25 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-violet to-cyan text-white shadow-[0_0_50px_-10px_#8b5cf6]">
                  <GraduationCap size={38} />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold md:text-3xl">{data.degree}</h3>
                  <p className="mt-2 text-lg text-muted">{data.institution}</p>
                  {data.extra.length > 0 && (
                    <ul className="mt-4 list-inside list-disc space-y-1 text-muted">
                      {data.extra.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
