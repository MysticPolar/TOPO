// ═══════════════════════════════════════════════════════════════
// Home · Weather strip + book pick (split for viewport flex layout)
// ═══════════════════════════════════════════════════════════════

import { useCallback, useEffect, useState } from "react";
import { FONTS as F, OWLPO_UI_STACK } from "../styles/tokens.js";
import {
  variantThemeFor,
  formatContextStamp,
  formatTempC,
  loadWeatherSnapshot,
  prefersFahrenheit,
  weatherVariant,
  wmoToLabel,
} from "../utils/weatherRuntime.js";
import { useAppTheme } from "../context/AppThemeContext.jsx";
import { owlpoWeatherBannerUrl, OWLPO_ASSETS } from "../utils/owlpoAssets.js";
import { OWLPO_HOME_REFERENCE_BOOK as REF } from "../data/owlpoHomeReference.js";

const CARD_BORDER = "1px solid var(--duleme-border)";
const SOFT_SHADOW = "0 2px 10px rgba(27, 42, 74, 0.05)";

function weatherPackGlyph(variantKey) {
  return variantKey === "drizzle" || variantKey === "rain"
    ? OWLPO_ASSETS.icons.rain
    : OWLPO_ASSETS.icons.weatherCloud;
}

function Postmark() {
  return (
    <svg viewBox="0 0 36 26" width={32} height={24} style={{ flexShrink: 0, opacity: 0.25 }} aria-hidden>
      {[0, 5, 10, 15, 20].map((y) => (
        <line key={y} x1="0" y1={y + 3} x2="36" y2={y + 3} stroke="#C4922A" strokeWidth="2" />
      ))}
    </svg>
  );
}

/** Benchmark: 110×166 · r8 · shadow-book · decorative play control */
function SpecBookCover() {
  return (
    <div
      aria-hidden
      style={{
        width: 110,
        height: 166,
        borderRadius: 8,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        boxShadow: "4px 6px 14px rgba(0,0,0,0.18)",
      }}
    >
      <img
        src={OWLPO_ASSETS.bookRemains}
        alt=""
        width={220}
        height={332}
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden>
          <polygon points="8,5 20,12 8,19" fill="#1B2A4A" />
        </svg>
      </div>
    </div>
  );
}

export function useHomeWeatherBookMoment() {
  const { theme: appTheme } = useAppTheme();
  const isDark = appTheme === "dark";
  const [snap, setSnap] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherSpin, setWeatherSpin] = useState(0);

  const useF = prefersFahrenheit();

  const refreshWeather = useCallback(async () => {
    setLoadingWeather(true);
    try {
      const next = await loadWeatherSnapshot();
      setSnap(next);
    } catch {
      setSnap(null);
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    refreshWeather();
    const id = window.setInterval(refreshWeather, 15 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [refreshWeather]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const variantKey = snap ? weatherVariant(snap.weatherCode, snap.isDay) : "overcast";
  const wTheme = variantThemeFor(variantKey, isDark);
  const bannerSrc = owlpoWeatherBannerUrl(variantKey, snap ? snap.isDay : true);
  const weatherGlyphSrc = weatherPackGlyph(variantKey);
  const stamp = formatContextStamp(now, snap?.city ?? "");
  const rawTemp = snap ? formatTempC(snap.tempC, useF) : "";
  const tempStr = loadingWeather ? "…" : (rawTemp || "18°");
  const rawLabel = snap ? wmoToLabel(snap.weatherCode) : "";
  const weatherLabel = loadingWeather ? "Loading…" : (rawLabel || "Overcast");

  const labelMuted = isDark ? "rgba(237,230,215,0.82)" : wTheme.labelColor;
  const tempMuted = isDark ? "rgba(237,230,215,0.95)" : wTheme.tempColor;

  return {
    isDark,
    loadingWeather,
    weatherSpin,
    setWeatherSpin,
    refreshWeather,
    wTheme,
    bannerSrc,
    weatherGlyphSrc,
    stamp,
    tempStr,
    weatherLabel,
    labelMuted,
    tempMuted,
  };
}

/** Flex weight 10 — full weather strip (~10% viewport in home column). */
export function HomeWeatherPanel({ moment }) {
  const {
    isDark,
    loadingWeather,
    weatherSpin,
    setWeatherSpin,
    refreshWeather,
    wTheme,
    bannerSrc,
    weatherGlyphSrc,
    stamp,
    tempStr,
    weatherLabel,
    labelMuted,
    tempMuted,
  } = moment;

  return (
    <section
      aria-label="Weather"
      style={{
        flex: "0 0 auto",
        minHeight: 96,
        position: "relative",
        borderRadius: 16,
        border: CARD_BORDER,
        boxShadow: SOFT_SHADOW,
        overflow: "hidden",
        boxSizing: "border-box",
        animation: "duleme-fade-up 0.4s ease 0.05s both",
        background: "var(--duleme-surface)",
      }}
    >
      <img
        src={bannerSrc}
        alt=""
        width={1200}
        height={360}
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center right",
          display: "block",
          opacity: isDark ? 0.88 : 0.94,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, var(--duleme-bg) 0%, var(--duleme-bg) 10%, rgba(250,247,242,0.45) 38%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
      {isDark ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(6,10,18,0.42) 0%, transparent 58%)",
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          padding: 14,
          zIndex: 1,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
          <img
            src={weatherGlyphSrc}
            alt=""
            width={36}
            height={36}
            style={{
              flexShrink: 0,
              opacity: isDark ? 0.88 : 0.78,
              filter: isDark ? "brightness(1.08)" : "none",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: OWLPO_UI_STACK,
                  fontSize: 38,
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-0.6px",
                  color: tempMuted,
                  textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.45)" : "0 1px 0 rgba(255,255,255,0.75)",
                }}
              >
                {tempStr}
              </span>
              <span
                style={{
                  fontFamily: OWLPO_UI_STACK,
                  fontSize: 15,
                  fontWeight: 500,
                  color: labelMuted,
                  whiteSpace: "nowrap",
                  opacity: isDark ? 0.92 : 0.88,
                  textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.4)" : "none",
                  marginTop: 6,
                }}
              >
                {weatherLabel}
              </span>
            </div>
            <p
              style={{
                margin: "2px 0 0",
                fontFamily: OWLPO_UI_STACK,
                fontSize: 12,
                color: wTheme.stampColor,
                letterSpacing: 0.2,
                fontWeight: 400,
                opacity: 0.88,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {stamp}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setWeatherSpin((n) => n + 1);
          refreshWeather();
        }}
        disabled={loadingWeather}
        aria-label="Refresh weather"
        className="duleme-press-dim"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: CARD_BORDER,
          background: "var(--duleme-chrome-bg)",
          cursor: loadingWeather ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          zIndex: 4,
          opacity: loadingWeather ? 0.55 : 1,
        }}
      >
        <img
          src={OWLPO_ASSETS.icons.refresh}
          width={12}
          height={12}
          alt=""
          style={{ display: "block", transform: `rotate(${weatherSpin * 12}deg)` }}
        />
      </button>
    </section>
  );
}

