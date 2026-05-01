-- Sales tracking table for AI Check report purchases
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  report_id TEXT,
  customer_email TEXT,
  amount_cents INTEGER,
  currency TEXT,
  environment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Only service role (server) may read/write sales. No client access.
-- (No policies = locked down for anon/authenticated users.)

CREATE INDEX idx_sales_created_at ON public.sales(created_at DESC);
CREATE INDEX idx_sales_report_id ON public.sales(report_id);