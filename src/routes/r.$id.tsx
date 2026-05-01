import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, Download, ArrowRight, Check } from "lucide-react";
import { getReportByToken } from "@/lib/report.functions";
import type { GeneratedReport } from "@/lib/report.functions";
import { generatePDF } from "@/lib/pdf.functions";

export const Route = createFileRoute("/r/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  head: () => ({
    meta: [
      { title: "Jouw AI rapport · ScanAI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SharedReportPage,
});

function SharedReportPage() {
  const { id } = Route.useParams();
  const { token } = Route.useSearch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ report: GeneratedReport; company: string | null; paid: boolean } | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!token) { setError("Deze link mist een toegangstoken."); setLoading(false); return; }
    getReportByToken({ data: { id, token } })
      .then((res) => setData({ report: res.report, company: res.company, paid: res.paid }))
      .catch((e) => setError(e instanceof Error ? e.message : "Kon rapport niet laden"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const onDownload = async () => {
    if (!data || downloading) return;
    setDownloading(true);
    try {
      const res = await generatePDF({ data: { companyName: data.company || "ScanAI", report: data.report } });
      const byteChars = atob(res.base64);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Download mislukt.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-medium tracking-tight">Geen toegang</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error || "Onbekende fout."}</p>
        <Link to="/audit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-accent-foreground">
          Doe de AI Check <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const r = data.report;
  return (
    <div className="px-6">
      <div className="mx-auto max-w-5xl py-20">
        <div className="flex flex-wrap items-center gap-3">
          <span className="pill">· Persoonlijk rapport</span>
          {data.paid ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              <Check className="h-3.5 w-3.5" strokeWidth={3} /> Betaald — volledig ontgrendeld
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              <Lock className="h-3.5 w-3.5" /> Nog niet betaald
            </span>
          )}
        </div>
        <h1 className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter md:text-6xl">
          AI Roadmap voor <span className="text-brand">{data.company || "jouw bedrijf"}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{r.executiveSummary}</p>

        <div className="surface mt-10 rounded-3xl p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Geschatte jaarwaarde</p>
          <p className="mt-2 text-6xl font-semibold tracking-tighter">{r.formattedValue}</p>
        </div>

        {data.paid && (
          <button
            onClick={onDownload}
            disabled={downloading}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {downloading ? "PDF wordt gemaakt…" : "Download PDF rapport"}
          </button>
        )}

        {data.paid && (
          <section className="mt-16 space-y-6">
            {r.chapters.map((c) => (
              <div key={c.title} className="surface rounded-3xl p-10">
                <h2 className="text-2xl font-medium tracking-tight">{c.title}</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-foreground/85">{c.body}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