/** Benchmark · book card ~210pt · cover 110×166 · seal + postmark + refresh */
export function HomeBookPanel({ moment }) {
  const { isDark, refreshWeather, weatherSpin, setWeatherSpin, loadingWeather } = moment;
  const bodySecondary = isDark ? "rgba(237,230,215,0.75)" : "#4A5568";

  return (
    <article
      aria-label="Owlpo's pick"
      style={{
        flex: "0 0 auto",
        minHeight: 210,
        position: "relative",
        borderRadius: 16,
        border: CARD_BORDER,
        boxShadow: SOFT_SHADOW,
        background: "var(--duleme-surface)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
        animation: "duleme-fade-up 0.4s ease 0.08s both",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          flex: "1 1 0",
          minHeight: 0,
        }}
      >
        <SpecBookCover />
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: F.display,
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "var(--duleme-text)",
                  letterSpacing: "-0.02em",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {REF.title}
              </h2>
              <div
                style={{
                  fontFamily: OWLPO_UI_STACK,
                  fontSize: 13,
                  lineHeight: 1.2,
                  color: "var(--duleme-text-muted)",
                  marginTop: 2,
                }}
              >
                {REF.author}
                <span style={{ opacity: 0.5, margin: "0 4px" }}>·</span>
                {REF.year}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginLeft: 4,
                flexShrink: 0,
              }}
            >
              <img
                src={OWLPO_ASSETS.sealOwlposPick}
                alt=""
                width={46}
                height={46}
                decoding="async"
                style={{
                  display: "block",
                  objectFit: "contain",
                  filter: isDark ? "brightness(1.05)" : "none",
                }}
              />
              <Postmark />
              <button
                type="button"
                onClick={() => {
                  setWeatherSpin((n) => n + 1);
                  refreshWeather();
                }}
                disabled={loadingWeather}
                aria-label="Refresh context"
                className="duleme-press-dim"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: CARD_BORDER,
                  background: "var(--duleme-chrome-bg)",
                  cursor: loadingWeather ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  flexShrink: 0,
                  opacity: loadingWeather ? 0.55 : 1,
                }}
              >
                <img
                  src={OWLPO_ASSETS.icons.refresh}
                  width={16}
                  height={16}
                  alt=""
                  style={{ display: "block", transform: `rotate(${weatherSpin * 12}deg)` }}
                />
              </button>
            </div>
          </div>

          <p
            style={{
              margin: "2px 0 0",
              fontFamily: OWLPO_UI_STACK,
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.45,
              color: bodySecondary,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {REF.description}
          </p>

          <div
            style={{
              borderLeft: "3px solid #C4922A",
              paddingLeft: 10,
              marginTop: 2,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: F.reading,
                fontStyle: "italic",
                fontSize: 13,
                fontWeight: 400,
                lineHeight: 1.45,
                color: bodySecondary,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {REF.moodLine}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
