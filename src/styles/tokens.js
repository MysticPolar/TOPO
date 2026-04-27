// ═══════════════════════════════════════════════════════════════
// 读了么 · Design Tokens
// The Owlery Press · Brand Identity System
// ═══════════════════════════════════════════════════════════════

export const COLORS = {
  ink:        "#1a1208",
  paper:      "#f5efe0",
  paperDark:  "#e8dfc8",
  paperAged:  "#d4c9a8",

  red:        "#c0392b",
  gold:       "#c9a227",
  goldLight:  "#e8c547",

  teal:       "#2a7c6f",
  cobalt:     "#1d3a6b",
  coral:      "#d4533a",
  green:      "#2d6a4f",
  purple:     "#5c2d7a",

  // Darkened from #6b5e45 → ~5.0:1 contrast on paper (#f5efe0) for WCAG AA
  muted:      "#54493a",
  rule:       "#2a1f0e",
};

export const SEMANTIC = {
  success:  "#2d6a4f",
  error:    "#c0392b",
  warning:  "#c9a227",
  info:     "#1d3a6b",
  disabled: "#d4c9a8",
};

export const STATES = {
  hoverBg:   "#e8dfc8",
  pressedBg: "#d4c9a8",
  focusRing: "#c9a227",
  disabledOpacity: 0.4,
};

export const CARD_COLORS = {
  coral:  "#d4533a",
  cobalt: "#1d3a6b",
  purple: "#5c2d7a",
  teal:   "#2a7c6f",
  gold:   "#c9a227",
  green:  "#2d6a4f",
};

// ── Type Scale (major-third ~1.25 ratio, 12px base) ──────────
export const TYPE_SCALE = {
  caption:  { size: 10, lineHeight: 1.4, letterSpacing: 1.5 },
  footnote: { size: 11, lineHeight: 1.5, letterSpacing: 1 },
  body:     { size: 13, lineHeight: 1.9, letterSpacing: 0.5 },
  subhead:  { size: 16, lineHeight: 1.5, letterSpacing: 1 },
  title:    { size: 20, lineHeight: 1.4, letterSpacing: 2 },
  headline: { size: 26, lineHeight: 1.3, letterSpacing: 3 },
  display:  { size: 34, lineHeight: 1.2, letterSpacing: 4 },
  banner:   { size: 42, lineHeight: 1.1, letterSpacing: 6 },
};

// ── Spacing Scale (4px base) ─────────────────────────────────
export const SPACE = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

// ── Layout Constants ─────────────────────────────────────────
export const LAYOUT = {
  minTouchTarget: 44,
  cornerRadius: 0,
  circularRadius: "50%",
};

// ── Bilingual Font System ────────────────────────────────────
// Blackletter: UnifrakturMaguntia — decorative masthead moments
// Display:     Playfair Display + Noto Serif SC — editorial headlines
// Body:        IM Fell English + Noto Serif SC — reading prose, AI answers
// UI:          Space Grotesk + Noto Sans SC — labels, nav, system chrome
// Chinese:     Noto Serif SC primary — CJK-heavy titles, questions
export const FONTS = {
  blackletter: "'UnifrakturMaguntia', cursive",
  display:     "'Playfair Display', 'Noto Serif SC', serif",
  body:        "'IM Fell English', 'Noto Serif SC', serif",
  ui:          "'Space Grotesk', 'Noto Sans SC', sans-serif",
  chinese:     "'Noto Serif SC', 'Playfair Display', serif",
};

// ── Dark Mode Palette ("aged paper under lamplight") ─────────
export const COLORS_DARK = {
  ink:        "#e8dfc8",
  paper:      "#1e1a12",
  paperDark:  "#161208",
  paperAged:  "#2a2418",

  red:        "#d94535",
  gold:       "#d4b030",
  goldLight:  "#f0d558",

  teal:       "#3a9c8f",
  cobalt:     "#3a5c9b",
  coral:      "#e06650",
  green:      "#3d8a6f",
  purple:     "#7c4da0",

  muted:      "#9a8e7a",
  rule:       "#3a3020",
};

// ── Texture helpers ───────────────────────────────────────────
const NOISE_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E";

