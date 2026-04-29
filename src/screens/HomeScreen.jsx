// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Home Screen (Today)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { QUESTIONS, getRankProgress } from "../data/content.js";
import { COLORS, FONTS as F, SPACE, LAYOUT } from "../styles/tokens.js";
import { todayISO } from "../utils/storage.js";
import {
  OrnateRule,
  ScholarAvatar,
  XPBar,
  CoinIcon,
  QuestionCard,
} from "../components/Primitives.jsx";

// ── Compact Challenge Chip (coin + challenge in top stats bar) ─
function ChallengeChip({ onOpenDispatch, userStats, onApplyChallengeReward, coinAmount }) {
  const [done, setDone] = useState(() => userStats.challengeCompletedDate === todayISO());
  const [showPopup, setShowPopup] = useState(false);
  const [reward, setReward] = useState(80);
  const triggerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Modal: scroll lock, Escape, focus management
  useEffect(() => {
    if (!showPopup) return;
    lastFocusedRef.current = document.activeElement;
    document.body.classList.add("duleme-no-scroll");
    const onKey = (e) => { if (e.key === "Escape") setShowPopup(false); };
    window.addEventListener("keydown", onKey);
    // Focus the close button so keyboard users land inside the dialog
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("duleme-no-scroll");
      // Restore focus to whatever opened the modal
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
        {/* Coin row — compact */}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          background: COLORS.ink, padding: "4px 8px",
          border: `1.5px solid ${COLORS.rule}`,
          borderBottom: "none",
        }}>
          <CoinIcon size={10} />
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 11, color: COLORS.gold, letterSpacing: 0.4, lineHeight: 1 }}>
            {coinAmount}
          </div>
        </div>

        {/* Challenge trigger */}
        <button
          type="button"
          onClick={() => !done && setShowPopup(true)}
          aria-label={done ? "Today's challenge complete" : "Open today's challenge"}
          aria-disabled={done}
          aria-haspopup="dialog"
          aria-expanded={showPopup}
          className={`duleme-bare ${done ? "" : "duleme-press-dim"}`}
          style={{
            background: done ? COLORS.paper : COLORS.ink,
            border: `1.5px solid ${done ? COLORS.green : COLORS.rule}`,
            padding: "5px 8px",
            cursor: done ? "default" : "pointer",
            textAlign: "center",
            transition: "opacity 0.15s ease",
          }}
        >
          {done ? (
            <div style={{
              fontFamily: F.ui, fontWeight: 800, fontSize: 11,
              color: COLORS.green, lineHeight: 1.15, letterSpacing: 2,
              textTransform: "uppercase",
            }}>
              READ
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: F.blackletter, fontWeight: 400, fontSize: 14,
                color: COLORS.paper, lineHeight: 1.05, letterSpacing: 0.4,
              }}>
                The Owl
              </div>
              <div style={{
                fontFamily: F.ui, fontSize: 8, fontWeight: 700,
                color: COLORS.gold, letterSpacing: 2, lineHeight: 1.3,
                textTransform: "uppercase",
              }}>
                Today's Challenge
              </div>
            </>
          )}
        </button>
      </div>

      {showPopup && createPortal(
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,18,8,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
            padding: 22,
            animation: "duleme-fade-up 0.2s ease both",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="duleme-challenge-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 340,
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
                position: "absolute",
                top: SPACE[2],
                right: SPACE[2],
                width: LAYOUT.minTouchTarget,
                height: LAYOUT.minTouchTarget,
                border: `1px solid ${COLORS.ink}`,
                background: COLORS.ink,
                color: COLORS.paper,
                fontFamily: F.ui,
                fontSize: 20,
                lineHeight: `${LAYOUT.minTouchTarget - 2}px`,
                textAlign: "center",
                cursor: "pointer",
              }}
              aria-label="Close challenge dialog"
            >
              ×
            </button>

            <div id="duleme-challenge-title" style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: COLORS.red, marginBottom: SPACE[2], paddingRight: LAYOUT.minTouchTarget }}>
              Today's Challenge · Day {userStats.streakDays}
            </div>

            <div style={{ display: "flex", alignItems: "stretch", gap: 12, marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("duleme-prefill-send", {
                    detail: { text: todayQuest.question, mode: todayQuest.mode },
                  }));
                  onApplyChallengeReward?.({ inkGain: 30, coinGain: 30, challengeDate: todayISO() });
                  setReward(30);
                  setDone(true);
                  setShowPopup(false);
                }}
                style={{
                  flex: 1,
                  border: `1px solid ${COLORS.rule}`,
                  background: "rgba(245,239,224,0.45)",
                  padding: "11px 10px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
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
                  }}>
                    {todayQuest.category}
                  </span>
                </div>
                <div style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontFamily: F.chinese,
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: COLORS.ink,
                }}>
                  {todayQuest.question}
                </div>
              </button>

              <div style={{ alignSelf: "center", fontFamily: F.display, fontStyle: "italic", fontSize: 14, color: COLORS.gold, opacity: 0.9, padding: "0 3px" }}>or</div>

              <button
                type="button"
                onClick={() => {
                  onOpenDispatch?.({
                    id: "challenge-book-kinofuku",
                    zh: `Dispatch · The Courage to Be Disliked: the central idea is "separation of tasks" — turn your attention from "how others judge" to "what you can actually choose," and build a feedback loop on the smallest step you can take today.`,
                    en: "Dispatch · The Courage to Be Disliked",
                    tag: "Book Summary",
                    color: "cobalt",
                    votes: "Issued",
                    type: "Challenge",
                  });
                  onApplyChallengeReward?.({ inkGain: 80, coinGain: 30, challengeDate: todayISO() });
                  setReward(80);
                  setDone(true);
                  setShowPopup(false);
                }}
                style={{
                  flex: 1,
                  border: `1px solid ${COLORS.rule}`,
                  background: "rgba(245,239,224,0.45)",
                  padding: "11px 10px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ marginBottom: SPACE[2] }}>
                  <div style={{ fontFamily: F.ui, fontSize: 9, color: COLORS.muted, letterSpacing: 2, marginBottom: SPACE[1], textTransform: "uppercase" }}>Task II</div>
                  <span style={{
                    fontFamily: F.ui, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                    padding: "2px 6px", border: `1px solid ${COLORS.purple}`,
                    color: COLORS.purple, background: "transparent",
                    textTransform: "uppercase",
                  }}>
                    Book Summary
                  </span>
                </div>
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: COLORS.ink,
                }}>
                  <div style={{
                    fontFamily: F.chinese,
                    fontSize: 13,
                    fontWeight: 900,
                    lineHeight: 1.25,
                    marginBottom: 4,
                  }}>
                    The Courage to Be Disliked
                  </div>
                  <div style={{
                    fontFamily: F.ui,
                    fontSize: 10,
                    letterSpacing: 1.2,
                    color: COLORS.muted,
                    marginBottom: SPACE[2],
                  }}>
                    Ichiro Kishimi · Fumitake Koga
                  </div>
                  <div style={{
                    fontFamily: F.body,
                    fontStyle: "italic",
                    fontSize: 10,
                    lineHeight: 1.4,
                    color: COLORS.ink,
                    opacity: 0.88,
                  }}>
                    Why: pulls your attention from “how others judge” back to “the one small step you can take.”
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPopup(false)}
              style={{
                width: "100%",
                background: COLORS.ink,
                color: COLORS.paper,
                border: "none",
                padding: `${SPACE[3]}px ${SPACE[4]}px`,
                minHeight: LAYOUT.minTouchTarget,
                fontFamily: F.ui,
                fontSize: 10,
                letterSpacing: 2.5,
                cursor: "pointer",
              }}
            >
              Choose One
            </button>
          </div>
        </div>,
        document.querySelector(".duleme-root") || document.body
      )}
    </>
  );
}

