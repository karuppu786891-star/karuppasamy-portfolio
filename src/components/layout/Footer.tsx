import { Mail } from "lucide-react";
import type { Profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../ui/SocialIcons";

export default function Footer({ profile }: { profile: Profile }) {
  const { links } = profile;
  return (
    <footer className="relative border-t border-white/5 bg-bg/80 px-5 py-10 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <p className="font-display text-lg font-bold">
            {profile.name}
            <span className="text-violet">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            © {new Date().getFullYear()} · Developer · Creator · Marketer · Innovator
          </p>
        </div>
        <ul className="flex items-center gap-3">
          {links.email && (
            <li>
              <a aria-label="Email" href={`mailto:${links.email}`} className="grid h-10 w-10 place-items-center rounded-full glass text-muted transition hover:text-ink">
                <Mail size={18} />
              </a>
            </li>
          )}
          {links.github && (
            <li>
              <a aria-label="GitHub" href={links.github} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full glass text-muted transition hover:text-ink">
                <GithubIcon size={18} />
              </a>
            </li>
          )}
          {links.linkedin && (
            <li>
              <a aria-label="LinkedIn" href={links.linkedin} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full glass text-muted transition hover:text-ink">
                <LinkedinIcon size={18} />
              </a>
            </li>
          )}
          {links.instagram && (
            <li>
              <a aria-label="Instagram" href={links.instagram} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full glass text-muted transition hover:text-ink">
                <InstagramIcon size={18} />
              </a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
