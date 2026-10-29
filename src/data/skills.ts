/**
 * SKILLS DATA — add, remove or reorder skills here.
 *
 * LOGOS: `icon` is a Simple Icons slug (see src/data/brandIcons.ts for the
 * bundled list). For brands that Simple Icons does not carry (CapCut, Canva,
 * After Effects, ChatGPT/OpenAI, Auth.js, Google Flow) no logo is faked: a clean
 * monogram tile is shown. To use the real logo, download the official asset from
 * the brand's press/brand page, save it in /public/logos/ and set
 * `image: "/logos/capcut.svg"` on that skill.
 */

export type SkillCategoryId = "fullstack" | "creative" | "marketing" | "ai";

export type Skill = {
  name: string;
  icon?: string; // simpleicons slug (bundled, see brandIcons.ts)
  image?: string; // optional path to an official logo file in /public/logos/
  color: string; // brand colour hex without '#'
};

export type SkillCategory = {
  id: SkillCategoryId;
  label: string;
  tagline: string;
  gradient: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "fullstack",
    label: "Full Stack Development",
    tagline: "Interfaces, APIs and data — shipped end to end.",
    gradient: "from-violet-600/30 via-indigo-500/10 to-transparent",
    skills: [
      { name: "HTML5", icon: "html5", color: "E34F26" },
      { name: "CSS3", icon: "css", color: "1572B6" },
      { name: "JavaScript", icon: "javascript", color: "F7DF1E" },
      { name: "React.js", icon: "react", color: "61DAFB" },
      { name: "Next.js", icon: "nextdotjs", color: "FFFFFF" },
      { name: "Node.js", icon: "nodedotjs", color: "5FA04E" },
      { name: "PostgreSQL", icon: "postgresql", color: "4169E1" },
      { name: "Auth.js", color: "8B5CF6" },
    ],
  },
  {
    id: "creative",
    label: "Video Editing & Creative Tools",
    tagline: "Turning raw footage and ideas into visual stories.",
    gradient: "from-pink-600/30 via-fuchsia-500/10 to-transparent",
    skills: [
      { name: "CapCut", color: "FFFFFF" },
      { name: "DaVinci Resolve", icon: "davinciresolve", color: "233A51" },
      { name: "After Effects", color: "9999FF" },
      { name: "Canva", color: "00C4CC" },
    ],
  },
  {
    id: "marketing",
    label: "Digital Marketing",
    tagline: "Connecting brands with the right audiences.",
    gradient: "from-cyan-500/30 via-sky-500/10 to-transparent",
    skills: [
      { name: "Meta Ads", icon: "meta", color: "0467DF" },
      { name: "Social Media Management", icon: "instagram", color: "E4405F" },
    ],
  },
  {
    id: "ai",
    label: "AI Tools",
    tagline: "Using AI to think, build and create faster.",
    gradient: "from-emerald-500/25 via-cyan-500/10 to-transparent",
    skills: [
      { name: "ChatGPT", color: "FFFFFF" },
      { name: "Claude AI", icon: "claude", color: "D97757" },
      { name: "Google Gemini", icon: "googlegemini", color: "8E75B2" },
      { name: "Google Flow", color: "22D3EE" },
    ],
  },
];
