import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { BCRYPT_HASH_PATTERN } from "@/lib/auth/environment";

/**
 * Single-admin auth. Credentials come from environment variables only:
 *   ADMIN_EMAIL, ADMIN_PASSWORD_HASH (bcrypt), AUTH_SECRET
 * No password is ever stored in code or in the database.
 */

const loginSchema = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) });

// basic brute-force throttle (per server instance)
const attempts = new Map<string, { n: number; first: number }>();
function throttled(key: string) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.first > 15 * 60_000) {
    attempts.set(key, { n: 1, first: now });
    return false;
  }
  rec.n += 1;
  return rec.n > 8;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminEmail || !hash || !BCRYPT_HASH_PATTERN.test(hash)) return null;

        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const email = parsed.data.email.trim().toLowerCase();
        if (throttled(email)) return null;

        // always run bcrypt so response time doesn't reveal whether the email matched
        let ok = false;
        try {
          ok = await bcrypt.compare(parsed.data.password, hash);
        } catch {
          return null;
        }
        if (!ok || email !== adminEmail) return null;
        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.isAdmin = true;
      return token;
    },
    session({ session, token }) {
      (session as unknown as { isAdmin?: boolean }).isAdmin = Boolean(token.isAdmin);
      return session;
    },
  },
});

/** Server-side guard used by every admin action and page. */
export async function requireAdmin() {
  const session = await auth();
  if (!session || !(session as unknown as { isAdmin?: boolean }).isAdmin) {
    throw new Error("Unauthorized");
  }
  return session;
}
