import { useState, useEffect } from "react";
import { FONTS as F, CARD_COLORS, LAYOUT } from "../styles/tokens.js";
import { articleTagLabel } from "../utils/dispatchMeta.js";
import { Typewriter, TypewriterEmpathy } from "./Typewriter.jsx";
import ArticleContent from "./ArticleContent.jsx";
import { saveReadingEntry, saveCollection } from "../utils/db.js";

function StreamIn({ children, visible }) {
  if (!visible) return null;
  return <div style={{ animation: "duleme-fade-up 0.4s ease both" }}>{children}</div>;
}

export default function OracleDispatch({ question, onClose, onRetry, issueKan = 1, issueJuan = 0 }) {
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
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        window.dispatchEvent(new CustomEvent("duleme-prefill-send", { detail: { text, mode: "normal" } }));
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
          question_text: question?.zh || "",
          book_title: R.bookRec?.title || "",
          book_author: R.bookRec?.en || "",
          tag: question?.tag || "",
          color: question?.color || "",
        });
      } catch { /* non-blocking */ }
    }
    onClose();
  };

  const accentColor = CARD_COLORS[question?.color] || CARD_COLORS.coral;
  const tagLabel = articleTagLabel(question);

  return (
    <div
      className="duleme-scroll-surface"
      style={{
        position: "absolute", inset: 0, zIndex: 200,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 60%, var(--duleme-vignette) 100%)",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 2, flex: 1, overflow: "auto" }}>
        <div style={{ padding: "14px 20px 12px", borderBottom: "3px double var(--duleme-rule)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{
              fontFamily: F.chinese, fontWeight: 900, fontSize: 36,
              lineHeight: 1, letterSpacing: 4, color: "var(--duleme-text)",
              display: "flex", alignItems: "baseline",
            }}>
              <span>READ</span>
              <span style={{
                color: "var(--duleme-red)", display: "inline-block", overflow: "hidden",
                maxWidth: stamped ? "0px" : "2.5em",
                transition: "max-width 0s ease 0.58s",
                animation: stamped ? "duleme-erase 0.55s ease forwards" : "none",
              }}>?</span>
            </div>
            <div style={{ textAlign: "right", paddingBottom: 4 }}>
              <div style={{
                fontFamily: F.ui, fontSize: 9, letterSpacing: 2,
                color: "var(--duleme-text-muted)", lineHeight: 1.8,
              }}>
                <strong style={{ fontWeight: 700, color: "var(--duleme-text)" }}>The Owl</strong> {"\u00B7 Exclusive Dispatch"}
              </div>
              <div style={{
                fontFamily: F.ui, fontSize: 9, letterSpacing: 2,
                color: "var(--duleme-text-muted)", lineHeight: 1.8,
              }}>
                Issue №{issueKan}{" \u00B7 "}{tagLabel}{" \u00B7 Vol. "}{issueJuan}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--duleme-border-strong)" }} />
            <span style={{
              fontFamily: F.ui, fontSize: 8, letterSpacing: 3,
              color: "var(--duleme-text-muted)", opacity: 0.55, whiteSpace: "nowrap",
            }}>Printed for you · Off the press</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--duleme-border-strong)" }} />
          </div>
        </div>

        {!R && !hasError && (
          <div style={{
            padding: "48px 20px", textAlign: "center",
            fontFamily: F.chinese, fontSize: 14, color: "var(--duleme-text-muted)",
            letterSpacing: 1, lineHeight: 2,
            animation: "duleme-shimmer 2s ease-in-out infinite",
          }}>The Owl is setting type…</div>
        )}

        {hasError && (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: F.chinese, fontWeight: 900, fontSize: 18, color: "var(--duleme-text)", marginBottom: 12 }}>
              The press is briefly jammed
            </div>
            <div style={{ fontFamily: F.chinese, fontSize: 13, color: "var(--duleme-text-muted)", marginBottom: 20, lineHeight: 2 }}>
              {question.error}
            </div>
            <button type="button" onClick={onRetry} style={{
              fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 2,
              padding: "12px 20px", minHeight: LAYOUT.minTouchTarget,
              background: "var(--duleme-button-fill)", color: "var(--duleme-gold-bright)",
              border: "none", cursor: "pointer",
            }}>Resend →</button>
          </div>
        )}

        {R && (
          <>
            <StreamIn visible={R.empathyLine1}>
              <div style={{
                padding: "24px 20px", borderBottom: "1px solid var(--duleme-border)",
                animation: "duleme-fade-up 0.5s ease both",
              }}>
                <span style={{
                  fontFamily: F.ui, fontSize: 9, fontWeight: 700,
                  letterSpacing: 5, color: "var(--duleme-red)",
                  marginBottom: 8, display: "block",
                }}>{"The Owl \u00B7 "}{tagLabel || "Today's Pick"}</span>
                <h1 style={{
                  fontFamily: F.chinese, fontWeight: 900, fontSize: 26,
                  lineHeight: 1.25, letterSpacing: 1, color: "var(--duleme-text)", margin: 0,
                }}>
                  <Typewriter text={R.empathyLine1} active={isStreaming} speed={28} />
                </h1>
                {R.empathyLine2 && (
                  <p style={{
                    fontFamily: F.chinese, fontSize: 16, lineHeight: 1.45,
                    color: "var(--duleme-text-muted)", marginTop: 10,
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

            <StreamIn visible={R.bookRec?.title}>
              <div style={{
                margin: "0 20px", padding: "16px 0",
                borderBottom: "1px solid var(--duleme-border)",
                display: "flex", gap: 16, alignItems: "flex-start",
                animation: "duleme-fade-up 0.5s 0.08s ease both",
              }}>
                <div style={{ width: 72, height: 100, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: F.chinese, fontWeight: 900, fontSize: 16,
                    color: "var(--duleme-on-button)", letterSpacing: 3,
                    writingMode: "vertical-rl", background: accentColor, position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: 6,
                      background: "rgba(0,0,0,0.2)",
                    }} />
                    <div style={{
                      position: "absolute", right: -2, top: 3, bottom: 3, width: 4,
                      background: "repeating-linear-gradient(to bottom, var(--duleme-spine-a) 0px, var(--duleme-spine-a) 1px, var(--duleme-spine-b) 1px, var(--duleme-spine-b) 2px)",
                      borderRadius: "0 1px 1px 0",
                    }} />
                    <span style={{ position: "relative", zIndex: 1 }}>{R.bookSpineShort}</span>
                  </div>
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{
                    fontFamily: F.chinese, fontWeight: 700, fontSize: 18,
                    letterSpacing: 1.5, color: "var(--duleme-text)", lineHeight: 1.3,
                  }}>
                    {(R.bookRec?.title || "").split("\u2014")[0]?.trim()}
                  </div>
                  <div style={{
                    fontFamily: F.ui, fontSize: 13, letterSpacing: 1.5,
                    color: "var(--duleme-text-muted)", marginTop: 4, lineHeight: 1.5,
                  }}>
                    {(R.bookRec?.title || "").includes("\u2014")
                      ? (R.bookRec?.title || "").split("\u2014")[1]?.trim()
                      : ""}
                    {R.bookRec?.en && <><br />{R.bookRec.en}</>}
                  </div>
                  {R.chapterTag && (
                    <div style={{
                      display: "inline-block", marginTop: 10,
                      fontFamily: F.ui, fontSize: 9, letterSpacing: 2.5,
                      color: "var(--duleme-on-button)", background: "var(--duleme-button-fill)", padding: "3px 10px",
                    }}>{R.chapterTag}</div>
                  )}
                </div>
              </div>
            </StreamIn>

            <ArticleContent R={R} isStreaming={isStreaming} stamped={stamped} />

            {isDone && (
              <div style={{ padding: "24px 20px 0", borderTop: "3px double var(--duleme-rule)" }}>
                <span style={{
                  fontFamily: F.ui, fontSize: 8, letterSpacing: 3,
                  color: "var(--duleme-text-muted)", opacity: 0.6,
                  marginBottom: 10, display: "block",
                }}>Ask boldly · Your question may become tomorrow's headline</span>
                <div style={{ display: "flex", border: "1.5px solid var(--duleme-rule)", overflow: "hidden" }}>
                  <textarea
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder={"What is the question most weighing on you right now…"}
                    rows={3}
                    style={{
                      flex: 1, border: "none", background: "var(--duleme-surface-input)",
                      fontFamily: F.chinese, fontSize: 15, color: "var(--duleme-text)",
                      padding: "14px 16px", outline: "none", resize: "none",
                      minHeight: 64, lineHeight: 1.8,
                    }}
                  />
                  <button type="button" onClick={handleSendFollowUp} style={{
                    background: "var(--duleme-button-fill)", color: "var(--duleme-gold-bright)",
                    border: "none", padding: "0 14px", cursor: "pointer",
                    fontFamily: F.ui, fontSize: 10, letterSpacing: 1.5,
                    writingMode: "vertical-rl",
                    borderLeft: "1px solid var(--duleme-border-medium)",
                    minWidth: 44, fontWeight: 500,
                  }}>Send →</button>
                </div>
              </div>
            )}

            <div style={{
              background: "var(--duleme-button-fill)", padding: "16px 20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTop: "1px solid var(--duleme-border-medium)", marginTop: 24,
            }}>
              <div style={{
                fontFamily: F.chinese, fontWeight: 900, fontSize: 20,
                color: "var(--duleme-footer-fade)", letterSpacing: 4, opacity: 1,
              }}>READ<span style={{ color: "var(--duleme-red)" }}>?</span></div>
              <div style={{
                fontFamily: F.ui, fontSize: 8, letterSpacing: 2,
                color: "var(--duleme-footer-fade-muted)", opacity: 1,
                textAlign: "right", lineHeight: 2,
              }}>From The Owl<br />Ask boldly</div>
            </div>
          </>
        )}
      </div>

      {isDone && (
        <div style={{
          flexShrink: 0, position: "relative", zIndex: 3,
          background: "var(--duleme-button-fill)", padding: "12px 20px",
          borderTop: "2px solid var(--duleme-border-medium)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: F.body, fontStyle: "italic", fontSize: 10,
              color: "var(--duleme-on-button)", opacity: 0.75,
            }}>The Owl is glad to hear from you. The lamp is still on.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button type="button" onClick={handleCollect} style={{
              fontFamily: F.ui, fontSize: 9, letterSpacing: 2.5,
              padding: "0 14px", minHeight: LAYOUT.minTouchTarget,
              cursor: collected ? "default" : "pointer", background: "transparent",
              color: collected ? "var(--duleme-gold)" : "var(--duleme-on-button)",
              border: `1px solid ${collected ? "var(--duleme-gold)" : "var(--duleme-border-strong)"}`,
              opacity: collected ? 1 : 0.85,
              transition: "color 0.3s ease, border-color 0.3s ease",
            }}>{collected ? "\u2665 Saved" : "Save"}</button>
            <button type="button" onClick={handleStartReading} style={{
              fontFamily: F.ui, fontSize: 9, fontWeight: 700,
              letterSpacing: 2.5, padding: "0 14px",
              minHeight: LAYOUT.minTouchTarget,
              cursor: "pointer", border: "none",
              background: "var(--duleme-gold-bright)", color: "var(--duleme-button-fill)",
            }}>Start Reading</button>
          </div>
        </div>
      )}
    </div>
  );
}
