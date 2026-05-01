import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Shield, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/admin.functions";

const TOKEN_KEY = "admin_portal_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · ScanAI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setHydrated(true);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminLogin({ data: { password } });
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login mislukt");
    } finally {
      setSubmitting(false);
    }
  };

  const onLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="px-6">
        <div className="mx-auto max-w-md py-32">
          <div className="surface rounded-3xl border border-border bg-card p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-medium tracking-tight">Admin portaal</h1>
                <p className="text-xs text-muted-foreground">Voer het beheerderswachtwoord in</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting || !password}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Inloggen
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="mx-auto max-w-7xl py-16">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tight">Admin portaal</h1>
              <p className="text-[11px] text-muted-foreground">Beheer rapportages & verkopen</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className={`text-xs ${pathname === "/admin" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              Rapporten
            </Link>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <LogOut className="h-3 w-3" /> Uitloggen
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
