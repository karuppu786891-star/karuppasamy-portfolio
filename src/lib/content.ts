import { profile as defaultProfile } from "@/data/profile";
import { skillCategories as defaultSkills } from "@/data/skills";
import { projects as defaultProjects } from "@/data/projects";
import { experience as defaultExperience, education as defaultEducation } from "@/data/experience";
import { getDb, isDbConfigured } from "@/lib/db/client";
import { contentSchemas, type ContentKey } from "@/lib/validations/content";
import type { SiteContent } from "./content-types";

export const defaults: SiteContent = {
  profile: defaultProfile,
  skills: defaultSkills,
  projects: defaultProjects,
  experience: defaultExperience,
  education: defaultEducation,
};

/**
 * Loads portfolio content. Values saved through /admin (database) win; anything
 * missing or invalid — or no database at all — falls back to src/data/*.ts.
 */
export async function getContent(): Promise<SiteContent> {
  const result: SiteContent = { ...defaults };
  if (!isDbConfigured()) return result;

  try {
    const rows = await getDb().siteContent.findMany();
    for (const row of rows) {
      const key = row.key as ContentKey;
      const schema = contentSchemas[key];
      if (!schema) continue;
      const parsed = schema.safeParse(row.value);
      if (parsed.success) (result as Record<string, unknown>)[key] = parsed.data;
    }
  } catch (err) {
    console.error("[content] database unavailable, using defaults:", err instanceof Error ? err.message : err);
  }
  return result;
}
