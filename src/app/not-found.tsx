import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-3">Not found</h1>
        <p className="text-slate-400 mb-6">That machine or page doesn’t exist.</p>
        <Link href="/scan" className="btn btn-primary">
          Back to scan
        </Link>
      </main>
    </>
  );
}
