-- Add access_token for magic-link entitlement
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS access_token text;

-- Backfill any existing rows
UPDATE public.reports
SET access_token = encode(gen_random_bytes(24), 'hex')
WHERE access_token IS NULL;

-- Enforce uniqueness + not-null going forward
ALTER TABLE public.reports
  ALTER COLUMN access_token SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS reports_access_token_key
  ON public.reports (access_token);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS reports_paid_idx ON public.reports (paid);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON public.reports (created_at DESC);
CREATE INDEX IF NOT EXISTS sales_created_at_idx ON public.sales (created_at DESC);

-- Ensure RLS is on but with NO public policies (server-only access via service-role)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;