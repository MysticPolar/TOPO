// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · localStorage Persistence
// ═══════════════════════════════════════════════════════════════

const STATS_KEY = "duleme-user-stats";

export function loadUserStats(defaults) {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

export function saveUserStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch { /* quota exceeded — silent for MVP */ }
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
