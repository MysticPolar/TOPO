// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Design Tokens
// The Owlery Press · Brand Identity System
// ═══════════════════════════════════════════════════════════════

/** Legacy palette — deferred screens still import COLORS; align with postal-letter light theme. */
export const COLORS = {
  ink:        "#0B1622",
  paper:      "#F7F2E8",
  paperDark:  "#E8E1D4",
  paperAged:  "#D4C9B8",

  creamPage:   "#FDF8F1",
  frameOuter:  "#E0D9CD",
  cardSurface: "#FDF9F0",

  red:        "#A84432",
  gold:       "#957A3C",
  goldLight:  "#C9A227",

  teal:       "#2a7c6f",
  cobalt:     "#1d3a6b",
  coral:      "#d4533a",
  green:      "#5F7568",
  purple:     "#5c2d7a",

  muted:      "#4A5560",
  rule:       "rgba(11,22,34,0.22)",
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
// TODO(theming): not yet wired — components currently inline fontSize /
// letterSpacing values. Adopting this scale is a separate refactor; the
// numbers here will need to be reconciled with actual on-screen usage
// (e.g. SectionLabel uses letterSpacing: 3, caption tier specifies 1.5).
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

/** Spec: SF Pro–style stack for Owlpo chat / pills / composer (web falls back to system UI). */
export const OWLPO_UI_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif";

// ── English-only Font System (NA build) ──────────────────────
// Blackletter: UnifrakturMaguntia — Victorian masthead wordmark
// Display:     Playfair Display — editorial headlines
// Body:        IM Fell English — period reading prose, AI answers
// UI:          Space Grotesk — labels, nav, system chrome
// `chinese` key kept as a legacy alias (full rename deferred); points
// to the same serif body stack so existing usages render correctly.
export const FONTS = {
  blackletter: "'UnifrakturMaguntia', 'IM Fell English', serif",
  display:     "'Playfair Display', 'IM Fell English', serif",
  body:        "'IM Fell English', 'Playfair Display', serif",
  /** Long explanatory blurbs (e.g. “Why this book”) — Lora loads via GLOBAL_CSS */
  reading:     "'Lora', Georgia, 'Times New Roman', serif",
  ui:          "'Space Grotesk', system-ui, -apple-system, sans-serif",
  chinese:     "'Playfair Display', 'IM Fell English', serif",
};

// ── Semantic recommendation hues (wire beyond shell in a follow-up) ──
export const REC_WEATHER = { light: "#5F7568", dark: "#6D8B7E" };
export const REC_TIME = { morning: "#C9A94B", midday: "#8FA0B0", evening: "#D4A574" };
export const REC_LOCATION = { fog: "#6B7A88", drizzle: "#5A6B78" };
export const REC_GENRE_FICTION = { spine: "#6B4E3D", leather: "#5C4033" };
export const REC_GENRE_NONFICTION = { forest: "#2D4A3E", study: "#4A6352" };

/** @param {Record<string, string>} obj */
function emitCssVars(obj) {
  return Object.entries(obj)
    .map(([k, v]) => {
      const kebab = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `    --duleme-${kebab}: ${v};`;
    })
    .join("\n");
}

/** iOS Owlpo benchmark — warm parchment + navy ink (`owls_postoffice.jsx` design system). */
export const THEME_LIGHT = {
  bg: "#F5F0E8",
  bgElevated: "#FAF7F2",
  frameOuter: "#D8CFC0",
  text: "#1B2A4A",
  textMuted: "#8E9AAB",
  gold: "#C4922A",
  goldBright: "#C4922A",
  goldTextOnDark: "#F4E8C4",
  surface: "#FAF7F2",
  surfaceRail: "#EDE8DE",
  surfaceInput: "#FFFFFF",
  seal: "#C0522E",
  bubbleBg: "#FAF7F2",
  replyPillBg: "#FAF7F2",
  border: "rgba(0,0,0,0.06)",
  borderMedium: "rgba(26,37,64,0.18)",
  borderStrong: "rgba(26,37,64,0.24)",
  warm: "#B87A64",
  sage: "#5F7568",
  red: "#C0522E",
  buttonFill: "#1B2A4A",
  onButton: "#FFFFFF",
  rule: "rgba(26,37,64,0.2)",
  chromeBg: "rgba(250,247,242,0.94)",
  shadow: "rgba(27,42,74,0.05)",
  shadowModal: "rgba(7,12,18,0.35)",
  overlay: "rgba(26,37,64,0.45)",
  vignette: "rgba(26,37,64,0.12)",
  progressTrack: "rgba(196,146,42,0.18)",
  focusRing: "#C4922A",
  focusGlow: "rgba(196,146,42,0.22)",
  cardShadowKey: "#1B2A4A",
  textureLineH: "rgba(26,37,64,0.04)",
  textureLineV: "rgba(26,37,64,0.022)",
  spineA: "#F0EBE2",
  spineB: "#D0C8BC",
  footerFade: "rgba(244,234,211,0.35)",
  footerFadeMuted: "rgba(244,234,211,0.2)",
};

export const THEME_DARK = {
  bg: "#061522",
  bgElevated: "rgba(7,25,40,0.88)",
  frameOuter: "#030910",
  text: "#EDE6D7",
  textMuted: "#8EA9BE",
  gold: "#C49A45",
  goldBright: "#D7A84F",
  goldTextOnDark: "#F0E4BC",
  surface: "rgba(7,25,40,0.88)",
  surfaceRail: "#071828",
  surfaceInput: "rgba(12,32,48,0.92)",
  border: "rgba(237,230,215,0.12)",
  borderMedium: "rgba(237,230,215,0.18)",
  borderStrong: "rgba(237,230,215,0.24)",
  warm: "#C99585",
  sage: "#6D8B7E",
  red: "#B85A43",
  buttonFill: "#1A2C3C",
  onButton: "#EDE6D7",
  rule: "rgba(237,230,215,0.2)",
  chromeBg: "rgba(7,25,40,0.92)",
  shadow: "rgba(0,0,0,0.5)",
  shadowModal: "rgba(0,0,0,0.55)",
  overlay: "rgba(4,8,12,0.72)",
  vignette: "rgba(2,4,8,0.45)",
  progressTrack: "rgba(237,230,215,0.1)",
  focusRing: "#D7A84F",
  focusGlow: "rgba(215,168,79,0.25)",
  cardShadowKey: "#020508",
  textureLineH: "rgba(215,168,79,0.04)",
  textureLineV: "rgba(215,168,79,0.022)",
  spineA: "#2C3A48",
  spineB: "#1A2633",
  footerFade: "rgba(237,230,215,0.22)",
  footerFadeMuted: "rgba(237,230,215,0.12)",
  seal: "#B85A43",
  bubbleBg: "rgba(7,25,40,0.72)",
  replyPillBg: "rgba(12,36,52,0.85)",
};

const THEME_VARS_CSS = `
  .duleme-root {
${emitCssVars(THEME_LIGHT)}
  }
  .duleme-root.duleme-theme-dark {
${emitCssVars(THEME_DARK)}
  }
`;

// ── Texture helpers ───────────────────────────────────────────
const NOISE_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E";

export const TEXTURES = {
  paper: {
    backgroundColor: "var(--duleme-bg)",
    backgroundImage: `url("${NOISE_URI}"), repeating-linear-gradient(0deg, transparent, transparent 31px, var(--duleme-texture-line-h) 31px, var(--duleme-texture-line-h) 32px), repeating-linear-gradient(90deg, transparent, transparent 47px, var(--duleme-texture-line-v) 47px, var(--duleme-texture-line-v) 48px)`,
    backgroundSize: "300px 300px, auto, auto",
  },
  paperLight: {
    backgroundColor: "var(--duleme-bg)",
    backgroundImage: `url("${NOISE_URI}")`,
    backgroundSize: "300px 300px",
  },
};

// ── Global CSS injected once ──────────────────────────────────
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=UnifrakturMaguntia&family=IM+Fell+English:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap');

${THEME_VARS_CSS}

  html, body {
    background: var(--duleme-frame-outer) !important;
  }

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

  /* ── Home weather atmosphere (subtle motion, single-surface) ───────── */
  @keyframes duleme-atmo-ray-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes duleme-atmo-rain-scroll {
    from { background-position: 0 0; }
    to   { background-position: 0 32px; }
  }
  @keyframes duleme-atmo-drizzle-scroll {
    from { background-position: 0 0; }
    to   { background-position: 0 22px; }
  }
  @keyframes duleme-atmo-cloud-drift {
    0%   { transform: translateX(0) scale(1); opacity: 0.4; }
    50%  { transform: translateX(-12px) scale(1.03); opacity: 0.5; }
    100% { transform: translateX(0) scale(1); opacity: 0.4; }
  }
  @keyframes duleme-atmo-snow-drift {
    from { background-position: 0 0, 8px 4px; }
    to   { background-position: 0 36px, 8px 40px; }
  }
  @keyframes duleme-atmo-night-shimmer {
    0%, 100% { opacity: 0.35; }
    50%      { opacity: 0.55; }
  }
  @keyframes duleme-atmo-storm-pulse {
    0%, 92%, 100% { opacity: 0.25; }
    94%           { opacity: 0.42; }
  }

  .duleme-atmo-rays {
    position: absolute;
    inset: -40% -20%;
    pointer-events: none;
    background: conic-gradient(
      from 200deg at 18% 42%,
      transparent 0deg 14deg,
      rgba(255, 190, 95, 0.09) 14deg 22deg,
      transparent 22deg 48deg,
      rgba(255, 215, 140, 0.06) 48deg 58deg,
      transparent 58deg 120deg,
      rgba(255, 200, 110, 0.05) 120deg 132deg,
      transparent 132deg 360deg
    );
    animation: duleme-atmo-ray-rotate 56s linear infinite;
    opacity: 0.85;
  }
  .duleme-atmo-rain {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      102deg,
      transparent 0,
      transparent 8px,
      rgba(45, 78, 98, 0.11) 8px,
      rgba(45, 78, 98, 0.11) 9px
    );
    background-size: 16px 32px;
    animation: duleme-atmo-rain-scroll 2.6s linear infinite;
    opacity: 0.9;
  }
  .duleme-atmo-drizzle {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      104deg,
      transparent 0,
      transparent 10px,
      rgba(70, 90, 102, 0.075) 10px,
      rgba(70, 90, 102, 0.075) 10.5px
    );
    background-size: 18px 24px;
    animation: duleme-atmo-drizzle-scroll 3.4s linear infinite;
    opacity: 0.85;
  }
  .duleme-atmo-clouds {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 130% 90% at 22% 55%, rgba(110, 106, 96, 0.14) 0%, transparent 52%),
      radial-gradient(ellipse 110% 80% at 78% 38%, rgba(98, 94, 88, 0.12) 0%, transparent 48%);
    animation: duleme-atmo-cloud-drift 32s ease-in-out infinite;
  }
  .duleme-atmo-snow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(1.2px 1.2px at 12% 15%, rgba(90, 130, 170, 0.35) 50%, transparent 52%),
      radial-gradient(1px 1px at 45% 8%, rgba(90, 130, 170, 0.28) 50%, transparent 52%),
      radial-gradient(1.1px 1.1px at 78% 22%, rgba(90, 130, 170, 0.32) 50%, transparent 52%),
      radial-gradient(1px 1px at 28% 45%, rgba(90, 130, 170, 0.25) 50%, transparent 52%),
      radial-gradient(1.2px 1.2px at 88% 55%, rgba(90, 130, 170, 0.3) 50%, transparent 52%),
      radial-gradient(1px 1px at 55% 78%, rgba(90, 130, 170, 0.26) 50%, transparent 52%);
    background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
    animation: duleme-atmo-snow-drift 18s linear infinite;
    opacity: 0.75;
  }
  .duleme-atmo-night {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(1px 1px at 18% 28%, rgba(120, 110, 180, 0.45) 50%, transparent 52%),
      radial-gradient(1px 1px at 42% 18%, rgba(140, 130, 200, 0.35) 50%, transparent 52%),
      radial-gradient(1px 1px at 72% 32%, rgba(110, 100, 170, 0.4) 50%, transparent 52%),
      radial-gradient(1px 1px at 88% 48%, rgba(130, 120, 190, 0.32) 50%, transparent 52%),
      radial-gradient(1px 1px at 55% 62%, rgba(120, 110, 180, 0.28) 50%, transparent 52%);
    animation: duleme-atmo-night-shimmer 5s ease-in-out infinite;
  }
  .duleme-atmo-storm {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      95deg,
      transparent 0,
      transparent 14px,
      rgba(35, 48, 58, 0.06) 14px,
      rgba(35, 48, 58, 0.06) 15px
    );
    background-size: 20px 40px;
    animation: duleme-atmo-rain-scroll 2.2s linear infinite, duleme-atmo-storm-pulse 7s ease-in-out infinite;
    opacity: 0.85;
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

  /* ── Container sizing: track the dynamic viewport, not the static one ─── */
  .duleme-root {
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    height: 100dvh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background: var(--duleme-bg);
  }
  /* Fallback for browsers without dvh — keep behavior, just less accurate. */
  @supports not (height: 100dvh) {
    .duleme-root { height: 100vh; min-height: 100vh; }
  }

  /* ── Desktop frame: only show the bezel + shadow on wider viewports ──── */
  @media (min-width: 401px) {
    .duleme-root {
      border: 1px solid var(--duleme-border-medium);
      box-shadow: 0 0 60px var(--duleme-shadow);
    }
  }

  /* ── Safe-area helpers (notched iPhones, gesture bar) ─────────────────── */
  .duleme-safe-bottom {
    padding-bottom: max(var(--duleme-safe-bottom-min, 8px), env(safe-area-inset-bottom));
  }
  .duleme-safe-top {
    padding-top: max(var(--duleme-safe-top-min, 8px), env(safe-area-inset-top));
  }

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
    outline: 2px solid var(--duleme-focus-ring);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px var(--duleme-focus-glow);
  }

  /* ── Body scroll lock when a modal is open ───────────────────────── */
  body.duleme-no-scroll { overflow: hidden; touch-action: none; }

  /* ── Press feedback for cards (works on touch via :active) ───────── */
  /* Cards set --rot inline; hover/active/focus snap to 0deg + lift.    */
  .duleme-card-lift {
    transform: rotate(var(--rot, 0deg));
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .duleme-card-lift:hover,
  .duleme-card-lift:active,
  .duleme-card-lift:focus-visible {
    transform: rotate(0deg) translateY(-4px);
    box-shadow: 4px 6px 0 var(--duleme-card-shadow-key);
  }
  .duleme-press-shadow {
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .duleme-press-shadow:hover,
  .duleme-press-shadow:active,
  .duleme-press-shadow:focus-visible {
    box-shadow: 3px 4px 0 var(--duleme-card-shadow-key);
  }
  .duleme-press-shadow:active {
    transform: translateY(1px);
  }
  .duleme-press-dim:active { opacity: 0.85; }

  /* ── Main scroll: parchment / navy + noise (inherits theme vars) ─────── */
  .duleme-scroll-surface {
    background-color: var(--duleme-bg);
    background-image:
      url("${NOISE_URI}"),
      repeating-linear-gradient(0deg, transparent, transparent 31px, var(--duleme-texture-line-h) 31px, var(--duleme-texture-line-h) 32px),
      repeating-linear-gradient(90deg, transparent, transparent 47px, var(--duleme-texture-line-v) 47px, var(--duleme-texture-line-v) 48px);
    background-size: 300px 300px, auto, auto;
  }

  .duleme-airmail-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 4;
    pointer-events: none;
    background: repeating-linear-gradient(
      125deg,
      #3d5a78 0px,
      #3d5a78 5px,
      #fdf8f1 5px,
      #fdf8f1 10px,
      #c5a059 10px,
      #c5a059 13px,
      #fdf8f1 13px,
      #fdf8f1 18px
    );
    opacity: 0.55;
  }

  .duleme-starfield {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      radial-gradient(1.2px 1.2px at 14% 22%, rgba(201,169,75,0.55) 50%, transparent 52%),
      radial-gradient(1px 1px at 38% 12%, rgba(201,169,75,0.4) 50%, transparent 52%),
      radial-gradient(1.1px 1.1px at 72% 18%, rgba(232,220,180,0.35) 50%, transparent 52%),
      radial-gradient(1px 1px at 88% 34%, rgba(201,169,75,0.45) 50%, transparent 52%),
      radial-gradient(1.2px 1.2px at 52% 48%, rgba(201,169,75,0.3) 50%, transparent 52%),
      radial-gradient(1px 1px at 22% 62%, rgba(201,169,75,0.38) 50%, transparent 52%),
      radial-gradient(1.1px 1.1px at 66% 72%, rgba(201,169,75,0.32) 50%, transparent 52%),
      radial-gradient(1px 1px at 44% 88%, rgba(232,220,180,0.28) 50%, transparent 52%);
    opacity: 0.65;
  }

  .duleme-scroll-vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background: radial-gradient(ellipse at center, transparent 52%, var(--duleme-vignette) 100%);
  }

  /* ── Weather atmosphere: dark theme tint (gold stars, blue-grey rain) ─ */
  .duleme-root.duleme-theme-dark .duleme-atmo-night {
    background:
      radial-gradient(1.2px 1.2px at 18% 28%, rgba(201,169,75,0.5) 50%, transparent 52%),
      radial-gradient(1px 1px at 42% 18%, rgba(201,169,75,0.38) 50%, transparent 52%),
      radial-gradient(1px 1px at 72% 32%, rgba(212,184,106,0.42) 50%, transparent 52%),
      radial-gradient(1px 1px at 88% 48%, rgba(201,169,75,0.35) 50%, transparent 52%),
      radial-gradient(1px 1px at 55% 62%, rgba(201,169,75,0.3) 50%, transparent 52%);
  }
  .duleme-root.duleme-theme-dark .duleme-atmo-rain {
    background: repeating-linear-gradient(
      102deg,
      transparent 0,
      transparent 8px,
      rgba(100,120,140,0.14) 8px,
      rgba(100,120,140,0.14) 9px
    );
  }
  .duleme-root.duleme-theme-dark .duleme-atmo-drizzle {
    background: repeating-linear-gradient(
      104deg,
      transparent 0,
      transparent 10px,
      rgba(110,130,148,0.1) 10px,
      rgba(110,130,148,0.1) 10.5px
    );
  }
  .duleme-root.duleme-theme-dark .duleme-atmo-clouds {
    background:
      radial-gradient(ellipse 130% 90% at 22% 55%, rgba(40,56,72,0.35) 0%, transparent 52%),
      radial-gradient(ellipse 110% 80% at 78% 38%, rgba(30,48,64,0.3) 0%, transparent 48%);
  }
  .duleme-root.duleme-theme-dark .duleme-atmo-snow {
    background-image:
      radial-gradient(1.2px 1.2px at 12% 15%, rgba(180,200,220,0.25) 50%, transparent 52%),
      radial-gradient(1px 1px at 45% 8%, rgba(180,200,220,0.2) 50%, transparent 52%),
      radial-gradient(1.1px 1.1px at 78% 22%, rgba(180,200,220,0.22) 50%, transparent 52%),
      radial-gradient(1px 1px at 28% 45%, rgba(180,200,220,0.18) 50%, transparent 52%),
      radial-gradient(1.2px 1.2px at 88% 55%, rgba(180,200,220,0.2) 50%, transparent 52%),
      radial-gradient(1px 1px at 55% 78%, rgba(180,200,220,0.18) 50%, transparent 52%);
  }
  .duleme-root.duleme-theme-dark .duleme-atmo-storm {
    background: repeating-linear-gradient(
      95deg,
      transparent 0,
      transparent 14px,
      rgba(60,76,92,0.12) 14px,
      rgba(60,76,92,0.12) 15px
    );
  }

  /* ── Reduced motion: neutralize all animations & transitions ─────── */
  @media (prefers-reduced-motion: reduce) {
    .duleme-root *,
    .duleme-root *::before,
    .duleme-root *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      animation-delay: 0ms !important;
      transition-duration: 0.001ms !important;
      transition-delay: 0ms !important;
      scroll-behavior: auto !important;
    }
    .duleme-tw-cursor { animation: none !important; opacity: 0.8 !important; }
    .duleme-starfield { opacity: 0.35 !important; }
  }
`;
