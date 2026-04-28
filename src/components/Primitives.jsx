// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Shared UI Primitives
// ═══════════════════════════════════════════════════════════════

import { COLORS, FONTS as F, TEXTURES, CARD_COLORS, SPACE, LAYOUT } from "../styles/tokens.js";

// ── Ornate Rule Divider ───────────────────────────────────────
export const OrnateRule = ({ symbol = "◆ · ◆", my = SPACE[3] }) => (
  <div style={{ display: "flex", alignItems: "center", gap: SPACE[2], margin: `${my}px 0` }}>
    <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}` }} />
    <span style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 4 }}>{symbol}</span>
    <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${COLORS.rule}` }} />
  </div>
);

// ── Section Label Banner ──────────────────────────────────────
export const SectionLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: SPACE[2], marginBottom: SPACE[3] }}>
    <div style={{
      fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 3,
      textTransform: "uppercase", background: COLORS.ink,
      color: COLORS.paper, padding: `${SPACE[1]}px ${SPACE[2]}px`,
    }}>{children}</div>
    <div style={{ flex: 1, borderTop: `1px solid ${COLORS.paperAged}` }} />
  </div>
);

// ── Nav Icons ─────────────────────────────────────────────────
export const NavIconHome = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
    <rect x="3" y="3" width="18" height="18" fill="none"
      stroke={active ? COLORS.gold : COLORS.muted}
      strokeWidth="1.5" opacity={active ? 1 : 0.35} />
    <rect x="6" y="6" width="12" height="2"
      fill={active ? COLORS.gold : COLORS.muted} opacity={active ? 1 : 0.35} />
    <rect x="6" y="10" width="8" height="1.5"
      fill={active ? COLORS.gold : COLORS.muted} opacity={active ? 0.7 : 0.25} />
    <rect x="6" y="13" width="10" height="1.5"
      fill={active ? COLORS.gold : COLORS.muted} opacity={active ? 0.7 : 0.25} />
    <rect x="6" y="16" width="5" height="1.5"
      fill={active ? COLORS.gold : COLORS.muted} opacity={active ? 0.4 : 0.15} />
  </svg>
);

export const NavIconReading = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
    <path d="M12 6 Q12 5 11 5 L4 5 Q3 5 3 6 L3 20 Q3 21 4 21 L12 21Z"
      fill="none" stroke={active ? COLORS.gold : COLORS.muted}
      strokeWidth="1.5" opacity={active ? 1 : 0.35} />
    <path d="M12 6 Q12 5 13 5 L20 5 Q21 5 21 6 L21 20 Q21 21 20 21 L12 21Z"
      fill="none" stroke={active ? COLORS.gold : COLORS.muted}
      strokeWidth="1.5" opacity={active ? 1 : 0.35} />
    <line x1="12" y1="6" x2="12" y2="21"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="1" opacity={active ? 1 : 0.35} />
    <line x1="6" y1="9" x2="10" y2="9"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="0.8" opacity={active ? 0.6 : 0.2} />
    <line x1="6" y1="12" x2="10" y2="12"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="0.8" opacity={active ? 0.5 : 0.15} />
    {active && <>
      <line x1="14" y1="9" x2="18" y2="9" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.6" />
      <line x1="14" y1="12" x2="18" y2="12" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.5" />
    </>}
  </svg>
);

export const NavIconProfile = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
    <circle cx="12" cy="9" r="4" fill="none"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="1.5" opacity={active ? 1 : 0.35} />
    <rect x="7" y="5" width="10" height="2" fill="none"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="1.2" opacity={active ? 1 : 0.35} />
    <rect x="9" y="3" width="6" height="3" fill="none"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="1" opacity={active ? 1 : 0.35} />
    <line x1="15" y1="4" x2="17" y2="7"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="1.2" opacity={active ? 1 : 0.35} />
    {active && <circle cx="17" cy="7.5" r="1" fill={COLORS.gold} opacity="0.7" />}
    <path d="M5 21 Q5 15 12 15 Q19 15 19 21" fill="none"
      stroke={active ? COLORS.gold : COLORS.muted} strokeWidth="1.5" opacity={active ? 1 : 0.35} />
  </svg>
);

// ── Scholar Avatar SVG ────────────────────────────────────────
export const ScholarAvatar = ({ size = 48 }) => (
  <svg viewBox="0 0 48 48" style={{ width: size, height: size }}>
    <rect width="48" height="48" fill="#e8dfc8" />
    <ellipse cx="24" cy="40" rx="14" ry="10" fill="#1a1208" />
    <rect x="18" y="30" width="12" height="9" fill="#f5efe0" rx="1" />
    <line x1="24" y1="30" x2="24" y2="39" stroke="#1a1208" strokeWidth="0.8" />
    <rect x="21" y="27" width="6" height="5" fill="#d4b896" />
    <circle cx="24" cy="22" r="10" fill="#d4b896" />
    <rect x="16" y="13" width="16" height="3" fill="#1a1208" rx="0.5" />
    <rect x="19" y="10" width="10" height="4" fill="#1a1208" rx="0.5" />
    <line x1="29" y1="11" x2="32" y2="16" stroke="#c9a227" strokeWidth="1.2" />
    <circle cx="32" cy="17" r="1.5" fill="#c9a227" />
    <circle cx="20.5" cy="22" r="1.5" fill="#1a1208" />
    <circle cx="27.5" cy="22" r="1.5" fill="#1a1208" />
    <circle cx="21" cy="21.5" r="0.5" fill="white" />
    <circle cx="28" cy="21.5" r="0.5" fill="white" />
    <circle cx="20.5" cy="22" r="3.5" fill="none" stroke="#1a1208" strokeWidth="0.8" />
    <circle cx="27.5" cy="22" r="3.5" fill="none" stroke="#1a1208" strokeWidth="0.8" />
    <line x1="24" y1="22" x2="24.5" y2="22" stroke="#1a1208" strokeWidth="0.8" />
    <path d="M21,26 Q24,28.5 27,26" fill="none" stroke="#1a1208" strokeWidth="0.8" />
  </svg>
);

