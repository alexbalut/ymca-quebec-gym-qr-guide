import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  const isLogin = pathname === "/admin/login" || pathname.endsWith("/admin/login");

  if (isLogin) {
    return <>{children}</>;
  }

  const session = await getSession();
  if (!session) {
    // Middleware should have redirected; soft fallback
    return <>{children}</>;
  }

  const gym = await prisma.gym.findUnique({ where: { id: session.gymId } });
  if (!gym) redirect("/admin/login");

  return (
    <div className="min-h-full flex flex-col">
      <AdminNav gymName={gym.name} userName={session.name} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
