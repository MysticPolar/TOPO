// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · Home Screen
// Layout reference: iPhone 15 Pro benchmark — weather 96 · book 210 · chat flex
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef } from "react";
import {
  useHomeWeatherBookMoment,
  HomeWeatherPanel,
  HomeBookPanel,
} from "../components/WeatherBookMoment.jsx";
import HomeOwlpoRoutes from "../components/HomeOwlpoRoutes.jsx";
import { OWLPO_UI_STACK } from "../styles/tokens.js";
import { OWLPO_ASSETS } from "../utils/owlpoAssets.js";

const CHAT_BG = "var(--duleme-surface-rail)";
const FIELD_BORDER = "1px solid rgba(0,0,0,0.07)";

/** Spec gaps between fixed-height strips (8pt). */
const HOME_COL_GAP = 8;

function PaperPlaneIcon() {
  return (
    <img
      src={OWLPO_ASSETS.icons.send}
      width={20}
      height={20}
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        filter: "brightness(0) invert(1)",
        transform: "rotate(-45deg)",
        marginLeft: -1,
        marginTop: -1,
      }}
    />
  );
}

export default function HomeScreen({ onSend }) {
  const textareaRef = useRef(null);
  const moment = useHomeWeatherBookMoment();

  useEffect(() => {
    const onPrefill = (e) => {
      const text = e.detail?.text?.trim();
      if (text && textareaRef.current) {
        textareaRef.current.value = text;
        textareaRef.current.focus();
      }
    };
    window.addEventListener("duleme-prefill-send", onPrefill);
    return () => window.removeEventListener("duleme-prefill-send", onPrefill);
  }, []);

  const sendFromComposer = () => {
    const value = textareaRef.current?.value?.trim();
    if (!value) return;
    onSend(value, "normal");
    textareaRef.current.value = "";
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        flex: "1 1 0",
        minHeight: 0,
        width: "100%",
        background: "var(--duleme-bg)",
        display: "flex",
        flexDirection: "column",
        gap: HOME_COL_GAP,
        padding: `0 16px 0`,
      }}
    >
      <HomeWeatherPanel moment={moment} />
      <HomeBookPanel moment={moment} />

      <section
        aria-label="Chat and routes"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px 16px 44px 44px",
          border: "none",
          background: CHAT_BG,
          boxShadow: "0 2px 10px rgba(27, 42, 74, 0.05)",
          padding: `16px 16px max(44px, env(safe-area-inset-bottom))`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            boxSizing: "border-box",
          }}
        >
          <HomeOwlpoRoutes phase="both" onPickRoute={(text) => onSend(text, "air")} />
        </div>

        <div
          aria-label="Message composer"
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          <button
            type="button"
            aria-label="Focus message field"
            onClick={() => textareaRef.current?.focus()}
            className="duleme-press-dim"
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              color: "var(--duleme-text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <img
              src={OWLPO_ASSETS.icons.plus}
              width={22}
              height={22}
              alt=""
              aria-hidden="true"
              style={{ display: "block", opacity: 0.85 }}
            />
          </button>

          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: 0,
              height: 48,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              background: "#FFFFFF",
              border: FIELD_BORDER,
              borderRadius: 26,
              padding: "4px 52px 4px 16px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 0,
              }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Message Owl…"
                aria-label="Message Owl"
                style={{
                  width: "100%",
                  minHeight: 0,
                  maxHeight: 22,
                  padding: 0,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: OWLPO_UI_STACK,
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "var(--duleme-text)",
                  resize: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendFromComposer();
                  }
                }}
              />
              <span
                style={{
                  fontFamily: OWLPO_UI_STACK,
                  fontSize: 11,
                  lineHeight: 1.2,
                  color: "var(--duleme-text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Ask anything. Owlpo is here to help.
              </span>
            </div>
            <div style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 44, height: 44 }}>
              <img
                src={OWLPO_ASSETS.icons.sparkle}
                width={12}
                height={12}
                alt=""
                aria-hidden
                style={{ position: "absolute", top: -4, left: -10, opacity: 0.35, pointerEvents: "none" }}
              />
              <img
                src={OWLPO_ASSETS.icons.sparkle}
                width={8}
                height={8}
                alt=""
                aria-hidden
                style={{ position: "absolute", top: 4, left: -14, opacity: 0.2, pointerEvents: "none" }}
              />
              <button
                type="button"
                onClick={sendFromComposer}
                style={{
                  width: 44,
                  height: 44,
                  background: "var(--duleme-button-fill)",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--duleme-on-button)",
                  boxShadow: "0 4px 12px rgba(27, 42, 74, 0.3)",
                  padding: 0,
                }}
                aria-label="Send message"
              >
                <PaperPlaneIcon />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
