// ═══════════════════════════════════════════════════════════════
// The Owl's Press · Home Screen
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
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
function ChallengeChip({ onOpenDispatch, userStats, onApplyChallengeReward }) {
  const [done, setDone] = useState(() => userStats.challengeCompletedDate === todayISO());
  const [showPopup, setShowPopup] = useState(false);
  const [reward, setReward] = useState(80);
  const todayQuest = userStats.streakDays % 2 === 0
    ? {
        category: "Find Books",
        mode: "air",
        question: "What kind of book would help you most right now?",
      }
    : {
        category: "Solve",
        mode: "normal",
        question: "What real-life problem do you most want to untangle next?",
      };

  return (
    <>
      <button
        onClick={() => !done && setShowPopup(true)}
        style={{
          alignSelf: "flex-end",
          background: done ? "rgba(245,239,224,0.8)" : COLORS.ink,
          border: `2.5px solid ${done ? COLORS.green : COLORS.rule}`,
          padding: "15px 18px",
          cursor: done ? "default" : "pointer",
          textAlign: "center",
          transition: "all 0.25s ease",
          minHeight: 64,
          minWidth: 232,
        }}
        onMouseEnter={e => { if (!done) e.currentTarget.style.opacity = "0.88"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      >
        <div style={{
          fontFamily: F.ui,
          fontWeight: 700,
          fontSize: 18,
          color: done ? COLORS.green : COLORS.paper,
          letterSpacing: 4,
          lineHeight: 1,
        }}>
          DAY {userStats.streakDays} | {done ? "READ ✓" : "TAKE ONE"}
        </div>
      </button>

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
            animation: "owls-press-fade-up 0.2s ease both",
          }}
        >
          <div
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
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: SPACE[2],
                right: SPACE[2],
                width: LAYOUT.minTouchTarget,
                height: LAYOUT.minTouchTarget,
                border: `1px solid ${COLORS.rule}`,
                background: "rgba(245,239,224,0.75)",
                color: COLORS.muted,
                fontFamily: F.ui,
                fontSize: 16,
                lineHeight: `${LAYOUT.minTouchTarget}px`,
                textAlign: "center",
                cursor: "pointer",
              }}
              aria-label="Close daily challenge"
            >
              ×
            </button>

            <div style={{ fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: COLORS.red, marginBottom: SPACE[2] }}>
              Daily Challenge · Day {userStats.streakDays}
            </div>

            <div style={{ display: "flex", alignItems: "stretch", gap: 12, marginBottom: 14 }}>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("owls-press-prefill-send", {
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
                  <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 2, marginBottom: SPACE[1] }}>Task One</div>
                  <span style={{
                    fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                    padding: "2px 6px",
                    border: `1px solid ${todayQuest.category === "Solve" ? COLORS.ink : COLORS.teal}`,
                    background: todayQuest.category === "Solve" ? COLORS.ink : "transparent",
                    color: todayQuest.category === "Solve" ? COLORS.paper : COLORS.teal,
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
                  fontFamily: F.editorial,
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: COLORS.ink,
                }}>
                  {todayQuest.question}
                </div>
              </button>

              <div style={{ alignSelf: "center", fontFamily: F.display, fontSize: 17, color: COLORS.gold, opacity: 0.9, padding: "0 3px" }}>or</div>

              <button
                onClick={() => {
                  onOpenDispatch?.({
                    id: "challenge-book-atomic-habits",
                    text: "Atomic Habits briefing: build a system around cues, tiny starts, and repeatable proof instead of relying on motivation.",
                    tag: "Book Briefing",
                    color: "cobalt",
                    votes: "Challenge",
                    type: "Daily Challenge",
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
                  <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 2, marginBottom: SPACE[1] }}>Task Two</div>
                  <span style={{
                    fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                    padding: "2px 6px", border: `1px solid ${COLORS.purple}`,
                    color: COLORS.purple, background: "transparent",
                  }}>
                    Open Brief
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
                    fontFamily: F.editorial,
                    fontSize: 13,
                    fontWeight: 900,
                    lineHeight: 1.25,
                    marginBottom: 4,
                  }}>
                    Atomic Habits
                  </div>
                  <div style={{
                    fontFamily: F.ui,
                    fontSize: 10,
                    letterSpacing: 1.2,
                    color: COLORS.muted,
                    marginBottom: SPACE[2],
                  }}>
                    James Clear
                  </div>
                  <div style={{
                    fontFamily: F.body,
                    fontStyle: "italic",
                    fontSize: 10,
                    lineHeight: 1.4,
                    color: COLORS.ink,
                    opacity: 0.88,
                  }}>
                    Why: it turns vague intention into a small system you can repeat today.
                  </div>
                </div>
              </button>
            </div>

            <button
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
              Choose one challenge
            </button>
          </div>
        </div>,
        document.querySelector(".owls-press-root") || document.body
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
      padding: "20px 16px 0",
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
    }}>

      {/* ── Top: editor stats + daily stamp ── */}
      <div style={{ animation: "owls-press-fade-up 0.4s ease both", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
        }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              border: `3px solid ${COLORS.ink}`,
              overflow: "hidden", background: COLORS.paperDark,
            }}>
              <ScholarAvatar size={72} />
            </div>
            <div style={{
              position: "absolute", bottom: -3, right: -3,
              width: 20, height: 20, background: COLORS.gold,
              borderRadius: "50%", border: `3px solid ${COLORS.paper}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: F.ui, fontSize: 10, fontWeight: 700, color: COLORS.ink,
            }}>O</div>
          </div>
          <XPBar
            current={userStats.xpCurrent}
            total={progress.xpTotal}
            rank={progress.currentRank}
          />
          <div style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: COLORS.ink,
            border: `3px solid ${COLORS.rule}`,
            padding: "12px 13px",
            boxShadow: "inset 0 0 0 1px rgba(245,239,224,0.12)",
          }}>
            <CoinIcon size={17} />
            <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 20, color: COLORS.gold, lineHeight: 1 }}>
              {userStats.inkBalance}
            </span>
            <span style={{ fontFamily: F.ui, fontSize: 12, fontWeight: 700, color: COLORS.gold, letterSpacing: 3 }}>
              INK
            </span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
          <ChallengeChip
            onOpenDispatch={onOpenDispatch}
            userStats={userStats}
            onApplyChallengeReward={onApplyChallengeReward}
          />
        </div>
        <OrnateRule my={0} symbol="" />
      </div>

      {/* ── Middle: Question cards ── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingTop: 16, paddingBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{
            fontFamily: F.ui,
            fontSize: 15,
            fontWeight: 700,
            color: COLORS.muted,
            letterSpacing: 4,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            Today's Questions
          </div>
          <div style={{ flex: 1, borderTop: `1.5px solid rgba(42,31,14,0.35)` }} />
          <div style={{
            fontFamily: F.ui,
            fontSize: 15,
            fontWeight: 700,
            color: COLORS.muted,
            letterSpacing: 3,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            opacity: 0.72,
          }}>
            {QUESTIONS.length} Dispatches
          </div>
        </div>
        <div>
          {QUESTIONS.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} onClick={(card) => onSend(card.text, "normal")} />
          ))}
        </div>
        <div style={{ textAlign: "center", margin: `${SPACE[3]}px 0 ${SPACE[2]}px` }}>
          <div style={{
            fontFamily: F.body, fontStyle: "italic", fontSize: 11,
            color: COLORS.muted, opacity: 0.48, lineHeight: 1.6,
          }}>
            "The owl accepts no vague panic. Please file a sharper question."<br />
            — The Owl's Press
          </div>
        </div>
      </div>
    </div>
  );
}
