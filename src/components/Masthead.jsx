// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Masthead Component
// ═══════════════════════════════════════════════════════════════

import { COLORS, FONTS as F, TEXTURES, SPACE } from "../styles/tokens.js";

export default function Masthead({
  loginDays = 1,
  foundingDate = "2025-01-01",
}) {
  const foundedDate = new Date(foundingDate);
  const foundedYear = foundedDate.getFullYear();
  const foundedMonthIdx = foundedDate.getMonth();
  const safeYear = Number.isFinite(foundedYear) ? foundedYear : 2025;
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const safeMonth = Number.isFinite(foundedMonthIdx) && foundedMonthIdx >= 0
    ? MONTHS[foundedMonthIdx]
    : "Jan";

  return (
    <div
      className="duleme-safe-top"
      style={{
        ...TEXTURES.paperLight,
        borderBottom: `1px solid ${COLORS.rule}`,
        padding: `0 ${SPACE[3]}px ${SPACE[2]}px`,
        textAlign: "center",
        flexShrink: 0,
        zIndex: 50,
        position: "relative",
        ["--duleme-safe-top-min"]: `${SPACE[2]}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[2] }}>
        <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}`, opacity: 0.4 }} />
        <span style={{
          fontFamily: F.ui, fontSize: 10, letterSpacing: 1.2,
          color: COLORS.muted,
          textAlign: "center",
          lineHeight: 1.35,
        }}>
          <span style={{ fontFamily: F.blackletter, fontSize: 13, letterSpacing: 0.5, color: COLORS.ink }}>The Owl's Postoffice</span>
          <span style={{ marginLeft: SPACE[3] }}>Issue №{loginDays}</span>
          <span style={{ color: COLORS.red, marginLeft: SPACE[3] }}>Est. {safeMonth} {safeYear}</span>
        </span>
        <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}`, opacity: 0.4 }} />
      </div>
    </div>
  );
}
