import AppMenu from "./AppMenu.jsx";
import { getRankProgress } from "../data/content.js";
import { FONTS as F } from "../styles/tokens.js";
import { OWLPO_ASSETS } from "../utils/owlpoAssets.js";

const CHROME_BORDER = "1px solid var(--duleme-border)";

function OwlMark({ size = 36 }) {
  return (
    <img
      src={OWLPO_ASSETS.avatarHeader}
      width={size}
      height={size}
      alt=""
      style={{
        borderRadius: "50%",
        flexShrink: 0,
        objectFit: "cover",
        border: "1px solid rgba(26,37,64,0.1)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }}
    />
  );
}

function FeatherIcon({ theme }) {
  return (
    <img
      src={OWLPO_ASSETS.icons.feather}
      width={16}
      height={16}
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        flexShrink: 0,
        filter: theme === "dark"
          ? "brightness(0) saturate(100%) invert(78%) sepia(28%) saturate(638%) hue-rotate(355deg) brightness(95%) contrast(92%)"
          : "none",
        opacity: theme === "dark" ? 0.95 : 0.8,
      }}
    />
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }} aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2.6v2.3M12 19.1v2.3M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.6 12h2.3M19.1 12h2.3M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <img src={OWLPO_ASSETS.icons.moon} width={22} height={22} alt="" aria-hidden="true" style={{ display: "block", opacity: 0.9 }} />
  );
}

export default function TopBar({
  userStats,
  isLoggedIn,
  userName,
  recentChats,
  libraryCount,
  theme,
  onToggleTheme,
  onNavigate,
  onOpenChat,
  onRequestLogin,
  onSignOut,
}) {
  const progress = getRankProgress(userStats?.xpCurrent ?? 0);
  const expPct = Math.max(0, Math.min(100, progress.pctToNext ?? 0));

  const navBtn = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "none",
    background: "var(--duleme-bg-elevated)",
    boxShadow: theme === "dark" ? "inset 0 0 0 1px var(--duleme-border)" : "none",
    color: "var(--duleme-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
    transition: "transform 120ms",
  };

  return (
    <div
      style={{
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: "auto",
        minHeight: "calc(env(safe-area-inset-top) + 62px)",
        maxHeight: "none",
        boxSizing: "border-box",
        borderBottom: "none",
        background: "var(--duleme-bg)",
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 10,
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div
        style={{
          minHeight: 48,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <OwlMark size={40} />
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
            <span
              style={{
                fontFamily: F.serif,
                fontSize: 22,
                fontWeight: 500,
                lineHeight: 1.1,
                color: "var(--duleme-text)",
                letterSpacing: "-0.01em",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              The Owl&apos;s Postoffice
            </span>
            <div
              aria-label="Experience progress"
              style={{
                width: 148,
                height: 4,
                borderRadius: 2,
                background: "var(--duleme-progress-track)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${expPct}%`,
                  height: "100%",
                  borderRadius: 2,
                  background: "linear-gradient(90deg, var(--duleme-gold), #D4A23A)",
                  transition: "width 0.35s ease",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => onNavigate("rewards")}
            aria-label="Open coin and rewards"
            className="duleme-press-dim"
            style={{
              minHeight: 36,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              border: "none",
              background: "var(--duleme-bg-elevated)",
              padding: "6px 10px",
              borderRadius: 999,
              color: "var(--duleme-text)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: theme === "dark" ? "inset 0 0 0 1px var(--duleme-border)" : "0 1px 0 rgba(26,37,64,0.04)",
            }}
          >
            <FeatherIcon theme={theme} />
            <span style={{ fontFamily: F.ui, fontSize: 13, fontWeight: 500 }}>
              {(userStats?.inkBalance ?? 0).toLocaleString()}
            </span>
          </button>

          <button type="button" onClick={onToggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="duleme-press-dim" style={navBtn}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <div style={{ display: "flex", alignItems: "center" }}>
            <AppMenu
              isLoggedIn={isLoggedIn}
              userName={userName}
              recentChats={recentChats}
              libraryCount={libraryCount}
              onNavigate={onNavigate}
              onOpenChat={onOpenChat}
              onRequestLogin={onRequestLogin}
              onSignOut={onSignOut}
              triggerStyle={navBtn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