// ── Main Home Screen ──────────────────────────────────────────
export default function HomeScreen({ onOpenDispatch, onSend, userStats, onApplyChallengeReward }) {
  const progress = getRankProgress(userStats.xpCurrent);

  return (
    <div style={{
      height: "100%",
      boxSizing: "border-box",
      padding: "10px 14px 8px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>

      {/* ── Top: User stats + Challenge chip ── */}
      <div style={{ animation: "duleme-fade-up 0.4s ease both" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
        }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              border: `2px solid ${COLORS.ink}`,
              overflow: "hidden", background: COLORS.paperDark,
            }}>
              <ScholarAvatar size={46} />
            </div>
            <div style={{
              position: "absolute", bottom: -2, right: -2,
              width: 16, height: 16, background: COLORS.gold,
              borderRadius: "50%", border: `2px solid ${COLORS.paper}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8,
            }}>🔮</div>
          </div>
          <XPBar
            current={userStats.xpCurrent}
            total={progress.xpTotal}
            rank={progress.currentRank}
          />
          <ChallengeChip
            onOpenDispatch={onOpenDispatch}
            userStats={userStats}
            onApplyChallengeReward={onApplyChallengeReward}
            coinAmount={userStats.inkBalance}
          />
        </div>
        <OrnateRule my={0} />
      </div>

      {/* ── Middle: Question cards ── */}
      <div>
        <div style={{ marginBottom: SPACE[2] }}>
          <div style={{
            display: "inline-block",
            fontFamily: F.ui, fontSize: 10, fontWeight: 700,
            letterSpacing: 3, textTransform: "uppercase",
            background: COLORS.ink, color: COLORS.paper, padding: `${SPACE[1]}px ${SPACE[2]}px`,
          }}>
            More to Explore
          </div>
        </div>
        <div style={{
          display: "flex", gap: 8, overflowX: "auto",
          padding: "0 max(0px, calc((100% - 320px) / 2)) 2px",
          scrollSnapType: "x proximity",
        }}>
          {QUESTIONS.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} onClick={(card) => onSend(card.zh, "normal")} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: SPACE[3] }}>
          <div style={{
            fontFamily: F.body, fontStyle: "italic", fontSize: 11,
            color: COLORS.muted, opacity: 0.48, lineHeight: 1.6,
          }}>
            “Somewhere, an owl is reading the page you wouldn't dare.”<br />
            — The Owl
          </div>
        </div>
      </div>

      {/* ── Bottom: just the ornate rule (challenge moved to top) ── */}
      <OrnateRule my={0} />

    </div>
  );
}
