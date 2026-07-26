import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — server-side only, never import in
// client components. Used by the public submission endpoint and the
// Stripe webhook, which both run without a user session.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
