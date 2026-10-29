import { brandIcons } from "@/data/brandIcons";
import type { Skill } from "@/data/skills";

/** Official bundled logo (Simple Icons), an uploaded logo image, or an honest monogram. */
export default function SkillLogo({ skill, size = 44 }: { skill: Skill; size?: number }) {
  const color = `#${skill.color}`;

  if (skill.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={skill.image} alt="" width={size} height={size} loading="lazy" className="object-contain" />
    );
  }

  const icon = skill.icon ? brandIcons[skill.icon] : undefined;
  if (icon) {
    return (
      <svg role="img" aria-label={skill.name} viewBox="0 0 24 24" width={size} height={size} fill={color}>
        <path d={icon.path} />
      </svg>
    );
  }

  const initials = skill.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      aria-label={skill.name}
      className="grid place-items-center rounded-xl font-display font-bold"
      style={{
        width: size,
        height: size,
        color,
        background: `${color}1f`,
        border: `1px solid ${color}55`,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
}
