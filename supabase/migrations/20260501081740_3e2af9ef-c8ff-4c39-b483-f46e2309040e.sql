CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT,
  contact_name TEXT,
  contact_email TEXT,
  industry TEXT,
  team_size TEXT,
  score NUMERIC,
  annual_value_cents INTEGER,
  currency TEXT DEFAULT 'EUR',
  answers JSONB,
  report JSONB,
  source TEXT,
  paid BOOLEAN NOT NULL DEFAULT false,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- No policies = no client access. Only service role (server) can read/write.

CREATE INDEX idx_reports_created_at ON public.reports (created_at DESC);
CREATE INDEX idx_reports_paid ON public.reports (paid);
CREATE INDEX idx_reports_stripe_session ON public.reports (stripe_session_id);

-- Add report_id link to sales table (if not exists already as text)
-- sales.report_id is already text, we keep it that way for compatibility.
