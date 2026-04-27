// ═══════════════════════════════════════════════════════════════
// The Owl's Press · Masthead Component
// ═══════════════════════════════════════════════════════════════

import { COLORS, FONTS as F, TEXTURES, SPACE } from "../styles/tokens.js";

export default function Masthead({
  loginDays = 1,
  foundingDate = "2025-01-01",
}) {
  const foundedDate = new Date(foundingDate);
  const foundedYear = foundedDate.getFullYear();
  const safeYear = Number.isFinite(foundedYear) ? foundedYear : 2025;

  return (
    <div style={{
      ...TEXTURES.paperLight,
      borderBottom: `1px solid ${COLORS.rule}`,
      padding: `${SPACE[2]}px ${SPACE[3]}px`,
      textAlign: "center",
      flexShrink: 0,
      zIndex: 50,
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[2] }}>
        <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}`, opacity: 0.4 }} />
        <span style={{
          fontFamily: F.ui, fontSize: 10, letterSpacing: 1.2,
          color: COLORS.muted,
          textAlign: "center",
          lineHeight: 1.35,
        }}>
          <span>The Owl's Press</span>
          <span style={{ marginLeft: SPACE[5] }}>Issue {loginDays}</span>
          <span style={{ color: COLORS.red, marginLeft: SPACE[5] }}>Est. {safeYear}</span>
        </span>
        <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}`, opacity: 0.4 }} />
      </div>
    </div>
  );
}
