import { z } from "zod";

/** "" (hidden) or a real http(s) URL. Anything else is rejected, so no junk links get saved. */
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v), "Must be a full http(s) URL or empty");

/** "" or a site path (/projects/a.jpg) or an https URL. */
const imageRef = z
  .string()
  .trim()
  .max(600)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\/[^\s]+$/i.test(v), "Must be a /path or https URL");

const text = (max: number) => z.string().trim().max(max);

export const profileSchema = z.object({
  name: text(80).min(1),
  firstName: text(60).min(1),
  title: text(200),
  roles: z.array(text(40)).max(8),
  heroHeadline: z.tuple([text(120), text(120)]),
  heroDescription: text(600),
  about: text(2000),
  languages: z.array(text(40)).max(10),
  profileImage: imageRef,
  links: z.object({
    email: z.string().trim().max(200).refine((v) => v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Invalid email"),
    github: optionalUrl,
    linkedin: optionalUrl,
    instagram: optionalUrl,
  }),
});

export const skillsSchema = z
  .array(
    z.object({
      id: z.enum(["fullstack", "creative", "marketing", "ai"]),
      label: text(80).min(1),
      tagline: text(160),
      gradient: text(120),
      skills: z
        .array(
          z.object({
            name: text(60).min(1),
            icon: z.string().trim().max(40).optional(),
            image: imageRef.optional(),
            color: z.string().trim().regex(/^[0-9a-fA-F]{6}$/, "6-digit hex, no #"),
          }),
        )
        .max(40),
    }),
  )
  .max(8);

const slug = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase letters, numbers and dashes only");

export const projectSchema = z.object({
  id: text(80).min(1),
  title: text(120).min(1),
  slug,
  category: z.enum(["Web Development", "Video Editing", "AI Projects", "Digital Marketing"]),
  description: text(300),
  fullDescription: text(6000),
  technologies: z.array(text(40)).max(30),
  coverImage: imageRef,
  galleryImages: z.array(imageRef).max(20),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  year: z.number().int().min(1990).max(2100).optional(),
  featured: z.boolean(),
  example: z.boolean().optional(),
});

export const projectsSchema = z
  .array(projectSchema)
  .max(100)
  .refine((list) => new Set(list.map((p) => p.slug)).size === list.length, "Project slugs must be unique")
  .refine((list) => new Set(list.map((p) => p.id)).size === list.length, "Project ids must be unique");

export const experienceSchema = z.object({
  duration: text(60),
  heading: text(200),
  summary: text(600),
  employer: text(120),
  areas: z
    .array(
      z.object({
        title: text(120).min(1),
        accent: z.enum(["violet", "cyan"]),
        points: z.array(text(200)).max(20),
        image: imageRef.optional(),
      }),
    )
    .max(8),
});

export const educationSchema = z.object({
  degree: text(200).min(1),
  institution: text(200).min(1),
  languages: z.array(text(40)).max(10),
  extra: z.array(text(200)).max(20),
});

export const CONTENT_KEYS = ["profile", "skills", "projects", "experience", "education"] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export const contentSchemas = {
  profile: profileSchema,
  skills: skillsSchema,
  projects: projectsSchema,
  experience: experienceSchema,
  education: educationSchema,
} as const;
