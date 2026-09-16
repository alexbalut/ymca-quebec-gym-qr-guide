"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { QrScanner } from "@/components/QrScanner";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { ProgressDashboard } from "@/components/ProgressDashboard";

type MachineRow = {
  id: string;
  token: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug: string;
};

type Props = {
  gym: {
    name: string;
    tagline: string | null;
    city: string | null;
    primaryColor: string;
    slug: string;
    initials?: string;
  };
  machines: MachineRow[];
};

type Mode = "browse" | "workout" | "progress" | "scan" | "code";

function modeFromParam(raw: string | null): Mode | null {
  if (
    raw === "workout" ||
    raw === "progress" ||
    raw === "scan" ||
    raw === "code" ||
    raw === "browse" ||
    raw === "machines"
  ) {
    return raw === "machines" ? "browse" : raw;
  }
  return null;
}

export function GymHome({ gym, machines }: Props) {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [mode, setMode] = useState<Mode>("browse");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fromUrl = modeFromParam(searchParams.get("tab") ?? searchParams.get("mode"));
    if (fromUrl) setMode(fromUrl);
  }, [searchParams]);

  function go(next: Mode) {
    setMode(next);
    if (next === "browse") {
      router.replace("/", { scroll: false });
      return;
    }
    const tab = next;
    router.replace(`/?tab=${tab}`, { scroll: false });
  }

  const t = useMemo(
    () =>
      lang === "fr"
        ? {
            welcome: "Bienvenue",
            brandTagline: gym.tagline || "We build strong kids, families, communities",
            subtitle: "Scannez un QR ou choisissez une machine pour voir le guide.",
            scan: "Scanner",
            enterCode: "Entrer un code",
            browse: "Machines",
            workout: "Entraînement",
            progress: "Progrès",
            back: "Retour",
            staff: "Espace staff",
            empty: "Aucune machine active pour le moment.",
            scanFull: "Scanner une machine",
          }
        : {
            welcome: "Welcome",
            brandTagline: gym.tagline || "We build strong kids, families, communities",
            subtitle: "Scan a QR or pick a machine to open its how-to guide.",
            scan: "Scan",
            enterCode: "Enter code",
            browse: "Machines",
            workout: "Workout",
            progress: "Progress",
            back: "Back",
            staff: "Staff",
            empty: "No active machines yet.",
            scanFull: "Scan a machine",
          },
    [lang, gym.tagline]
  );

  const tabClass = (active: boolean) =>
    `flex-1 min-h-[48px] px-2 py-2.5 text-sm sm:text-base font-bold rounded-xl transition ${
      active ? "text-black" : "bg-[#353535] text-neutral-300 hover:text-white"
    }`;
  const tabStyle = (active: boolean): CSSProperties =>
    active ? { backgroundColor: gym.primaryColor, color: "#000" } : {};

  return (
    <div className="mx-auto max-w-xl px-4 py-8 w-full flex-1">
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold border"
              style={{
                backgroundColor: `${gym.primaryColor}22`,
                color: gym.primaryColor,
                borderColor: `${gym.primaryColor}55`,
              }}
            >
              {gym.initials || "YM"}
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-slate-400">{t.welcome}</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{gym.name}</h1>
              <p className="text-sm text-neutral-400 mt-1">
                {t.brandTagline}
                {gym.city ? ` · ${gym.city}` : ""}
              </p>
            </div>
          </div>
          <div className="flex rounded-xl border border-border overflow-hidden text-sm font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 ${lang === "en" ? "text-black" : "bg-[#353535] text-neutral-300"}`}
              style={lang === "en" ? { backgroundColor: gym.primaryColor } : undefined}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`px-2.5 py-1.5 ${lang === "fr" ? "text-black" : "bg-[#353535] text-neutral-300"}`}
              style={lang === "fr" ? { backgroundColor: gym.primaryColor } : undefined}
            >
              FR
            </button>
          </div>
        </div>
        {(mode === "browse" || mode === "workout" || mode === "progress") && (
          <p className="mt-4 text-slate-300">{t.subtitle}</p>
        )}
      </header>

      <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6" aria-label="Member navigation">
        <button type="button" onClick={() => go("browse")} className={tabClass(mode === "browse")} style={tabStyle(mode === "browse")}>
          {t.browse}
        </button>
        <button
          type="button"
          onClick={() => go("workout")}
          className={tabClass(mode === "workout")} style={tabStyle(mode === "workout")}
        >
          {t.workout}
        </button>
        <button
          type="button"
          onClick={() => go("progress")}
          className={tabClass(mode === "progress")} style={tabStyle(mode === "progress")}
        >
          {t.progress}
        </button>
        <button type="button" onClick={() => go("scan")} className={tabClass(mode === "scan")} style={tabStyle(mode === "scan")}>
          {t.scan}
        </button>
      </nav>

      {mode === "browse" && (
        <>
          <div className="grid grid-cols-1 gap-3 mb-8">
            <button type="button" onClick={() => go("code")} className="btn btn-secondary !py-3">
              {t.enterCode}
            </button>
          </div>

          <section>
            <h2 className="font-semibold mb-3 text-slate-200">
              {t.browse}
              <span className="text-slate-500 font-normal text-sm ml-2">({machines.length})</span>
            </h2>
            {machines.length === 0 ? (
              <p className="text-slate-400 text-sm">{t.empty}</p>
            ) : (
              <ul className="space-y-2">
                {machines.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/q/${m.token}`}
                      className="card px-4 py-3 flex items-center justify-between gap-3 hover:border-yellow-400/40 transition"
                    >
                      <span className="min-w-0">
                        <span className="font-medium block truncate">
                          {lang === "fr" ? m.nameFr : m.nameEn}
                        </span>
                        <span className="text-slate-500 text-sm truncate block">
                          {lang === "fr" ? m.nameEn : m.nameFr}
                        </span>
                      </span>
                      <span className="badge shrink-0">{m.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {mode === "workout" && (
        <WorkoutTracker
          gymSlug={gym.slug}
          gymColor={gym.primaryColor}
          lang={lang}
          onSaved={() => go("progress")}
          machines={machines.map((m) => ({
            id: m.id,
            token: m.token,
            nameEn: m.nameEn,
            nameFr: m.nameFr,
            category: m.category,
            slug: m.slug,
          }))}
        />
      )}

      {mode === "progress" && (
        <ProgressDashboard gymSlug={gym.slug} gymColor={gym.primaryColor} lang={lang} />
      )}

      {mode === "scan" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">{t.scanFull}</h2>
          <QrScanner />
          <button
            type="button"
            onClick={() => go("code")}
            className="mt-4 text-sm text-slate-400 hover:text-yellow-300 w-full text-center"
          >
            {t.enterCode}
          </button>
        </section>
      )}

      {mode === "code" && (
        <section>
          <button
            type="button"
            onClick={() => go("browse")}
            className="text-sm text-slate-400 hover:text-yellow-300 mb-4"
          >
            ← {t.back}
          </button>
          <h2 className="text-xl font-semibold mb-4">{t.enterCode}</h2>
          <CodeEntry />
        </section>
      )}

      <p className="mt-10 text-center text-xs text-slate-500">
        <Link href="/admin/login" className="hover:text-slate-300 underline-offset-2 hover:underline">
          {t.staff}
        </Link>
      </p>
    </div>
  );
}

function CodeEntry() {
  const router = useRouter();
  const [manual, setManual] = useState("");
  const [error, setError] = useState<string | null>(null);

  function extractToken(raw: string): string | null {
    const text = raw.trim();
    try {
      const url = new URL(text);
      const parts = url.pathname.split("/").filter(Boolean);
      const qi = parts.indexOf("q");
      if (qi >= 0 && parts[qi + 1]) return parts[qi + 1];
      const mi = parts.indexOf("m");
      if (mi >= 0 && parts[mi + 1] && parts[mi + 2]) {
        return `slug:${parts[mi + 1]}/${parts[mi + 2]}`;
      }
    } catch {
      // bare token
    }
    if (/^[a-f0-9]{12,}$/i.test(text)) return text;
    return null;
  }

  function go(e: React.FormEvent) {
    e.preventDefault();
    const token = extractToken(manual);
    if (!token) {
      setError("Enter a machine token or full /q/… URL.");
      return;
    }
    if (token.startsWith("slug:")) router.push(`/m/${token.slice(5)}`);
    else router.push(`/q/${token}`);
  }

  return (
    <form onSubmit={go} className="card p-5 space-y-3">
      <p className="text-sm text-slate-400">Paste a QR link, or type the machine token from the sticker.</p>
      <input
        className="input"
        value={manual}
        onChange={(e) => setManual(e.target.value)}
        placeholder="https://…/q/abc123 or token"
        autoFocus
      />
      {error && <p className="text-sm text-amber-200">{error}</p>}
      <button type="submit" className="btn btn-primary w-full">
        Open guide
      </button>
    </form>
  );
}
