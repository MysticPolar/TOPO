// ═══════════════════════════════════════════════════════════════
// The Owl's Press · Main App Root

import { useState, useRef, useCallback, useEffect } from "react";
import { GLOBAL_CSS, COLORS, TEXTURES } from "./styles/tokens.js";
import Masthead from "./components/Masthead.jsx";
import NavBar from "./components/NavBar.jsx";
import InputBar from "./components/InputBar.jsx";
import PressDispatch from "./components/PressDispatch.jsx";
import { InkToast } from "./components/Primitives.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ReadingScreen from "./screens/ReadingScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SplashScreen from "./screens/SplashScreen.jsx";
import { USER_STATS } from "./data/content.js";
import { readSoftwareCreatedAt } from "./utils/softwareCreatedAt.js";
import { loadUserStats, saveUserStats } from "./utils/storage.js";
import { askPressStream, FALLBACK } from "./services/gemini.js";
import {
  articleInstanceKey,
  loadTagSeenArticles,
  persistTagSeenArticles,
  tagKeyForDispatch,
} from "./utils/dispatchMeta.js";

if (typeof document !== "undefined" && !document.querySelector("[data-owls-press]")) {
  const style = document.createElement("style");
  style.setAttribute("data-owls-press", "");
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
}

const STAT_DEFAULTS = {
  ...USER_STATS,
  softwareCreatedAt: readSoftwareCreatedAt(
    USER_STATS.softwareCreatedAt ?? USER_STATS.accountCreatedAt,
  ),
};

export default function OwlsPressApp() {
  const [userStats, setUserStats] = useState(() => loadUserStats(STAT_DEFAULTS));
  const [page, setPage] = useState("splash");
  const [dispatch, setDispatch] = useState(null);
  const [tagSeenArticles, setTagSeenArticles] = useState(() => loadTagSeenArticles());
  const [toast, setToast] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const forceHome = () => {
      setPage("home");
      setDispatch(null);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      sessionStorage.removeItem("owls-press-force-home");
    };

    if (sessionStorage.getItem("owls-press-force-home") === "1") {
      forceHome();
    }

    window.addEventListener("owls-press-force-home", forceHome);
    return () => window.removeEventListener("owls-press-force-home", forceHome);
  }, []);

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
    setDispatch(q);
  }, []);

  const handleCloseDispatch = useCallback(() => {
    const reward = dispatch?.response?.inkReward ?? 40;
    setDispatch(null);
    setToast({ amount: reward, message: "Dispatch read. Ink has been added to your account." });
    updateStats((prev) => ({
      ...prev,
      xpCurrent: prev.xpCurrent + reward,
      questionsAsked: prev.questionsAsked + 1,
    }));
    setTimeout(() => setToast(null), 3200);
  }, [dispatch, updateStats]);

  const handleSend = useCallback(async (text, mode) => {
    const q = {
      text,
      tag: mode === "air" ? "Book Scout" : mode === "max" ? "Deep Research" : "Reader's Question",
      color: mode === "air" ? "teal" : mode === "max" ? "purple" : "gold",
      votes: "New",
      type: "Your Question",
      streaming: true,
      response: null,
      error: null,
    };

    handleOpenDispatch(q);

    try {
      await askPressStream(text, mode, (partial) => {
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
    const text = dispatch.text;
    const mode = dispatch.tag?.includes("Book Scout") ? "air" : dispatch.tag?.includes("Deep Research") ? "max" : "normal";
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

  return (
    <div
      className="owls-press-root"
      style={{
        width: "100%",
        maxWidth: 390,
        margin: "0 auto",
        height: "100vh",
        maxHeight: 844,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        border: typeof window !== "undefined" && window.innerWidth > 400
          ? "1px solid rgba(42,31,14,0.15)" : "none",
        boxShadow: typeof window !== "undefined" && window.innerWidth > 400
          ? "0 0 60px rgba(42,31,14,0.2)" : "none",
      }}
    >
      {page !== "splash" && !(page === "home" && dispatch) && (
        <Masthead
          loginDays={userStats.loginDays ?? userStats.streakDays}
          foundingDate={userStats.softwareCreatedAt ?? userStats.accountCreatedAt}
        />
      )}

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: page === "home" ? "hidden" : "auto",
          position: "relative",
          ...TEXTURES.paper,
        }}
      >
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(42,31,14,0.16) 100%)",
          zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, height: page === "home" || page === "splash" ? "100%" : "auto" }}>
          {page === "splash" && (
            <SplashScreen onEnter={() => setPage("home")} />
          )}
          {page === "home" && (
            <HomeScreen
              onOpenDispatch={handleOpenDispatch}
              onSend={handleSend}
              userStats={userStats}
              onApplyChallengeReward={handleApplyChallengeReward}
            />
          )}
          {page === "reading" && <ReadingScreen />}
          {page === "profile" && <ProfileScreen userStats={userStats} />}
        </div>

        {dispatch && (
          <PressDispatch
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

      {page === "home" && !dispatch && (
        <div style={{ flexShrink: 0, zIndex: 40 }}>
          <InputBar onSend={handleSend} />
        </div>
      )}

      {page !== "splash" && <NavBar activePage={page} onNavigate={handleNavigate} />}
    </div>
  );
}
