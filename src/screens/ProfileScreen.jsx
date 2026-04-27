// ═══════════════════════════════════════════════════════════════
// The Owl's Press · Profile Screen
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { AVATARS, RANKS, TAG_VOLUMES, getRankProgress } from "../data/content.js";
import { COLORS, FONTS as F, SPACE, LAYOUT } from "../styles/tokens.js";
import { OrnateRule, SectionLabel, ScholarAvatar, CoinIcon } from "../components/Primitives.jsx";
import CalendarPanel from "../components/panels/CalendarPanel.jsx";
import CollectionsPanel from "../components/panels/CollectionsPanel.jsx";

// ── Settings Row ──────────────────────────────────────────────
function SettingRow({ icon, label, sub, value }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: SPACE[3],
      padding: `${SPACE[3]}px 0`,
      minHeight: LAYOUT.minTouchTarget,
      borderBottom: `1px solid ${COLORS.paperAged}`,
      cursor: "pointer",
    }}>
      <div style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.editorial, fontSize: 13, color: COLORS.ink }}>{label}</div>
        {sub && <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 10, color: COLORS.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>
        {value || "→"}
      </div>
    </div>
  );
}

// ── Hex Radar Chart ─────────────────────────────────
function HexRadar({ data, size = 220 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;
  const labels = Object.keys(data);
  const values = Object.values(data);
  const maxVal = Math.max(...values, 1);
  const n = labels.length;

  const pt = (i, ratio) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * ratio * Math.cos(a), cy + r * ratio * Math.sin(a)];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = labels.map((_, i) => pt(i, values[i] / maxVal));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((lv, li) => (
        <polygon key={li}
          points={labels.map((_, i) => pt(i, lv).join(",")).join(" ")}
          fill="none" stroke={COLORS.paperAged} strokeWidth={0.5} opacity={0.45}
        />
      ))}
      {labels.map((_, i) => {
        const [px, py] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={px} y2={py} stroke={COLORS.paperAged} strokeWidth={0.5} opacity={0.3} />;
      })}
      <polygon
        points={dataPoints.map(p => p.join(",")).join(" ")}
        fill={`${COLORS.gold}30`} stroke={COLORS.gold} strokeWidth={1.5}
      />
      {dataPoints.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={3} fill={COLORS.gold} />
      ))}
      {labels.map((label, i) => {
        const [px, py] = pt(i, 1.22);
        return (
          <g key={i}>
            <text x={px} y={py - 5} textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: F.editorial, fontSize: 10, fontWeight: 700, fill: COLORS.ink }}>
              {label}
            </text>
            <text x={px} y={py + 7} textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: F.ui, fontSize: 10, fill: COLORS.muted }}>
              {values[i]} reads
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const TABS = [
  { id: "radar", label: "Map" },
  { id: "calendar", label: "Calendar" },
  { id: "collections", label: "Saved" },
];

