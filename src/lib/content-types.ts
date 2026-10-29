import type { Profile } from "@/data/profile";
import type { SkillCategory } from "@/data/skills";
import type { Project } from "@/data/projects";
import type { experience, education } from "@/data/experience";

export type ExperienceContent = typeof experience;
export type EducationContent = typeof education;

export type SiteContent = {
  profile: Profile;
  skills: SkillCategory[];
  projects: Project[];
  experience: ExperienceContent;
  education: EducationContent;
};
