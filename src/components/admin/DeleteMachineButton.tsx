"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteMachineButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/machines/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("fail");
      router.refresh();
    } catch {
      alert("Could not delete machine");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      className="btn btn-danger !py-1 !px-2 text-xs"
    >
      {busy ? "…" : "Delete"}
    </button>
  );
}
