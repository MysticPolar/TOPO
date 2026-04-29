// ═══════════════════════════════════════════════════════════════
// The Owl's Press · Masthead Component
// ═══════════════════════════════════════════════════════════════

import { COLORS, FONTS as F, TEXTURES, SPACE } from "../styles/tokens.js";

export default function Masthead({
  loginDays = 1,
  foundingDate = "2026-03-01",
}) {
  const foundedDate = new Date(foundingDate);
  const foundedYear = foundedDate.getFullYear();
  const safeSince = Number.isFinite(foundedYear)
    ? foundedDate.toLocaleString("en-US", { month: "short", year: "numeric" })
    : "Mar 2026";

  return (
    <div style={{
      ...TEXTURES.paperLight,
      borderBottom: `2px solid ${COLORS.rule}`,
      padding: `5px ${SPACE[3]}px 6px`,
      textAlign: "center",
      flexShrink: 0,
      zIndex: 50,
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE[3], whiteSpace: "nowrap" }}>
        <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}`, opacity: 0.4 }} />
        <span style={{
          fontFamily: F.blackletter,
          fontSize: 24,
          color: COLORS.ink,
          letterSpacing: 0.3,
          lineHeight: 1,
        }}>
          <span>The Owl's Press</span>
        </span>
        <span style={{
          fontFamily: F.ui,
          fontSize: 13,
          letterSpacing: 3,
          color: COLORS.muted,
          lineHeight: 1,
        }}>
          Your Issue Nº{loginDays}
        </span>
        <span style={{
          fontFamily: F.ui,
          fontSize: 13,
          letterSpacing: 3,
          color: COLORS.red,
          lineHeight: 1,
        }}>
          Since {safeSince}
        </span>
        <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}`, opacity: 0.4 }} />
      </div>
    </div>
  );
}
