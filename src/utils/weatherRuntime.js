// ═══════════════════════════════════════════════════════════════
// Live weather (Open-Meteo) + city (BigDataCloud reverse client API)
// ═══════════════════════════════════════════════════════════════

const LONDON = { lat: 51.5074, lon: -0.1278, label: "London" };

export function prefersFahrenheit() {
  if (typeof navigator === "undefined") return false;
  const l = navigator.language || "en-GB";
  return /^en-(US|LR|MM)/i.test(l);
}

export function formatTempC(celsius, useF) {
  if (celsius == null || Number.isNaN(celsius)) return "";
  if (useF) {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°`;
  }
  return `${Math.round(celsius)}°`;
}

/** Default city label when reverse-geo is unavailable (Owlpo home). */
export const OWLPO_DEFAULT_CITY_LABEL = "London";

/** @param {Date} d */
export function formatContextStamp(d, cityName) {
  const date = d || new Date();
  const dateLine = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const t = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const c = (cityName || "").trim() || OWLPO_DEFAULT_CITY_LABEL;
  return `${dateLine} · ${t} · ${c}`;
}

/** WMO Weather interpretation (Open-Meteo current.weather_code) */
export function wmoToLabel(code) {
  const c = code ?? 0;
  if (c === 0) return "Clear sky";
  if (c <= 3) return "Overcast";
  if (c <= 48) return "Fog";
  if (c <= 57) return "Drizzle";
  if (c <= 67) return "Rain";
  if (c <= 77) return "Snow";
  if (c <= 82) return "Showers";
  if (c <= 86) return "Snow showers";
  if (c <= 99) return "Storm";
  return "Weather";
}

/**
 * Visual mood for the bar (matches reference HTML variants).
 * @returns {"sunny" | "drizzle" | "rain" | "snow" | "storm" | "night" | "overcast"}
 */
export function weatherVariant(code, isDay) {
  const c = code ?? 0;
  if (!isDay && c === 0) return "night";
  if (c === 0) return "sunny";
  if (c >= 95) return "storm";
  if (c >= 71 && c <= 77) return "snow";
  if (c >= 51 && c <= 67) return c <= 57 ? "drizzle" : "rain";
  if (c >= 80 && c <= 82) return "rain";
  if (c <= 3) return "overcast";
  if (!isDay) return "night";
  return "overcast";
}

/** Per-variant atmosphere: light mode — linen, moss/sage, London fog blues */
export const VARIANT_THEME = {
  sunny: {
    canvasGradient: "linear-gradient(165deg, #FDF9F0 0%, #f7f0e0 38%, #f2e8d4 72%, #F7F2E8 100%)",
    tempColor: "#5c4518",
    labelColor: "#6B5A3A",
    stampColor: "rgba(11, 22, 34, 0.55)",
    atmo: "rays",
    particle: "#957A3C",
    particleOpacity: 0.14,
  },
  drizzle: {
    canvasGradient: "linear-gradient(165deg, #F7F2E8 0%, #ece8df 42%, #dfe8e4 100%)",
    tempColor: "#2d4550",
    labelColor: "#4a5f68",
    stampColor: "rgba(95, 117, 104, 0.75)",
    atmo: "drizzle",
    particle: "#5F7568",
    particleOpacity: 0.11,
  },
  rain: {
    canvasGradient: "linear-gradient(165deg, #F7F2E8 0%, #e4ebe8 50%, #d8e4e8 100%)",
    tempColor: "#1a3544",
    labelColor: "#3d5666",
    stampColor: "rgba(42, 62, 74, 0.72)",
    atmo: "rain",
    particle: "#4a6670",
    particleOpacity: 0.12,
  },
  snow: {
    canvasGradient: "linear-gradient(165deg, #F7F2E8 0%, #eef4f6 55%, #e4eef2 100%)",
    tempColor: "#1a3a55",
    labelColor: "#2d5580",
    stampColor: "rgba(30, 58, 86, 0.68)",
    atmo: "snow",
    particle: "#4a7aad",
    particleOpacity: 0.18,
  },
  storm: {
    canvasGradient: "linear-gradient(165deg, #F7F2E8 0%, #e6e9ea 40%, #dadfe4 100%)",
    tempColor: "#1a2830",
    labelColor: "#3d4c56",
    stampColor: "rgba(40, 52, 60, 0.72)",
    atmo: "storm",
    particle: "#5a6670",
    particleOpacity: 0.2,
  },
  night: {
    canvasGradient: "linear-gradient(165deg, #F0EBE4 0%, #e8e6ee 50%, #e0dde8 100%)",
    tempColor: "#2a2840",
    labelColor: "#4a4670",
    stampColor: "rgba(55, 52, 88, 0.7)",
    atmo: "night",
    particle: "#8b84b8",
    particleOpacity: 0.2,
  },
  overcast: {
    canvasGradient: "linear-gradient(165deg, #F7F2E8 0%, #eceae4 50%, #e4e2dc 100%)",
    tempColor: "#3a3830",
    labelColor: "#5c5a52",
    stampColor: "rgba(74, 72, 64, 0.66)",
    atmo: "clouds",
    particle: "#8a8680",
    particleOpacity: 0.08,
  },
};

/** Dark mode — midnight navy canvas, cream type, starlight accents */
export const VARIANT_THEME_DARK = {
  sunny: {
    canvasGradient: "linear-gradient(165deg, #152433 0%, #1a2c3d 45%, #142536 100%)",
    tempColor: "#E8DCC4",
    labelColor: "#C9A94B",
    stampColor: "rgba(237, 232, 221, 0.45)",
    atmo: "rays",
    particle: "#C9A94B",
    particleOpacity: 0.18,
  },
  drizzle: {
    canvasGradient: "linear-gradient(165deg, #0F1E2E 0%, #142a38 50%, #122232 100%)",
    tempColor: "#D4E0E4",
    labelColor: "#9BB0B8",
    stampColor: "rgba(109, 139, 126, 0.85)",
    atmo: "drizzle",
    particle: "#6D8B7E",
    particleOpacity: 0.14,
  },
  rain: {
    canvasGradient: "linear-gradient(165deg, #0B1622 0%, #152a38 55%, #0f1c28 100%)",
    tempColor: "#E2ECF0",
    labelColor: "#9EB4C0",
    stampColor: "rgba(180, 200, 210, 0.55)",
    atmo: "rain",
    particle: "#7a9cac",
    particleOpacity: 0.16,
  },
  snow: {
    canvasGradient: "linear-gradient(165deg, #121f2a 0%, #1a3040 55%, #152433 100%)",
    tempColor: "#E8F2FA",
    labelColor: "#A8C0D4",
    stampColor: "rgba(200, 220, 235, 0.5)",
    atmo: "snow",
    particle: "#9ebfd4",
    particleOpacity: 0.2,
  },
  storm: {
    canvasGradient: "linear-gradient(165deg, #0a1420 0%, #162530 40%, #0d1822 100%)",
    tempColor: "#E0E4E8",
    labelColor: "#8A9AA8",
    stampColor: "rgba(160, 175, 188, 0.55)",
    atmo: "storm",
    particle: "#6a7a88",
    particleOpacity: 0.22,
  },
  night: {
    canvasGradient: "linear-gradient(165deg, #0B1622 0%, #152038 50%, #0F1E2E 100%)",
    tempColor: "#EDE8DD",
    labelColor: "#C9A94B",
    stampColor: "rgba(201, 169, 75, 0.5)",
    atmo: "night",
    particle: "#D4B86A",
    particleOpacity: 0.22,
  },
  overcast: {
    canvasGradient: "linear-gradient(165deg, #101c28 0%, #1a2834 50%, #121f2a 100%)",
    tempColor: "#E4E2DC",
    labelColor: "#A8A6A0",
    stampColor: "rgba(237, 232, 221, 0.4)",
    atmo: "clouds",
    particle: "#889088",
    particleOpacity: 0.1,
  },
};

/** @param {keyof typeof VARIANT_THEME} variantKey @param {boolean} isDark */
export function variantThemeFor(variantKey, isDark) {
  const k = variantKey in VARIANT_THEME ? variantKey : "overcast";
  return isDark ? VARIANT_THEME_DARK[k] : VARIANT_THEME[k];
}

export async function fetchReverseCity(lat, lon) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("City lookup failed");
  const data = await res.json();
  return (
    data.city
    || data.locality
    || data.principalSubdivision
    || data.countryName
    || ""
  );
}

export async function fetchOpenMeteoCurrent(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("timezone", "auto");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();
  const cur = data.current;
  return {
    tempC: cur?.temperature_2m ?? null,
    weatherCode: cur?.weather_code ?? 0,
    isDay: cur?.is_day === 1,
  };
}

export function getBrowserGeolocation() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 12_000 },
    );
  });
}

export async function loadWeatherSnapshot() {
  try {
    const { lat, lon } = await getBrowserGeolocation();
    const [meteo, city] = await Promise.all([
      fetchOpenMeteoCurrent(lat, lon),
      fetchReverseCity(lat, lon).catch(() => ""),
    ]);
    return { lat, lon, city, ...meteo, usedFallback: false };
  } catch {
    const meteo = await fetchOpenMeteoCurrent(LONDON.lat, LONDON.lon);
    return {
      lat: LONDON.lat,
      lon: LONDON.lon,
      city: LONDON.label,
      ...meteo,
      usedFallback: true,
    };
  }
}
