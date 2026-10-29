import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth/config";
import { getAdminAuthConfigStatus } from "@/lib/auth/environment";

export const metadata = { title: "Admin login", robots: { index: false, follow: false } };

async function login(formData: FormData) {
  "use server";
  if (!getAdminAuthConfigStatus().configured) redirect("/admin/login?config=1");
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) redirect("/admin/login?error=1");
    throw err; // lets Next.js handle the successful-redirect "error"
  }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; config?: string }> }) {
  const session = await auth();
  if (session) redirect("/admin");
  const { error, config } = await searchParams;
  const configured = getAdminAuthConfigStatus().configured;

  return (
    <main className="mesh-bg grid min-h-screen place-items-center px-5">
      <form action={login} className="glass w-full max-w-md space-y-5 rounded-3xl p-8">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        {!configured && (
          <p className="rounded-xl border border-pink/40 bg-pink/10 px-4 py-3 text-sm text-pink">
            Admin login configuration is incomplete or invalid. Run <code>npm run admin:check</code> and follow the setup steps in the README.
          </p>
        )}
        {config && configured && <p role="alert" className="text-sm text-pink">Admin authentication configuration is unavailable. Check the server environment and restart the app.</p>}
        {error && <p role="alert" className="text-sm text-pink">Incorrect email or password.</p>}
        <label className="block text-sm text-muted">
          Email
          <input name="email" type="email" required autoComplete="username" className="mt-2 w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-3 text-ink outline-none focus:border-violet" />
        </label>
        <label className="block text-sm text-muted">
          Password
          <input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-3 text-ink outline-none focus:border-violet" />
        </label>
        <button className="w-full rounded-full bg-violet px-6 py-3 font-medium text-white transition hover:bg-violet/90">Sign in</button>
      </form>
    </main>
  );
}
