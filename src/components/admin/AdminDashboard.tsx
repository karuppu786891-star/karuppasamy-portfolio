"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";
import ProfileEditor from "./ProfileEditor";
import SkillsEditor from "./SkillsEditor";
import ProjectsEditor from "./ProjectsEditor";
import ExperienceEditor from "./ExperienceEditor";
import EducationEditor from "./EducationEditor";

const TABS = ["Profile", "Skills", "Projects", "Experience", "Education"] as const;

export default function AdminDashboard({
  content,
  dbReady,
  uploadsReady,
  signOutAction,
}: {
  content: SiteContent;
  dbReady: boolean;
  uploadsReady: boolean;
  signOutAction: () => Promise<void>;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");

  return (
    <main className="mesh-bg min-h-screen px-5 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold">Portfolio Admin</h1>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="rounded-full glass px-5 py-2 text-sm hover:bg-white/10">View site</Link>
            <form action={signOutAction}>
              <button className="rounded-full glass px-5 py-2 text-sm text-muted hover:text-ink">Sign out</button>
            </form>
          </div>
        </header>

        {!dbReady && (
          <p className="mb-4 rounded-2xl border border-pink/40 bg-pink/10 px-5 py-4 text-sm text-pink">
            Database not connected (DATABASE_URL is not set). You can look around, but saving is disabled until it is configured — see the README.
          </p>
        )}
        {!uploadsReady && (
          <p className="mb-4 rounded-2xl border border-pink/40 bg-pink/10 px-5 py-4 text-sm text-pink">
            Image storage is not configured. Add the server-only BLOB_READ_WRITE_TOKEN from a public Vercel Blob store and restart the app. Uploads are disabled until then; image URL and /public path fallback still works. See README setup steps.
          </p>
        )}

        <div role="tablist" className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2.5 text-sm transition ${tab === t ? "bg-violet text-white" : "glass text-muted hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* each editor keeps its own state; render only the active one */}
        {tab === "Profile" && <ProfileEditor initial={content.profile} dbReady={dbReady} />}
        {tab === "Skills" && <SkillsEditor initial={content.skills} dbReady={dbReady} />}
        {tab === "Projects" && <ProjectsEditor initial={content.projects} dbReady={dbReady} />}
        {tab === "Experience" && <ExperienceEditor initial={content.experience} dbReady={dbReady} />}
        {tab === "Education" && <EducationEditor initial={content.education} dbReady={dbReady} />}
      </div>
    </main>
  );
}
