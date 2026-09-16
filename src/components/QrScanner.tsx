"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
    // not a URL — maybe bare token
  }
  if (/^[a-f0-9]{12,}$/i.test(text)) return text;
  return null;
}

export function QrScanner() {
  const router = useRouter();
  const regionId = "qr-reader";
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [scanning, setScanning] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    let scanner: { stop: () => Promise<void>; clear?: () => void } | null = null;
    let cancelled = false;

    async function start() {
      if (started.current) return;
      started.current = true;
      setScanning(true);
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const html5 = new Html5Qrcode(regionId);
        scanner = html5;
        await html5.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            const token = extractToken(decoded);
            if (!token) return;
            html5.stop().catch(() => {});
            if (token.startsWith("slug:")) {
              const path = token.slice(5);
              router.push(`/m/${path}`);
            } else {
              router.push(`/q/${token}`);
            }
          },
          () => {}
        );
      } catch (e) {
        if (!cancelled) {
          setError(
            "Camera unavailable. Allow camera permission, or enter a machine code / paste a QR URL below."
          );
          setScanning(false);
        }
      }
    }

    start();
    return () => {
      cancelled = true;
      if (scanner) scanner.stop().catch(() => {});
    };
  }, [router]);

  function goManual(e: React.FormEvent) {
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
    <div className="space-y-5">
      <div className="card p-4 overflow-hidden">
        <div id={regionId} className="rounded-lg overflow-hidden min-h-[260px] bg-slate-950" />
        {scanning && !error && (
          <p className="text-center text-sm text-slate-400 mt-3">Point at a machine QR code…</p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </div>
      )}

      <form onSubmit={goManual} className="card p-5 space-y-3">
        <h2 className="font-semibold">Manual code / URL</h2>
        <p className="text-sm text-slate-400">
          Paste a QR link, or type the machine token from the sticker.
        </p>
        <input
          className="input"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="https://…/q/abc123 or token"
        />
        <button type="submit" className="btn btn-primary w-full">
          Open guide
        </button>
      </form>
    </div>
  );
}
