
CREATE TABLE public.audit_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL UNIQUE,
  company text,
  industry text,
  team_size text,
  current_step integer NOT NULL DEFAULT 0,
  max_step_reached integer NOT NULL DEFAULT 0,
  total_steps integer,
  last_step_key text,
  answers jsonb,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  report_id uuid,
  user_agent text,
  referrer text,
  landing_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_sessions_created_at ON public.audit_sessions(created_at DESC);
CREATE INDEX idx_audit_sessions_completed ON public.audit_sessions(completed);

ALTER TABLE public.audit_sessions ENABLE ROW LEVEL SECURITY;
-- No policies: only service role (server-side admin) can read/write.

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_audit_sessions_updated
BEFORE UPDATE ON public.audit_sessions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