// ── Coin Icon ─────────────────────────────────────────────────
export const CoinIcon = ({ size = 14 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle at 35% 35%, ${COLORS.goldLight}, ${COLORS.gold})`,
    border: "1px solid rgba(42,31,14,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.57, color: COLORS.ink, fontWeight: 900,
    fontFamily: F.ui, flexShrink: 0,
  }}>¤</div>
);

// ── Send Icon ─────────────────────────────────────────────────
export const SendIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill={COLORS.paper} />
  </svg>
);

// ── XP Bar ────────────────────────────────────────────────────
export const XPBar = ({ current = 2340, total = 3500, rank = "Oracle Reader" }) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: SPACE[1] }}>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontStyle: "italic", fontSize: 11, color: COLORS.ink }}>
          {rank}
        </div>
        <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 600, color: COLORS.muted, letterSpacing: 1 }}>
          {current.toLocaleString()} ink
        </div>
      </div>
      <div style={{ height: 6, background: COLORS.paperAged, border: `1px solid ${COLORS.rule}`, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          background: COLORS.ink, width: `${pct}%`,
          animation: "duleme-xp-fill 1.2s cubic-bezier(.23,1,.32,1) 0.3s both",
          "--xp-pct": `${pct}%`,
        }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(245,239,224,0.15) 8px, rgba(245,239,224,0.15) 9px)" }} />
        </div>
      </div>
      <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 10, color: COLORS.muted, marginTop: SPACE[1] }}>
        “The Owl is logging your progress.”
      </div>
    </div>
  );
};

// ── Coins Display ─────────────────────────────────────────────
export const CoinsDisplay = ({ amount = 420 }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 5,
    background: COLORS.ink, padding: "7px 10px",
    border: `1.5px solid ${COLORS.rule}`, flexShrink: 0,
  }}>
    <CoinIcon size={14} />
    <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 14, color: COLORS.gold, letterSpacing: 0.4, lineHeight: 1 }}>
      {amount}
    </div>
  </div>
);

// ── Ink Toast Notification ────────────────────────────────────
export const InkToast = ({ amount, message, visible }) => (
  <div style={{
    position: "absolute", bottom: 80, left: 16, right: 16, zIndex: 300,
    display: "flex", alignItems: "center", gap: 12,
    background: COLORS.ink, padding: "12px 16px",
    borderLeft: `4px solid ${COLORS.gold}`,
    boxShadow: `4px 6px 0 ${COLORS.rule}`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
    pointerEvents: visible ? "auto" : "none",
    animation: visible ? "duleme-toast-in 0.35s ease both" : "none",
  }}>
    <CoinIcon size={28} />
    <div>
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 18, color: COLORS.gold }}>
        +{amount} ink
      </div>
      <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 9, color: COLORS.muted }}>
        {message}
      </div>
    </div>
  </div>
);

// ── Question Card ─────────────────────────────────────────────
export const QuestionCard = ({ q, index, onClick }) => {
  const isOdd = index % 2 === 0;
  const rot = isOdd ? -1.5 : 1;
  const mt = isOdd ? 0 : SPACE[3];

  return (
    <button
      type="button"
      onClick={() => onClick(q)}
      aria-label={`Question card · ${q.zh}`}
      className="duleme-bare duleme-card-lift"
      style={{
        flexShrink: 0, width: 156, padding: `${SPACE[3]}px ${SPACE[3]}px ${SPACE[2]}px`,
        paddingLeft: SPACE[3] + 3,
        border: `1.5px solid ${COLORS.rule}`,
        position: "relative", overflow: "hidden", cursor: "pointer",
        ...TEXTURES.paperLight,
        marginTop: mt,
        animation: `${isOdd ? "duleme-float-in" : "duleme-float-in-2"} 0.5s ease ${0.1 + index * 0.15}s both`,
        "--rot": `${rot}deg`,
      }}
    >
      {/* Left 3px accent bar — "book spine" per brand spec */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: CARD_COLORS[q.color] || COLORS.coral }} />
      <div style={{ fontFamily: F.chinese, fontWeight: 700, fontSize: 13, lineHeight: 1.4, color: COLORS.ink, marginBottom: SPACE[2] }}>
        {q.zh}
      </div>
      <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, lineHeight: 1.4, marginBottom: SPACE[2] }}>
        {q.en}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>▲ {q.votes}</div>
        <div style={{ background: COLORS.ink, color: COLORS.paper, fontFamily: F.ui, fontSize: 10, fontWeight: 700, padding: `${SPACE[1]}px ${SPACE[2]}px` }}>
          {q.type}
        </div>
      </div>
    </button>
  );
};
