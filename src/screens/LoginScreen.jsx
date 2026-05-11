// ═══════════════════════════════════════════════════════════════
// LoginScreen — closed-beta auth gate
//   Sign In: password OR magic link
//   Sign Up: invite code required (password OR magic link)
// ═══════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { FONTS as F, LAYOUT } from "../styles/tokens.js";
import {
  signInWithPassword,
  sendMagicLink,
  signupWithInvite,
} from "../utils/auth.js";

const FIELD_BORDER = "1px solid var(--duleme-border-medium)";

function Field({ label, htmlFor, children, hint }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "block", marginBottom: 12 }}>
      <span
        style={{
          display: "block",
          marginBottom: 4,
          fontFamily: F.ui,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--duleme-text-muted)",
        }}
      >
        {label}
      </span>
      {children}
      {hint ? (
        <span
          style={{
            display: "block",
            marginTop: 4,
            fontFamily: F.body,
            fontStyle: "italic",
            fontSize: 11,
            color: "var(--duleme-text-muted)",
          }}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: FIELD_BORDER,
  minHeight: LAYOUT.minTouchTarget,
  padding: "10px 12px",
  fontFamily: F.ui,
  fontSize: 14,
  background: "var(--duleme-surface-input)",
  color: "var(--duleme-text)",
  borderRadius: 4,
};

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        minHeight: 40,
        background: active ? "var(--duleme-button-fill)" : "transparent",
        color: active ? "var(--duleme-on-button)" : "var(--duleme-text-muted)",
        border: "1px solid var(--duleme-border-medium)",
        fontFamily: F.ui,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: "0 12px",
      }}
    >
      {children}
    </button>
  );
}

function MethodToggle({ method, setMethod }) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
      <TabButton active={method === "password"} onClick={() => setMethod("password")}>
        Password
      </TabButton>
      <TabButton active={method === "magic_link"} onClick={() => setMethod("magic_link")}>
        Magic link
      </TabButton>
    </div>
  );
}

function PrimaryButton({ disabled, children, onClick }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: LAYOUT.minTouchTarget,
        border: "none",
        background: disabled ? "var(--duleme-border-strong)" : "var(--duleme-button-fill)",
        color: "var(--duleme-on-button)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: F.ui,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderRadius: 4,
      }}
    >
      {children}
    </button>
  );
}

function StatusBanner({ tone = "info", children }) {
  if (!children) return null;
  const palette = {
    info: { bg: "rgba(196,146,42,0.10)", fg: "var(--duleme-text)" },
    error: { bg: "rgba(192,82,46,0.12)", fg: "var(--duleme-red)" },
    success: { bg: "rgba(95,117,104,0.16)", fg: "var(--duleme-sage)" },
  }[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      style={{
        background: palette.bg,
        color: palette.fg,
        border: "1px solid var(--duleme-border-medium)",
        padding: "10px 12px",
        marginBottom: 12,
        fontFamily: F.ui,
        fontSize: 12,
        lineHeight: 1.4,
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  );
}

export default function LoginScreen({ onAuthSuccess }) {
  const [tab, setTab] = useState("sign_in");
  const [method, setMethod] = useState("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const reset = () => {
    setError("");
    setInfo("");
  };

  const disabled = useMemo(() => {
    if (submitting) return true;
    if (!email) return true;
    if (tab === "sign_in") {
      return method === "password" ? password.length < 8 : false;
    }
    if (!inviteCode.trim()) return true;
    if (method === "password" && password.length < 8) return true;
    return false;
  }, [submitting, email, password, inviteCode, tab, method]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    reset();
    setSubmitting(true);
    try {
      if (tab === "sign_in") {
        if (method === "password") {
          await signInWithPassword({ email, password });
          onAuthSuccess?.();
        } else {
          await sendMagicLink({ email });
          setInfo("Magic link sent. Check your inbox to finish signing in.");
        }
      } else {
        const res = await signupWithInvite({
          email,
          password: method === "password" ? password : undefined,
          display_name: displayName,
          invite_code: inviteCode.trim().toUpperCase(),
          method,
        });
        if (method === "password" && res?.requires_email_confirm) {
          setInfo(
            "Account created. Check your email to confirm your address, then sign in.",
          );
        } else if (method === "magic_link") {
          setInfo("Invite accepted. Check your inbox for a magic link to finish signing in.");
        } else {
          setInfo("Account created. You can now sign in.");
        }
        setTab("sign_in");
        setPassword("");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px 16px 40px" }}>
      <div style={{ maxWidth: 360, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: F.display,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "var(--duleme-text)",
              letterSpacing: "-0.01em",
            }}
          >
            The Owl&apos;s Postoffice
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontFamily: F.body,
              fontStyle: "italic",
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--duleme-text-muted)",
            }}
          >
            {tab === "sign_in"
              ? "Welcome back. Sign in to sync your dispatches."
              : "Closed beta. An invite code is required."}
          </p>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
          <TabButton
            active={tab === "sign_in"}
            onClick={() => {
              setTab("sign_in");
              reset();
            }}
          >
            Sign in
          </TabButton>
          <TabButton
            active={tab === "sign_up"}
            onClick={() => {
              setTab("sign_up");
              reset();
            }}
          >
            Sign up
          </TabButton>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            border: "1.5px solid var(--duleme-rule)",
            background: "var(--duleme-surface)",
            padding: 16,
            borderRadius: 6,
          }}
        >
          <StatusBanner tone="error">{error}</StatusBanner>
          <StatusBanner tone="success">{info}</StatusBanner>

          <MethodToggle method={method} setMethod={setMethod} />

          {tab === "sign_up" ? (
            <Field label="Display name" htmlFor="auth-name">
              <input
                id="auth-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                style={inputStyle}
                placeholder="What should we call you?"
              />
            </Field>
          ) : null}

          <Field label="Email" htmlFor="auth-email">
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              style={inputStyle}
              placeholder="you@example.com"
            />
          </Field>

          {method === "password" ? (
            <Field
              label={tab === "sign_in" ? "Password" : "Choose a password"}
              htmlFor="auth-password"
              hint={tab === "sign_up" ? "At least 8 characters." : undefined}
            >
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={tab === "sign_in" ? "current-password" : "new-password"}
                style={inputStyle}
                placeholder="••••••••"
                minLength={8}
              />
            </Field>
          ) : null}

          {tab === "sign_up" ? (
            <Field
              label="Invite code"
              htmlFor="auth-invite"
              hint="Required — ask whoever sent you here for theirs."
            >
              <input
                id="auth-invite"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                style={{ ...inputStyle, letterSpacing: "0.15em", fontFamily: F.ui }}
                placeholder="ABCD2345"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
          ) : null}

          <PrimaryButton disabled={disabled}>
            {submitting
              ? "Please wait…"
              : tab === "sign_in"
                ? method === "password"
                  ? "Sign in"
                  : "Send magic link"
                : method === "password"
                  ? "Create account"
                  : "Send magic link"}
          </PrimaryButton>
        </form>

        <p
          style={{
            marginTop: 14,
            textAlign: "center",
            fontFamily: F.body,
            fontSize: 11,
            fontStyle: "italic",
            color: "var(--duleme-text-muted)",
            lineHeight: 1.5,
          }}
        >
          {tab === "sign_in" ? (
            <>
              No account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("sign_up");
                  reset();
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--duleme-text)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontStyle: "italic",
                }}
              >
                Sign up with an invite code
              </button>
              .
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("sign_in");
                  reset();
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--duleme-text)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontStyle: "italic",
                }}
              >
                Sign in instead
              </button>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
