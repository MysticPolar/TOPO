import { FONTS as F, CARD_COLORS } from "../styles/tokens.js";
import { Typewriter } from "./Typewriter.jsx";

function StreamIn({ children, visible }) {
  if (!visible) return null;
  return <div style={{ animation: "duleme-fade-up 0.4s ease both" }}>{children}</div>;
}

function SectionTag({ children, dark }) {
  return (
    <div style={{
      fontFamily: F.ui, fontWeight: 700, fontSize: 9, letterSpacing: 4,
      color: dark ? "var(--duleme-on-button)" : "var(--duleme-bg)",
      background: dark ? "var(--duleme-button-fill)" : "var(--duleme-text-muted)",
      display: "inline-block", padding: "3px 12px", marginBottom: 16,
    }}>{children}</div>
  );
}

function PullQuote({ text, isStreaming }) {
  return (
    <div style={{
      margin: "24px -20px",
      padding: "24px 20px 24px 24px",
      background: "var(--duleme-surface-rail)",
      borderLeft: "3px solid var(--duleme-rule)",
      borderTop: "1px solid var(--duleme-border)",
      borderBottom: "1px solid var(--duleme-border)",
      position: "relative",
    }}>
      <span style={{
        position: "absolute", top: -14, left: 20,
        fontSize: 72, color: "var(--duleme-red)", opacity: 0.2,
        lineHeight: 1, fontWeight: 900, pointerEvents: "none",
      }}>{"\u201C"}</span>
      <span style={{
        position: "absolute", bottom: -22, right: 20,
        fontSize: 72, color: "var(--duleme-red)", opacity: 0.12,
        lineHeight: 1, fontWeight: 900, pointerEvents: "none",
      }}>{"\u201D"}</span>
      <p style={{
        fontFamily: F.chinese, fontSize: 16, lineHeight: 1.7,
        color: "var(--duleme-text-muted)", fontStyle: "italic",
        position: "relative", zIndex: 1, margin: 0,
      }}>
        <Typewriter text={text} active={isStreaming} speed={25} />
      </p>
    </div>
  );
}

function ViewpointLabel({ label }) {
  return (
    <div style={{
      fontFamily: F.ui, fontSize: 9, fontWeight: 700,
      letterSpacing: 4, color: "var(--duleme-gold)",
      marginBottom: 8, display: "flex", alignItems: "center", gap: 8,
    }}>
      {label}
      <span style={{ flex: 1, borderTop: "1px solid var(--duleme-border-medium)" }} />
    </div>
  );
}

const BODY = {
  fontFamily: "'Noto Serif SC', 'Playfair Display', serif",
  fontSize: 16, lineHeight: 1.7, color: "var(--duleme-text)",
  textAlign: "justify", margin: 0,
};

