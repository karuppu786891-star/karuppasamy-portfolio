"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Skill, SkillCategory } from "@/data/skills";
import { brandIcons } from "@/data/brandIcons";
import { Field, IconButton, ImageField, MoveButtons, SaveBar, TextInput } from "./ui";

export default function SkillsEditor({ initial, dbReady }: { initial: SkillCategory[]; dbReady: boolean }) {
  const [cats, setCats] = useState<SkillCategory[]>(initial);

  const updateCat = (ci: number, patch: Partial<SkillCategory>) =>
    setCats((c) => c.map((x, i) => (i === ci ? { ...x, ...patch } : x)));
  const updateSkill = (ci: number, si: number, patch: Partial<Skill>) =>
    updateCat(ci, { skills: cats[ci].skills.map((s, i) => (i === si ? { ...s, ...patch } : s)) });

  /** Move a skill into another category (changes its category). */
  const moveToCategory = (ci: number, si: number, target: number) => {
    if (target === ci) return;
    const skill = cats[ci].skills[si];
    setCats((c) =>
      c.map((x, i) =>
        i === ci ? { ...x, skills: x.skills.filter((_, j) => j !== si) } : i === target ? { ...x, skills: [...x.skills, skill] } : x,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <datalist id="icon-slugs">{Object.keys(brandIcons).map((s) => <option key={s} value={s} />)}</datalist>

      {cats.map((cat, ci) => (
        <section key={cat.id} className="glass rounded-3xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category name"><TextInput value={cat.label} onChange={(e) => updateCat(ci, { label: e.target.value })} /></Field>
            <Field label="Tagline"><TextInput value={cat.tagline} onChange={(e) => updateCat(ci, { tagline: e.target.value })} /></Field>
          </div>

          <ul className="mt-6 space-y-4">
            {cat.skills.map((s, si) => (
              <li key={si} className="rounded-2xl border border-white/10 p-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Skill name"><TextInput value={s.name} onChange={(e) => updateSkill(ci, si, { name: e.target.value })} /></Field>
                  <Field label="Icon" hint="Bundled brand icon name (optional)">
                    <TextInput list="icon-slugs" value={s.icon ?? ""} onChange={(e) => updateSkill(ci, si, { icon: e.target.value })} />
                  </Field>
                  <Field label="Colour (hex)" hint="e.g. 8B5CF6, no #">
                    <TextInput value={s.color} maxLength={6} onChange={(e) => updateSkill(ci, si, { color: e.target.value.replace("#", "") })} />
                  </Field>
                  <Field label="Category">
                    <select
                      value={ci}
                      onChange={(e) => moveToCategory(ci, si, Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-2.5 text-ink"
                    >
                      {cats.map((c, i) => (
                        <option key={c.id} value={i}>{c.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-3">
                  <ImageField label="Custom logo image (overrides icon)" value={s.image ?? ""} onChange={(v) => updateSkill(ci, si, { image: v })} />
                </div>
                <div className="mt-3 flex gap-2">
                  <MoveButtons list={cat.skills} index={si} onChange={(n) => updateCat(ci, { skills: n })} />
                  <IconButton label="Delete skill" onClick={() => updateCat(ci, { skills: cat.skills.filter((_, j) => j !== si) })}>
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => updateCat(ci, { skills: [...cat.skills, { name: "New skill", color: "8B5CF6" }] })}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg glass px-3 py-2 text-sm text-muted hover:text-ink"
          >
            <Plus size={14} /> Add skill
          </button>
        </section>
      ))}

      <SaveBar contentKey="skills" value={cats} dbReady={dbReady} />
    </div>
  );
}
