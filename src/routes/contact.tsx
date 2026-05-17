import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, Check } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · ScanAI" },
      { name: "description", content: "Get in touch with an AI specialist for a personal conversation." },
      { property: "og:title", content: "Contact · ScanAI" },
      { property: "og:description", content: "Schedule a call with an AI specialist at ScanAI." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "At least 10 characters").max(1500),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    // Open mail client as fallback "send"
    const body = `Name: ${form.name}%0D%0ACompany: ${form.company}%0D%0A%0D%0A${encodeURIComponent(form.message)}`;
    window.location.href = `mailto:hello@scanai.nl?subject=${encodeURIComponent(
      "Contact from website",
    )}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="px-6">
      <div className="mx-auto max-w-6xl py-24">
        <div className="border-b border-border pb-12 text-center">
          <span className="pill">· Contact</span>
          <h1 className="mt-6 text-balance text-5xl font-medium leading-[1] tracking-tighter md:text-7xl">
            Plan een gesprek met een<br />
            <span className="text-brand">AI specialist</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            Geen verkoper. Een specialist die kijkt waar AI in jouw situatie de meeste
            geld oplevert.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="surface rounded-3xl p-8 lg:col-span-7"
          >
            {sent ? (
              <div className="py-12 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-2xl font-medium tracking-tight">Bedankt!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We nemen binnen één werkdag contact op.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <Field
                  label="Naam"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                  placeholder="Jan Jansen"
                  maxLength={100}
                />
                <Field
                  label="E-mailadres"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                  placeholder="jan@bedrijf.nl"
                  maxLength={255}
                />
                <Field
                  label="Bedrijf (optioneel)"
                  value={form.company}
                  onChange={(v) => setForm({ ...form, company: v })}
                  error={errors.company}
                  placeholder="Bedrijfsnaam B.V."
                  maxLength={120}
                />
                <div>
                  <label className="block text-sm font-medium">Bericht</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Vertel kort over jullie situatie en wat je wilt bereiken…"
                    maxLength={1500}
                    className="mt-2 min-h-[140px] w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-brand"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-brand/20 transition hover:opacity-90"
                >
                  Verstuur bericht
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.form>

          {/* Sidebar */}
          <div className="space-y-4 lg:col-span-5">
            <ContactCard icon={<Mail className="h-4 w-4" />} title="E-mail" value="hello@scanai.nl" />
            <ContactCard icon={<Phone className="h-4 w-4" />} title="Telefoon" value="+31 (0)20 123 45 67" />
            <ContactCard icon={<MapPin className="h-4 w-4" />} title="Locatie" value="Amsterdam · Remote NL" />
            <div className="surface rounded-3xl p-6">
              <p className="text-sm text-muted-foreground">
                Liever eerst zelf rekenen? Doe de AI Check en ontvang een persoonlijke
                geldwaarde-analyse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, placeholder, type = "text", maxLength }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-brand"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ContactCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="surface flex items-center gap-4 rounded-3xl p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand">
        {icon}
      </span>
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
