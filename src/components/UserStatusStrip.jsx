// ═══════════════════════════════════════════════════════════════
// Profile · User status (moved from Home)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getRankProgress } from "../data/content.js";
import { COLORS, FONTS as F, SPACE, LAYOUT } from "../styles/tokens.js";
import { todayISO } from "../utils/storage.js";

const HTML = {
  creamDark: "#EDE6D3",
  ink: "#1C1A16",
  inkLight: "#7A7468",
  border: "#2A2820",
  gold: "#C8A84B",
  redDot: "#D64C3A",
};
const F_MONO = "'IBM Plex Mono', ui-monospace, monospace";

function OwlAvatar() {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      border: `2px solid ${HTML.border}`,
      background: HTML.ink,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
    }}
    >
      <svg viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24 }}>
        <circle cx="9" cy="11" r="2.5" fill="#F4EFE2" />
        <circle cx="15" cy="11" r="2.5" fill="#F4EFE2" />
        <circle cx="9" cy="11" r="1" fill="#1C1A16" />
        <circle cx="15" cy="11" r="1" fill="#1C1A16" />
        <path d="M10.5 13.5 Q12 15 13.5 13.5" stroke="#F4EFE2" strokeWidth="1" fill="none" strokeLinecap="round" />
        <polygon points="12,12.5 11.3,13.5 12.7,13.5" fill="#C8A84B" />
        <path d="M6 8 Q7 5 9 7" stroke="#F4EFE2" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M18 8 Q17 5 15 7" stroke="#F4EFE2" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M5 12 Q4 14 6 15 Q8 16 8 14" stroke="#F4EFE2" strokeWidth="1" fill="none" />
        <path d="M19 12 Q20 14 18 15 Q16 16 16 14" stroke="#F4EFE2" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

