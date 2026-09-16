"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildMachineProgress,
  formatDuration,
  isCardio,
  loadHistory,
  type MachineProgress,
} from "@/lib/workout";

type Lang = "en" | "fr";

type Props = {
  gymSlug: string;
  gymColor: string;
  lang: Lang;
};

function formatDate(iso: string, lang: Lang): string {
  try {
    return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function ProgressDashboard({ gymSlug, gymColor, lang }: Props) {
  const [rows, setRows] = useState<MachineProgress[] | null>(null);

  const t = useMemo(
    () =>
      lang === "fr"
        ? {
            title: "Progrès",
            empty: "Aucun entraînement enregistré. Sauvegardez une séance depuis l'onglet Entraînement.",
            timesUsed: "Utilisations",
            lastUsed: "Dernière fois",
            totalSets: "Séries totales",
            heaviest: "Poids max",
            lastSession: "Dernière séance",
            lastDuration: "Dernière durée",
            bestDuration: "Meilleure durée",
            totalTime: "Temps total",
            history: "Historique récent",
          }
        : {
            title: "Progress",
            empty: "No saved workouts yet. Save a session from the Workout tab.",
            timesUsed: "Times used",
            lastUsed: "Last used",
            totalSets: "Total sets",
            heaviest: "Heaviest",
            lastSession: "Last session",
            lastDuration: "Last duration",
            bestDuration: "Best duration",
            totalTime: "Total time",
            history: "Recent history",
          },
    [lang]
  );

  useEffect(() => {
    setRows(buildMachineProgress(loadHistory(gymSlug)));
  }, [gymSlug]);

  // Re-read when tab becomes visible again (e.g. after Save navigation)
  useEffect(() => {
    function refresh() {
      setRows(buildMachineProgress(loadHistory(gymSlug)));
    }
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [gymSlug]);

  if (rows == null) {
    return (
      <div className="card p-6 text-center text-slate-400 text-sm" aria-busy="true">
        …
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-200 text-lg">{t.title}</h2>
        {rows.length > 0 && (
          <span className="text-xs text-slate-500">
            {rows.length} {lang === "fr" ? "machines" : "machines"}
          </span>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-400 text-sm card p-5">{t.empty}</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((m) => (
            <li key={m.machineId} className="card p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {lang === "fr" ? m.nameFr : m.nameEn}
                  </p>
                  <p className="text-slate-500 text-sm truncate">
                    {lang === "fr" ? m.nameEn : m.nameFr}
                  </p>
                  <span className="badge mt-2">{m.category}</span>
                </div>
                <div className="text-right shrink-0 text-xs text-slate-400">
                  <p>
                    <span className="text-slate-500">{t.timesUsed}</span>
                    <br />
                    <strong className="text-slate-200 text-base">{m.timesUsed}</strong>
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-black/35 border border-border px-3 py-2.5">
                  <dt className="text-xs text-slate-500">{t.lastUsed}</dt>
                  <dd className="font-medium text-slate-200 mt-0.5">
                    {formatDate(m.lastUsedAt, lang)}
                  </dd>
                </div>

                {isCardio(m.category) ? (
                  <>
                    <div className="rounded-xl bg-black/35 border border-border px-3 py-2.5">
                      <dt className="text-xs text-slate-500">{t.lastDuration}</dt>
                      <dd className="font-medium text-slate-200 mt-0.5">
                        {m.lastDurationSec != null ? formatDuration(m.lastDurationSec) : "—"}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-black/35 border border-border px-3 py-2.5">
                      <dt className="text-xs text-slate-500">{t.bestDuration}</dt>
                      <dd className="font-medium mt-0.5" style={{ color: gymColor || "#0060A9" }}>
                        {m.bestDurationSec != null ? formatDuration(m.bestDurationSec) : "—"}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-black/35 border border-border px-3 py-2.5">
                      <dt className="text-xs text-slate-500">{t.totalTime}</dt>
                      <dd className="font-medium text-slate-200 mt-0.5">
                        {formatDuration(m.totalDurationSec)}
                      </dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl bg-black/35 border border-border px-3 py-2.5">
                      <dt className="text-xs text-slate-500">{t.totalSets}</dt>
                      <dd className="font-medium text-slate-200 mt-0.5">{m.totalSets}</dd>
                    </div>
                    <div className="rounded-xl bg-black/35 border border-border px-3 py-2.5">
                      <dt className="text-xs text-slate-500">{t.heaviest}</dt>
                      <dd className="font-medium mt-0.5" style={{ color: gymColor || "#0060A9" }}>
                        {m.heaviestKg != null ? `${m.heaviestKg} kg` : "—"}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-black/35 border border-border px-3 py-2.5 col-span-2">
                      <dt className="text-xs text-slate-500">{t.lastSession}</dt>
                      <dd className="font-medium text-slate-200 mt-0.5 break-words">
                        {m.lastSetsSummary ?? "—"}
                      </dd>
                    </div>
                  </>
                )}
              </dl>

              {m.recent.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">{t.history}</p>
                  <ul className="space-y-1.5">
                    {m.recent.map((r, i) => (
                      <li
                        key={`${r.savedAt}-${i}`}
                        className="flex items-baseline justify-between gap-3 text-sm border-b border-border/60 pb-1.5 last:border-0"
                      >
                        <span className="text-slate-400 shrink-0">{formatDate(r.savedAt, lang)}</span>
                        <span className="text-slate-200 text-right truncate">{r.summary}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
