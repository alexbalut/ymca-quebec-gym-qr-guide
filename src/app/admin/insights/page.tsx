import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const gym = await prisma.gym.findUnique({ where: { id: session.gymId } });
  if (!gym) redirect("/admin/login");

  const machines = await prisma.machine.findMany({
    where: { gymId: session.gymId },
    orderBy: [{ viewCount: "desc" }, { nameEn: "asc" }],
    select: {
      id: true,
      nameEn: true,
      nameFr: true,
      category: true,
      viewCount: true,
      active: true,
      token: true,
    },
  });

  const totalViews = machines.reduce((s, m) => s + m.viewCount, 0);
  const openIssues = await prisma.issueReport.count({
    where: { status: "OPEN", machine: { gymId: session.gymId } },
  });
  const resolvedIssues = await prisma.issueReport.count({
    where: { status: "RESOLVED", machine: { gymId: session.gymId } },
  });

  const topMachines = machines.filter((m) => m.viewCount > 0).slice(0, 8);
  const zeroViewMachines = machines.filter((m) => m.viewCount === 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Owner ROI insights</h1>
        <p className="text-muted mt-1">
          {gym.name} · real usage from QR scans &amp; member reports
        </p>
      </div>

      <div className="card p-5 mb-8 border-yellow-400/20 bg-yellow-400/5">
        <p className="text-sm font-semibold text-yellow-200 mb-1">Pitch language</p>
        <p className="text-navy leading-relaxed">
          Scans = guided members; open issues = maintenance backlog. Resolved reports show
          staff follow-through. Zero-view machines are content gaps — add photos or promote
          those QR stickers on the floor.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Total machine views</p>
          <p className="text-3xl font-bold mt-1 tabular-nums">{totalViews}</p>
          <p className="text-xs text-muted mt-1">Sum of viewCount across machines</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Open issues</p>
          <p className="text-3xl font-bold mt-1 tabular-nums text-[#8a6116]">{openIssues}</p>
          <p className="text-xs text-muted mt-1">Maintenance backlog</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Resolved issues</p>
          <p className="text-3xl font-bold mt-1 tabular-nums text-[var(--ok)]">{resolvedIssues}</p>
          <p className="text-xs text-muted mt-1">Closed by staff</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Machines tracked</p>
          <p className="text-3xl font-bold mt-1 tabular-nums">{machines.length}</p>
          <p className="text-xs text-muted mt-1">{zeroViewMachines.length} with 0 views</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Top machines by views</h2>
            <p className="text-xs text-muted">Most-scanned guides — proof of member engagement</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted border-b border-border bg-[var(--wash)]">
                <tr>
                  <th className="px-4 py-2 font-medium">#</th>
                  <th className="px-4 py-2 font-medium">Machine</th>
                  <th className="px-4 py-2 font-medium">Views</th>
                </tr>
              </thead>
              <tbody>
                {topMachines.map((m, i) => (
                  <tr key={m.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2.5 text-muted tabular-nums">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <Link href={`/q/${m.token}`} className="font-medium hover:text-[var(--accent)]">
                        {m.nameEn}
                      </Link>
                      <div className="text-xs text-muted">{m.category}</div>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums font-semibold">{m.viewCount}</td>
                  </tr>
                ))}
                {topMachines.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted">
                      No views yet — scan a QR to start the counter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Content gap — 0 views</h2>
            <p className="text-xs text-muted">
              Machines members have never opened — opportunity to improve discoverability
            </p>
          </div>
          {zeroViewMachines.length === 0 ? (
            <p className="px-4 py-8 text-center text-muted text-sm">
              Every machine has at least one view. Nice coverage.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {zeroViewMachines.map((m) => (
                <li key={m.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{m.nameEn}</p>
                    <p className="text-xs text-muted">
                      {m.category}
                      {!m.active ? " · Hidden" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/admin/machines/${m.id}/edit`}
                    className="btn btn-secondary !py-1 !px-2 text-xs"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-8 text-sm text-muted">
        Looking for the issue inbox?{" "}
        <Link href="/admin/issues" className="text-[var(--accent)] hover:underline">
          Open issues
        </Link>
      </p>
    </main>
  );
}
