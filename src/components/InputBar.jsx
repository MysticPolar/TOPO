// ═══════════════════════════════════════════════════════════════
// The Owl's Press · InputBar Component
// Three modes: Solve · Scout · Research
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { COLORS, FONTS as F, TEXTURES, SPACE, LAYOUT } from "../styles/tokens.js";
import { SendIcon } from "./Primitives.jsx";

const MODES = [
  {
    id: "normal",
    label: "Solve",
    color: COLORS.ink,
    placeholder: "Ask for the one book that can help...",
    hint: "Solve mode: one book, one focused dispatch, one practical next step.",
  },
  {
    id: "air",
    label: "Scout",
    color: COLORS.teal,
    placeholder: "Find five books for this mood or problem...",
    hint: "Scout mode: five fast recommendations with a clear reason for each.",
  },
  {
    id: "max",
    label: "Research",
    color: COLORS.purple,
    placeholder: "Ask for a deeper reading brief...",
    hint: "Research mode: broader context, tradeoffs, and companion reads.",
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
      padding: `${SPACE[2]}px ${SPACE[3]}px`,
    }}>
      {/* Mode toggles */}
      <div style={{ display: "flex", gap: SPACE[1], marginBottom: SPACE[1] }}>
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                fontFamily: F.ui, fontSize: 10, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase",
                padding: `${SPACE[1]}px ${SPACE[2]}px`,
                minHeight: LAYOUT.minTouchTarget,
                border: `1px solid ${active ? m.color : COLORS.rule}`,
                background: active ? m.color : "transparent",
                color: active ? COLORS.paper : (m.id === "normal" ? COLORS.muted : m.color),
                cursor: "pointer", transition: "all 0.15s ease",
              }}
            >
              {m.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{
          fontFamily: F.ui, fontSize: 10, color: COLORS.muted,
          letterSpacing: 1, display: "flex", alignItems: "center",
          opacity: 0.5,
        }}>
          {mode === "air" ? "30 sec" : mode === "max" ? "2 min" : "1 min"}
        </div>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[1] }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{
            position: "absolute", top: 0, right: 0, width: 10, height: 10,
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
              border: `1.5px solid ${mode !== "normal" ? modeColor : COLORS.rule}`,
              background: COLORS.paperDark,
              padding: `${SPACE[2]}px ${SPACE[3]}px`,
              fontFamily: F.body, fontStyle: "italic", fontSize: 13,
              color: COLORS.ink, outline: "none", resize: "none",
              lineHeight: 1.5,
              transition: "border-color 0.2s ease",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: SPACE[1] }}>
          <button
            onClick={() => setRecording(!recording)}
            style={{
              width: LAYOUT.minTouchTarget, height: LAYOUT.minTouchTarget,
              border: `1.5px solid ${recording ? COLORS.red : (mode !== "normal" ? modeColor : COLORS.rule)}`,
              background: recording ? COLORS.red : COLORS.paperDark,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 15,
              animation: recording ? "owls-press-shimmer 1s ease-in-out infinite" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {recording ? "⏺" : "🎙"}
          </button>

          <button
            onClick={handleSend}
            style={{
              width: LAYOUT.minTouchTarget, height: LAYOUT.minTouchTarget,
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
          textAlign: "center", marginTop: SPACE[1], letterSpacing: 0.4,
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