function TabStrip({ active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid rgba(42,31,14,0.12)`, marginBottom: 16 }}>
      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              padding: "9px 0",
              fontFamily: F.editorial, fontWeight: isActive ? 700 : 400,
              fontSize: 12, letterSpacing: 1.5,
              color: isActive ? COLORS.ink : COLORS.muted,
              borderBottom: isActive ? `2px solid ${COLORS.gold}` : "2px solid transparent",
              marginBottom: -1,
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function DimensionPanel() {
  const [activeTab, setActiveTab] = useState("radar");
  const [collectionsRefresh, setCollectionsRefresh] = useState(0);

  const handleTabChange = (id) => {
    setActiveTab(id);
    if (id === "collections") setCollectionsRefresh(n => n + 1);
  };

  return (
    <div style={{ marginBottom: 18, animation: "owls-press-fade-up 0.4s ease 0.2s both" }}>
      <TabStrip active={activeTab} onChange={handleTabChange} />

      {activeTab === "radar" && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <HexRadar data={TAG_VOLUMES} size={240} />
        </div>
      )}

      {activeTab === "calendar" && (
        <CalendarPanel />
      )}

      {activeTab === "collections" && (
        <CollectionsPanel refresh={collectionsRefresh} />
      )}
    </div>
  );
}

export default function ProfileScreen({ userStats = {} }) {
  const progress = getRankProgress(userStats.xpCurrent ?? 0);
  const pct = progress.pctToNext;

  return (
    <div style={{ padding: "10px 16px 80px" }}>

      {/* Profile header */}
      <div style={{ textAlign: "center", marginBottom: 18, animation: "owls-press-fade-up 0.4s ease both" }}>
        <div style={{ display: "inline-block", position: "relative", marginBottom: 10 }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            border: `2.5px solid ${COLORS.ink}`,
            overflow: "hidden", background: COLORS.paperDark, margin: "0 auto",
          }}>
            <ScholarAvatar size={76} />
          </div>
          <div style={{
            position: "absolute", bottom: 0, right: -4,
            width: 26, height: 26, borderRadius: "50%",
            background: COLORS.gold, border: `2px solid ${COLORS.paper}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
          }}>🔮</div>
        </div>
      </div>

      {/* XP Bar (full width) */}
      <div style={{
        background: COLORS.ink, padding: 16,
        border: `1.5px solid rgba(245,239,224,0.08)`,
        marginBottom: 14,
        animation: "owls-press-fade-up 0.4s ease 0.1s both",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontStyle: "italic", fontSize: 15, color: COLORS.paper }}>
            {progress.currentRank}
          </div>
          <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 600, color: COLORS.muted, letterSpacing: 1 }}>
            {(userStats.xpCurrent ?? 0).toLocaleString()} ink
          </div>
        </div>
        <div style={{ height: 10, background: "rgba(245,239,224,0.08)", border: "1px solid rgba(245,239,224,0.12)", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0,
            width: `${pct}%`, background: COLORS.gold,
            animation: "owls-press-xp-fill 1.2s cubic-bezier(.23,1,.32,1) 0.3s both",
            "--xp-pct": `${pct}%`,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(26,18,8,0.2) 14px, rgba(26,18,8,0.2) 15px)" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 10, color: COLORS.muted }}>
            {progress.nextRank
              ? `Next: ${progress.nextRank} · ${progress.remainingToNext.toLocaleString()} ink to go`
              : "Top rank reached"}
          </div>
          <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: COLORS.gold }}>{pct}%</div>
        </div>
      </div>

      {/* Ink balance */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: COLORS.ink, padding: "10px 16px",
        border: `1.5px solid rgba(201,162,39,0.35)`,
        marginBottom: 16,
        animation: "owls-press-fade-up 0.4s ease 0.15s both",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #f0d060, ${COLORS.gold} 60%, #8a6510)`,
          border: "1.5px solid rgba(42,31,14,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.blackletter, fontSize: 14, color: COLORS.ink,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
        }}>¤</div>
        <div>
          <div style={{
            fontFamily: F.display, fontWeight: 900, fontSize: 26, color: COLORS.gold,
            animation: "owls-press-shimmer 3s ease-in-out infinite",
          }}>
            {(userStats.inkBalance ?? 0).toLocaleString()}
          </div>
          <div style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(245,239,224,0.35)" }}>
            Ink Balance
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: F.body, fontStyle: "italic", fontSize: 10, color: COLORS.muted,
          textAlign: "right",
        }}>
          "The Owl's Press<br />reserve"
        </div>
      </div>

      <OrnateRule symbol="* Reading Trail *" />

      <DimensionPanel />

      <OrnateRule symbol="- Rank Path -" />

      {/* Rank progression */}
      <SectionLabel>Rank Path</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {RANKS.map((rank, i) => {
          const unlocked = (userStats.xpCurrent ?? 0) >= rank.ink;
          const current = rank.name === progress.currentRank;
          return (
            <div key={i} style={{
              fontFamily: F.display, fontWeight: 700, fontStyle: "italic", fontSize: 10,
              padding: "4px 12px",
              border: `1px solid ${current ? COLORS.gold : unlocked ? COLORS.ink : COLORS.paperAged}`,
              background: current ? COLORS.gold : unlocked ? COLORS.ink : "transparent",
              color: current ? COLORS.ink : unlocked ? COLORS.paper : COLORS.paperAged,
              opacity: unlocked ? 1 : 0.5,
            }}>
              {rank.name}
              {current && " ✦"}
            </div>
          );
        })}
      </div>

      {/* Stats grid */}
      <OrnateRule />
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Asked", value: userStats.questionsAsked ?? 0, sub: "Questions" },
          { label: "Read", value: userStats.articlesRead ?? 0, sub: "Dispatches" },
          { label: "Streak", value: userStats.streakDays ?? 0, sub: "Days" },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1, background: COLORS.ink, padding: "12px 8px",
            textAlign: "center",
            animation: `owls-press-fade-up 0.4s ease ${0.3 + i * 0.08}s both`,
          }}>
            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 24, color: COLORS.paper }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: F.editorial, fontSize: 10, color: COLORS.muted, marginTop: 2 }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: F.ui, fontSize: 10, color: "rgba(245,239,224,0.25)", letterSpacing: 1 }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <OrnateRule symbol="— ⚙ —" />
      <SectionLabel>Settings</SectionLabel>
      <SettingRow icon="!" label="Notifications" sub="Reading reminders" />
      <SettingRow icon="M" label="Dark Mode" sub="Night reading theme" value="Off" />
      <SettingRow icon="@" label="Daily Dispatch" sub="Email edition" value="On" />
      <SettingRow icon="#" label="Privacy" sub="Data and reading history" />
      <SettingRow icon="O" label="About The Owl's Press" sub="Publication notes" />

      {/* Footer */}
      <div style={{ textAlign: "center", padding: `${SPACE[7]}px 0 ${SPACE[2]}px` }}>
        <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, opacity: 0.35, lineHeight: 1.8 }}>
          "The page stays warm after midnight."<br />
          — The Owl's Press · Est. 2025
        </div>
      </div>
    </div>
  );
}
