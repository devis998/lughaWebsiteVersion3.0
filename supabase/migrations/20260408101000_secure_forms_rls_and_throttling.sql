/*
  # Secure forms RLS and throttling primitives

  1) Remove public INSERT access from form tables.
  2) Add request_throttles table for backend rate-limit/cooldown tracking.
  3) Add consume_throttle(...) RPC for atomic throttle consumption.
*/

-- Remove public write access from browser clients
DROP POLICY IF EXISTS "Allow public insert" ON quote_requests;
DROP POLICY IF EXISTS "Allow public insert" ON contact_inquiries;

-- Optional cleanup if policy names ever changed
DROP POLICY IF EXISTS "allow public insert" ON quote_requests;
DROP POLICY IF EXISTS "allow public insert" ON contact_inquiries;

CREATE TABLE IF NOT EXISTS request_throttles (
  key text PRIMARY KEY,
  window_seconds integer NOT NULL,
  max_requests integer NOT NULL,
  count integer NOT NULL DEFAULT 0,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE request_throttles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_throttle(
  p_key text,
  p_window_seconds integer,
  p_max_requests integer,
  p_increment integer DEFAULT 1
)
RETURNS TABLE (
  allowed boolean,
  remaining integer,
  reset_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_expires_at timestamptz;
BEGIN
  IF p_key IS NULL OR length(trim(p_key)) = 0 THEN
    RAISE EXCEPTION 'Throttle key is required';
  END IF;
  IF p_window_seconds <= 0 OR p_max_requests <= 0 OR p_increment <= 0 THEN
    RAISE EXCEPTION 'Invalid throttle parameters';
  END IF;

  INSERT INTO public.request_throttles (
    key,
    window_seconds,
    max_requests,
    count,
    window_started_at,
    expires_at
  )
  VALUES (
    p_key,
    p_window_seconds,
    p_max_requests,
    p_increment,
    now(),
    now() + make_interval(secs => p_window_seconds)
  )
  ON CONFLICT (key)
  DO UPDATE SET
    window_seconds = EXCLUDED.window_seconds,
    max_requests = EXCLUDED.max_requests,
    count = CASE
      WHEN public.request_throttles.expires_at <= now() THEN EXCLUDED.count
      ELSE public.request_throttles.count + EXCLUDED.count
    END,
    window_started_at = CASE
      WHEN public.request_throttles.expires_at <= now() THEN now()
      ELSE public.request_throttles.window_started_at
    END,
    expires_at = CASE
      WHEN public.request_throttles.expires_at <= now()
        THEN now() + make_interval(secs => p_window_seconds)
      ELSE public.request_throttles.expires_at
    END
  RETURNING count, expires_at INTO v_count, v_expires_at;

  RETURN QUERY
  SELECT
    (v_count <= p_max_requests) AS allowed,
    GREATEST(0, p_max_requests - v_count) AS remaining,
    v_expires_at AS reset_at;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_throttle(text, integer, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_throttle(text, integer, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.consume_throttle(text, integer, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_throttle(text, integer, integer, integer) TO service_role;
