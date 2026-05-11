import { useState, useEffect } from "react";
import { COLORS, FONTS as F } from "../styles/tokens.js";

export default function SplashScreen({ onEnter }) {
  const [visible, setVisible] = useState(false);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      width: "100%", flex: 1, minHeight: 0, height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: COLORS.ink,
      gap: 14,
      padding: "0 24px",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease",
    }}>
      <div style={{ width: 80, height: 1, background: "rgba(245,239,224,0.12)" }} />

      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 9,
        letterSpacing: 6,
        color: "rgba(245,239,224,0.55)",
        textTransform: "uppercase",
      }}>
        The
      </div>

      <div style={{
        fontFamily: F.blackletter,
        fontSize: "clamp(36px, 11vw, 56px)",
        color: "#f5efe0",
        letterSpacing: 1,
        lineHeight: 1,
        textAlign: "center",
      }}>
        Owl's <span style={{ color: COLORS.red }}>Post</span>office
      </div>

      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 9,
        letterSpacing: 5,
        color: COLORS.muted,
        textTransform: "uppercase",
      }}>
        Read Dangerously
      </div>

      <div style={{ width: 80, height: 1, background: "rgba(245,239,224,0.12)" }} />

      <button
        type="button"
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
        onMouseLeave={() => setPressing(false)}
        onTouchStart={() => setPressing(true)}
        onTouchEnd={() => setPressing(false)}
        onClick={onEnter}
        style={{
          marginTop: 32,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: 4,
          padding: "12px 32px",
          background: "transparent",
          color: pressing ? "rgba(245,239,224,0.5)" : "rgba(245,239,224,0.35)",
          border: `1px solid ${pressing ? "rgba(245,239,224,0.3)" : "rgba(245,239,224,0.12)"}`,
          cursor: "pointer",
          textTransform: "uppercase",
          transition: "all 0.15s ease",
          transform: pressing ? "scale(0.97)" : "scale(1)",
        }}
      >
        Enter Preview
      </button>
    </div>
  );
}
