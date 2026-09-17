import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResolveIssueButton } from "@/components/admin/ResolveIssueButton";

export const dynamic = "force-dynamic";

export default async function IssuesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const issues = await prisma.issueReport.findMany({
    where: { machine: { gymId: session.gymId } },
    include: { machine: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Member issue reports</h1>
      <p className="text-muted mb-6">Notes submitted from machine guide pages.</p>

      <ul className="space-y-3">
        {issues.map((issue) => (
          <li key={issue.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/q/${issue.machine.token}`} className="font-semibold hover:text-[var(--accent)]">
                    {issue.machine.nameEn}
                  </Link>
                  <span
                    className={`badge ${
                      issue.status === "OPEN"
                        ? "!bg-amber-400/10 !text-[#8a6116] !border-amber-400/30"
                        : "!bg-emerald-400/10 !text-[var(--ok)] !border-emerald-400/30"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
                <p className="text-navy">{issue.note}</p>
                <p className="text-xs text-muted mt-2">
                  {new Date(issue.createdAt).toLocaleString()}
                </p>
              </div>
              {issue.status === "OPEN" && <ResolveIssueButton id={issue.id} />}
            </div>
          </li>
        ))}
        {issues.length === 0 && (
          <li className="card p-8 text-center text-muted">No reports yet.</li>
        )}
      </ul>
    </main>
  );
}
