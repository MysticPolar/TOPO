import { COLORS, FONTS as F, SPACE } from "../styles/tokens.js";

export default function RewardsScreen({ userStats = {} }) {
  return (
    <div style={{ padding: `${SPACE[4]}px ${SPACE[4]}px max(${SPACE[6]}px, calc(env(safe-area-inset-bottom, 0px) + ${SPACE[4]}px))` }}>
      <div style={{ textAlign: "center", marginBottom: SPACE[4] }}>
        <h2 style={{ margin: 0, fontFamily: F.display, fontSize: 24, color: COLORS.ink }}>
          Coins & Rewards
        </h2>
        <p style={{ margin: `${SPACE[2]}px 0 0`, fontFamily: F.body, fontStyle: "italic", fontSize: 12, color: COLORS.muted }}>
          Spend your earned feather coins on boosts and special dispatches.
        </p>
      </div>

      <div style={{ border: `1.5px solid ${COLORS.rule}`, background: COLORS.cardSurface, padding: `${SPACE[4]}px` }}>
        <div style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.muted, marginBottom: SPACE[1] }}>
          Current Balance
        </div>
        <div style={{ fontFamily: F.display, fontSize: 34, color: COLORS.gold, fontWeight: 900 }}>
          {(userStats.inkBalance ?? 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
