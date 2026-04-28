const STORAGE_KEY = "duleme-tag-seen-articles"; // legacy storage key, internal rename deferred

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

/** Stable id for deduping the same article: cards use id, input uses body text. */
export function articleInstanceKey(q) {
  if (!q) return "unknown";
  if (q.id != null && q.id !== "") return `id:${q.id}`;
  const zh = (q.zh || "").trim();
  if (zh) return `zh:${zh}`;
  return `t:${Date.now()}`;
}

/** @returns {Record<string, string[]>} tag -> list of article keys already counted toward the volume number */
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
