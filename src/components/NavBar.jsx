// ═══════════════════════════════════════════════════════════════
// The Owl's Press · Navigation Bar
// ═══════════════════════════════════════════════════════════════

import { COLORS, FONTS as F, SPACE, LAYOUT } from "../styles/tokens.js";
import { NavIconHome, NavIconReading, NavIconProfile } from "./Primitives.jsx";

const NAV_ITEMS = [
  { id: "home",    label: "Dispatch", Icon: NavIconHome },
  { id: "reading", label: "Reading", Icon: NavIconReading },
  { id: "profile", label: "Profile", Icon: NavIconProfile },
];

export default function NavBar({ activePage, onNavigate }) {
  return (
    <div style={{
      flexShrink: 0,
      background: COLORS.ink,
      borderTop: `2px solid ${COLORS.gold}`,
      padding: `${SPACE[1]}px 0 ${SPACE[2]}px`,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "flex-start",
      zIndex: 60,
    }}>
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = activePage === id;
        return (
          <div
            key={id}
            onClick={() => onNavigate(id)}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 2,
              cursor: "pointer",
              padding: `${SPACE[1]}px ${SPACE[4]}px`,
              minHeight: LAYOUT.minTouchTarget,
              position: "relative", userSelect: "none",
            }}
          >
            {active && (
              <div style={{
                position: "absolute", top: -4, left: "50%",
                transform: "translateX(-50%)",
                width: 22, height: 2, background: COLORS.gold,
              }} />
            )}

            <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon active={active} />
            </div>

            <div style={{
              fontFamily: F.ui, fontSize: 10, fontWeight: 700,
              letterSpacing: 1.2, textTransform: "uppercase",
              color: active ? COLORS.gold : COLORS.muted,
              transition: "color 0.15s ease",
            }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
