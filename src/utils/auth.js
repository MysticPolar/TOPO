// ═══════════════════════════════════════════════════════════════
// Auth helpers — thin wrappers around Supabase + signup-with-invite
// ═══════════════════════════════════════════════════════════════

import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase.js";

function ensure() {
  if (!supabase) throw new Error("Supabase is not configured. See AUTH_SETUP.md.");
  return supabase;
}

/** Sign in with email + password (existing user). */
export async function signInWithPassword({ email, password }) {
  const sb = ensure();
  const { data, error } = await sb.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

/** Send a magic-link email to an existing user. The link logs them in. */
export async function sendMagicLink({ email, redirectTo } = {}) {
  const sb = ensure();
  const { error } = await sb.auth.signInWithOtp({
    email: email.trim(),
    options: {
      emailRedirectTo: redirectTo || window.location.origin,
      shouldCreateUser: false,
    },
  });
  if (error) throw error;
}

/** Sign out the current session. */
export async function signOut() {
  const sb = ensure();
  await sb.auth.signOut();
}

/**
 * Closed-beta signup. Requires a valid invite code. The Edge Function
 * verifies the code, creates the auth user (password or magic-link),
 * and records the redemption + profile.
 *
 * @param {{
 *   email: string,
 *   display_name?: string,
 *   invite_code: string,
 *   method: "password" | "magic_link",
 *   password?: string,
 *   redirect_to?: string,
 * }} payload
 */
export async function signupWithInvite(payload) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase is not configured. See AUTH_SETUP.md.");
  }

  const url = `${SUPABASE_URL}/functions/v1/signup-with-invite`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      ...payload,
      redirect_to: payload.redirect_to || window.location.origin,
    }),
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    /* response was not JSON */
  }

  if (!res.ok) {
    const message = body?.error || `Signup failed (HTTP ${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return body;
}
