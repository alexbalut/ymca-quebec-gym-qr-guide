import { SiteHeader } from "@/components/SiteHeader";
import { QrScanner } from "@/components/QrScanner";
import Link from "next/link";

export const metadata = {
  title: "Scan a machine",
};

export default function ScanPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-8 flex-1 w-full">
        <div className="mb-6">
          <Link href="/" className="text-sm text-muted hover:text-[var(--accent)]">
            ← Back to machines
          </Link>
          <h1 className="text-3xl font-bold mt-3 mb-2">Scan machine QR</h1>
          <p className="text-muted">
            Point your camera at a machine sticker, or enter a code / URL below.
          </p>
        </div>
        <QrScanner />
      </main>
    </>
  );
}
