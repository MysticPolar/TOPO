import { useState } from "react";
import { COLORS, FONTS as F, SPACE, LAYOUT } from "../styles/tokens.js";
import { OrnateRule, SectionLabel } from "../components/Primitives.jsx";

function ArrowRow({ icon, label, sub }) {
  return (
    <button
      type="button"
      className="duleme-bare"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: SPACE[3],
        padding: `${SPACE[3]}px 0`,
        minHeight: LAYOUT.minTouchTarget,
        borderBottom: `1px solid ${COLORS.paperAged}`,
        cursor: "pointer",
      }}
    >
      <div style={{ width: 20, textAlign: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontFamily: F.chinese, fontSize: 13, color: COLORS.ink }}>{label}</div>
        <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 10, color: COLORS.muted, marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ fontFamily: F.ui, fontSize: 11, color: COLORS.muted }}>→</div>
    </button>
  );
}

export default function SettingsScreen() {
  const [bulletinOn, setBulletinOn] = useState(true);

  return (
    <div style={{ padding: "10px 16px max(80px, calc(env(safe-area-inset-bottom, 0px) + 56px))" }}>
      <OrnateRule symbol="— ⚙ —" />
      <SectionLabel>Settings</SectionLabel>

      <ArrowRow icon="🔔" label="Notifications" sub="Push & email preferences" />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: SPACE[3],
          padding: `${SPACE[3]}px 0`,
          minHeight: LAYOUT.minTouchTarget,
          borderBottom: `1px solid ${COLORS.paperAged}`,
        }}
      >
        <div style={{ width: 20, textAlign: "center", fontSize: 15, flexShrink: 0 }}>📧</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.chinese, fontSize: 13, color: COLORS.ink }}>Daily Bulletin</div>
          <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 10, color: COLORS.muted, marginTop: 1 }}>
            A short morning email
          </div>
        </div>
        <button
          type="button"
          onClick={() => setBulletinOn((v) => !v)}
          style={{
            minWidth: 56,
            height: 28,
            border: `1px solid ${bulletinOn ? COLORS.ink : COLORS.paperAged}`,
            background: bulletinOn ? COLORS.ink : COLORS.paper,
            color: bulletinOn ? COLORS.paper : COLORS.muted,
            fontFamily: F.ui,
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {bulletinOn ? "On" : "Off"}
        </button>
      </div>

      <ArrowRow icon="🔒" label="Privacy" sub="Privacy & your data" />
      <ArrowRow icon="🦉" label="About The Owl" sub="About us" />
    </div>
  );
}
