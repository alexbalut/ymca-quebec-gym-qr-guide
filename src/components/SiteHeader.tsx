import Link from "next/link";

/** Compact chrome for member/scan flows — not a sales header. */
export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="no-print border-b border-border/80 backdrop-blur sticky top-0 z-40 bg-black/80">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold border"
            style={{
              backgroundColor: "#0060A926",
              color: "#0060A9",
              borderColor: "#0060A955",
            }}
          >
            YM
          </span>
          <span className="text-slate-200">YMCA Québec</span>
        </Link>
        {!compact && (
          <nav className="flex items-center gap-3 text-sm text-slate-400">
            <Link href="/" className="hover:opacity-80" style={{ color: undefined }}>
              Home
            </Link>
            <Link href="/scan">Scan</Link>
            <Link href="/admin/login" className="text-xs text-slate-500 hover:text-slate-300">
              Staff
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
