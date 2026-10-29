"use client";

import { useState } from "react";
import type { Profile } from "@/data/profile";
import { Field, ImageField, SaveBar, StringList, TextArea, TextInput } from "./ui";

export default function ProfileEditor({ initial, dbReady }: { initial: Profile; dbReady: boolean }) {
  const [p, setP] = useState<Profile>(initial);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((x) => ({ ...x, [k]: v }));
  const setLink = (k: keyof Profile["links"], v: string) => setP((x) => ({ ...x, links: { ...x.links, [k]: v } }));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name"><TextInput value={p.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="First name"><TextInput value={p.firstName} onChange={(e) => set("firstName", e.target.value)} /></Field>
      </div>
      <Field label="Professional title"><TextInput value={p.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Hero headline — line 1">
          <TextInput value={p.heroHeadline[0]} onChange={(e) => set("heroHeadline", [e.target.value, p.heroHeadline[1]])} />
        </Field>
        <Field label="Hero headline — line 2">
          <TextInput value={p.heroHeadline[1]} onChange={(e) => set("heroHeadline", [p.heroHeadline[0], e.target.value])} />
        </Field>
      </div>
      <Field label="Hero description"><TextArea value={p.heroDescription} onChange={(e) => set("heroDescription", e.target.value)} /></Field>
      <Field label="About me"><TextArea rows={6} value={p.about} onChange={(e) => set("about", e.target.value)} /></Field>
      <StringList label="Languages" items={p.languages} onChange={(v) => set("languages", v)} />
      <ImageField label="Profile image" value={p.profileImage} onChange={(v) => set("profileImage", v)} />

      <h3 className="pt-4 font-display text-xl font-semibold">Contact &amp; social links</h3>
      <p className="-mt-3 text-sm text-muted">Leave a link empty to hide it from the site.</p>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Email"><TextInput type="email" value={p.links.email} onChange={(e) => setLink("email", e.target.value)} /></Field>
        <Field label="GitHub URL"><TextInput value={p.links.github} placeholder="https://github.com/…" onChange={(e) => setLink("github", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><TextInput value={p.links.linkedin} placeholder="https://linkedin.com/in/…" onChange={(e) => setLink("linkedin", e.target.value)} /></Field>
        <Field label="Instagram URL"><TextInput value={p.links.instagram} placeholder="https://instagram.com/…" onChange={(e) => setLink("instagram", e.target.value)} /></Field>
      </div>

      <SaveBar contentKey="profile" value={p} dbReady={dbReady} />
    </div>
  );
}