function ChallengeChip({ onOpenDispatch, userStats, onApplyChallengeReward }) {
  const [done, setDone] = useState(() => userStats.challengeCompletedDate === todayISO());
  const [showPopup, setShowPopup] = useState(false);
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!showPopup) return;
    lastFocusedRef.current = document.activeElement;
    document.body.classList.add("duleme-no-scroll");
    const onKey = (e) => { if (e.key === "Escape") setShowPopup(false); };
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("duleme-no-scroll");
      const el = lastFocusedRef.current;
      if (el && typeof el.focus === "function") el.focus();
    };
  }, [showPopup]);

  const todayQuest = userStats.streakDays % 2 === 0
    ? {
        category: "Find a Book",
        mode: "air",
        question: "Which book do you most need right now — and what worry should it ease?",
      }
    : {
        category: "Solve a Problem",
        mode: "normal",
        question: "What is the one real problem you most want to move forward this week?",
      };

  return (
    <>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 0 }}>
        <button
          type="button"
          onClick={() => !done && setShowPopup(true)}
          aria-label={done ? "Today's challenge complete" : "Open today's challenge"}
          aria-disabled={done}
          aria-haspopup="dialog"
          aria-expanded={showPopup}
          className={`duleme-bare ${done ? "" : "duleme-press-dim"}`}
          style={{
            width: 32,
            height: 32,
            background: HTML.ink,
            border: "none",
            borderRadius: 6,
            cursor: done ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.15s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="12" height="9" rx="1" stroke="#F4EFE2" strokeWidth="1.5" />
            <path d="M5 6h6M5 8.5h4" stroke="#F4EFE2" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {showPopup && createPortal(
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(26,18,8,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 300, padding: 22,
            animation: "duleme-fade-up 0.2s ease both",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="duleme-challenge-title-profile"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 340,
              background: COLORS.paperDark,
              border: `1.5px solid ${COLORS.rule}`,
              boxShadow: "0 10px 28px rgba(26,18,8,0.3)",
              padding: "16px 16px 14px",
              position: "relative",
            }}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute", top: SPACE[2], right: SPACE[2],
                width: LAYOUT.minTouchTarget, height: LAYOUT.minTouchTarget,
                border: `1px solid ${COLORS.ink}`,
                background: COLORS.ink, color: COLORS.paper,
                fontFamily: F.ui, fontSize: 20,
                lineHeight: `${LAYOUT.minTouchTarget - 2}px`,
                textAlign: "center", cursor: "pointer",
              }}
              aria-label="Close challenge dialog"
            >
              ×
            </button>

            <div
              id="duleme-challenge-title-profile"
              style={{
                fontFamily: F.ui, fontSize: 10, fontWeight: 700,
                letterSpacing: 3, textTransform: "uppercase",
                color: COLORS.red, marginBottom: SPACE[2],
                paddingRight: LAYOUT.minTouchTarget,
              }}
            >
              Today's Challenge · Day {userStats.streakDays}
            </div>

            <div style={{ display: "flex", alignItems: "stretch", gap: 12, marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new Event("duleme-force-home"));
                  window.setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("duleme-prefill-send", {
                      detail: { text: todayQuest.question, mode: todayQuest.mode },
                    }));
                  }, 80);
                  onApplyChallengeReward?.({ inkGain: 30, coinGain: 30, challengeDate: todayISO() });
                  setDone(true);
                  setShowPopup(false);
                }}
                style={{
                  flex: 1, border: `1px solid ${COLORS.rule}`,
                  background: "rgba(245,239,224,0.45)",
                  padding: "11px 10px", textAlign: "left", cursor: "pointer",
                  display: "flex", flexDirection: "column",
                }}
              >
                <div style={{ marginBottom: SPACE[2] }}>
                  <div style={{ fontFamily: F.ui, fontSize: 9, color: COLORS.muted, letterSpacing: 2, marginBottom: SPACE[1], textTransform: "uppercase" }}>Task I</div>
                  <span style={{
                    fontFamily: F.ui, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                    padding: "2px 6px", textTransform: "uppercase",
                    border: `1px solid ${todayQuest.category === "Solve a Problem" ? COLORS.ink : COLORS.teal}`,
                    background: todayQuest.category === "Solve a Problem" ? COLORS.ink : "transparent",
                    color: todayQuest.category === "Solve a Problem" ? COLORS.paper : COLORS.teal,
                  }}
                  >
                    {todayQuest.category}
                  </span>
                </div>
                <div style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                  textAlign: "center", fontFamily: F.display,
                  fontSize: 12, fontWeight: 700, lineHeight: 1.35, color: COLORS.ink,
                }}
                >
                  {todayQuest.question}
                </div>
              </button>

              <div style={{
                alignSelf: "center", fontFamily: F.display, fontStyle: "italic",
                fontSize: 14, color: COLORS.gold, opacity: 0.9, padding: "0 3px",
              }}
              >
                or
              </div>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new Event("duleme-force-home"));
                  window.setTimeout(() => {
                    onOpenDispatch?.({
                      id: "challenge-book-kinofuku",
                      zh: `Dispatch · The Courage to Be Disliked: the central idea is "separation of tasks" — turn your attention from "how others judge" to "what you can actually choose," and build a feedback loop on the smallest step you can take today.`,
                      en: "Dispatch · The Courage to Be Disliked",
                      tag: "Book Summary",
                      color: "cobalt",
                      votes: "Issued",
                      type: "Challenge",
                    });
                  }, 80);
                  onApplyChallengeReward?.({ inkGain: 80, coinGain: 30, challengeDate: todayISO() });
                  setDone(true);
                  setShowPopup(false);
                }}
                style={{
                  flex: 1, border: `1px solid ${COLORS.rule}`,
                  background: "rgba(245,239,224,0.45)",
                  padding: "11px 10px", textAlign: "left", cursor: "pointer",
                  display: "flex", flexDirection: "column",
                }}
              >
                <div style={{ marginBottom: SPACE[2] }}>
                  <div style={{ fontFamily: F.ui, fontSize: 9, color: COLORS.muted, letterSpacing: 2, marginBottom: SPACE[1], textTransform: "uppercase" }}>Task II</div>
                  <span style={{
                    fontFamily: F.ui, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                    padding: "2px 6px", border: `1px solid ${COLORS.purple}`,
                    color: COLORS.purple, background: "transparent", textTransform: "uppercase",
                  }}
                  >
                    Book Summary
                  </span>
                </div>
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  textAlign: "center", color: COLORS.ink,
                }}
                >
                  <div style={{ fontFamily: F.display, fontSize: 13, fontWeight: 900, lineHeight: 1.25, marginBottom: 4 }}>
                    The Courage to Be Disliked
                  </div>
                  <div style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: 1.2, color: COLORS.muted, marginBottom: SPACE[2] }}>
                    Ichiro Kishimi · Fumitake Koga
                  </div>
                  <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 10, lineHeight: 1.4, color: COLORS.ink, opacity: 0.88 }}>
                    Why: pulls your attention from "how others judge" back to "the one small step you can take."
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              style={{
                width: "100%", background: COLORS.ink, color: COLORS.paper,
                border: "none", padding: `${SPACE[3]}px ${SPACE[4]}px`,
                minHeight: LAYOUT.minTouchTarget, fontFamily: F.ui,
                fontSize: 10, letterSpacing: 2.5, cursor: "pointer",
              }}
            >
              Choose One
            </button>
          </div>
        </div>,
        document.querySelector(".duleme-root") || document.body,
      )}
    </>
  );
}