export const TEXTURES = {
  paper: {
    backgroundColor: COLORS.paper,
    backgroundImage: `url("${NOISE_URI}"), repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(42,31,14,0.05) 31px, rgba(42,31,14,0.05) 32px), repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(42,31,14,0.02) 47px, rgba(42,31,14,0.02) 48px)`,
    backgroundSize: "300px 300px, auto, auto",
  },
  paperLight: {
    backgroundColor: COLORS.paper,
    backgroundImage: `url("${NOISE_URI}")`,
    backgroundSize: "300px 300px",
  },
};

// ── Global CSS injected once ──────────────────────────────────
export const GLOBAL_CSS = `
  @import url('https://fonts.loli.net/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=UnifrakturMaguntia&family=IM+Fell+English:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

  @keyframes duleme-float-in {
    from { opacity: 0; transform: rotate(-2deg) translateY(12px); }
    to   { opacity: 1; transform: rotate(var(--rot, -1.5deg)) translateY(0); }
  }
  @keyframes duleme-float-in-2 {
    from { opacity: 0; transform: rotate(1deg) translateY(12px); }
    to   { opacity: 1; transform: rotate(var(--rot, 1deg)) translateY(0); }
  }
  @keyframes duleme-xp-fill {
    from { width: 0; }
    to   { width: var(--xp-pct, 67%); }
  }
  @keyframes duleme-shimmer {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.65; }
  }
  @keyframes duleme-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes duleme-slide-up {
    from { opacity: 0; transform: translateY(100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes duleme-pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,39,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(201,162,39,0); }
  }
  @keyframes duleme-ink-drip {
    0%   { transform: scaleY(0); transform-origin: top; }
    100% { transform: scaleY(1); transform-origin: top; }
  }
  @keyframes duleme-toast-in {
    from { opacity: 0; transform: translateY(24px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes duleme-stamp {
    0%   { transform: scale(1.4) rotate(-8deg); opacity: 0; }
    60%  { transform: scale(0.95) rotate(-2deg); opacity: 1; }
    100% { transform: scale(1) rotate(-3deg); opacity: 1; }
  }
  @keyframes duleme-erase {
    0%   { clip-path: inset(0 0 0 0%);      opacity: 1;   transform: none;                          filter: blur(0); }
    20%  { clip-path: inset(-4px 0 -4px 18%); opacity: 0.9; transform: skewX(-7deg) scaleY(1.06);   filter: blur(0.5px); }
    55%  { clip-path: inset(-4px 0 -4px 55%); opacity: 0.6; transform: skewX(5deg) scaleY(0.94);    filter: blur(1.5px); }
    85%  { clip-path: inset(-4px 0 -4px 85%); opacity: 0.3; transform: skewX(-3deg);                filter: blur(2px); }
    100% { clip-path: inset(0 0 0 100%);    opacity: 0;   transform: none;                          filter: blur(3px); }
  }

  @keyframes duleme-blink {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0; }
  }
  .duleme-tw-cursor {
    display: inline-block;
    width: 2px;
    height: 1.1em;
    background: currentColor;
    margin-left: 1px;
    vertical-align: text-bottom;
    opacity: 0.8;
    animation: duleme-blink 0.7s step-end infinite;
  }

  .duleme-root *::-webkit-scrollbar { display: none; }
  .duleme-root * { scrollbar-width: none; -webkit-tap-highlight-color: transparent; }
  .duleme-root input, .duleme-root button, .duleme-root textarea { -webkit-appearance: none; }

  /* ── Reset for buttons used as cards/rows: keep the card look ────── */
  .duleme-root button.duleme-bare {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    text-align: inherit;
    cursor: pointer;
    width: 100%;
    display: block;
  }

  /* ── Focus-visible: keyboard-only ring, never on touch/mouse ─────── */
  .duleme-root *:focus { outline: none; }
  .duleme-root *:focus-visible {
    outline: 2px solid #c9a227;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(201,162,39,0.18);
  }

  /* ── Body scroll lock when a modal is open ───────────────────────── */
  body.duleme-no-scroll { overflow: hidden; touch-action: none; }
`;
