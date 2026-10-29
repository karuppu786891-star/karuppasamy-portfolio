"use client";

import { useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { resetContent, saveContent, uploadImage } from "@/lib/actions/admin";
import type { ContentKey } from "@/lib/validations/content";

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-2.5 text-ink outline-none transition focus:border-violet";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/90">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${inputCls} resize-y`} />;
}

export function IconButton({
  label,
  onClick,
  children,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg glass text-muted transition hover:text-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** Edit a list of short strings (one per row) with add / remove. */
export function StringList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink/90">{label}</span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={it}
              placeholder={placeholder}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              className={inputCls}
            />
            <IconButton label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 size={16} />
            </IconButton>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-2 text-sm text-muted hover:text-ink"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

/** Upload an image to storage (server-validated) and store its URL. */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setErr("Image must be 4 MB or smaller.");
      if (ref.current) ref.current.value = "";
      return;
    }
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadImage(fd);
    setBusy(false);
    if (res.ok) onChange(res.url);
    else setErr(res.error);
    if (ref.current) ref.current.value = "";
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink/90">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-24 rounded-lg border border-white/10 object-cover" />
        )}
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        <button
          type="button"
          disabled={busy}
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-sm text-muted hover:text-pink">
            Remove
          </button>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">JPG, PNG, GIF, or WebP; maximum 4 MB. You can also paste an image URL or a local /public path.</p>
      <input
        value={value}
        placeholder="…or paste an image URL / /path"
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} mt-2 text-sm`}
      />
      {err && <p className="mt-1 text-sm text-pink">{err}</p>}
    </div>
  );
}

/** Move an item up/down in a list. */
export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function MoveButtons<T>({ list, index, onChange }: { list: T[]; index: number; onChange: (n: T[]) => void }) {
  return (
    <>
      <IconButton label="Move up" disabled={index === 0} onClick={() => onChange(move(list, index, index - 1))}>
        <ArrowUp size={16} />
      </IconButton>
      <IconButton label="Move down" disabled={index === list.length - 1} onClick={() => onChange(move(list, index, index + 1))}>
        <ArrowDown size={16} />
      </IconButton>
    </>
  );
}

/** Save / reset bar. Shows the real server result; never claims success unless the save succeeded. */
export function SaveBar({
  contentKey,
  value,
  dbReady,
}: {
  contentKey: ContentKey;
  value: unknown;
  dbReady: boolean;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center gap-3 rounded-2xl glass p-4">
      <button
        type="button"
        disabled={pending || !dbReady}
        onClick={() =>
          start(async () => {
            setMsg(null);
            const r = await saveContent(contentKey, value);
            setMsg(r.ok ? { ok: true, text: "Saved. The live site will update shortly." } : { ok: false, text: r.error });
          })
        }
        className="inline-flex items-center gap-2 rounded-full bg-violet px-6 py-2.5 font-medium text-white transition hover:bg-violet/90 disabled:opacity-50"
      >
        {pending && <Loader2 size={16} className="animate-spin" />} Save changes
      </button>
      <button
        type="button"
        disabled={pending || !dbReady}
        onClick={() => {
          if (!confirm("Discard saved changes for this section and go back to the defaults in src/data?")) return;
          start(async () => {
            const r = await resetContent(contentKey);
            setMsg(r.ok ? { ok: true, text: "Reset. Reload the page to see the defaults." } : { ok: false, text: r.error });
          });
        }}
        className="rounded-full glass px-5 py-2.5 text-sm text-muted hover:text-ink disabled:opacity-50"
      >
        Reset to defaults
      </button>
      {!dbReady && <span className="text-sm text-pink">Database not configured — saving is disabled.</span>}
      {msg && (
        <span role="status" className={msg.ok ? "text-sm text-emerald-400" : "text-sm text-pink"}>
          {msg.text}
        </span>
      )}
    </div>
  );
}
