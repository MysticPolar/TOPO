const KEY = "owls-press-software-created-at";

export function readSoftwareCreatedAt(fallback = "2025-01-01") {
  if (typeof window === "undefined") return fallback;
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    const d = new Date().toISOString().slice(0, 10);
    localStorage.setItem(KEY, d);
    return d;
  } catch (e) {
    return fallback;
  }
}
