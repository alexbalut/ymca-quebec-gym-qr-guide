"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/utils";
import { addMachineToWorkout } from "@/lib/workout";

type Localized = {
  id: string;
  name: string;
  description: string | null;
  steps: string[];
  tips: string[];
  warnings: string[];
  category: string;
  muscleGroups: string | null;
  viewCount: number;
};

type Props = {
  gymName: string;
  gymColor: string;
  gymSlug: string;
  token: string;
  machineId: string;
  machineSlug?: string;
  nameEn: string;
  nameFr: string;
  category: string;
  en: Localized;
  fr: Localized;
  imageUrls?: string[];
  initialLang?: Lang;
};

export function MachineGuide({
  gymName,
  gymColor,
  gymSlug,
  token,
  machineId,
  machineSlug,
  nameEn,
  nameFr,
  category,
  en,
  fr,
  imageUrls = [],
  initialLang = "en",
}: Props) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [added, setAdded] = useState(false);
  const data = lang === "fr" ? fr : en;

  const copy = useMemo(
    () =>
      lang === "fr"
        ? {
            steps: "Étapes",
            tips: "Conseils",
            warnings: "Avertissements",
            muscles: "Muscles",
            views: "vues",
            report: "Signaler un problème",
            placeholder: "Ex. : coussin desserré, câble usé…",
            send: "Envoyer",
            thanks: "Merci — le staff a été notifié.",
            scan: "Retour aux machines",
            error: "Échec de l'envoi. Réessayez.",
            addWorkout: "Ajouter à l'entraînement",
            added: "Ajouté — voir l'entraînement",
            openWorkout: "Ouvrir l'entraînement",
            addPhotos: "Ajoutez des photos dans l'admin",
          }
        : {
            steps: "Steps",
            tips: "Tips",
            warnings: "Warnings",
            muscles: "Muscles",
            views: "views",
            report: "Report an issue",
            placeholder: "e.g. loose pad, frayed cable…",
            send: "Submit",
            thanks: "Thanks — staff has been notified.",
            scan: "Back to machines",
            error: "Could not send. Try again.",
            addWorkout: "Add to workout",
            added: "Added — view workout",
            openWorkout: "Open workout",
            addPhotos: "Add photos in admin",
          },
    [lang]
  );

  async function submitIssue(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, note }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("sent");
      setNote("");
    } catch {
      setStatus("error");
    }
  }

  function onAddToWorkout() {
    addMachineToWorkout(gymSlug, {
      id: machineId,
      token,
      nameEn,
      nameFr,
      category,
      slug: machineSlug,
    });
    setAdded(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-xs uppercase tracking-wider" style={{ color: gymColor }}>
            {gymName}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        </div>
        <div className="flex rounded-xl border border-border overflow-hidden text-sm font-semibold">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 ${lang === "en" ? "bg-yellow-400 text-black" : "bg-slate-900 text-slate-300"}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={`px-3 py-1.5 ${lang === "fr" ? "bg-yellow-400 text-black" : "bg-slate-900 text-slate-300"}`}
          >
            FR
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="badge">{data.category}</span>
        {data.muscleGroups && (
          <span className="badge !bg-violet-400/10 !text-violet-200 !border-violet-400/25">
            {copy.muscles}: {data.muscleGroups}
          </span>
        )}
        <span className="badge !bg-slate-400/10 !text-slate-300 !border-slate-400/20">
          {data.viewCount} {copy.views}
        </span>
      </div>

      
      {(imageUrls?.length ?? 0) > 0 ? (
        <div className="mb-6 -mx-1">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {imageUrls!.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="snap-center shrink-0 w-[min(100%,320px)] aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl border border-dashed border-border bg-slate-900/50 px-4 py-8 text-center">
          <p className="text-sm text-slate-400">{copy.addPhotos}</p>
        </div>
      )}

      {data.description && <p className="text-slate-300 mb-6 leading-relaxed">{data.description}</p>}

      <div className="mb-5">
        {added ? (
          <Link
            href="/?tab=workout"
            className="btn btn-primary w-full !py-3.5"
            style={{ background: gymColor || "#0060A9", color: "#000" }}
          >
            {copy.added}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAddToWorkout}
            className="btn btn-primary w-full !py-3.5"
            style={{ background: gymColor || "#0060A9", color: "#000" }}
          >
            {copy.addWorkout}
          </button>
        )}
      </div>

      <section className="card p-5 mb-4">
        <h2 className="font-semibold text-lg mb-3">{copy.steps}</h2>
        <ol className="space-y-3">
          {data.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-slate-200">
              <span className="font-mono text-yellow-300 shrink-0 w-7">{String(i + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {data.tips.length > 0 && (
        <section className="card p-5 mb-4 border-emerald-400/20">
          <h2 className="font-semibold text-lg mb-3 text-emerald-300">{copy.tips}</h2>
          <ul className="space-y-2 text-slate-300">
            {data.tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-300">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.warnings.length > 0 && (
        <section className="card p-5 mb-4 border-rose-400/25">
          <h2 className="font-semibold text-lg mb-3 text-rose-300">{copy.warnings}</h2>
          <ul className="space-y-2 text-slate-300">
            {data.warnings.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-rose-300">!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card p-5 mb-6">
        <h2 className="font-semibold mb-3">{copy.report}</h2>
        {status === "sent" ? (
          <p className="text-emerald-300 text-sm">{copy.thanks}</p>
        ) : (
          <form onSubmit={submitIssue} className="space-y-3">
            <textarea
              className="input min-h-[88px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={copy.placeholder}
            />
            {status === "error" && <p className="text-rose-300 text-sm">{copy.error}</p>}
            <button type="submit" className="btn btn-secondary" disabled={status === "sending"}>
              {status === "sending" ? "…" : copy.send}
            </button>
          </form>
        )}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/?tab=workout" className="btn btn-secondary w-full">
          {copy.openWorkout}
        </Link>
        <Link href="/" className="btn btn-primary w-full">
          {copy.scan}
        </Link>
      </div>
    </div>
  );
}
