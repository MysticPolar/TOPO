import { COLORS, FONTS as F, SPACE, LAYOUT } from "../styles/tokens.js";

export default function LoginScreen() {
  return (
    <div style={{ padding: `${SPACE[5]}px ${SPACE[4]}px ${SPACE[6]}px` }}>
      <div style={{ maxWidth: 360, margin: "0 auto" }}>
        <div style={{ marginBottom: SPACE[4], textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontFamily: F.display,
              fontSize: 26,
              fontWeight: 800,
              lineHeight: 1.15,
              color: COLORS.ink,
            }}
          >
            Login
          </h2>
          <p
            style={{
              margin: `${SPACE[2]}px 0 0`,
              fontFamily: F.body,
              fontStyle: "italic",
              fontSize: 12,
              lineHeight: 1.5,
              color: COLORS.muted,
            }}
          >
            Sign in to sync your dispatches and reading history.
          </p>
        </div>

        <div
          style={{
            border: `1.5px solid ${COLORS.rule}`,
            background: COLORS.cardSurface,
            padding: `${SPACE[4]}px ${SPACE[4]}px ${SPACE[5]}px`,
          }}
        >
          <label
            htmlFor="duleme-login-email"
            style={{
              display: "block",
              marginBottom: SPACE[1],
              fontFamily: F.ui,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            Email
          </label>
          <input
            id="duleme-login-email"
            type="email"
            placeholder="you@example.com"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: SPACE[3],
              border: `1px solid ${COLORS.paperAged}`,
              padding: "10px 11px",
              minHeight: LAYOUT.minTouchTarget,
              background: COLORS.paper,
              color: COLORS.ink,
              fontFamily: F.ui,
              fontSize: 13,
            }}
          />

          <label
            htmlFor="duleme-login-password"
            style={{
              display: "block",
              marginBottom: SPACE[1],
              fontFamily: F.ui,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            Password
          </label>
          <input
            id="duleme-login-password"
            type="password"
            placeholder="Password"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginBottom: SPACE[4],
              border: `1px solid ${COLORS.paperAged}`,
              padding: "10px 11px",
              minHeight: LAYOUT.minTouchTarget,
              background: COLORS.paper,
              color: COLORS.ink,
              fontFamily: F.ui,
              fontSize: 13,
            }}
          />

          <button
            type="button"
            style={{
              width: "100%",
              minHeight: LAYOUT.minTouchTarget,
              border: "none",
              background: COLORS.ink,
              color: COLORS.paper,
              fontFamily: F.ui,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
