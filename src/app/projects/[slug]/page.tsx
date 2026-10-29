import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getContent } from "@/lib/content";
import ProjectCover from "@/components/ui/ProjectCover";
import { GithubIcon } from "@/components/ui/SocialIcons";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getContent()).projects.find((p) => p.slug === slug);
  return project ? { title: `${project.title} — Karuppasamy C`, description: project.description } : {};
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const { projects } = await getContent();
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();
  const project = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="mesh-bg min-h-screen px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-muted transition hover:text-ink">
          <ArrowLeft size={18} /> All projects
        </Link>

        <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
          {project.category}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-6xl">{project.title}</h1>
        {project.example && (
          <p className="mt-4 inline-block rounded-full border border-pink/40 bg-pink/10 px-4 py-1 font-mono text-xs uppercase tracking-widest text-pink">
            Example entry — replace with a real project
          </p>
        )}

        <div className="glass mt-10 overflow-hidden rounded-3xl">
          <ProjectCover project={project} />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">About this project</h2>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-muted">
              {project.fullDescription || project.description}
            </p>
          </div>
          <aside>
            <h2 className="font-display text-2xl font-semibold">Technologies</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <li key={t} className="rounded-full glass px-4 py-1.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-violet px-6 py-3 font-medium text-white transition hover:bg-violet/90"
                >
                  Live Website <ExternalLink size={16} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 font-medium transition hover:bg-white/10"
                >
                  <GithubIcon size={16} /> GitHub Repository
                </a>
              )}
              {!project.liveUrl && !project.githubUrl && (
                <p className="text-sm text-muted">Links for this project have not been added yet.</p>
              )}
            </div>
          </aside>
        </div>

        {project.galleryImages.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Gallery</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.galleryImages.map((src) => (
                <li key={src} className="glass overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${project.title} screenshot`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {next && next.slug !== project.slug && (
          <Link
            href={`/projects/${next.slug}`}
            className="glass mt-16 flex items-center justify-between rounded-3xl p-6 transition hover:bg-white/10"
          >
            <span className="text-muted">Next project</span>
            <span className="font-display text-xl font-semibold">{next.title} →</span>
          </Link>
        )}
      </div>
    </main>
  );
}
