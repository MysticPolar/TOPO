import { askPressStreamMock } from "./gemini-mock.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const PROXY_URL = `${SUPABASE_URL}/functions/v1/gemini-proxy`;

const FALLBACK = {
  empathyLine1: "The press is offline for a moment",
  empathyLine2: "Your question has been",
  empathyRed: "saved",
  empathyLine2After: " for the next edition.",
  bookRec: {
    title: "How to Read a Book - Mortimer J. Adler and Charles Van Doren",
    description: "A durable guide to asking sharper questions and reading with purpose.",
  },
  bookSpineShort: "READ",
  chapterTag: "Recommended chapter · Analytical reading",
  body: [
    "The Owl's Press could not reach the live desk just now. That does not make your question smaller. Good questions often deserve a slower answer than the network is willing to provide.",
    "While the press resets, try naming what kind of help you need from a book: comfort, strategy, evidence, language, or a challenge. That one distinction usually improves the recommendation immediately.",
    "Reading is not a retreat from your life. It is a way to borrow another mind long enough to see your own situation with more structure.",
  ],
  bodyStrong1: "Name the job",
  bodyStrong2: "Ask for leverage",
  bodyStrong3: "Return with a sharper question",
  pullQuote: "The best book is the one that changes what you can notice.",
  pullQuote2: "",
  reflectionQuestions: [
    "What would a useful answer help you do tomorrow?",
    "Do you need comfort, strategy, evidence, language, or a challenge?",
    "Which part of the question are you avoiding because it is too specific?",
  ],
  takeaways: [
    "The live desk is unavailable, but the reading path remains open.",
    "A useful recommendation starts with the job you need the book to do.",
    "Clearer questions produce better books.",
  ],
  recommendations: [],
  inkReward: 10,
};

function softParse(partial) {
  if (!partial || partial.length < 2) return null;
  try { return JSON.parse(partial); } catch { /* continue */ }

  let text = partial;
  const unescapedQuotes = text.match(/(?<!\\)"/g) || [];
  if (unescapedQuotes.length % 2 !== 0) text += '"';

  const stack = [];
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && (i === 0 || text[i - 1] !== "\\")) { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    if (ch === "}" && stack.length && stack[stack.length - 1] === "{") stack.pop();
    if (ch === "]" && stack.length && stack[stack.length - 1] === "[") stack.pop();
  }

  while (stack.length) {
    const last = stack.pop();
    text += last === "{" ? "}" : "]";
  }

  try { return JSON.parse(text); } catch { return null; }
}

function normalizeResponse(parsed) {
  return {
    ...parsed,
    recommendations: (parsed.recommendations || []).map(r => ({
      spine: r.spine || "",
      title: r.title || "",
      author: r.author || "",
      why: r.why || "",
      color: r.color || "cobalt",
    })),
  };
}

export async function askPressStream(questionText, mode = "normal", onPartial) {
  if (USE_MOCK) {
    return askPressStreamMock(questionText, mode, onPartial);
  }

  if (!SUPABASE_URL) {
    console.warn("[owls-press] No VITE_SUPABASE_URL set, using fallback response");
    onPartial(FALLBACK);
    return FALLBACK;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  let res;
  try {
    res = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ question: questionText, mode }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("The press timed out. Please try again in a moment.");
    }
    throw err;
  }

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini proxy ${res.status}: ${errBody.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";
  let lastSnapshot = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        const event = JSON.parse(raw);
        const text = event.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) accumulated += text;
      } catch { /* skip malformed SSE lines */ }
    }

    const partial = softParse(accumulated);
    if (partial) {
      const snap = JSON.stringify(partial);
      if (snap !== lastSnapshot) {
        lastSnapshot = snap;
        onPartial(normalizeResponse(partial));
      }
    }
  }

  clearTimeout(timeoutId);

  let finalResult;
  try {
    finalResult = normalizeResponse(JSON.parse(accumulated));
  } catch {
    const soft = softParse(accumulated);
    finalResult = soft ? normalizeResponse(soft) : FALLBACK;
  }
  onPartial(finalResult);
  return finalResult;
}

export { FALLBACK };
