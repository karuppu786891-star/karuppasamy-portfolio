"use server";

import { revalidatePath } from "next/cache";
import {
  BlobAccessError,
  BlobServiceNotAvailable,
  BlobServiceRateLimited,
  BlobStoreNotFoundError,
  BlobStoreSuspendedError,
  put,
} from "@vercel/blob";
import { requireAdmin } from "@/lib/auth/config";
import { getDb, isDbConfigured } from "@/lib/db/client";
import { CONTENT_KEYS, contentSchemas, type ContentKey } from "@/lib/validations/content";

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Validates and permanently saves one content section. Admin-only, enforced on the server. */
export async function saveContent(key: ContentKey, value: unknown): Promise<SaveResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not signed in." };
  }

  if (!CONTENT_KEYS.includes(key)) return { ok: false, error: "Unknown section." };
  if (!isDbConfigured()) {
    return { ok: false, error: "Database is not configured (DATABASE_URL missing), so changes cannot be saved yet." };
  }

  const parsed = contentSchemas[key].safeParse(value);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `${issue.path.join(".") || key}: ${issue.message}` };
  }

  try {
    await getDb().siteContent.upsert({
      where: { key },
      create: { key, value: parsed.data as object },
      update: { value: parsed.data as object },
    });
  } catch (err) {
    console.error("[admin] save failed:", err instanceof Error ? err.message : err);
    return { ok: false, error: "Saving to the database failed. Check the DATABASE_URL and that the tables exist (npm run db:push)." };
  }

  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  return { ok: true };
}

/** Resets a section back to the defaults in src/data by deleting its saved row. */
export async function resetContent(key: ContentKey): Promise<SaveResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not signed in." };
  }
  if (!CONTENT_KEYS.includes(key)) return { ok: false, error: "Unknown section." };
  if (!isDbConfigured()) return { ok: false, error: "Database is not configured." };
  try {
    await getDb().siteContent.deleteMany({ where: { key } });
  } catch {
    return { ok: false, error: "Reset failed." };
  }
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  return { ok: true };
}

// Keep below Vercel Functions' 4.5 MB request limit to leave room for multipart overhead.
const MAX_BYTES = 4 * 1024 * 1024;

/** Detects real image type from the file's first bytes (never trusts the browser-supplied type). */
function sniff(buf: Uint8Array): { ext: string; mime: string } | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return { ext: "png", mime: "image/png" };
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return { ext: "gif", mime: "image/gif" };
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  )
    return { ext: "webp", mime: "image/webp" };
  return null;
}

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/** Admin-only image upload to Vercel Blob. Validates size and real file type. */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not signed in." };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return { ok: false, error: "Image storage is not configured. Add BLOB_READ_WRITE_TOKEN from your Vercel Blob store to the server environment, then restart the app." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "No file selected." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Image must be 4 MB or smaller." };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) return { ok: false, error: "Only JPG, PNG, GIF or WebP images are allowed." };

  try {
    const blob = await put(`portfolio/${crypto.randomUUID()}.${kind.ext}`, Buffer.from(bytes), {
      access: "public",
      contentType: kind.mime,
      addRandomSuffix: true,
    });
    return { ok: true, url: blob.url };
  } catch (err) {
    // Log only the error class; SDK messages can contain request details.
    console.error("[admin] Blob upload failed", { name: err instanceof Error ? err.name : "UnknownError" });
    if (err instanceof BlobAccessError) {
      return { ok: false, error: "Vercel Blob rejected the credentials. Confirm this token belongs to the connected Blob store and has read/write access." };
    }
    if (err instanceof BlobStoreNotFoundError) {
      return { ok: false, error: "The configured Vercel Blob store was not found. Check that the token belongs to an active store." };
    }
    if (err instanceof BlobStoreSuspendedError) {
      return { ok: false, error: "The Vercel Blob store is unavailable. Check its status in the Vercel dashboard." };
    }
    if (err instanceof BlobServiceRateLimited) {
      return { ok: false, error: "Vercel Blob is receiving too many uploads. Wait briefly, then try again." };
    }
    if (err instanceof BlobServiceNotAvailable) {
      return { ok: false, error: "Vercel Blob is temporarily unavailable. Try again in a moment." };
    }
    return { ok: false, error: "Upload could not reach Vercel Blob. Check your connection and Blob store setup, then try again." };
  }
}
