// ═══════════════════════════════════════════════════════════════
// Home · Owlpo routes (bubble row + pills — iOS benchmark layout)
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { OWLPO_UI_STACK } from "../styles/tokens.js";
import { useAppTheme } from "../context/AppThemeContext.jsx";
import { OWLPO_ASSETS } from "../utils/owlpoAssets.js";

const CARD_BORDER = "1px solid rgba(0,0,0,0.06)";

function OwlAvatar() {
  return (
    <img
      src={OWLPO_ASSETS.avatarSpeaking}
      alt=""
      aria-hidden="true"
      style={{
        borderRadius: "50%",
        flexShrink: 0,
        width: 38,
        height: 38,
        objectFit: "cover",
        border: "1px solid rgba(26,37,64,0.08)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    />
  );
}

const ROUTES = [
  { label: "Surprise me", text: "Surprise me — pick a book I would never have reached for on my own tonight." },
  { label: "A thoughtful route", text: "A thoughtful route — something literary that still feels like a warm coat." },
  { label: "A cozy escape", text: "A cozy escape — quiet pages, soft endings, no sharp edges tonight." },
];

function RoutePills({ onPickRoute, selectedIdx, setSelectedIdx }) {
  return (
    <div
      style={{
        marginLeft: 46,
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      {ROUTES.map((r, i) => (
        <button
          key={r.label}
          type="button"
          className="duleme-press-dim"
          onClick={() => {
            setSelectedIdx(i);
            onPickRoute(r.text);
          }}
          style={{
            height: 44,
            boxSizing: "border-box",
            width: "fit-content",
            maxWidth: "100%",
            textAlign: "left",
            padding: "0 20px",
            borderRadius: 24,
            border: selectedIdx === i ? "1px solid #C4922A" : CARD_BORDER,
            background: selectedIdx === i ? "rgba(196,146,42,0.08)" : "var(--duleme-reply-pill-bg)",
            color: "var(--duleme-text)",
            fontFamily: OWLPO_UI_STACK,
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.01em",
            lineHeight: 1.2,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            boxShadow:
              selectedIdx === i ? "0 0 0 2px rgba(196,146,42,0.12)" : "0 1px 3px rgba(0, 0, 0, 0.03)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function AssistantBubble({ isDark }) {
  const inkPrimary = "var(--duleme-text)";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, minWidth: 0, minHeight: 0 }}>
      <OwlAvatar />
      <div style={{ flex: 1, minWidth: 0, maxWidth: "100%", position: "relative" }}>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            maxWidth: "min(100%, 260px)",
            boxSizing: "border-box",
            background: "var(--duleme-bubble-bg)",
            border: CARD_BORDER,
            borderRadius: "4px 14px 14px 14px",
            padding: "10px 14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pointerEvents: "none",
              opacity: 0.65,
            }}
          >
            <img src={OWLPO_ASSETS.icons.sparkle} width={14} height={14} alt="" />
            <img src={OWLPO_ASSETS.icons.sparkle} width={9} height={9} alt="" style={{ marginLeft: 6 }} />
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: OWLPO_UI_STACK,
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.35,
              color: isDark ? "rgba(237,230,215,0.82)" : "#4A5568",
            }}
          >
            Owlpo found three routes for tonight.
          </p>
          <p
            style={{
              margin: "3px 0 0",
              fontFamily: OWLPO_UI_STACK,
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.25,
              color: isDark ? "var(--duleme-gold-bright)" : inkPrimary,
            }}
          >
            Which one should we fly?
          </p>
        </div>
      </div>
      <div style={{ marginTop: 2, flexShrink: 0, position: "relative", width: 20, height: 36 }}>
        <img
          src={OWLPO_ASSETS.icons.sparkle}
          width={14}
          height={14}
          alt=""
          style={{ opacity: 0.45, display: "block" }}
        />
        <img
          src={OWLPO_ASSETS.icons.sparkle}
          width={9}
          height={9}
          alt=""
          style={{ position: "absolute", top: 10, left: 6, opacity: 0.28, display: "block" }}
        />
      </div>
    </div>
  );
}

/**
 * @param {{ onPickRoute: (text: string) => void, phase?: "bubble" | "pills" | "both" }} props
 */
export default function HomeOwlpoRoutes({ onPickRoute, phase = "both" }) {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (phase === "bubble") {
    return <AssistantBubble isDark={isDark} />;
  }
  if (phase === "pills") {
    return <RoutePills onPickRoute={onPickRoute} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} />;
  }

  return (
    <div style={{ position: "relative" }}>
      <AssistantBubble isDark={isDark} />
      <RoutePills onPickRoute={onPickRoute} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} />
    </div>
  );
}
