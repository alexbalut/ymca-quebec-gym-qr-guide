export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function appUrl(path = "") {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function machineQrUrl(token: string) {
  return appUrl(`/q/${token}`);
}

export type Lang = "en" | "fr";

export function pickLang<T>(en: T, fr: T, lang: Lang): T {
  return lang === "fr" ? fr : en;
}

export function parseImageUrls(value: string | null | undefined): string[] {
  return parseJsonArray(value).filter(Boolean).slice(0, 3);
}

/** Normalize form input (newline- or comma-separated) to up to 3 URL strings. */
export function normalizeImageUrls(v: unknown): string[] {
  let parts: string[] = [];
  if (Array.isArray(v)) {
    parts = v.map(String);
  } else if (typeof v === "string") {
    parts = v.split(/[\n,]+/);
  }
  return parts
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 3);
}
