import { Briefcase } from "lucide-react";
import { brandIcons } from "@/data/brandIcons";

function Brand({ slug, size = 18 }: { slug: string; size?: number }) {
  const icon = brandIcons[slug];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}

export const GithubIcon = ({ size = 18 }: { size?: number }) => <Brand slug="github" size={size} />;
export const InstagramIcon = ({ size = 18 }: { size?: number }) => <Brand slug="instagram" size={size} />;
// LinkedIn's logo is not in the open icon set, so a neutral professional icon is used (label stays "LinkedIn").
export const LinkedinIcon = ({ size = 18 }: { size?: number }) => <Briefcase size={size} aria-hidden />;
