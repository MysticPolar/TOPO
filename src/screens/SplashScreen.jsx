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
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: COLORS.ink,
      gap: 14,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease",
    }}>
      <div style={{ width: 80, height: 1, background: "rgba(245,239,224,0.12)" }} />

      <div style={{
        fontFamily: F.chinese,
        fontSize: 52,
        color: "#f5efe0",
        letterSpacing: 6,
        lineHeight: 1,
      }}>
        读<span style={{ color: COLORS.red }}>了</span>么
      </div>

      <div style={{
        fontFamily: "sans-serif",
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
          fontFamily: "sans-serif",
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
        测试入口
      </button>
    </div>
  );
}
