// ═══════════════════════════════════════════════════════════════
// The Owl's Press · InputBar Component
// Three modes: Solve · Scout · Research
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { COLORS, FONTS as F, TEXTURES } from "../styles/tokens.js";
import { SendIcon } from "./Primitives.jsx";

const MODES = [
  {
    id: "normal",
    label: "Solve a Problem",
    color: COLORS.ink,
    marker: "",
    time: "1 M",
    placeholder: "Personal dispatch - bring us a question...",
    hint: "Solve a Problem · A focused dispatch written around the question on your mind.",
  },
  {
    id: "air",
    label: "Find a Book",
    color: COLORS.teal,
    marker: "✦",
    time: "30 S",
    placeholder: "Describe the mood, mess, or obsession...",
    hint: "Find a Book · Five sharp recommendations, no bookshelf cosplay.",
  },
  {
    id: "max",
    label: "Deep Dive",
    color: COLORS.purple,
    marker: "◇",
    time: "2 M",
    placeholder: "Ask for the longer, thornier version...",
    hint: "Deep Dive · Context, tradeoffs, and companion reads for the properly curious.",
  },
];

export default function InputBar({ onSend }) {
  const [mode, setMode] = useState("normal");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);

  const currentMode = MODES.find((m) => m.id === mode);
  const modeColor = currentMode.color;

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim(), mode);
      setText("");
    }
  };

  useEffect(() => {
    const handlePrefillSend = (event) => {
      const incomingText = event?.detail?.text?.trim();
      const incomingMode = event?.detail?.mode || "normal";
      if (!incomingText) return;
      setMode(incomingMode);
      setText(incomingText);
      setTimeout(() => {
        onSend(incomingText, incomingMode);
        setText("");
      }, 80);
    };

    window.addEventListener("owls-press-prefill-send", handlePrefillSend);
    return () => window.removeEventListener("owls-press-prefill-send", handlePrefillSend);
  }, [onSend]);

  return (
    <div style={{
      ...TEXTURES.paperLight,
      borderTop: `2px double ${COLORS.rule}`,
      padding: `16px 24px 18px`,
    }}>
      {/* Mode toggles */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                fontFamily: F.ui,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "10px 10px",
                minHeight: 78,
                border: `2px solid ${active ? m.color : COLORS.rule}`,
                background: active ? m.color : "transparent",
                color: active ? COLORS.paper : (m.id === "normal" ? COLORS.ink : m.color),
                cursor: "pointer", transition: "all 0.15s ease",
              }}
            >
              {m.marker && <span style={{ color: active ? COLORS.paper : m.color, fontSize: 16 }}>{m.marker}</span>}
              <span style={{
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {m.label}
              </span>
              {active && (
                <span style={{
                  borderLeft: `1px solid ${active ? "rgba(245,239,224,0.35)" : COLORS.rule}`,
                  paddingLeft: 12,
                  fontSize: 15,
                  lineHeight: 1.05,
                  letterSpacing: 2,
                  color: active ? COLORS.paper : COLORS.muted,
                  whiteSpace: "pre-line",
                }}>
                  {m.time.replace(" ", "\n")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{
            position: "absolute", top: 0, right: 0, width: 17, height: 17,
            background: COLORS.paperAged,
            clipPath: "polygon(0 0, 100% 0, 100% 100%)", zIndex: 1,
          }} />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={currentMode.placeholder}
            rows={2}
            style={{
              width: "100%",
              height: 116,
              border: `2.5px solid ${mode !== "normal" ? modeColor : COLORS.rule}`,
              background: COLORS.paperDark,
              padding: `20px 24px`,
              fontFamily: F.body, fontStyle: "italic", fontWeight: 700, fontSize: 18,
              color: COLORS.ink, outline: "none", resize: "none",
              lineHeight: 1.5,
              transition: "border-color 0.2s ease",
            }}
          />
        </div>

        <div style={{ width: 88, display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => setRecording(!recording)}
            style={{
              width: "100%", height: 52,
              border: `2px dashed ${recording ? COLORS.red : COLORS.muted}`,
              background: recording ? COLORS.red : COLORS.paperDark,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 18,
              animation: recording ? "owls-press-shimmer 1s ease-in-out infinite" : "none",
              transition: "all 0.2s ease",
              color: recording ? COLORS.paper : COLORS.muted,
            }}
          >
            <span>{recording ? "●" : "♬"}</span>
            <span style={{ fontFamily: F.ui, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
              SOON
            </span>
          </button>

          <button
            onClick={handleSend}
            style={{
              width: "100%", flex: 1, minHeight: 56,
              background: modeColor, border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0, transition: "background 0.15s",
              animation: text.trim() ? "owls-press-pulse-gold 2s ease-in-out infinite" : "none",
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {currentMode.hint && (
        <div style={{
          fontFamily: F.body, fontStyle: "italic", fontSize: 10,
          color: mode !== "normal" ? modeColor : COLORS.muted,
          opacity: mode !== "normal" ? 0.85 : 0.55,
          textAlign: "center", marginTop: 11, letterSpacing: 0.4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: 14,
          lineHeight: "14px",
        }}>
          {currentMode.hint}
        </div>
      )}
    </div>
  );
}
