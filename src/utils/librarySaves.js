// ═══════════════════════════════════════════════════════════════
// Owlpo · Books saved from the home weather card → Library shelf
// ═══════════════════════════════════════════════════════════════

const KEY = "duleme-owlpo-library-saves";

/** @returns {object[]} */
export function loadLibrarySaves() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function persist(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch { /* quota */ }
}

export function isBookOnShelf(title, author) {
  const t = (title || "").trim().toLowerCase();
  const a = (author || "").trim().toLowerCase();
  if (!t) return false;
  return loadLibrarySaves().some(
    (x) => (x.title || "").trim().toLowerCase() === t && (x.author || "").trim().toLowerCase() === a,
  );
}

/**
 * @param {{ title: string, author: string, year?: string, description?: string, readTime?: string }} pick
 * @returns {object} saved article row (ReadingScreen card shape)
 */
export function addLibrarySave(pick) {
  const title = (pick.title || "").trim();
  const author = (pick.author || "").trim();
  if (!title || !author) return null;

  const article = {
    id: `owlpo-saved-${Date.now()}`,
    title,
    en: `${title} — ${author}`,
    author,
    date: "Owlpo shelf",
    tag: "Saved",
    color: "gold",
    readTime: pick.readTime || "—",
    preview: (pick.description || "").slice(0, 280),
  };

  const prev = loadLibrarySaves().filter(
    (x) => (x.title || "").trim().toLowerCase() !== title.toLowerCase()
      || (x.author || "").trim().toLowerCase() !== author.toLowerCase(),
  );
  persist([article, ...prev].slice(0, 60));
  try {
    window.dispatchEvent(new Event("duleme-library-updated"));
  } catch { /* */ }
  return article;
}

export function removeLibrarySave(id) {
  persist(loadLibrarySaves().filter((x) => x.id !== id));
  try {
    window.dispatchEvent(new Event("duleme-library-updated"));
  } catch { /* */ }
}
