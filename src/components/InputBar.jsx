// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · InputBar Component
// Three modes: Normal · Air · Max
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { COLORS, FONTS as F } from "../styles/tokens.js";
import { SendIcon } from "./Primitives.jsx";

export default function InputBar({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim(), "normal");
      setText("");
    }
  };

  return (
    <div>
      <div style={{
        margin: "12px 16px 6px",
        border: `2px solid ${COLORS.rule}`,
        borderRadius: 4,
        background: COLORS.cardSurface,
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={2}
          placeholder="Personal dispatch - bring us a question…"
          aria-label="Personal dispatch input"
          style={{
            flex: 1,
            padding: "12px 14px",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: F.body,
            fontStyle: "italic",
            fontSize: 13,
            color: "#7A7468",
            resize: "none",
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          aria-label="Send dispatch"
          style={{
            width: 48,
            background: COLORS.ink,
            border: "none",
            borderLeft: `2px solid ${COLORS.rule}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "#F4EFE2",
          }}
        >
          <SendIcon />
        </button>
      </div>

      <p style={{
        padding: "0 16px 10px",
        fontFamily: F.ui,
        fontSize: 9.5,
        color: "#7A7468",
        lineHeight: 1.5,
        letterSpacing: "0.01em",
        margin: 0,
      }}>
        <strong style={{ fontWeight: 600, color: "#3A3730" }}>Solve a Problem</strong> · A focused dispatch written around the question on yo…
      </p>
    </div>
  );
}
