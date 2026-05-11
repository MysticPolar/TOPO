import { useEffect, useMemo, useState } from "react";
import { FONTS as F } from "../styles/tokens.js";
import { OWLPO_ASSETS } from "../utils/owlpoAssets.js";

function truncatePreview(text, max = 38) {
  const safe = (text ?? "").trim();
  if (!safe) return "Untitled chat";
  if (safe.length <= max) return safe;
  return `${safe.slice(0, max - 1)}…`;
}

function KebabIcon({ open }) {
  return (
    <img
      src={OWLPO_ASSETS.icons.more}
      width={20}
      height={20}
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        opacity: open ? 1 : 0.88,
        filter: open ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }} aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 20v-5.5h5V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }} aria-hidden="true">
      <path d="M4.5 5h5.5v14H4.5zM10 7h5.5v12H10zM15.5 9H20v10h-4.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }} aria-hidden="true">
      <path d="m19.4 13.1.1-2.2-2-.7a5.8 5.8 0 0 0-.7-1.6l1-1.9-1.6-1.5-1.8 1a5.8 5.8 0 0 0-1.7-.7L12 3.5l-2.1.1-.7 2a5.8 5.8 0 0 0-1.6.7l-1.9-1-1.5 1.6 1 1.8a5.8 5.8 0 0 0-.7 1.7l-2 .7.1 2.1 2 .7a5.8 5.8 0 0 0 .7 1.6l-1 1.9 1.6 1.5 1.8-1a5.8 5.8 0 0 0 1.7.7l.7 2 2.1-.1.7-2a5.8 5.8 0 0 0 1.6-.7l1.9 1 1.5-1.6-1-1.8c.3-.5.6-1 .7-1.7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }} aria-hidden="true">
      <path d="M4 6h16v10H9l-5 4V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function timeAgoLabel(ts) {
  if (!ts) return "";
  const created = new Date(ts).getTime();
  if (!Number.isFinite(created)) return "";
  const diffMs = Date.now() - created;
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / (60 * 1000)))}m`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h`;
  if (diffMs < 2 * day) return "Yesterday";
  if (diffMs < 7 * day) return new Date(created).toLocaleDateString(undefined, { weekday: "short" });
  return new Date(created).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function MenuRow({ icon, label, onClick, right }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        borderBottom: "1px solid var(--duleme-border)",
        background: "transparent",
        color: "var(--duleme-text)",
        textAlign: "left",
        padding: "10px 12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
      <span style={{ flex: 1, fontFamily: F.ui, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
      {right}
    </button>
  );
}

export default function AppMenu({
  isLoggedIn,
  userName,
  recentChats = [],
  libraryCount = 0,
  onNavigate,
  onOpenChat,
  onRequestLogin,
  onSignOut,
  /** Merged into the menu trigger button (e.g. Owlpo top bar 40×40 circle). */
  triggerStyle = null,
}) {
  const [open, setOpen] = useState(false);

  const chatItems = useMemo(() => recentChats.slice(0, 5), [recentChats]);

  useEffect(() => {
    setOpen(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open app menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="duleme-press-dim"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          ...(triggerStyle || { width: 32, height: 32 }),
          border: open
            ? "1px solid var(--duleme-button-fill)"
            : (triggerStyle?.border ?? "1px solid var(--duleme-border-strong)"),
          background: open
            ? "var(--duleme-button-fill)"
            : (triggerStyle?.background ?? "var(--duleme-chrome-bg)"),
        }}
      >
        <KebabIcon open={open} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 210,
            background: "transparent",
          }}
        >
          <div
            role="menu"
            aria-label="Main menu"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 118,
              right: 12,
              minWidth: 230,
              maxWidth: 270,
              background: "var(--duleme-surface)",
              border: "1.5px solid var(--duleme-rule)",
              boxShadow: "0 10px 30px var(--duleme-shadow-modal)",
              overflow: "hidden",
            }}
          >
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onRequestLogin();
                }}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid var(--duleme-border)",
                  background: "var(--duleme-button-fill)",
                  color: "var(--duleme-on-button)",
                  textAlign: "center",
                  padding: "12px",
                  cursor: "pointer",
                  fontFamily: F.ui,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNavigate("profile");
                }}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid var(--duleme-border)",
                  background: "var(--duleme-surface-rail)",
                  color: "var(--duleme-text)",
                  textAlign: "left",
                  padding: "10px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--duleme-button-fill)", color: "var(--duleme-on-button)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 700 }}>
                  {(userName || "U")[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 700 }}>{userName}</div>
                  <div style={{ fontFamily: F.body, fontSize: 10, fontStyle: "italic", color: "var(--duleme-text-muted)" }}>Manage account</div>
                </div>
                <div style={{ fontFamily: F.ui, fontSize: 13, color: "var(--duleme-text-muted)" }}>{">"}</div>
              </button>
            )}

            <MenuRow
              icon={<HomeIcon />}
              label="My Owlery"
              onClick={() => {
                setOpen(false);
                onNavigate("home");
              }}
            />

            <MenuRow
              icon={<LibraryIcon />}
              label="Library"
              onClick={() => {
                setOpen(false);
                onNavigate("reading");
              }}
              right={
                isLoggedIn ? (
                  <span style={{ minWidth: 24, height: 20, padding: "0 6px", borderRadius: 10, background: "var(--duleme-button-fill)", color: "var(--duleme-on-button)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontSize: 10, fontWeight: 700 }}>
                    {libraryCount}
                  </span>
                ) : null
              }
            />

            <div
              style={{
                borderBottom: "1px solid var(--duleme-border)",
                padding: "8px 12px 7px",
                fontFamily: F.ui,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--duleme-text-muted)",
                background: "var(--duleme-surface-rail)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ChatIcon />
              Chat History
            </div>

            {chatItems.length === 0 && (
              <div
                style={{ borderBottom: "1px solid var(--duleme-border)", padding: "9px 12px", fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: "var(--duleme-text-muted)" }}
              >
                No recent chats
              </div>
            )}

            {chatItems.map((chat) => (
              <button
                key={chat.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onOpenChat(chat);
                }}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid var(--duleme-border)",
                  background: "transparent",
                  color: "var(--duleme-text)",
                  textAlign: "left",
                  padding: "9px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ flex: 1, minWidth: 0, fontFamily: F.body, fontSize: 11, lineHeight: 1.35 }}>
                  {truncatePreview(chat.title)}
                </span>
                <span style={{ fontFamily: F.ui, fontSize: 9, color: "var(--duleme-text-muted)", letterSpacing: "0.03em" }}>
                  {timeAgoLabel(chat.createdAt)}
                </span>
              </button>
            ))}

            <MenuRow
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => {
                setOpen(false);
                onNavigate("settings");
              }}
            />

            {isLoggedIn && onSignOut ? (
              <MenuRow
                icon={<span aria-hidden style={{ fontSize: 12 }}>↩</span>}
                label="Sign out"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
