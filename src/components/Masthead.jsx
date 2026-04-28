// ═══════════════════════════════════════════════════════════════
// 读了么 · Masthead Component
// ═══════════════════════════════════════════════════════════════

import { COLORS, FONTS as F, TEXTURES, SPACE } from "../styles/tokens.js";

export default function Masthead({
  loginDays = 1,
  foundingDate = "2025-01-01",
}) {
  const foundedDate = new Date(foundingDate);
  const foundedYear = foundedDate.getFullYear();
  const foundedMonth = foundedDate.getMonth() + 1;
  const safeYear = Number.isFinite(foundedYear) ? foundedYear : 2025;
  const safeMonth = Number.isFinite(foundedMonth) && foundedMonth > 0 ? foundedMonth : 1;

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
          <span>读了么 · 猫头鹰邮局</span>
          <span style={{ marginLeft: SPACE[5] }}>第 {loginDays} 刊 </span>
          <span style={{ color: COLORS.red }}>创刊于{safeYear}年{safeMonth}月</span>
        </span>
        <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}`, opacity: 0.4 }} />
      </div>
    </div>
  );
}
