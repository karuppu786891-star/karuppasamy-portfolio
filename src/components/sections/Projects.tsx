"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projectCategories, type Project } from "@/data/projects";
import SectionHeading from "../ui/SectionHeading";
import ProjectCard from "../projects/ProjectCard";
import Reveal from "../animations/Reveal";

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All Projects");

  const visible = useMemo(
    () => (filter === "All Projects" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <section id="projects" className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Selected Projects"
            title={<>Things I&apos;ve <span className="text-gradient">Built &amp; Created.</span></>}
          />
        </Reveal>

        <div role="tablist" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
          {projectCategories.map((c) => {
            const on = c === filter;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(c)}
                className={`rounded-full px-5 py-2.5 text-sm transition ${
                  on ? "bg-violet text-white shadow-[0_0_30px_-8px_#8b5cf6]" : "glass text-muted hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {visible.length === 0 && (
          <p className="glass rounded-2xl p-10 text-center text-muted">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
