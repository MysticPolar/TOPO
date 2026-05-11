// ═══════════════════════════════════════════════════════════════
// InvitesPanel — list / generate the current user's invite codes
// Quota of 3 per user is enforced server-side (RLS + trigger).
// ═══════════════════════════════════════════════════════════════

import { useCallback, useEffect, useMemo, useState } from "react";
import { FONTS as F, LAYOUT } from "../styles/tokens.js";
import { useAuth } from "../context/AuthContext.jsx";
import { generateInviteCode, listOwnInviteCodes, listOwnRedemptions } from "../utils/invites.js";

const MAX_USER_CODES = 3;

function StatusText({ tone = "muted", children }) {
  const color =
    tone === "error"
      ? "var(--duleme-red)"
      : tone === "success"
        ? "var(--duleme-sage)"
        : "var(--duleme-text-muted)";
  return (
    <p
      style={{
        margin: 0,
        fontFamily: F.body,
        fontStyle: tone === "muted" ? "italic" : "normal",
        fontSize: 11,
        lineHeight: 1.5,
        color,
      }}
    >
      {children}
    </p>
  );
}

function CodeRow({ row, redemptionCount }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(row.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  }, [row.code]);

  const status = row.revoked
    ? "Revoked"
    : row.uses >= row.max_uses
      ? "Used"
      : row.expires_at && new Date(row.expires_at).getTime() < Date.now()
        ? "Expired"
        : "Active";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid var(--duleme-border)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: F.ui,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "var(--duleme-text)",
          }}
        >
          {row.code}
        </div>
        <div
          style={{
            marginTop: 2,
            fontFamily: F.body,
            fontSize: 10,
            fontStyle: "italic",
            color: "var(--duleme-text-muted)",
          }}
        >
          {status} · {row.uses}/{row.max_uses} used
          {redemptionCount > 0 ? ` · ${redemptionCount} redeemed` : ""}
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        disabled={status !== "Active"}
        style={{
          minWidth: 70,
          minHeight: 32,
          border: "1px solid var(--duleme-border-medium)",
          background: status === "Active" ? "var(--duleme-button-fill)" : "var(--duleme-surface-input)",
          color: status === "Active" ? "var(--duleme-on-button)" : "var(--duleme-text-muted)",
          fontFamily: F.ui,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: status === "Active" ? "pointer" : "not-allowed",
          padding: "0 10px",
          borderRadius: 4,
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function InvitesPanel() {
  const { user, configured } = useAuth();
  const [codes, setCodes] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const [c, r] = await Promise.all([
        listOwnInviteCodes(),
        listOwnRedemptions(),
      ]);
      setCodes(c);
      setRedemptions(r);
    } catch (err) {
      setError(err?.message || "Could not load invite codes.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  const redemptionsByCode = useMemo(() => {
    const map = new Map();
    for (const r of redemptions) {
      map.set(r.invite_code_id, (map.get(r.invite_code_id) || 0) + 1);
    }
    return map;
  }, [redemptions]);

  const remaining = Math.max(0, MAX_USER_CODES - codes.length);
  const atLimit = remaining === 0;

  const generate = async () => {
    setBusy(true);
    setError("");
    try {
      await generateInviteCode();
      await reload();
    } catch (err) {
      setError(err?.message || "Could not generate code.");
    } finally {
      setBusy(false);
    }
  };

  if (!configured) {
    return (
      <StatusText>
        Supabase is not configured. Invites are unavailable in this preview build.
      </StatusText>
    );
  }

  if (!user) {
    return <StatusText>Sign in to manage invite codes.</StatusText>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1, fontFamily: F.body, fontSize: 12, fontStyle: "italic", color: "var(--duleme-text-muted)" }}>
          {atLimit
            ? "You have used all 3 invites."
            : `${remaining} invite${remaining === 1 ? "" : "s"} available.`}
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={busy || atLimit}
          style={{
            minHeight: LAYOUT.minTouchTarget,
            padding: "0 14px",
            border: "none",
            background: busy || atLimit ? "var(--duleme-border-strong)" : "var(--duleme-button-fill)",
            color: "var(--duleme-on-button)",
            fontFamily: F.ui,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: busy || atLimit ? "not-allowed" : "pointer",
            borderRadius: 4,
          }}
        >
          {busy ? "Working…" : "New code"}
        </button>
      </div>

      {error ? (
        <div style={{ marginBottom: 8 }}>
          <StatusText tone="error">{error}</StatusText>
        </div>
      ) : null}

      {loading && codes.length === 0 ? (
        <StatusText>Loading…</StatusText>
      ) : codes.length === 0 ? (
        <StatusText>No codes yet. Generate one to invite a friend.</StatusText>
      ) : (
        <div>
          {codes.map((row) => (
            <CodeRow
              key={row.id}
              row={row}
              redemptionCount={redemptionsByCode.get(row.id) || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