export default function ArticleContent({ R, isStreaming, stamped }) {
  if (!R) return null;

  return (
    <>
      <div style={{ padding: "0 20px" }}>
        <StreamIn visible={R.body?.[0]}>
          <div style={{ padding: "24px 0", borderBottom: "1px solid var(--duleme-border)", animation: "duleme-fade-up 0.5s 0.15s ease both" }}>
            <SectionTag>I · The Core Idea</SectionTag>
            <p style={BODY}>
              <Typewriter text={R.body?.[0]} active={isStreaming} />
            </p>
            {R.body?.[1] && !R.bodyStrong1 && (
              <p style={{ ...BODY, marginTop: "1em" }}>
                <Typewriter text={R.body?.[1]} active={isStreaming} />
              </p>
            )}
          </div>
        </StreamIn>

        <StreamIn visible={R.pullQuote}>
          <PullQuote text={R.pullQuote} isStreaming={isStreaming} />
        </StreamIn>

        <StreamIn visible={R.bodyStrong1}>
          {R.bodyStrong1 && (
            <div style={{ padding: "24px 0", borderBottom: "1px solid var(--duleme-border)", animation: "duleme-fade-up 0.5s 0.2s ease both" }}>
              <ViewpointLabel label={"POINT I"} />
              <div style={{
                fontFamily: F.chinese, fontWeight: 700, fontSize: 18,
                lineHeight: 1.4, letterSpacing: 0.5, color: "var(--duleme-text)",
                marginBottom: 8,
              }}>
                <Typewriter text={R.bodyStrong1} active={isStreaming} />
              </div>
              {R.body?.[1] && (
                <p style={BODY}>
                  <Typewriter text={R.body?.[1]} active={isStreaming} />
                </p>
              )}
            </div>
          )}
        </StreamIn>

        <StreamIn visible={R.pullQuote2}>
          <PullQuote text={R.pullQuote2} isStreaming={isStreaming} />
        </StreamIn>

        <StreamIn visible={R.bodyStrong2}>
          {R.bodyStrong2 && (
            <div style={{ padding: "24px 0", borderBottom: "1px solid var(--duleme-border)", animation: "duleme-fade-up 0.5s 0.25s ease both" }}>
              <ViewpointLabel label={"POINT II"} />
              <div style={{
                fontFamily: F.chinese, fontWeight: 700, fontSize: 18,
                lineHeight: 1.4, letterSpacing: 0.5, color: "var(--duleme-text)",
                marginBottom: 8,
              }}>
                <Typewriter text={R.bodyStrong2} active={isStreaming} />
              </div>
              {R.body?.[2] && (
                <p style={BODY}>
                  <Typewriter text={R.body?.[2]} active={isStreaming} />
                </p>
              )}
            </div>
          )}
        </StreamIn>

        <StreamIn visible={R.bodyStrong3}>
          {R.bodyStrong3 && (
            <div style={{ padding: "24px 0", borderBottom: "1px solid var(--duleme-border)", animation: "duleme-fade-up 0.5s 0.3s ease both" }}>
              <ViewpointLabel label={"POINT III"} />
              <div style={{
                fontFamily: F.chinese, fontWeight: 700, fontSize: 18,
                lineHeight: 1.4, letterSpacing: 0.5, color: "var(--duleme-text)",
                marginBottom: 8,
              }}>
                <Typewriter text={R.bodyStrong3} active={isStreaming} />
              </div>
              {R.body?.[3] && (
                <p style={BODY}>
                  <Typewriter text={R.body?.[3]} active={isStreaming} />
                </p>
              )}
            </div>
          )}
        </StreamIn>

        <StreamIn visible={R.reflectionQuestions?.length}>
          <div style={{ padding: "24px 0", borderBottom: "1px solid var(--duleme-border)" }}>
            <SectionTag>II · Questions to Sit With</SectionTag>
            <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {(R.reflectionQuestions || []).map((q, i) => (
                <li key={i} style={{
                  ...BODY, textAlign: "left",
                  padding: "12px 0 12px 28px", position: "relative",
                  borderBottom: i < (R.reflectionQuestions?.length || 0) - 1 ? "1px solid var(--duleme-border)" : "none",
                }}>
                  <span style={{
                    position: "absolute", left: 0, top: 14,
                    fontFamily: F.ui, fontSize: 11, fontWeight: 700,
                    color: "var(--duleme-gold)", width: 20, height: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid var(--duleme-border-medium)",
                  }}>{i + 1}</span>
                  <Typewriter text={q} active={isStreaming} />
                </li>
              ))}
            </ol>
          </div>
        </StreamIn>

        <StreamIn visible={R.takeaways?.length}>
          <div style={{ padding: "24px 0" }}>
            <SectionTag>III · Key Takeaways</SectionTag>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {(R.takeaways || []).map((line, i) => (
                <li key={i} style={{
                  ...BODY, textAlign: "left",
                  padding: "8px 0 8px 20px", position: "relative",
                  borderBottom: i < (R.takeaways?.length || 0) - 1 ? "1px solid var(--duleme-border)" : "none",
                }}>
                  <span style={{
                    position: "absolute", left: 0, top: 14,
                    color: "var(--duleme-gold)", fontSize: 8,
                  }}>{"\u25C6"}</span>
                  <Typewriter text={line} active={isStreaming} />
                </li>
              ))}
            </ul>
          </div>
        </StreamIn>

        <div style={{
          textAlign: "center", fontSize: 9, color: "var(--duleme-text-muted)",
          letterSpacing: 12, padding: "24px 0 8px", opacity: 0.35,
        }}>{"\u2726 \u25C6 \u2726"}</div>
      </div>

      <StreamIn visible={R.recommendations?.length > 0}>
        <div style={{ padding: "24px 20px 16px", borderTop: "3px double var(--duleme-rule)" }}>
          <div style={{
            fontFamily: F.ui, fontWeight: 700, fontSize: 9, letterSpacing: 4,
            color: "var(--duleme-text-muted)", marginBottom: 16,
          }}>You may also read…</div>
          <div style={{ display: "flex", gap: 10 }}>
            {(R.recommendations || []).map((rec, i) => (
              <div key={i} style={{
                flex: 1, display: "flex", flexDirection: "column",
                border: "1px solid var(--duleme-rule)",
                overflow: "hidden",
                animation: `duleme-fade-up 0.4s ease ${i * 0.1}s both`,
              }}>
                <div style={{
                  height: 96, position: "relative",
                  background: CARD_COLORS[rec.color] || CARD_COLORS.cobalt,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: 5,
                    background: "rgba(0,0,0,0.18)",
                  }} />
                  <div style={{
                    position: "absolute", right: -1, top: 2, bottom: 2, width: 3,
                    background: "repeating-linear-gradient(to bottom, var(--duleme-spine-a) 0px, var(--duleme-spine-a) 1px, var(--duleme-spine-b) 1px, var(--duleme-spine-b) 2px)",
                  }} />
                  <span style={{
                    fontFamily: F.chinese, fontWeight: 900, fontSize: 12,
                    color: "var(--duleme-on-button)", writingMode: "vertical-rl",
                    letterSpacing: 3, lineHeight: 1, position: "relative", zIndex: 1,
                  }}>{rec.spine}</span>
                </div>
                <div style={{ padding: "10px 8px 0", flex: 1 }}>
                  <div style={{
                    fontFamily: F.chinese, fontWeight: 700, fontSize: 12,
                    color: "var(--duleme-text)", lineHeight: 1.3, marginBottom: 3,
                  }}>{rec.title}</div>
                  <div style={{
                    fontFamily: F.ui, fontSize: 10, color: "var(--duleme-text-muted)",
                    letterSpacing: 0.5, lineHeight: 1.4, marginBottom: 6,
                  }}>{rec.author}</div>
                  <p style={{
                    fontFamily: F.chinese, fontSize: 11, lineHeight: 1.6,
                    color: "var(--duleme-text-muted)", fontStyle: "italic", margin: 0,
                  }}>{rec.why}</p>
                </div>
                <div style={{ padding: "10px 8px 10px" }}>
                  <button type="button" style={{
                    width: "100%", background: "var(--duleme-button-fill)", color: "var(--duleme-gold-bright)",
                    border: "none", padding: "7px 0",
                    fontFamily: F.ui, fontSize: 9, fontWeight: 700,
                    letterSpacing: 2, cursor: "pointer",
                  }}>Start Reading →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StreamIn>

      {stamped && (
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
          <div style={{
            display: "inline-block", padding: 4,
            border: "1.5px solid var(--duleme-sage)",
            transform: "rotate(-5deg)",
            animation: "duleme-stamp 0.5s ease both",
          }}>
            <div style={{ border: "2px solid var(--duleme-sage)", padding: "8px 14px" }}>
              <div style={{
                fontFamily: F.chinese, fontWeight: 900, fontSize: 22,
                color: "var(--duleme-sage)", letterSpacing: 6, lineHeight: 1.2,
                textAlign: "center",
              }}>READ!</div>
              <div style={{
                fontFamily: F.ui, fontSize: 7, letterSpacing: 2,
                color: "var(--duleme-sage)", opacity: 0.7, textAlign: "center",
                marginTop: 2,
              }}>The Owl</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
