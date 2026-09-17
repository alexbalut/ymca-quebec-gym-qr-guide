"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type MachineFormValues = {
  nameEn: string;
  nameFr: string;
  slug: string;
  category: string;
  muscleGroups: string;
  descriptionEn: string;
  descriptionFr: string;
  stepsEn: string;
  stepsFr: string;
  tipsEn: string;
  tipsFr: string;
  warningsEn: string;
  warningsFr: string;
  sortOrder: number;
  active: boolean;
  imageUrls: string;
};

const empty: MachineFormValues = {
  nameEn: "",
  nameFr: "",
  slug: "",
  category: "General",
  muscleGroups: "",
  descriptionEn: "",
  descriptionFr: "",
  stepsEn: "",
  stepsFr: "",
  tipsEn: "",
  tipsFr: "",
  warningsEn: "",
  warningsFr: "",
  sortOrder: 0,
  active: true,
  imageUrls: "",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function MachineForm({
  initial,
  machineId,
}: {
  initial?: Partial<MachineFormValues>;
  machineId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<MachineFormValues>({ ...empty, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof MachineFormValues>(key: K, val: MachineFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function autoSlugFromName() {
    if (values.slug) return;
    set(
      "slug",
      values.nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(machineId ? `/api/machines/${machineId}` : "/api/machines", {
        method: machineId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4 card p-5">
        <Field label="Name (EN)">
          <input
            className="input"
            required
            value={values.nameEn}
            onChange={(e) => set("nameEn", e.target.value)}
            onBlur={autoSlugFromName}
          />
        </Field>
        <Field label="Name (FR)">
          <input
            className="input"
            required
            value={values.nameFr}
            onChange={(e) => set("nameFr", e.target.value)}
          />
        </Field>
        <Field label="Slug">
          <input
            className="input"
            required
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </Field>
        <Field label="Category">
          <input
            className="input"
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
          />
        </Field>
        <Field label="Muscle groups">
          <input
            className="input"
            value={values.muscleGroups}
            onChange={(e) => set("muscleGroups", e.target.value)}
            placeholder="Quads, Glutes…"
          />
        </Field>
        <Field label="Sort order">
          <input
            className="input"
            type="number"
            value={values.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
        </Field>
        <label className="flex items-center gap-2 md:col-span-2 text-sm text-body">
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => set("active", e.target.checked)}
          />
          Active (visible to members)
        </label>
      </div>

      <div className="card p-5">
        <Field label="Photo URLs (1–3, one per line)">
          <textarea
            className="input min-h-[88px] font-mono text-sm"
            value={values.imageUrls}
            onChange={(e) => set("imageUrls", e.target.value)}
            placeholder="https://… or /placeholders/machine-1.svg (one per line)"
          />
        </Field>
        <p className="text-xs text-muted mt-2">
          HTTPS or relative paths (e.g. /placeholders/…). Shown above steps on the member guide.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 card p-5">
        <Field label="Description EN">
          <textarea
            className="input min-h-[80px]"
            value={values.descriptionEn}
            onChange={(e) => set("descriptionEn", e.target.value)}
          />
        </Field>
        <Field label="Description FR">
          <textarea
            className="input min-h-[80px]"
            value={values.descriptionFr}
            onChange={(e) => set("descriptionFr", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4 card p-5">
        <Field label="Steps EN (one per line)">
          <textarea
            className="input min-h-[160px] font-mono text-sm"
            required
            value={values.stepsEn}
            onChange={(e) => set("stepsEn", e.target.value)}
          />
        </Field>
        <Field label="Steps FR (one per line)">
          <textarea
            className="input min-h-[160px] font-mono text-sm"
            required
            value={values.stepsFr}
            onChange={(e) => set("stepsFr", e.target.value)}
          />
        </Field>
        <Field label="Tips EN">
          <textarea
            className="input min-h-[100px] font-mono text-sm"
            value={values.tipsEn}
            onChange={(e) => set("tipsEn", e.target.value)}
          />
        </Field>
        <Field label="Tips FR">
          <textarea
            className="input min-h-[100px] font-mono text-sm"
            value={values.tipsFr}
            onChange={(e) => set("tipsFr", e.target.value)}
          />
        </Field>
        <Field label="Warnings EN">
          <textarea
            className="input min-h-[100px] font-mono text-sm"
            value={values.warningsEn}
            onChange={(e) => set("warningsEn", e.target.value)}
          />
        </Field>
        <Field label="Warnings FR">
          <textarea
            className="input min-h-[100px] font-mono text-sm"
            value={values.warningsFr}
            onChange={(e) => set("warningsFr", e.target.value)}
          />
        </Field>
      </div>

      {error && (
        <p className="text-[var(--danger)] text-sm border border-rose-400/30 rounded-lg px-3 py-2 bg-rose-400/10">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : machineId ? "Update machine" : "Create machine"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => router.push("/admin")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
