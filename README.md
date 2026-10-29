# KARUPPASAMY C — 3D Interactive Portfolio

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Three Fiber / Three.js / Drei · GSAP ScrollTrigger + Lenis · Motion · Prisma + PostgreSQL · Auth.js

## 1. Run it locally

```bash
npm install            # also runs `prisma generate` (needs internet access once)
cp .env.example .env   # then fill in the values (see below)
npm run dev            # http://localhost:3000
```

The public site works with **no configuration at all** — it reads `src/data/*.ts`.
The `/admin` dashboard, image uploads and the contact form each switch on when their environment variables are set. Anything not configured is clearly shown as inactive on screen; nothing pretends to work.

## 2. Two ways to update your content

**A. Admin dashboard (no code)** — go to `/admin`, sign in, edit Profile, Skills, Projects, Experience, Education, click **Save changes**. Saved values are stored in PostgreSQL and override the defaults in `src/data`.

**B. Edit the data files (backup method)** — `src/data/profile.ts`, `skills.ts`, `projects.ts`, `experience.ts`. Each file has comments explaining how to add or remove entries. The site renders everything from this data.

Project links are never faked: leave `liveUrl` / `githubUrl` empty and the button is hidden. The four starter projects are labelled **"Example entry — edit me"**; replace or delete them.

## 3. Set up the admin dashboard

1. **Database** — create a free PostgreSQL database (Neon, Supabase, Vercel Postgres, Railway…). Put its URL in `DATABASE_URL`, then create the table:
   ```bash
   npm run db:push
   ```
2. **Login** — set these in `.env`:
   - `AUTH_SECRET` → if missing, run `npm run admin:secret` and copy its output into `.env` as `AUTH_SECRET` (keep it private; do not replace a working secret).
   - `ADMIN_EMAIL=karuppasamyc804@gmail.com`
   - `ADMIN_PASSWORD_HASH` → run `npm run admin:password` in Windows PowerShell or another interactive terminal. Type a new password of at least 12 characters when prompted; input is masked. Copy the escaped bcrypt hash into `.env` exactly as printed; Next.js requires `$` to be escaped in `.env` values. For hosting dashboards, use the raw hash without backslashes. The command never takes the password as an argument or saves it.
   - Run `npm run admin:check` to verify required configuration without displaying values. Restart the dev server after changing `.env`.
   There is no default or hardcoded password. With these unset or invalid, nobody can log in.
3. **Image uploads** (optional) — open your Vercel project’s **Storage** tab, create a **Blob** store with **Public** access, and connect it to this project. Vercel adds `BLOB_READ_WRITE_TOKEN` to the deployment environments you select. For local development, put the store’s read/write token in the server-only `BLOB_READ_WRITE_TOKEN` entry in `.env.local` (or pull the project environment with the Vercel CLI). Never prefix it with `NEXT_PUBLIC_`. Restart `npm run dev` after changing it. The admin uploader accepts JPG, PNG, GIF, and WebP images up to 4 MB, checks the file signature on the server, and stores a public Blob URL. Without a token, uploads remain disabled while pasting an image URL or `/public` path still works. The app caps uploads at 4 MB because Vercel Functions limit request bodies to 4.5 MB.
4. **Contact form** (optional) — create a Resend account, verify a sender, set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`. Without these the form shows "not active yet".

Security: every save/upload runs on the server, re-checks your session, validates all input with Zod, and uploads are limited to real JPG/PNG/GIF/WebP files up to 4 MB (file type is detected from the file contents, not the filename). Admin sessions use Auth.js JWT cookies and expire after eight hours; login attempts are throttled after eight attempts per email in a 15-minute window per server instance.

## 4. Deploy (Vercel recommended)

1. Push the project to GitHub and import it in Vercel.
2. Add every variable from `.env.example` under Project → Settings → Environment Variables.
3. Run `npm run db:push` once against the production database (locally with the production `DATABASE_URL`).
4. Deploy. Edits made in `/admin` appear on the live site within moments, without redeploying.

## 5. Logos

Official logos for HTML5, CSS3, JavaScript, React, Next.js, Node.js, PostgreSQL, DaVinci Resolve, Meta, Instagram, Claude and Google Gemini are bundled from the open Simple Icons set.

**CapCut, Canva, Adobe After Effects, ChatGPT/OpenAI, Auth.js and Google Flow** are not in that set, so they currently show a clean monogram tile rather than an invented logo. To use the real ones: download the official asset from each brand's press/brand page, save it in `public/logos/`, and set the skill's image (in `/admin` → Skills → *Custom logo image*, or `image: "/logos/capcut.svg"` in `skills.ts`). Check each brand's usage guidelines.

## 6. Project structure

```
src/
  app/            page.tsx, projects/[slug], admin/, api/auth
  components/     layout, sections, three (3D scene), animations, projects, admin, ui
  data/           profile.ts  skills.ts  projects.ts  experience.ts  (edit me)
  lib/            auth/ (Auth.js)  db/ (Prisma)  validations/ (Zod)  actions/ (server actions)
prisma/schema.prisma
```

3D code lives only in `components/three` and reads scroll position from one shared state written by a single Lenis + GSAP loop. The scene lazy-loads after first paint, lowers pixel ratio and particle count on phones, falls back to a gradient background if WebGL is unavailable, and animations are disabled for visitors who prefer reduced motion.

## 7. What has and has not been tested

Tested in the build environment: TypeScript type check, production build, page rendering, project routes (including 404), and the full login flow (wrong password rejected, correct password creates a session, `/admin` redirects when signed out).

**Not tested there** (the environment could not reach Prisma's engine downloads, had no Postgres, no browser and no Blob/Resend accounts): database saving, image uploads, email delivery, and how the 3D scene and animations actually look and perform in a real browser. Please check these on your machine after setup and report anything that looks off.
