"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ymca-quebec.demo");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <SiteHeader compact />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <form onSubmit={onSubmit} className="card w-full max-w-md p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Staff login</h1>
            <p className="text-sm text-slate-400 mt-1">YMCA Notre-Dame-de-Grâce</p>
          </div>
          <label className="block">
            <span className="label">Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-rose-300 text-sm">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-xs text-slate-500 text-center">
            Demo: admin@ymca-quebec.demo / demo1234
          </p>
          <p className="text-xs text-slate-500 text-center">
            <Link href="/" className="hover:text-yellow-300">
              ← Back to gym home
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
