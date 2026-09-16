/** Client-side in-progress workout + saved history (localStorage, no login). */

export type StrengthSet = {
  id: string;
  reps: number;
  weightKg?: number;
};

export type WorkoutExercise = {
  id: string;
  machineId: string;
  token: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug?: string;
  /** Strength / non-cardio */
  sets?: StrengthSet[];
  /** Cardio */
  minutes?: number;
  seconds?: number;
  distanceKm?: number;
};

export type WorkoutSession = {
  gymSlug: string;
  startedAt: string;
  exercises: WorkoutExercise[];
};

/** Snapshot of one exercise inside a saved workout. */
export type SavedExercise = {
  machineId: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug: string;
  sets?: Array<{ reps: number; weightKg?: number }>;
  minutes?: number;
  seconds?: number;
  distanceKm?: number;
};

export type SavedWorkout = {
  id: string;
  gymSlug: string;
  savedAt: string;
  startedAt: string;
  exercises: SavedExercise[];
};

export type MachineProgress = {
  machineId: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug: string;
  timesUsed: number;
  lastUsedAt: string;
  /** Strength */
  totalSets: number;
  heaviestKg: number | null;
  lastSetsSummary: string | null;
  /** Cardio — durations in total seconds */
  lastDurationSec: number | null;
  bestDurationSec: number | null;
  totalDurationSec: number;
  recent: Array<{
    savedAt: string;
    summary: string;
  }>;
};

export function isCardio(category: string): boolean {
  return category.trim().toLowerCase() === "cardio";
}

export function workoutStorageKey(gymSlug: string): string {
  return `ymca-quebec-workout:v1:${gymSlug}`;
}

export function historyStorageKey(gymSlug: string): string {
  return `ymca-quebec-workout-history:v1:${gymSlug}`;
}

