"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ExperienceContent } from "@/lib/content-types";
import { Field, IconButton, ImageField, SaveBar, StringList, TextArea, TextInput } from "./ui";

export default function ExperienceEditor({ initial, dbReady }: { initial: ExperienceContent; dbReady: boolean }) {
  const [e, setE] = useState<ExperienceContent>(initial);
  const set = <K extends keyof ExperienceContent>(k: K, v: ExperienceContent[K]) => setE((x) => ({ ...x, [k]: v }));
  const updateArea = (i: number, patch: Partial<ExperienceContent["areas"][number]>) =>
    set("areas", e.areas.map((a, j) => (j === i ? { ...a, ...patch } : a)));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Duration"><TextInput value={e.duration} onChange={(ev) => set("duration", ev.target.value)} /></Field>
        <Field label="Employer / company (optional)" hint="Leave empty to hide. Only add it if you want it shown.">
          <TextInput value={e.employer} onChange={(ev) => set("employer", ev.target.value)} />
        </Field>
      </div>
      <Field label="Heading"><TextInput value={e.heading} onChange={(ev) => set("heading", ev.target.value)} /></Field>
      <Field label="Summary"><TextArea rows={3} value={e.summary} onChange={(ev) => set("summary", ev.target.value)} /></Field>

      <h3 className="pt-2 font-display text-xl font-semibold">Experience areas</h3>
      {e.areas.map((a, i) => (
        <section key={i} className="glass space-y-4 rounded-3xl p-5">
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Area title"><TextInput value={a.title} onChange={(ev) => updateArea(i, { title: ev.target.value })} /></Field>
            </div>
            <div className="w-36">
              <Field label="Accent">
                <select
                  value={a.accent}
                  onChange={(ev) => updateArea(i, { accent: ev.target.value as "violet" | "cyan" })}
                  className="w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-2.5 text-ink"
                >
                  <option value="violet">Purple</option>
                  <option value="cyan">Cyan</option>
                </select>
              </Field>
            </div>
            <div className="pt-7">
              <IconButton label="Delete area" onClick={() => set("areas", e.areas.filter((_, j) => j !== i))}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          </div>
          <StringList label="Responsibilities" items={a.points} onChange={(v) => updateArea(i, { points: v })} />
          <ImageField label="Image (optional)" value={a.image ?? ""} onChange={(v) => updateArea(i, { image: v })} />
        </section>
      ))}
      <button
        type="button"
        onClick={() => set("areas", [...e.areas, { title: "New area", accent: "violet", points: [] }])}
        className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-2 text-sm text-muted hover:text-ink"
      >
        <Plus size={14} /> Add area
      </button>

      <SaveBar contentKey="experience" value={e} dbReady={dbReady} />
    </div>
  );
}
