"use client";

import { useActionState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import type { Profile } from "@/data/profile";
import { sendContact, type ContactState } from "@/lib/actions/contact";
import Reveal from "../animations/Reveal";
import Magnetic from "../animations/Magnetic";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../ui/SocialIcons";

const initial: ContactState = { status: "idle", message: "" };

const field =
  "peer w-full rounded-2xl border border-white/10 bg-bg/60 px-5 py-4 text-ink placeholder-transparent outline-none transition focus:border-violet focus:shadow-[0_0_0_4px_rgba(139,92,246,0.15)]";
const label =
  "pointer-events-none absolute left-5 top-4 origin-left text-muted transition-all peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-cyan peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-75";

export default function Contact({ profile, active }: { profile: Profile; active: boolean }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const { links } = profile;

  const social = [
    links.github && { label: "GitHub", href: links.github, icon: <GithubIcon /> },
    links.linkedin && { label: "LinkedIn", href: links.linkedin, icon: <LinkedinIcon /> },
    links.instagram && { label: "Instagram", href: links.instagram, icon: <InstagramIcon /> },
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode }[];

  return (
    <section id="contact" className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            <span className="h-px w-10 bg-cyan/60" /> Contact — Let&apos;s Collaborate
          </p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Let&apos;s Build Something <span className="text-gradient">Extraordinary.</span>
          </h2>

          <div className="mt-10 space-y-3">
            {links.email && (
              <Magnetic>
                <a href={`mailto:${links.email}`} className="glass flex items-center gap-3 rounded-2xl px-6 py-4 transition hover:bg-white/10">
                  <Mail size={20} className="text-violet" /> {links.email}
                </a>
              </Magnetic>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm transition hover:bg-white/10"
                >
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
            {social.length === 0 && (
              <p className="text-sm text-muted">Social links can be added from the admin dashboard.</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form action={action} className="glass border-spin relative space-y-5 rounded-[2rem] p-6 md:p-10" noValidate>
            {!active && (
              <p role="status" className="rounded-xl border border-pink/40 bg-pink/10 px-4 py-3 text-sm text-pink">
                This form is not active yet (email delivery is not configured). Please use the email link.
              </p>
            )}

            <div className="relative">
              <input id="name" name="name" placeholder="Name" required minLength={2} maxLength={100} autoComplete="name" className={field} />
              <label htmlFor="name" className={label}>Name</label>
            </div>
            <div className="relative">
              <input id="email" name="email" type="email" placeholder="Email" required maxLength={200} autoComplete="email" className={field} />
              <label htmlFor="email" className={label}>Email</label>
            </div>
            <div className="relative">
              <textarea id="message" name="message" placeholder="Message" required minLength={10} maxLength={4000} rows={5} className={`${field} resize-none`} />
              <label htmlFor="message" className={label}>Message</label>
            </div>

            {/* honeypot */}
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

            <button
              type="submit"
              disabled={pending || !active}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet px-7 py-4 font-medium text-white shadow-[0_0_40px_-8px_#8b5cf6] transition hover:bg-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Send Message
            </button>

            {state.message && (
              <p
                role="status"
                aria-live="polite"
                className={state.status === "success" ? "text-emerald-400" : "text-pink"}
              >
                {state.message}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
