// ═══════════════════════════════════════════════════════════════
// Invite-code helpers — uses Supabase RLS-protected RPCs and tables
// All calls require an authenticated session.
// ═══════════════════════════════════════════════════════════════

import { supabase } from "./supabase.js";

function ensure() {
  if (!supabase) throw new Error("Supabase is not configured. See AUTH_SETUP.md.");
  return supabase;
}

/** List invite codes created by the current user (newest first). */
export async function listOwnInviteCodes() {
  const sb = ensure();
  const { data, error } = await sb
    .from("invite_codes")
    .select("id, code, max_uses, uses, expires_at, revoked, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Generate a new invite code for the current user (server enforces ≤ 3 quota).
 * @param {{ maxUses?: number, expiresAt?: string | null }} opts
 */
export async function generateInviteCode(opts = {}) {
  const sb = ensure();
  const { data, error } = await sb.rpc("generate_invite_code", {
    p_max_uses: opts.maxUses ?? 1,
    p_expires_at: opts.expiresAt ?? null,
  });
  if (error) throw error;
  return data;
}

/** Who redeemed the current user's codes (for the "you invited:" list). */
export async function listOwnRedemptions() {
  const sb = ensure();
  const { data, error } = await sb
    .from("invite_redemptions")
    .select("invite_code_id, user_id, redeemed_at")
    .order("redeemed_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
