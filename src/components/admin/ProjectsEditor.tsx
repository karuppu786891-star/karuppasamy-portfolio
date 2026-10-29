"use client";

import { useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { Field, IconButton, ImageField, MoveButtons, SaveBar, StringList, TextArea, TextInput } from "./ui";

const CATEGORIES: Project["category"][] = ["Web Development", "Video Editing", "AI Projects", "Digital Marketing"];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function blank(): Project {
  const id = `project-${Date.now().toString(36)}`;
  return {
    id,
    title: "New project",
    slug: id,
    category: "Web Development",
    description: "",
    fullDescription: "",
    technologies: [],
    coverImage: "",
    galleryImages: [],
    liveUrl: "",
    githubUrl: "",
    year: new Date().getFullYear(),
    featured: false,
  };
}

export default function ProjectsEditor({ initial, dbReady }: { initial: Project[]; dbReady: boolean }) {
  const [list, setList] = useState<Project[]>(initial);
  const [open, setOpen] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Project>) =>
    setList((l) => l.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Entries marked as examples can be edited or deleted. Leave Live / GitHub URLs empty if you have none — the button is hidden on the site.
      </p>

      {list.map((p, i) => (
        <section key={p.id} className="glass rounded-3xl p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setOpen(open === p.id ? null : p.id)} className="flex-1 text-left">
              <span className="font-display text-lg font-semibold">{p.title || "Untitled"}</span>
              <span className="ml-3 text-sm text-muted">{p.category}</span>
              {p.example && <span className="ml-3 text-xs text-pink">example</span>}
            </button>
            <IconButton label={p.featured ? "Unfeature" : "Feature"} onClick={() => update(p.id, { featured: !p.featured })}>
              <Star size={16} className={p.featured ? "fill-cyan text-cyan" : ""} />
            </IconButton>
            <MoveButtons list={list} index={i} onChange={setList} />
            <IconButton
              label="Delete project"
              onClick={() => confirm(`Delete "${p.title}"?`) && setList((l) => l.filter((x) => x.id !== p.id))}
            >
              <Trash2 size={16} />
            </IconButton>
          </div>

          {open === p.id && (
            <div className="mt-6 space-y-5 border-t border-white/10 pt-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Title">
                  <TextInput
                    value={p.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      // keep the slug in sync only while it still matches the old title
                      update(p.id, { title, ...(p.slug === slugify(p.title) || p.slug === p.id ? { slug: slugify(title) || p.id } : {}) });
                    }}
                  />
                </Field>
                <Field label="URL slug" hint="Lowercase letters, numbers, dashes. Used in /projects/<slug>.">
                  <TextInput value={p.slug} onChange={(e) => update(p.id, { slug: slugify(e.target.value) })} />
                </Field>
                <Field label="Category">
                  <select
                    value={p.category}
                    onChange={(e) => update(p.id, { category: e.target.value as Project["category"] })}
                    className="w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-2.5 text-ink"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Year (optional)">
                  <TextInput
                    type="number"
                    value={p.year ?? ""}
                    onChange={(e) => update(p.id, { year: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </Field>
              </div>

              <Field label="Short description"><TextArea rows={2} value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} /></Field>
              <Field label="Full description"><TextArea rows={6} value={p.fullDescription} onChange={(e) => update(p.id, { fullDescription: e.target.value })} /></Field>
              <StringList label="Technologies" items={p.technologies} onChange={(v) => update(p.id, { technologies: v })} />

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Live Demo URL"><TextInput value={p.liveUrl} placeholder="https://…" onChange={(e) => update(p.id, { liveUrl: e.target.value })} /></Field>
                <Field label="GitHub URL"><TextInput value={p.githubUrl} placeholder="https://github.com/…" onChange={(e) => update(p.id, { githubUrl: e.target.value })} /></Field>
              </div>

              <ImageField label="Cover image" value={p.coverImage} onChange={(v) => update(p.id, { coverImage: v })} />

              <div>
                <span className="mb-2 block text-sm font-medium">Screenshots</span>
                <div className="space-y-4">
                  {p.galleryImages.map((g, gi) => (
                    <div key={gi} className="flex items-start gap-2">
                      <div className="flex-1">
                        <ImageField
                          label={`Screenshot ${gi + 1}`}
                          value={g}
                          onChange={(v) => update(p.id, { galleryImages: p.galleryImages.map((x, j) => (j === gi ? v : x)) })}
                        />
                      </div>
                      <IconButton label="Remove screenshot" onClick={() => update(p.id, { galleryImages: p.galleryImages.filter((_, j) => j !== gi) })}>
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update(p.id, { galleryImages: [...p.galleryImages, ""] })}
                    className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-2 text-sm text-muted hover:text-ink"
                  >
                    <Plus size={14} /> Add screenshot
                  </button>
                </div>
              </div>

              {p.example && (
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" checked onChange={() => update(p.id, { example: false })} />
                  This is an example entry — untick when it describes a real project
                </label>
              )}
            </div>
          )}
        </section>
      ))}

      <button
        type="button"
        onClick={() => {
          const n = blank();
          setList((l) => [...l, n]);
          setOpen(n.id);
        }}
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 hover:bg-white/15"
      >
        <Plus size={16} /> Add project
      </button>

      <SaveBar
        contentKey="projects"
        value={list.map((p) => ({ ...p, galleryImages: p.galleryImages.filter(Boolean) }))}
        dbReady={dbReady}
      />
    </div>
  );
}
