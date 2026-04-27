import { useState, useEffect } from "react";
import { COLORS, FONTS as F, TEXTURES, CARD_COLORS, SPACE, LAYOUT } from "../styles/tokens.js";
import { articleTagLabel } from "../utils/dispatchMeta.js";
import { Typewriter, TypewriterEmpathy } from "./Typewriter.jsx";
import ArticleContent from "./ArticleContent.jsx";
import { saveReadingEntry, saveCollection } from "../utils/db.js";

function StreamIn({ children, visible }) {
  if (!visible) return null;
  return <div style={{ animation: "owls-press-fade-up 0.4s ease both" }}>{children}</div>;
}

export default function PressDispatch({ question, onClose, onRetry, issueKan = 1, issueJuan = 0 }) {
  const [visible, setVisible] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [collected, setCollected] = useState(false);

  const isStreaming = question?.streaming;
  const hasError = question?.error && !question?.response?.empathyLine1;
  const R = question?.response || null;
  const isDone = R && !isStreaming;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!isDone) return;
    const t = setTimeout(() => setStamped(true), 600);
    return () => clearTimeout(t);
  }, [isDone]);

  const handleSendFollowUp = () => {
    const text = followUp.trim();
    onClose();
    if (text) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("owls-press-prefill-send", { detail: { text, mode: "normal" } }));
      }, 120);
    }
  };

  const handleCollect = async () => {
    if (collected || !R) return;
    setCollected(true);
    try {
      await saveCollection({
        type: "dispatch",
        title: R.empathyLine1 || "",
        subtitle: R.bookRec?.title || "",
        content: R.empathyLine2 || "",
        tag: question?.tag || "",
        color: question?.color || "",
      });
    } catch { setCollected(false); }
  };

  const handleStartReading = async () => {
    if (R) {
      try {
        await saveReadingEntry({
          question_text: question?.text || "",
          book_title: R.bookRec?.title || "",
          book_author: R.bookRec?.description || "",
          tag: question?.tag || "",
          color: question?.color || "",
        });
      } catch { /* non-blocking */ }
    }
    onClose();
  };

  const accentColor = CARD_COLORS[question?.color] || COLORS.coral;
  const tagLabel = articleTagLabel(question);
  const inkAmt = R?.inkReward ?? 40;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      ...TEXTURES.paper,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 60%, rgba(26,18,8,0.10) 100%)",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 2, flex: 1, overflow: "auto" }}>
        {/* ═══ MASTHEAD ═══ */}
        <div style={{ padding: "14px 20px 12px", borderBottom: `3px double ${COLORS.rule}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{
              fontFamily: F.blackletter, fontWeight: 900, fontSize: 32,
              lineHeight: 1, letterSpacing: 0.5, color: COLORS.ink,
              display: "flex", alignItems: "baseline",
            }}>
              <span>The Owl's Press</span>
            </div>
            <div style={{ textAlign: "right", paddingBottom: 4 }}>
              <div style={{
                fontFamily: F.ui, fontSize: 9, letterSpacing: 2,
                color: COLORS.muted, lineHeight: 1.8,
              }}>
                <strong style={{ fontWeight: 700, color: COLORS.ink }}>The Owl's Press</strong> · Private Dispatch
              </div>
              <div style={{
                fontFamily: F.ui, fontSize: 9, letterSpacing: 2,
                color: COLORS.muted, lineHeight: 1.8,
              }}>
                Issue {issueKan} · {tagLabel} · Vol. {issueJuan}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(42,31,14,0.25)" }} />
            <span style={{
              fontFamily: F.ui, fontSize: 8, letterSpacing: 3,
              color: COLORS.muted, opacity: 0.55, whiteSpace: "nowrap",
            }}>Printed for you · Instant edition</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(42,31,14,0.25)" }} />
          </div>
        </div>

        {/* ═══ LOADING ═══ */}
        {!R && !hasError && (
          <div style={{
            padding: "48px 20px", textAlign: "center",
            fontFamily: F.editorial, fontSize: 14, color: COLORS.muted,
            letterSpacing: 1, lineHeight: 2,
            animation: "owls-press-shimmer 2s ease-in-out infinite",
          }}>The Owl's Press is setting type...</div>
        )}

        {/* ═══ ERROR ═══ */}
        {hasError && (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: F.editorial, fontWeight: 900, fontSize: 18, color: COLORS.ink, marginBottom: 12 }}>
              The press jammed
            </div>
            <div style={{ fontFamily: F.editorial, fontSize: 13, color: COLORS.muted, marginBottom: 20, lineHeight: 2 }}>
              {question.error}
            </div>
            <button onClick={onRetry} style={{
              fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 2,
              padding: "12px 20px", minHeight: LAYOUT.minTouchTarget,
              background: COLORS.ink, color: COLORS.goldLight,
              border: "none", cursor: "pointer",
            }}>Retry →</button>
          </div>
        )}

        {/* ═══ ARTICLE ═══ */}
        {R && (
          <>
            {/* Hero Line */}
            <StreamIn visible={R.empathyLine1}>
              <div style={{
                padding: "24px 20px", borderBottom: "1px solid rgba(42,31,14,0.1)",
                animation: "owls-press-fade-up 0.5s ease both",
              }}>
                <span style={{
                  fontFamily: F.ui, fontSize: 9, fontWeight: 700,
                  letterSpacing: 5, color: COLORS.red,
                  marginBottom: 8, display: "block",
                }}>The Owl's Press · {tagLabel || "Today's Pick"}</span>
                <h1 style={{
                  fontFamily: F.editorial, fontWeight: 900, fontSize: 26,
                  lineHeight: 1.25, letterSpacing: 1, color: COLORS.ink, margin: 0,
                }}>
                  <Typewriter text={R.empathyLine1} active={isStreaming} speed={28} />
                </h1>
                {R.empathyLine2 && (
                  <p style={{
                    fontFamily: F.editorial, fontSize: 16, lineHeight: 1.45,
                    color: COLORS.muted, marginTop: 10,
                    letterSpacing: 0.3, fontStyle: "italic",
                  }}>
                    <TypewriterEmpathy
                      line2={R.empathyLine2} red={R.empathyRed}
                      after={R.empathyLine2After} active={isStreaming} speed={28}
                    />
                  </p>
                )}
              </div>
            </StreamIn>

            {/* Book Block */}
            <StreamIn visible={R.bookRec?.title}>
              <div style={{
                margin: "0 20px", padding: "16px 0",
                borderBottom: "1px solid rgba(42,31,14,0.1)",
                display: "flex", gap: 16, alignItems: "flex-start",
                animation: "owls-press-fade-up 0.5s 0.08s ease both",
              }}>
                <div style={{ width: 72, height: 100, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: F.editorial, fontWeight: 900, fontSize: 16,
                    color: COLORS.paper, letterSpacing: 3,
                    writingMode: "vertical-rl", background: accentColor, position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: 6,
                      background: "rgba(0,0,0,0.2)",
                    }} />
                    <div style={{
                      position: "absolute", right: -2, top: 3, bottom: 3, width: 4,
                      background: `repeating-linear-gradient(to bottom, ${COLORS.paper} 0px, ${COLORS.paper} 1px, ${COLORS.paperDark} 1px, ${COLORS.paperDark} 2px)`,
                      borderRadius: "0 1px 1px 0",
                    }} />
                    <span style={{ position: "relative", zIndex: 1 }}>{R.bookSpineShort}</span>
                  </div>
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{
                    fontFamily: F.editorial, fontWeight: 700, fontSize: 18,
                    letterSpacing: 1.5, color: COLORS.ink, lineHeight: 1.3,
                  }}>
                    {(R.bookRec?.title || "").split(/\s[-–—]\s/)[0]?.trim()}
                  </div>
                  <div style={{
                    fontFamily: F.ui, fontSize: 13, letterSpacing: 1.5,
                    color: COLORS.muted, marginTop: 4, lineHeight: 1.5,
                  }}>
                    {/\s[-–—]\s/.test(R.bookRec?.title || "")
                      ? (R.bookRec?.title || "").split(/\s[-–—]\s/)[1]?.trim()
                      : ""}
                    {R.bookRec?.description && <><br />{R.bookRec.description}</>}
                  </div>
                  {R.chapterTag && (
                    <div style={{
                      display: "inline-block", marginTop: 10,
                      fontFamily: F.ui, fontSize: 9, letterSpacing: 2.5,
                      color: COLORS.paper, background: COLORS.ink, padding: "3px 10px",
                    }}>{R.chapterTag}</div>
                  )}
                </div>
              </div>
            </StreamIn>

            {/* Article Body + Recommendations + Green Stamp */}
            <ArticleContent R={R} isStreaming={isStreaming} stamped={stamped} />

            {/* ═══ FOLLOW-UP INPUT ═══ */}
            {isDone && (
              <div style={{ padding: "24px 20px 0", borderTop: `3px double ${COLORS.rule}` }}>
                <span style={{
                  fontFamily: F.ui, fontSize: 8, letterSpacing: 3,
                  color: COLORS.muted, opacity: 0.6,
                  marginBottom: 10, display: "block",
                }}>Ask boldly · your next question can become the next dispatch</span>
                <div style={{ display: "flex", border: `1.5px solid ${COLORS.rule}`, overflow: "hidden" }}>
                  <textarea
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder={"What is bothering you most right now?"}
                    rows={3}
                    style={{
                      flex: 1, border: "none", background: COLORS.paper,
                      fontFamily: F.editorial, fontSize: 15, color: COLORS.ink,
                      padding: "14px 16px", outline: "none", resize: "none",
                      minHeight: 64, lineHeight: 1.8,
                    }}
                  />
                  <button type="button" onClick={handleSendFollowUp} style={{
                    background: COLORS.ink, color: COLORS.goldLight,
                    border: "none", padding: "0 14px", cursor: "pointer",
                    fontFamily: F.ui, fontSize: 10, letterSpacing: 1.5,
                    writingMode: "vertical-rl",
                    borderLeft: "1px solid rgba(42,31,14,0.15)",
                    minWidth: 44, fontWeight: 500,
                  }}>Send →</button>
                </div>
              </div>
            )}

            {/* ═══ FOOTER ═══ */}
            <div style={{
              background: COLORS.ink, padding: "16px 20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTop: "1px solid rgba(201,162,39,0.08)", marginTop: 24,
            }}>
              <div style={{
                fontFamily: F.editorial, fontWeight: 900, fontSize: 20,
                color: COLORS.paper, letterSpacing: 4, opacity: 0.35,
              }}>The Owl's Press</div>
              <div style={{
                fontFamily: F.ui, fontSize: 8, letterSpacing: 2,
                color: COLORS.paperAged, opacity: 0.2,
                textAlign: "right", lineHeight: 2,
              }}>Printed for readers<br />Ask boldly</div>
            </div>
          </>
        )}
      </div>

      {/* ═══ STICKY ACTION BAR ═══ */}
      {isDone && (
        <div style={{
          flexShrink: 0, position: "relative", zIndex: 3,
          background: COLORS.ink, padding: "12px 20px",
          borderTop: "2px solid rgba(201,162,39,0.2)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: F.body, fontStyle: "italic", fontSize: 10,
              color: COLORS.paperAged, opacity: 0.75,
            }}>The press is pleased. The lamp is still on.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button type="button" onClick={handleCollect} style={{
              fontFamily: F.ui, fontSize: 9, letterSpacing: 2.5,
              padding: "0 14px", minHeight: LAYOUT.minTouchTarget,
              cursor: collected ? "default" : "pointer", background: "transparent",
              color: collected ? COLORS.gold : COLORS.paperAged,
              border: `1px solid ${collected ? "rgba(201,162,39,0.6)" : "rgba(232,197,71,0.25)"}`,
              transition: "color 0.3s ease, border-color 0.3s ease",
            }}>{collected ? "Saved" : "Save"}</button>
            <button type="button" onClick={handleStartReading} style={{
              fontFamily: F.ui, fontSize: 9, fontWeight: 700,
              letterSpacing: 2.5, padding: "0 14px",
              minHeight: LAYOUT.minTouchTarget,
              cursor: "pointer", border: "none",
              background: COLORS.goldLight, color: COLORS.ink,
            }}>Start Reading</button>
          </div>
        </div>
      )}
    </div>
  );
}
