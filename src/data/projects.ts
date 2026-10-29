/**
 * PROJECTS DATA — add, edit or remove your real projects here.
 *
 * HOW TO ADD A PROJECT
 *  1. Copy one entry below and paste it at the end of the array.
 *  2. Give it a unique `id` and `slug` (lowercase, dashes, no spaces).
 *  3. Put images in /public/projects/ and reference them like "/projects/my-app.jpg".
 *  4. Fill `liveUrl` / `githubUrl` with the REAL links. Leave "" if you have none —
 *     the matching button is hidden automatically. Never paste fake links.
 *  5. Delete the entries marked `example: true` once you add your own.
 */

export type ProjectCategory =
  | "Web Development"
  | "Video Editing"
  | "AI Projects"
  | "Digital Marketing";

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  fullDescription: string;
  technologies: string[];
  coverImage: string; // "" shows a generated gradient cover
  galleryImages: string[];
  liveUrl: string;
  githubUrl: string;
  year?: number;
  featured: boolean;
  /** Marks a placeholder so it is clearly labelled on the site. Remove when real. */
  example?: boolean;
};

export const projectCategories: ("All Projects" | ProjectCategory)[] = [
  "All Projects",
  "Web Development",
  "Video Editing",
  "AI Projects",
  "Digital Marketing",
];

export const projects: Project[] = [
  {
    id: "example-web",
    title: "Your Web Project Title",
    slug: "example-web-project",
    category: "Web Development",
    description: "Example entry — replace with a short summary of a real web project.",
    fullDescription:
      "This is a clearly labelled example entry. Edit src/data/projects.ts (or use the /admin dashboard) to replace it with your real project: what it does, who it is for, what you built and the problems you solved.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    coverImage: "",
    galleryImages: [],
    liveUrl: "",
    githubUrl: "",
    year: 2026,
    featured: true,
    example: true,
  },
  {
    id: "example-video",
    title: "Your Video Edit Title",
    slug: "example-video-edit",
    category: "Video Editing",
    description: "Example entry — replace with a real video or reel you edited.",
    fullDescription:
      "This is a clearly labelled example entry. Describe the video, the story, the tools used (CapCut, DaVinci Resolve, After Effects) and link to the finished piece.",
    technologies: ["DaVinci Resolve", "After Effects"],
    coverImage: "",
    galleryImages: [],
    liveUrl: "",
    githubUrl: "",
    year: 2026,
    featured: false,
    example: true,
  },
  {
    id: "example-ai",
    title: "Your AI Project Title",
    slug: "example-ai-project",
    category: "AI Projects",
    description: "Example entry — replace with a real AI-assisted project.",
    fullDescription:
      "This is a clearly labelled example entry. Explain what you built or explored with AI tools and what you learned.",
    technologies: ["Claude AI", "Google Gemini"],
    coverImage: "",
    galleryImages: [],
    liveUrl: "",
    githubUrl: "",
    year: 2026,
    featured: false,
    example: true,
  },
  {
    id: "example-marketing",
    title: "Your Marketing Project Title",
    slug: "example-marketing-project",
    category: "Digital Marketing",
    description: "Example entry — replace with a real campaign or social media project.",
    fullDescription:
      "This is a clearly labelled example entry. Describe the campaign or page you managed. Only add results you can truthfully stand behind.",
    technologies: ["Meta Ads", "Canva"],
    coverImage: "",
    galleryImages: [],
    liveUrl: "",
    githubUrl: "",
    year: 2026,
    featured: false,
    example: true,
  },
];
