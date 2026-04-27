const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const DEVICE_ID_KEY = "owls-press-device-id";

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function headers(extra = {}) {
  return {
    "apikey": ANON_KEY,
    "Authorization": `Bearer ${ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function rest(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: headers(opts.headers || {}),
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

export async function saveReadingEntry({ question_text = "", book_title = "", book_author = "", tag = "", color = "" } = {}) {
  const device_id = getDeviceId();
  const date = new Date().toISOString().slice(0, 10);
  return rest("/reading_history", {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify({ device_id, date, question_text, book_title, book_author, tag, color }),
  });
}

export async function fetchReadingHistory() {
  const device_id = getDeviceId();
  return rest(`/reading_history?device_id=eq.${device_id}&order=created_at.desc`);
}

export async function saveCollection({ type = "dispatch", title = "", subtitle = "", content = "", tag = "", color = "" } = {}) {
  const device_id = getDeviceId();
  return rest("/collections", {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify({ device_id, type, title, subtitle, content, tag, color }),
  });
}

export async function fetchCollections() {
  const device_id = getDeviceId();
  return rest(`/collections?device_id=eq.${device_id}&order=created_at.desc`);
}

export async function deleteCollection(id) {
  return rest(`/collections?id=eq.${id}`, { method: "DELETE" });
}
