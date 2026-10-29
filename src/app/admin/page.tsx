import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth/config";
import { getContent } from "@/lib/content";
import { isDbConfigured } from "@/lib/db/client";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session || !(session as unknown as { isAdmin?: boolean }).isAdmin) redirect("/admin/login");

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  const content = await getContent();
  return (
    <AdminDashboard
      content={content}
      dbReady={isDbConfigured()}
      uploadsReady={Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())}
      signOutAction={signOutAction}
    />
  );
}
