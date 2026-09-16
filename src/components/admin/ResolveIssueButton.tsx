"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResolveIssueButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function resolve() {
    setBusy(true);
    try {
      const res = await fetch(`/api/issues/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("fail");
      router.refresh();
    } catch {
      alert("Could not update issue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="btn btn-secondary !py-1.5 !px-3 text-xs" onClick={resolve} disabled={busy}>
      {busy ? "…" : "Mark resolved"}
    </button>
  );
}
