// ═══════════════════════════════════════════════════════════════
// signup-with-invite — closed-beta signup gated by invite code
//
// POST body:
//   {
//     email: string,
//     display_name?: string,
//     invite_code: string,
//     method: "password" | "magic_link",
//     password?: string,         // required if method === "password"
//     redirect_to?: string,      // optional magic-link return URL
//   }
//
// Response: 200 { ok: true, user_id, method, requires_email_confirm }
//           4xx { error }
//
// Atomicity strategy: this function uses optimistic concurrency on
// `invite_codes.uses` to claim the code; on failure it deletes the
// auth user it just created and rolls back any partial writes.
// ═══════════════════════════════════════════════════════════════

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normCode(s: unknown): string {
  return String(s ?? "").trim().toUpperCase();
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const email = String(payload.email ?? "").trim().toLowerCase();
  const displayName = String(payload.display_name ?? "").trim();
  const inviteCode = normCode(payload.invite_code);
  const method = payload.method === "magic_link" ? "magic_link" : "password";
  const password = payload.password as string | undefined;
  const redirectTo = (payload.redirect_to as string | undefined) || undefined;

  if (!isEmail(email)) return json(400, { error: "Valid email is required" });
  if (!inviteCode) return json(400, { error: "Invite code is required" });
  if (method === "password" && (!password || password.length < 8)) {
    return json(400, { error: "Password must be at least 8 characters" });
  }

  const sb = admin();

  // 1. Look up and validate the invite code.
  const { data: code, error: codeErr } = await sb
    .from("invite_codes")
    .select("id, code, created_by, max_uses, uses, expires_at, revoked")
    .eq("code", inviteCode)
    .maybeSingle();

  if (codeErr) return json(500, { error: "Database error" });
  if (!code) return json(404, { error: "Invite code not found" });
  if (code.revoked) {
    return json(403, { error: "Invite code has been revoked" });
  }
  if (code.expires_at && new Date(code.expires_at).getTime() < Date.now()) {
    return json(403, { error: "Invite code has expired" });
  }
  if (code.uses >= code.max_uses) {
    return json(403, { error: "Invite code has already been used" });
  }

  // 2. Create the auth user (password or magic-link invite).
  let userId: string | null = null;
  if (method === "password") {
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { display_name: displayName, invite_code: inviteCode },
    });
    if (error) return json(400, { error: error.message });
    userId = data.user!.id;
  } else {
    const { data, error } = await sb.auth.admin.inviteUserByEmail(email, {
      data: { display_name: displayName, invite_code: inviteCode },
      redirectTo,
    });
    if (error) return json(400, { error: error.message });
    userId = data.user!.id;
  }

  const rollback = async (reason: string) => {
    try {
      if (userId) await sb.auth.admin.deleteUser(userId);
    } catch (e) {
      console.error("[signup-with-invite] rollback deleteUser failed", e);
    }
    return json(409, { error: reason });
  };

  // 3. Optimistically claim the invite (uses ↑) using the value we just read.
  const { data: claimed, error: claimErr } = await sb
    .from("invite_codes")
    .update({ uses: code.uses + 1 })
    .eq("id", code.id)
    .eq("uses", code.uses)
    .select("id")
    .maybeSingle();

  if (claimErr || !claimed) {
    return rollback(
      "Invite code was just claimed by someone else. Please try a different code.",
    );
  }

  // 4. Record the redemption and profile.
  const { error: redErr } = await sb.from("invite_redemptions").insert({
    invite_code_id: code.id,
    user_id: userId,
  });
  if (redErr) {
    await sb.from("invite_codes").update({ uses: code.uses }).eq("id", code.id);
    return rollback(redErr.message);
  }

  const { error: profErr } = await sb.from("profiles").insert({
    id: userId,
    email,
    display_name: displayName || null,
    invited_by: code.created_by,
    invite_code_used: inviteCode,
  });
  if (profErr) {
    // Profile is non-critical (we can fix later); log but don't roll back.
    console.error("[signup-with-invite] profile insert failed", profErr.message);
  }

  return json(200, {
    ok: true,
    user_id: userId,
    method,
    requires_email_confirm: method === "password",
  });
});
