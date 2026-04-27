const STORAGE_KEY = "owls-press-tag-seen-articles";

export function tagKeyForDispatch(q) {
  if (!q) return "Dispatch";
  if (q.type && q.type !== "Your Question") return q.type;
  return String(q.tag || "Dispatch");
}

export function articleTagLabel(q) {
  if (!q) return "Dispatch";
  if (q.type && q.type !== "Your Question") return q.type;
  return q.tag || "Dispatch";
}

/** Stable id for deduping the same dispatch across cards and user input. */
export function articleInstanceKey(q) {
  if (!q) return "unknown";
  if (q.id != null && q.id !== "") return `id:${q.id}`;
  const text = (q.text || "").trim();
  if (text) return `text:${text}`;
  return `t:${Date.now()}`;
}

/** @returns {Record<string, string[]>} tag -> counted dispatch keys */
export function loadTagSeenArticles() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

export function persistTagSeenArticles(v) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch (e) {}
}
