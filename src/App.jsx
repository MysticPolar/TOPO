// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Main App Root
// "Read Dangerously" · The Owlery Press · V2
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from "react";
import { GLOBAL_CSS, COLORS, TEXTURES } from "./styles/tokens.js";
import Masthead from "./components/Masthead.jsx";
import NavBar from "./components/NavBar.jsx";
import InputBar from "./components/InputBar.jsx";
import OracleDispatch from "./components/OracleDispatch.jsx";
import { InkToast } from "./components/Primitives.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ReadingScreen from "./screens/ReadingScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SplashScreen from "./screens/SplashScreen.jsx";
import { USER_STATS } from "./data/content.js";
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

export default function DulemeApp() {
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
      sessionStorage.removeItem("duleme-force-home");
    };

    if (sessionStorage.getItem("duleme-force-home") === "1") {
      forceHome();
    }

    window.addEventListener("duleme-force-home", forceHome);
    return () => window.removeEventListener("duleme-force-home", forceHome);
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

  return (
    <div className="duleme-root">
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

      {page === "home" && !dispatch && (
        <div style={{ flexShrink: 0, zIndex: 40 }}>
          <InputBar onSend={handleSend} />
        </div>
      )}

      {page !== "splash" && <NavBar activePage={page} onNavigate={handleNavigate} />}
    </div>
  );
}
