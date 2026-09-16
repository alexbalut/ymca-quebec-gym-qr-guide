import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { machineQrUrl } from "@/lib/utils";
import { DeleteMachineButton } from "@/components/admin/DeleteMachineButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const gym = await prisma.gym.findUnique({ where: { id: session.gymId } });
  if (!gym) redirect("/admin/login");

  const machines = await prisma.machine.findMany({
    where: { gymId: session.gymId },
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    include: { _count: { select: { issues: true } } },
  });

  const totalViews = machines.reduce((s, m) => s + m.viewCount, 0);
  const openIssues = await prisma.issueReport.count({
    where: { status: "OPEN", machine: { gymId: session.gymId } },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Machines</h1>
          <p className="text-slate-400 mt-1">
            {gym.city || gym.name} · manage guides, QRs & analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/print" className="btn btn-secondary">
            Print QR sheet
          </Link>
          <Link href="/admin/machines/new" className="btn btn-primary">
            + Add machine
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Machines</p>
          <p className="text-3xl font-bold mt-1">{machines.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total views</p>
          <p className="text-3xl font-bold mt-1">{totalViews}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Open issues</p>
          <p className="text-3xl font-bold mt-1">{openIssues}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400 border-b border-border bg-slate-950/40">
              <tr>
                <th className="px-4 py-3 font-medium">Machine</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m) => (
                <tr key={m.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{m.nameEn}</div>
                    <div className="text-xs text-slate-500">{m.nameFr}</div>
                    <div className="text-[11px] text-yellow-400/80 font-mono mt-0.5 truncate max-w-[220px]">
                      {machineQrUrl(m.token)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge">{m.category}</span>
                  </td>
                  <td className="px-4 py-3">{m.viewCount}</td>
                  <td className="px-4 py-3">
                    {m.active ? (
                      <span className="text-emerald-300">Active</span>
                    ) : (
                      <span className="text-slate-500">Hidden</span>
                    )}
                    {m._count.issues > 0 && (
                      <span className="block text-xs text-amber-300 mt-1">
                        {m._count.issues} issue(s)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/q/${m.token}`} className="btn btn-secondary !py-1 !px-2 text-xs">
                        View
                      </Link>
                      <Link
                        href={`/admin/machines/${m.id}/edit`}
                        className="btn btn-secondary !py-1 !px-2 text-xs"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/api/machines/${m.id}/qr?format=png`}
                        className="btn btn-secondary !py-1 !px-2 text-xs"
                      >
                        QR PNG
                      </a>
                      <DeleteMachineButton id={m.id} name={m.nameEn} />
                    </div>
                  </td>
                </tr>
              ))}
              {machines.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    No machines yet.{" "}
                    <Link href="/admin/machines/new" className="text-yellow-300">
                      Create one
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
