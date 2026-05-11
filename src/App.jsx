// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Main App Root
// "Read Dangerously" · The Owlery Press · V2
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from "react";
import { GLOBAL_CSS } from "./styles/tokens.js";
import { AppThemeContext } from "./context/AppThemeContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import TopBar from "./components/TopBar.jsx";
import OracleDispatch from "./components/OracleDispatch.jsx";
import { InkToast } from "./components/Primitives.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ReadingScreen from "./screens/ReadingScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import SplashScreen from "./screens/SplashScreen.jsx";
import RewardsScreen from "./screens/RewardsScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
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

export default function DulemeApp() {
  const { user, profile, signOut } = useAuth();
  const [userStats, setUserStats] = useState(() => loadUserStats(STAT_DEFAULTS));
  const [page, setPage] = useState(() => (readSkipSplash() ? "home" : "splash"));
  const [dispatch, setDispatch] = useState(null);
  const [tagSeenArticles, setTagSeenArticles] = useState(() => loadTagSeenArticles());
  const [recentChats, setRecentChats] = useState([]);
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

  const isLoggedIn = !!user;
  const userName = profile?.display_name
    || user?.user_metadata?.display_name
    || (user?.email ? user.email.split("@")[0] : "Reader");

  return (
    <AppThemeContext.Provider value={{ theme }}>
    <div className={`duleme-root ${theme === "dark" ? "duleme-theme-dark" : ""}`}>
      <TopBar
        userStats={userStats}
        isLoggedIn={isLoggedIn}
        userName={userName}
        recentChats={recentChats}
        libraryCount={libraryCount}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChatFromHistory}
        onRequestLogin={() => setPage("auth")}
        onSignOut={signOut}
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
          {page === "auth" && (
            <LoginScreen onAuthSuccess={() => handleNavigate("home")} />
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
      </div>

    </div>
    </AppThemeContext.Provider>
  );
}
