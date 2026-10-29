import type { Project } from "@/data/projects";

const GRADIENTS: Record<string, string> = {
  "Web Development": "linear-gradient(135deg,#4c1d95,#1e1b4b 55%,#0e7490)",
  "Video Editing": "linear-gradient(135deg,#9d174d,#3b0764 55%,#4c1d95)",
  "AI Projects": "linear-gradient(135deg,#064e3b,#1e1b4b 55%,#0e7490)",
  "Digital Marketing": "linear-gradient(135deg,#0e7490,#1e1b4b 55%,#9d174d)",
};

/** Cover image, or a generated gradient cover when no image has been set. */
export default function ProjectCover({
  project,
  className = "",
}: {
  project: Pick<Project, "coverImage" | "title" | "category">;
  className?: string;
}) {
  return (
    <div className={`relative aspect-[16/10] w-full overflow-hidden bg-surface ${className}`}>
      {project.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center transition-transform duration-700 group-hover:scale-110"
          style={{ background: GRADIENTS[project.category] ?? GRADIENTS["Web Development"] }}
        >
          <span className="font-display text-5xl font-bold text-white/15">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
    </div>
  );
}