export default function UserStatusStrip({ userStats, onOpenDispatch, onApplyChallengeReward }) {
  const progress = getRankProgress(userStats.xpCurrent ?? 0);
  const pct = progress.pctToNext ?? 0;

  return (
    <div style={{
      padding: "10px 16px",
      borderBottom: `1.5px solid ${HTML.border}`,
      marginBottom: 14,
      animation: "duleme-fade-up 0.35s ease both",
    }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <OwlAvatar />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 5,
          }}
          >
            <span style={{
              fontFamily: F_MONO, fontSize: 11, fontWeight: 600,
              letterSpacing: "0.04em", color: HTML.ink,
              textTransform: "uppercase",
            }}
            >
              {progress.currentRank}
            </span>
            <span style={{ fontFamily: F_MONO, fontSize: 10, color: HTML.inkLight, letterSpacing: "0.02em" }}>
              {userStats.xpCurrent ?? 0} / {progress.xpTotal} XP
            </span>
          </div>
          <div style={{
            height: 7, background: HTML.creamDark,
            borderRadius: 4, border: "1px solid rgba(0,0,0,0.15)", overflow: "hidden",
          }}
          >
            <div style={{
              height: "100%", width: `${pct}%`,
              background: HTML.gold, borderRadius: 4,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        <ChallengeChip
          onOpenDispatch={onOpenDispatch}
          userStats={userStats}
          onApplyChallengeReward={onApplyChallengeReward}
        />
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        paddingLeft: 50,
      }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontFamily: F_MONO, fontSize: 12, fontWeight: 600, color: HTML.ink,
        }}
        >
          <div style={{
            width: 14, height: 14, borderRadius: "50%", background: HTML.gold,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="3" fill={HTML.ink} />
            </svg>
          </div>
          {(userStats.inkBalance ?? 0).toLocaleString()}
        </div>
        <div style={{ width: 1.5, height: 14, background: HTML.border, opacity: 0.3 }} />
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontFamily: F_MONO, fontSize: 12, fontWeight: 600, color: HTML.ink,
        }}
        >
          <div style={{
            width: 14, height: 14, borderRadius: "50%", background: HTML.redDot,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <path d="M4 1 L5.5 4 H7 L5 5.5 L5.8 8 L4 6.5 L2.2 8 L3 5.5 L1 4 H2.5Z" fill={HTML.ink} />
            </svg>
          </div>
          {userStats.questionsAsked ?? 0}
        </div>
        <div style={{ width: 1.5, height: 14, background: HTML.border, opacity: 0.3 }} />
        <span style={{ fontFamily: F_MONO, fontSize: 12, fontWeight: 600, color: HTML.ink }}>
          {userStats.streakDays ?? 0}
        </span>
      </div>
    </div>
  );
}
