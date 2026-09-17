"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/insights", label: "ROI insights" },
  { href: "/admin/machines/new", label: "Add machine" },
  { href: "/admin/print", label: "Print QR sheet" },
  { href: "/admin/issues", label: "Issues" },
];

export function AdminNav({ gymName, userName }: { gymName: string; userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="no-print border-b border-border bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="font-semibold">
            {gymName} <span className="text-[var(--accent)]">Admin</span>
          </Link>
          <p className="text-xs text-muted">{userName}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`btn !py-1.5 !px-3 ${
                pathname === l.href ? "btn-primary" : "btn-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/scan" className="btn btn-secondary !py-1.5 !px-3">
            Member view
          </Link>
          <button type="button" onClick={logout} className="btn btn-danger !py-1.5 !px-3">
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
