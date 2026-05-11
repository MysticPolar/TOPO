// ═══════════════════════════════════════════════════════════════
// Supabase client — created once and reused across the app.
// Returns `null` if env vars are missing so the app can still run
// in preview mode without a backend (anon flows degrade silently).
// ═══════════════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = URL && KEY
  ? createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "duleme-auth",
      },
    })
  : null;

export const isSupabaseConfigured = Boolean(supabase);

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.warn(
    "[duleme] Supabase env vars missing — auth and invite-code flows are disabled.\n" +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in `.env.local`.",
  );
}

export const SUPABASE_URL = URL || "";
export const SUPABASE_ANON_KEY = KEY || "";
