"use client";

import { useState } from "react";
import type { EducationContent } from "@/lib/content-types";
import { Field, SaveBar, StringList, TextInput } from "./ui";

export default function EducationEditor({ initial, dbReady }: { initial: EducationContent; dbReady: boolean }) {
  const [e, setE] = useState<EducationContent>(initial);
  const set = <K extends keyof EducationContent>(k: K, v: EducationContent[K]) => setE((x) => ({ ...x, [k]: v }));

  return (
    <div className="space-y-5">
      <Field label="Degree"><TextInput value={e.degree} onChange={(ev) => set("degree", ev.target.value)} /></Field>
      <Field label="College / institution"><TextInput value={e.institution} onChange={(ev) => set("institution", ev.target.value)} /></Field>
      <StringList label="Languages" items={e.languages} onChange={(v) => set("languages", v)} />
      <StringList
        label="Additional qualifications / certificates"
        items={e.extra}
        onChange={(v) => set("extra", v)}
        placeholder="e.g. a certificate you actually hold"
      />
      <SaveBar contentKey="education" value={e} dbReady={dbReady} />
    </div>
  );
}
