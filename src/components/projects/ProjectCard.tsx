import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import TiltCard from "../animations/TiltCard";
import ProjectCover from "../ui/ProjectCover";
import { GithubIcon } from "../ui/SocialIcons";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full rounded-3xl" max={8}>
      <article className="group glass border-spin relative flex h-full flex-col overflow-hidden rounded-3xl">
        <Link href={`/projects/${project.slug}`} className="block" aria-label={`View details: ${project.title}`}>
          <ProjectCover project={project} />
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest">
            <span className="text-cyan">{project.category}</span>
            <span className="text-muted">{project.year}</span>
          </div>

          <h3 className="font-display text-2xl font-semibold leading-tight">
            <Link href={`/projects/${project.slug}`} className="hover:text-violet">
              {project.title}
            </Link>
          </h3>
          {project.example && (
            <p className="mt-2 inline-block w-fit rounded-full border border-pink/40 bg-pink/10 px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-pink">
              Example entry — edit me
            </p>
          )}
          <p className="mt-3 text-muted">{project.description}</p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-ink/80 transition hover:bg-violet/20 hover:text-violet">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-violet px-4 py-2 text-sm font-medium text-white transition hover:bg-violet/90"
            >
              View Details <ArrowUpRight size={15} />
            </Link>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-sm transition hover:bg-white/10"
              >
                Live Demo <ExternalLink size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-sm transition hover:bg-white/10"
              >
                <GithubIcon size={14} /> GitHub
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
