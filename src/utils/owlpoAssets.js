// ═══════════════════════════════════════════════════════════════
// Static paths for Owlpo main-screen pack (public/owlpo/)
// ═══════════════════════════════════════════════════════════════

const ROOT = "/owlpo";

/** @param {string} p */
export function owlpo(p) {
  return `${ROOT}${p.startsWith("/") ? p : `/${p}`}`;
}

/** Watercolor banners: 1200×360, lighthouse on the right (see illustrations/README.md). */
const BANNER_PREFIX = `${ROOT}/illustrations/owlpo_postoffice_`;

/**
 * @param {"sunny" | "drizzle" | "rain" | "snow" | "storm" | "night" | "overcast"} variantKey
 * @param {boolean} isDay
 */
export function owlpoWeatherBannerUrl(variantKey, isDay) {
  const d = isDay ? "day" : "night";
  switch (variantKey) {
    case "sunny":
      return `${BANNER_PREFIX}clear_${d}.png`;
    case "night":
      return `${BANNER_PREFIX}clear_${d}.png`;
    case "drizzle":
    case "rain":
      return `${BANNER_PREFIX}rainy_${d}.png`;
    case "snow":
      return `${BANNER_PREFIX}snow_${d}.png`;
    case "storm":
      return `${BANNER_PREFIX}storm_${d}.png`;
    case "overcast":
      return `${BANNER_PREFIX}cloudy_${d}.png`;
    default:
      return `${BANNER_PREFIX}cloudy_${d}.png`;
  }
}

export const OWLPO_ASSETS = {
  avatarHeader: owlpo("avatars/owl_avatar_small_64.png"),
  avatarSpeaking: owlpo("avatars/owl_avatar_speaking_64.png"),
  bookRemains: owlpo("book-covers/book_remains_of_the_day.png"),
  sealOwlposPick: owlpo("seals/seal_owlpos_pick.png"),
  lighthouseBanner: owlpo("illustrations/weather_lighthouse_banner.png"),
  icons: {
    feather: owlpo("icons/icon_feather.svg"),
    moon: owlpo("icons/icon_moon.svg"),
    send: owlpo("icons/icon_send.svg"),
    plus: owlpo("icons/icon_plus.svg"),
    sparkle: owlpo("icons/icon_sparkle.svg"),
    lantern: owlpo("icons/icon_lantern.svg"),
    refresh: owlpo("icons/icon_refresh.svg"),
    rain: owlpo("icons/icon_rain.svg"),
    weatherCloud: owlpo("icons/icon_weather-cloud.svg"),
    more: owlpo("icons/icon_more.svg"),
  },
};
