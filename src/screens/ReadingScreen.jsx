// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Reading Screen (Library)
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { READING_ARTICLES } from "../data/content.js";
import { COLORS, FONTS as F, TEXTURES, CARD_COLORS, SPACE, LAYOUT } from "../styles/tokens.js";
import { OrnateRule, SectionLabel } from "../components/Primitives.jsx";

// ── Article Card ──────────────────────────────────────────────
function ArticleCard({ article, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(article)}
      aria-label={`Read: ${article.title}`}
      className="duleme-bare duleme-press-shadow"
      style={{
        border: `1.5px solid ${COLORS.rule}`,
        ...TEXTURES.paperLight,
        marginBottom: SPACE[4], overflow: "hidden",
        cursor: "pointer", position: "relative",
        animation: `duleme-fade-up 0.4s ease ${0.08 + index * 0.1}s both`,
      }}
    >
      {/* Left 3px accent bar — "book spine" per brand spec */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: CARD_COLORS[article.color] }} />

      <div style={{ padding: `${SPACE[4]}px ${SPACE[4]}px ${SPACE[4]}px ${SPACE[4] + 3}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: SPACE[2] }}>
          <div style={{
            fontFamily: F.ui, fontSize: 10, fontWeight: 700,
            letterSpacing: 1.5,
            color: CARD_COLORS[article.color],
          }}>
            {article.tag} · {article.date}
          </div>
          <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>
            {article.readTime}
          </div>
        </div>

        <div style={{
          fontFamily: F.chinese, fontWeight: 700, fontSize: 16,
          lineHeight: 1.4, color: COLORS.ink, marginBottom: SPACE[2],
        }}>
          {article.title}
        </div>

        <div style={{
          fontFamily: F.body, fontStyle: "italic", fontSize: 11,
          color: COLORS.muted, lineHeight: 1.5, marginBottom: SPACE[3],
        }}>
          {article.en}
        </div>

        <div style={{
          fontFamily: F.chinese, fontSize: 12,
          lineHeight: 1.8, color: COLORS.muted, marginBottom: SPACE[3],
          borderLeft: `2px solid ${COLORS.paperAged}`,
          paddingLeft: SPACE[3],
        }}>
          {article.preview}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>
            {article.author}
          </div>
          <div style={{
            fontFamily: F.ui, fontSize: 10, fontWeight: 700,
            color: COLORS.ink, letterSpacing: 1,
          }}>
            Read →
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Filter Tabs ───────────────────────────────────────────────
const FILTERS = ["All", "Health", "Wealth", "Relationships", "Literature", "Philosophy", "Career"];

function FilterTabs({ active, onSelect }) {
  return (
    <div style={{ display: "flex", gap: SPACE[2], overflowX: "auto", margin: `0 -${SPACE[4]}px`, padding: `0 ${SPACE[4]}px ${SPACE[3]}px` }}>
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onSelect(f)}
          aria-pressed={active === f}
          style={{
            flexShrink: 0,
            fontFamily: F.ui, fontSize: 10, fontWeight: 700,
            letterSpacing: 1,
            padding: `${SPACE[2]}px ${SPACE[3]}px`,
            minHeight: LAYOUT.minTouchTarget,
            border: `1px solid ${active === f ? COLORS.ink : COLORS.paperAged}`,
            background: active === f ? COLORS.ink : "transparent",
            color: active === f ? COLORS.paper : COLORS.muted,
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

// ── Full Reading Screen ───────────────────────────────────────
export default function ReadingScreen() {
  const [filter, setFilter] = useState("All");
  const [openArticle, setOpenArticle] = useState(null);

  const filtered = filter === "All"
    ? READING_ARTICLES
    : READING_ARTICLES.filter(a => a.tag === filter);

  if (openArticle) {
    return (
      <div style={{ padding: `${SPACE[3]}px ${SPACE[4]}px ${SPACE[9]}px` }}>
        <button
          type="button"
          onClick={() => setOpenArticle(null)}
          aria-label="Back to library"
          style={{
            fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 2,
            textTransform: "uppercase", color: COLORS.muted,
            background: "none", border: "none", cursor: "pointer",
            marginBottom: SPACE[4],
            minHeight: LAYOUT.minTouchTarget,
            padding: `${SPACE[2]}px 0`,
          }}
        >
          ← Back
        </button>

        <div style={{ animation: "duleme-fade-up 0.4s ease both" }}>
          <div style={{
            fontFamily: F.ui, fontSize: 10, fontWeight: 700, letterSpacing: 2,
            color: CARD_COLORS[openArticle.color],
            marginBottom: SPACE[2],
          }}>
            {openArticle.tag} · {openArticle.date}
          </div>
          <div style={{
            fontFamily: F.chinese, fontWeight: 900, fontSize: 22,
            lineHeight: 1.35, color: COLORS.ink, marginBottom: SPACE[2],
          }}>
            {openArticle.title}
          </div>
          <div style={{
            fontFamily: F.body, fontStyle: "italic", fontSize: 12,
            color: COLORS.muted, lineHeight: 1.6, marginBottom: SPACE[4],
          }}>
            {openArticle.en}
          </div>
          <OrnateRule />
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: SPACE[4],
          }}>
            <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>
              {openArticle.author}
            </div>
            <div style={{ fontFamily: F.ui, fontSize: 10, color: COLORS.muted, letterSpacing: 1 }}>
              {openArticle.readTime} · {openArticle.date}
            </div>
          </div>
          {openArticle.pullQuote && (
            <div style={{
              borderLeft: `3px solid ${CARD_COLORS[openArticle.color]}`,
              paddingLeft: SPACE[4],
              margin: `${SPACE[5]}px 0`,
            }}>
              <div style={{
                fontFamily: F.display, fontStyle: "italic", fontSize: 15,
                lineHeight: 1.7, color: COLORS.ink, letterSpacing: 0.3,
              }}>
                「{openArticle.pullQuote}」
              </div>
            </div>
          )}

          {(openArticle.body || [openArticle.preview]).map((para, i) => (
            <div key={i} style={{
              fontFamily: F.chinese, fontSize: 14, lineHeight: 2,
              color: COLORS.ink, marginBottom: SPACE[4],
            }}>
              {para}
            </div>
          ))}

          {openArticle.bookRec && (
            <div style={{
              border: `1px solid ${COLORS.paperAged}`,
              borderLeft: `3px solid ${CARD_COLORS[openArticle.color]}`,
              padding: `${SPACE[3]}px ${SPACE[4]}px`,
              marginTop: SPACE[5],
            }}>
              <div style={{ fontFamily: F.ui, fontSize: 9, fontWeight: 700, letterSpacing: 2, color: COLORS.muted, marginBottom: SPACE[1] }}>
                Recommended by The Owl
              </div>
              <div style={{ fontFamily: F.chinese, fontWeight: 700, fontSize: 13, color: COLORS.ink, marginBottom: 4 }}>
                {openArticle.bookRec.title}
              </div>
              <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, lineHeight: 1.5 }}>
                {openArticle.bookRec.en}
              </div>
            </div>
          )}
          <OrnateRule my={SPACE[6]} symbol="— end —" />
          <div style={{ textAlign: "center", fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, opacity: 0.5 }}>
            “A good book ends. A good question never does.”<br />— The Owl
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: `${SPACE[3]}px ${SPACE[4]}px ${SPACE[4]}px` }}>

      <div style={{ textAlign: "center", marginBottom: SPACE[4], animation: "duleme-fade-up 0.4s ease both" }}>
        <div style={{ fontFamily: F.chinese, fontWeight: 900, fontSize: 20, color: COLORS.ink, marginBottom: SPACE[1] }}>
          Library
        </div>
        <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, letterSpacing: 1 }}>
          Selected dispatches from The Owl
        </div>
      </div>

      <OrnateRule symbol="✦ ◆ ✦" />

      <FilterTabs active={filter} onSelect={setFilter} />

      {filtered.map((article, i) => (
        <ArticleCard key={article.id} article={article} index={i} onOpen={setOpenArticle} />
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: `${SPACE[8]}px 0`, fontFamily: F.body, fontStyle: "italic", fontSize: 13, color: COLORS.muted, opacity: 0.5 }}>
          No dispatches in this category yet.
        </div>
      )}

      <OrnateRule symbol="— more issues to come —" />
      <div style={{ textAlign: "center", padding: `${SPACE[4]}px 0` }}>
        <div style={{ fontFamily: F.body, fontStyle: "italic", fontSize: 11, color: COLORS.muted, opacity: 0.4, lineHeight: 1.8 }}>
          “Every question grows the library by one more page.”<br />
          — The Owl
        </div>
      </div>
    </div>
  );
}
