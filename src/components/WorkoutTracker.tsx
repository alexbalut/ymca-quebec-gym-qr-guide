"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  addMachineToWorkout,
  clearWorkout,
  emptyWorkout,
  isCardio,
  loadWorkout,
  newId,
  saveSessionToHistory,
  saveWorkout,
  type AddableMachine,
  type StrengthSet,
  type WorkoutExercise,
  type WorkoutSession,
} from "@/lib/workout";

type Lang = "en" | "fr";

type Props = {
  gymSlug: string;
  gymColor: string;
  machines: AddableMachine[];
  lang: Lang;
  /** Called after a workout is saved to history (e.g. switch to Progress tab). */
  onSaved?: () => void;
};

export function WorkoutTracker({ gymSlug, gymColor, machines, lang, onSaved }: Props) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const t = useMemo(
    () =>
      lang === "fr"
        ? {
            title: "Entraînement",
            empty: "Aucun exercice pour l'instant. Ajoutez une machine pour commencer.",
            add: "Ajouter une machine",
            pick: "Choisir une machine",
            close: "Fermer",
            sets: "Séries",
            addSet: "Ajouter une série",
            reps: "Répétitions",
            weight: "Poids (kg)",
            optional: "optionnel",
            time: "Durée",
            minutes: "Min",
            seconds: "Sec",
            distance: "Distance (km)",
            saveDuration: "Enregistrer",
            removeSet: "Retirer",
            removeExercise: "Retirer l'exercice",
            finish: "Terminer",
            clear: "Effacer",
            save: "Sauvegarder",
            saveConfirm: "Sauvegarder cet entraînement dans votre historique ?",
            finishConfirm: "Terminer et effacer cet entraînement sans le sauvegarder ?",
            clearConfirm: "Effacer l'entraînement en cours ?",
            done: "Entraînement terminé. Bravo!",
            saved: "Entraînement sauvegardé!",
            inWorkout: "Déjà dans l'entraînement",
            guide: "Guide",
            noMachines: "Aucune machine active.",
            setN: "Série",
            cardioHint: "Entrez la durée (et la distance si vous voulez).",
            strengthHint: "Ajoutez des séries avec répétitions et poids optionnel.",
          }
        : {
            title: "Workout",
            empty: "No exercises yet. Add a machine to start logging.",
            add: "Add a machine",
            pick: "Pick a machine",
            close: "Close",
            sets: "Sets",
            addSet: "Add set",
            reps: "Reps",
            weight: "Weight (kg)",
            optional: "optional",
            time: "Duration",
            minutes: "Min",
            seconds: "Sec",
            distance: "Distance (km)",
            saveDuration: "Save",
            removeSet: "Remove",
            removeExercise: "Remove exercise",
            finish: "Finish",
            clear: "Clear",
            save: "Save",
            saveConfirm: "Save this workout to your history?",
            finishConfirm: "Finish and clear this workout without saving?",
            clearConfirm: "Clear the in-progress workout?",
            done: "Workout finished. Nice work!",
            saved: "Workout saved!",
            inWorkout: "Already in workout",
            guide: "Guide",
            noMachines: "No active machines.",
            setN: "Set",
            cardioHint: "Log time (and distance if you like).",
            strengthHint: "Add sets with reps and optional weight.",
          },
    [lang]
  );

  useEffect(() => {
    setSession(loadWorkout(gymSlug) ?? emptyWorkout(gymSlug));
    setHydrated(true);
  }, [gymSlug]);

  const persist = useCallback(
    (next: WorkoutSession) => {
      setSession(next);
      if (next.exercises.length === 0 && !next.startedAt) {
        clearWorkout(gymSlug);
      } else {
        saveWorkout(next);
      }
    },
    [gymSlug]
  );

  function showFlash(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  function addMachine(m: AddableMachine) {
    const next = addMachineToWorkout(gymSlug, m);
    setSession(next);
    setPickerOpen(false);
  }

  function removeExercise(exerciseId: string) {
    if (!session) return;
    const exercises = session.exercises.filter((e) => e.id !== exerciseId);
    const next = { ...session, exercises };
    if (exercises.length === 0) {
      clearWorkout(gymSlug);
      setSession(emptyWorkout(gymSlug));
    } else {
      persist(next);
    }
  }

  function updateExercise(exerciseId: string, patch: Partial<WorkoutExercise>) {
    if (!session) return;
    persist({
      ...session,
      exercises: session.exercises.map((e) => (e.id === exerciseId ? { ...e, ...patch } : e)),
    });
  }

  function addSet(exerciseId: string, reps: number, weightKg?: number) {
    if (!session) return;
    const set: StrengthSet = { id: newId(), reps, weightKg };
    persist({
      ...session,
      exercises: session.exercises.map((e) =>
        e.id === exerciseId ? { ...e, sets: [...(e.sets ?? []), set] } : e
      ),
    });
  }

  function removeSet(exerciseId: string, setId: string) {
    if (!session) return;
    persist({
      ...session,
      exercises: session.exercises.map((e) =>
        e.id === exerciseId ? { ...e, sets: (e.sets ?? []).filter((s) => s.id !== setId) } : e
      ),
    });
  }

  function finishOrClear(kind: "finish" | "clear") {
    if (!session || session.exercises.length === 0) return;
    const ok = window.confirm(kind === "finish" ? t.finishConfirm : t.clearConfirm);
    if (!ok) return;
    clearWorkout(gymSlug);
    setSession(emptyWorkout(gymSlug));
    if (kind === "finish") showFlash(t.done);
  }

  function saveToHistory() {
    if (!session || session.exercises.length === 0) return;
    const ok = window.confirm(t.saveConfirm);
    if (!ok) return;
    const saved = saveSessionToHistory(session);
    if (!saved) return;
    clearWorkout(gymSlug);
    setSession(emptyWorkout(gymSlug));
    showFlash(t.saved);
    window.setTimeout(() => onSaved?.(), 600);
  }

  const inWorkoutIds = useMemo(
    () => new Set(session?.exercises.map((e) => e.machineId) ?? []),
    [session]
  );

  if (!hydrated || !session) {
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
        {session.exercises.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={() => finishOrClear("clear")}
              className="btn btn-secondary !py-2 !px-3 text-sm"
            >
              {t.clear}
            </button>
            <button
              type="button"
              onClick={() => finishOrClear("finish")}
              className="btn btn-secondary !py-2 !px-3 text-sm"
            >
              {t.finish}
            </button>
            <button
              type="button"
              onClick={saveToHistory}
              className="btn btn-primary !py-2 !px-3 text-sm"
              style={{ background: gymColor || "#0060A9", color: "#000" }}
            >
              {t.save}
            </button>
          </div>
        )}
      </div>

      {flash && (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {flash}
        </p>
      )}

      {session.exercises.length === 0 ? (
        <p className="text-slate-400 text-sm">{t.empty}</p>
      ) : (
        <ul className="space-y-4">
          {session.exercises.map((ex) => (
            <li key={ex.id} className="card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">
                    {lang === "fr" ? ex.nameFr : ex.nameEn}
                  </p>
                  <p className="text-slate-500 text-sm truncate">
                    {lang === "fr" ? ex.nameEn : ex.nameFr}
                  </p>
                  <span className="badge mt-2">{ex.category}</span>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Link href={`/q/${ex.token}`} className="text-xs text-slate-400 hover:text-yellow-300">
                    {t.guide}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeExercise(ex.id)}
                    className="text-xs text-rose-300/90 hover:text-rose-200"
                  >
                    {t.removeExercise}
                  </button>
                </div>
              </div>

              {isCardio(ex.category) ? (
                <CardioEditor
                  exercise={ex}
                  t={t}
                  onSave={(minutes, seconds, distanceKm) =>
                    updateExercise(ex.id, { minutes, seconds, distanceKm })
                  }
                />
              ) : (
                <StrengthEditor
                  exercise={ex}
                  t={t}
                  onAddSet={addSet}
                  onRemoveSet={removeSet}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setPickerOpen((v) => !v)}
        className="btn btn-primary w-full !py-3.5 text-base"
        style={{ background: gymColor || "#0060A9", color: "#000" }}
      >
        {pickerOpen ? t.close : t.add}
      </button>

      {pickerOpen && (
        <section className="card p-4 space-y-2">
          <h3 className="font-medium text-slate-200 mb-2">{t.pick}</h3>
          {machines.length === 0 ? (
            <p className="text-sm text-slate-400">{t.noMachines}</p>
          ) : (
            <ul className="space-y-2 max-h-[50vh] overflow-y-auto">
              {machines.map((m) => {
                const taken = inWorkoutIds.has(m.id);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      disabled={taken}
                      onClick={() => addMachine(m)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition flex items-center justify-between gap-3 min-h-[52px] ${
                        taken
                          ? "border-border/50 opacity-50 cursor-not-allowed"
                          : "border-border hover:border-yellow-400/40 bg-black/30"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="font-medium block truncate">
                          {lang === "fr" ? m.nameFr : m.nameEn}
                        </span>
                        <span className="text-slate-500 text-sm">{m.category}</span>
                      </span>
                      {taken ? (
                        <span className="text-xs text-slate-500 shrink-0">{t.inWorkout}</span>
                      ) : (
                        <span className="text-yellow-300 text-xl font-bold shrink-0" aria-hidden>
                          +
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

type Copy = {
  sets: string;
  addSet: string;
  reps: string;
  weight: string;
  optional: string;
  time: string;
  minutes: string;
  seconds: string;
  distance: string;
  saveDuration: string;
  removeSet: string;
  setN: string;
  cardioHint: string;
  strengthHint: string;
};

function StrengthEditor({
  exercise,
  t,
  onAddSet,
  onRemoveSet,
}: {
  exercise: WorkoutExercise;
  t: Copy;
  onAddSet: (exerciseId: string, reps: number, weightKg?: number) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
}) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const sets = exercise.sets ?? [];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = parseInt(reps, 10);
    if (!Number.isFinite(r) || r <= 0) return;
    const wRaw = weight.trim();
    const w = wRaw === "" ? undefined : parseFloat(wRaw);
    if (w !== undefined && (!Number.isFinite(w) || w < 0)) return;
    onAddSet(exercise.id, r, w);
    setReps("");
    // keep weight for quick consecutive sets
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{t.strengthHint}</p>
      {sets.length > 0 && (
        <ul className="space-y-2">
          {sets.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-black/35 border border-border px-3 py-2.5"
            >
              <span className="text-sm text-slate-200">
                <span className="text-slate-500 mr-2">
                  {t.setN} {i + 1}
                </span>
                <strong>{s.reps}</strong> {t.reps.toLowerCase()}
                {s.weightKg != null && (
                  <>
                    {" · "}
                    <strong>{s.weightKg}</strong> kg
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={() => onRemoveSet(exercise.id, s.id)}
                className="text-xs text-slate-400 hover:text-rose-300 min-h-[36px] min-w-[56px]"
              >
                {t.removeSet}
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={submit} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
        <label className="block">
          <span className="label">{t.reps} *</span>
          <input
            className="input !py-3 text-base"
            inputMode="numeric"
            pattern="[0-9]*"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="12"
            required
          />
        </label>
        <label className="block">
          <span className="label">
            {t.weight}{" "}
            <span className="text-slate-500 font-normal">({t.optional})</span>
          </span>
          <input
            className="input !py-3 text-base"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="60"
          />
        </label>
        <button type="submit" className="btn btn-secondary !py-3 !px-4 min-h-[48px]">
          {t.addSet}
        </button>
      </form>
    </div>
  );
}

function CardioEditor({
  exercise,
  t,
  onSave,
}: {
  exercise: WorkoutExercise;
  t: Copy;
  onSave: (minutes: number, seconds: number, distanceKm?: number) => void;
}) {
  const [minutes, setMinutes] = useState(String(exercise.minutes ?? 0));
  const [seconds, setSeconds] = useState(String(exercise.seconds ?? 0));
  const [distance, setDistance] = useState(
    exercise.distanceKm != null ? String(exercise.distanceKm) : ""
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMinutes(String(exercise.minutes ?? 0));
    setSeconds(String(exercise.seconds ?? 0));
    setDistance(exercise.distanceKm != null ? String(exercise.distanceKm) : "");
  }, [exercise.id, exercise.minutes, exercise.seconds, exercise.distanceKm]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    let min = parseInt(minutes, 10) || 0;
    let sec = parseInt(seconds, 10) || 0;
    if (sec >= 60) {
      min += Math.floor(sec / 60);
      sec = sec % 60;
    }
    if (min < 0 || sec < 0) return;
    const dRaw = distance.trim();
    const d = dRaw === "" ? undefined : parseFloat(dRaw);
    if (d !== undefined && (!Number.isFinite(d) || d < 0)) return;
    onSave(min, sec, d);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  const hasLog =
    (exercise.minutes ?? 0) > 0 || (exercise.seconds ?? 0) > 0 || exercise.distanceKm != null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{t.cardioHint}</p>
      {hasLog && (
        <p className="rounded-xl bg-black/35 border border-border px-3 py-2.5 text-sm text-slate-200">
          {String(exercise.minutes ?? 0).padStart(2, "0")}:
          {String(exercise.seconds ?? 0).padStart(2, "0")}
          {exercise.distanceKm != null && (
            <>
              {" · "}
              {exercise.distanceKm} km
            </>
          )}
        </p>
      )}
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="label">{t.minutes}</span>
            <input
              className="input !py-3 text-base"
              inputMode="numeric"
              pattern="[0-9]*"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="20"
            />
          </label>
          <label className="block">
            <span className="label">{t.seconds}</span>
            <input
              className="input !py-3 text-base"
              inputMode="numeric"
              pattern="[0-9]*"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              placeholder="0"
            />
          </label>
        </div>
        <label className="block">
          <span className="label">
            {t.distance}{" "}
            <span className="text-slate-500 font-normal">({t.optional})</span>
          </span>
          <input
            className="input !py-3 text-base"
            inputMode="decimal"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="3.5"
          />
        </label>
        <button type="submit" className="btn btn-secondary w-full !py-3 min-h-[48px]">
          {saved ? "✓" : t.saveDuration}
        </button>
      </form>
    </div>
  );
}
