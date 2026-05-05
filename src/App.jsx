// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Main App Root
// "Read Dangerously" · The Owlery Press · V2
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from "react";
import { GLOBAL_CSS, FONTS as F, LAYOUT } from "./styles/tokens.js";
import { AppThemeContext } from "./context/AppThemeContext.jsx";
import TopBar from "./components/TopBar.jsx";
import OracleDispatch from "./components/OracleDispatch.jsx";
import { InkToast } from "./components/Primitives.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ReadingScreen from "./screens/ReadingScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import SplashScreen from "./screens/SplashScreen.jsx";
import RewardsScreen from "./screens/RewardsScreen.jsx";
import { READING_ARTICLES, USER_STATS } from "./data/content.js";
import { loadLibrarySaves } from "./utils/librarySaves.js";
import { readSoftwareCreatedAt } from "./utils/softwareCreatedAt.js";
import { loadUserStats, saveUserStats } from "./utils/storage.js";
import { askOwleryStream, FALLBACK } from "./services/gemini.js";
import {
  articleInstanceKey,
  loadTagSeenArticles,
  persistTagSeenArticles,
  tagKeyForDispatch,
} from "./utils/dispatchMeta.js";

if (typeof document !== "undefined" && !document.querySelector("[data-duleme-v2]")) {
  const style = document.createElement("style");
  style.setAttribute("data-duleme-v2", "");
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
}

const STAT_DEFAULTS = {
  ...USER_STATS,
  softwareCreatedAt: readSoftwareCreatedAt(
    USER_STATS.softwareCreatedAt ?? USER_STATS.accountCreatedAt,
  ),
};

const PREVIEW_ENTERED_KEY = "duleme-entered-preview";
const THEME_KEY = "duleme-theme";

function readSkipSplash() {
  try {
    return sessionStorage.getItem(PREVIEW_ENTERED_KEY) === "1";
  } catch {
    return false;
  }
}