export function loadWorkout(gymSlug: string): WorkoutSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(workoutStorageKey(gymSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkoutSession;
    if (!parsed || parsed.gymSlug !== gymSlug || !Array.isArray(parsed.exercises)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkout(session: WorkoutSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(workoutStorageKey(session.gymSlug), JSON.stringify(session));
}

export function clearWorkout(gymSlug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(workoutStorageKey(gymSlug));
}

export function emptyWorkout(gymSlug: string): WorkoutSession {
  return {
    gymSlug,
    startedAt: new Date().toISOString(),
    exercises: [],
  };
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type AddableMachine = {
  id: string;
  token: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug?: string;
};

/** Add a machine to the gym's in-progress workout (creates session if needed). */
export function addMachineToWorkout(gymSlug: string, machine: AddableMachine): WorkoutSession {
  const existing = loadWorkout(gymSlug) ?? emptyWorkout(gymSlug);
  const already = existing.exercises.find((e) => e.machineId === machine.id);
  if (already) return existing;

  const entry: WorkoutExercise = {
    id: newId(),
    machineId: machine.id,
    token: machine.token,
    nameEn: machine.nameEn,
    nameFr: machine.nameFr,
    category: machine.category,
    slug: machine.slug,
  };

  if (isCardio(machine.category)) {
    entry.minutes = 0;
    entry.seconds = 0;
  } else {
    entry.sets = [];
  }

  const next = { ...existing, exercises: [...existing.exercises, entry] };
  saveWorkout(next);
  return next;
}

export function loadHistory(gymSlug: string): SavedWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(historyStorageKey(gymSlug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedWorkout[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((w) => w && w.gymSlug === gymSlug && Array.isArray(w.exercises));
  } catch {
    return [];
  }
}

function writeHistory(gymSlug: string, history: SavedWorkout[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(historyStorageKey(gymSlug), JSON.stringify(history));
}

/** Persist current in-progress session as a completed workout; returns the saved record. */
export function saveSessionToHistory(session: WorkoutSession): SavedWorkout | null {
  if (!session.exercises.length) return null;

  const exercises: SavedExercise[] = session.exercises.map((ex) => {
    const base: SavedExercise = {
      machineId: ex.machineId,
      nameEn: ex.nameEn,
      nameFr: ex.nameFr,
      category: ex.category,
      slug: ex.slug ?? "",
    };
    if (isCardio(ex.category)) {
      base.minutes = ex.minutes ?? 0;
      base.seconds = ex.seconds ?? 0;
      if (ex.distanceKm != null) base.distanceKm = ex.distanceKm;
    } else {
      base.sets = (ex.sets ?? []).map((s) => ({
        reps: s.reps,
        ...(s.weightKg != null ? { weightKg: s.weightKg } : {}),
      }));
    }
    return base;
  });

  const saved: SavedWorkout = {
    id: newId(),
    gymSlug: session.gymSlug,
    savedAt: new Date().toISOString(),
    startedAt: session.startedAt,
    exercises,
  };

  const history = loadHistory(session.gymSlug);
  history.unshift(saved);
  writeHistory(session.gymSlug, history);
  return saved;
}

export function durationSeconds(minutes?: number, seconds?: number): number {
  return Math.max(0, (minutes ?? 0) * 60 + (seconds ?? 0));
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function strengthSummary(sets: Array<{ reps: number; weightKg?: number }>): string {
  if (!sets.length) return "—";
  return sets
    .map((s) => (s.weightKg != null ? `${s.reps}×${s.weightKg}kg` : `${s.reps} reps`))
    .join(", ");
}

function cardioSummary(ex: SavedExercise): string {
  const dur = formatDuration(durationSeconds(ex.minutes, ex.seconds));
  if (ex.distanceKm != null) return `${dur} · ${ex.distanceKm} km`;
  return dur;
}

/** Aggregate per-machine stats from saved workout history (newest first). */
export function buildMachineProgress(history: SavedWorkout[]): MachineProgress[] {
  const map = new Map<string, MachineProgress>();

  for (const workout of history) {
    for (const ex of workout.exercises) {
      let acc = map.get(ex.machineId);
      if (!acc) {
        acc = {
          machineId: ex.machineId,
          nameEn: ex.nameEn,
          nameFr: ex.nameFr,
          category: ex.category,
          slug: ex.slug,
          timesUsed: 0,
          lastUsedAt: workout.savedAt,
          totalSets: 0,
          heaviestKg: null,
          lastSetsSummary: null,
          lastDurationSec: null,
          bestDurationSec: null,
          totalDurationSec: 0,
          recent: [],
        };
        map.set(ex.machineId, acc);
      }

      acc.timesUsed += 1;
      if (workout.savedAt > acc.lastUsedAt) acc.lastUsedAt = workout.savedAt;

      // Prefer richer name/slug from later entries
      acc.nameEn = ex.nameEn || acc.nameEn;
      acc.nameFr = ex.nameFr || acc.nameFr;
      if (ex.slug) acc.slug = ex.slug;

      if (isCardio(ex.category)) {
        const sec = durationSeconds(ex.minutes, ex.seconds);
        if (acc.lastDurationSec == null) acc.lastDurationSec = sec;
        acc.bestDurationSec =
          acc.bestDurationSec == null ? sec : Math.max(acc.bestDurationSec, sec);
        acc.totalDurationSec += sec;
        if (acc.recent.length < 5) {
          acc.recent.push({ savedAt: workout.savedAt, summary: cardioSummary(ex) });
        }
      } else {
        const sets = ex.sets ?? [];
        acc.totalSets += sets.length;
        for (const s of sets) {
          if (s.weightKg != null) {
            acc.heaviestKg =
              acc.heaviestKg == null ? s.weightKg : Math.max(acc.heaviestKg, s.weightKg);
          }
        }
        if (acc.lastSetsSummary == null) {
          acc.lastSetsSummary = strengthSummary(sets);
        }
        if (acc.recent.length < 5) {
          acc.recent.push({
            savedAt: workout.savedAt,
            summary: strengthSummary(sets),
          });
        }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.lastUsedAt < b.lastUsedAt ? 1 : -1
  );
}