function LoginModal({ open, onClose, onSignIn }) {
  const [name, setName] = useState("Maya Chen");
  const [email, setEmail] = useState("maya@example.com");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!open) setPassword("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 420,
        background: "var(--duleme-overlay)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "max(20px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 330,
          background: "var(--duleme-surface)",
          border: "1.5px solid var(--duleme-rule)",
          boxShadow: "0 12px 28px var(--duleme-shadow-modal)",
          padding: 16,
        }}
      >
        <div style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--duleme-text)", marginBottom: 10 }}>
          Login
        </div>
        <label style={{ display: "block", fontFamily: F.ui, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--duleme-text-muted)", marginBottom: 4 }}>
          Display name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", marginBottom: 9, border: "1px solid var(--duleme-border-medium)", minHeight: LAYOUT.minTouchTarget, padding: "8px 10px", fontFamily: F.ui, background: "var(--duleme-surface-input)", color: "var(--duleme-text)" }}
        />
        <label style={{ display: "block", fontFamily: F.ui, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--duleme-text-muted)", marginBottom: 4 }}>
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          style={{ width: "100%", boxSizing: "border-box", marginBottom: 9, border: "1px solid var(--duleme-border-medium)", minHeight: LAYOUT.minTouchTarget, padding: "8px 10px", fontFamily: F.ui, background: "var(--duleme-surface-input)", color: "var(--duleme-text)" }}
        />
        <label style={{ display: "block", fontFamily: F.ui, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--duleme-text-muted)", marginBottom: 4 }}>
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          style={{ width: "100%", boxSizing: "border-box", marginBottom: 12, border: "1px solid var(--duleme-border-medium)", minHeight: LAYOUT.minTouchTarget, padding: "8px 10px", fontFamily: F.ui, background: "var(--duleme-surface-input)", color: "var(--duleme-text)" }}
        />
        <button
          type="button"
          onClick={() => onSignIn({ name, email })}
          style={{
            width: "100%",
            minHeight: LAYOUT.minTouchTarget,
            border: "none",
            background: "var(--duleme-button-fill)",
            color: "var(--duleme-on-button)",
            cursor: "pointer",
            fontFamily: F.ui,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function DulemeApp() {
  const [userStats, setUserStats] = useState(() => loadUserStats(STAT_DEFAULTS));
  const [page, setPage] = useState(() => (readSkipSplash() ? "home" : "splash"));
  const [dispatch, setDispatch] = useState(null);
  const [tagSeenArticles, setTagSeenArticles] = useState(() => loadTagSeenArticles());
  const [recentChats, setRecentChats] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [toast, setToast] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const forceHome = () => {
      try {
        sessionStorage.setItem(PREVIEW_ENTERED_KEY, "1");
      } catch { /* private mode */ }
      setPage("home");
      setDispatch(null);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      sessionStorage.removeItem("duleme-force-home");
    };

    if (sessionStorage.getItem("duleme-force-home") === "1") {
      forceHome();
    }

    window.addEventListener("duleme-force-home", forceHome);
    return () => window.removeEventListener("duleme-force-home", forceHome);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // private mode or unavailable storage
    }
    const meta = document.querySelector("meta[name=\"theme-color\"]");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#061522" : "#F4EAD3");
  }, [theme]);

  const updateStats = useCallback((updater) => {
    setUserStats((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveUserStats(next);
      return next;
    });
  }, []);

  const handleOpenDispatch = useCallback((q) => {
    setTagSeenArticles((prev) => {
      const tag = tagKeyForDispatch(q);
      const instanceKey = articleInstanceKey(q);
      const list = prev[tag] ?? [];
      if (list.includes(instanceKey)) return prev;
      const next = { ...prev, [tag]: [...list, instanceKey] };
      persistTagSeenArticles(next);
      return next;
    });
    setRecentChats((prev) => {
      const title = q.en || q.zh || q.response?.summary || "Untitled chat";
      const nextItem = {
        ...q,
        id: q.id || `${Date.now()}-${Math.random()}`,
        title,
        createdAt: new Date().toISOString(),
      };
      const deduped = prev.filter((item) => item.title !== nextItem.title);
      return [nextItem, ...deduped].slice(0, 5);
    });
    setDispatch(q);
  }, []);

  const handleCloseDispatch = useCallback(() => {
    const reward = dispatch?.response?.inkReward ?? 40;
    setDispatch(null);
    setToast({ amount: reward, message: "Dispatch read. Ink reward delivered." });
    updateStats((prev) => ({
      ...prev,
      xpCurrent: prev.xpCurrent + reward,
      questionsAsked: prev.questionsAsked + 1,
    }));
    setTimeout(() => setToast(null), 3200);
  }, [dispatch, updateStats]);

  const handleSend = useCallback(async (text, mode) => {
    const q = {
      zh: text,
      en: text,
      tag: mode === "air" ? "\u2726 Quick Air" : mode === "max" ? "\u25C8 Deep Dive" : "\uD83D\uDD2E Personal Dispatch",
      color: mode === "air" ? "teal" : mode === "max" ? "purple" : "gold",
      votes: "New",
      type: "Your Question",
      streaming: true,
      response: null,
      error: null,
    };

    handleOpenDispatch(q);

    try {
      await askOwleryStream(text, mode, (partial) => {
        setDispatch((prev) => prev ? { ...prev, response: partial } : null);
      });
      setDispatch((prev) => prev ? { ...prev, streaming: false } : null);
    } catch (err) {
      setDispatch((prev) => prev ? {
        ...prev,
        streaming: false,
        error: err.message,
        response: FALLBACK,
      } : null);
    }
  }, [handleOpenDispatch]);

  const handleRetry = useCallback(() => {
    if (!dispatch) return;
    const text = dispatch.zh;
    const mode = dispatch.tag?.includes("Quick Air") ? "air" : dispatch.tag?.includes("Deep Dive") ? "max" : "normal";
    setDispatch(null);
    setTimeout(() => handleSend(text, mode), 100);
  }, [dispatch, handleSend]);

  const handleApplyChallengeReward = useCallback(({ inkGain = 0, coinGain = 0, challengeDate }) => {
    updateStats((prev) => ({
      ...prev,
      xpCurrent: prev.xpCurrent + inkGain,
      inkBalance: prev.inkBalance + coinGain,
      ...(challengeDate ? { challengeCompletedDate: challengeDate } : {}),
    }));
  }, [updateStats]);

  const handleNavigate = useCallback((p) => {
    setPage(p);
    setDispatch(null);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const handleOpenChatFromHistory = useCallback((chat) => {
    setPage("home");
    setDispatch({ ...chat });
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const [libraryCount, setLibraryCount] = useState(
    () => READING_ARTICLES.length + loadLibrarySaves().length,
  );

  useEffect(() => {
    const sync = () => setLibraryCount(READING_ARTICLES.length + loadLibrarySaves().length);
    window.addEventListener("duleme-library-updated", sync);
    return () => window.removeEventListener("duleme-library-updated", sync);
  }, []);

  return (
    <AppThemeContext.Provider value={{ theme }}>
    <div className={`duleme-root ${theme === "dark" ? "duleme-theme-dark" : ""}`}>
      <TopBar
        userStats={userStats}
        isLoggedIn={!!authUser}
        userName={authUser?.name || "Maya Chen"}
        recentChats={recentChats}
        libraryCount={libraryCount}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChatFromHistory}
        onRequestLogin={() => setLoginModalOpen(true)}
      />

      <div
        ref={scrollRef}
        className={`duleme-scroll-surface ${theme === "dark" ? "duleme-scroll-dark" : "duleme-scroll-light"}`}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: page === "home" ? "hidden" : "auto",
          overflowX: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {theme === "light" && page !== "home" ? <div className="duleme-airmail-accent" aria-hidden="true" /> : null}
        {theme === "dark" ? <div className="duleme-starfield" aria-hidden="true" /> : null}
        <div className="duleme-scroll-vignette" aria-hidden="true" />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            flex: page === "home" ? "1 1 0" : "0 0 auto",
            minHeight: page === "home" ? 0 : "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {page === "splash" && (
            <SplashScreen
              onEnter={() => {
                try {
                  sessionStorage.setItem(PREVIEW_ENTERED_KEY, "1");
                } catch { /* private mode */ }
                setPage("home");
              }}
            />
          )}
          {page === "home" && (
            <HomeScreen
              onSend={handleSend}
            />
          )}
          {page === "reading" && <ReadingScreen />}
          {page === "rewards" && <RewardsScreen userStats={userStats} />}
          {page === "profile" && (
            <ProfileScreen
              userStats={userStats}
              onOpenDispatch={handleOpenDispatch}
              onApplyChallengeReward={handleApplyChallengeReward}
            />
          )}
          {page === "settings" && <SettingsScreen />}
        </div>

        {dispatch && (
          <OracleDispatch
            question={dispatch}
            onClose={handleCloseDispatch}
            onRetry={handleRetry}
            issueKan={userStats.loginDays ?? userStats.streakDays}
            issueJuan={tagSeenArticles[tagKeyForDispatch(dispatch)]?.length ?? 0}
          />
        )}

        <InkToast
          amount={toast?.amount || 0}
          message={toast?.message || ""}
          visible={!!toast}
        />

        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSignIn={(user) => {
            setAuthUser({
              name: user?.name?.trim() || "Maya Chen",
              email: user?.email?.trim() || "maya@example.com",
            });
            setLoginModalOpen(false);
          }}
        />
      </div>

    </div>
    </AppThemeContext.Provider>
  );
}
