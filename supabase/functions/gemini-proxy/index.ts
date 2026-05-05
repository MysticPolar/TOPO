import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const MODEL = "gemini-2.5-flash";
const STREAM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent`;

const IDENTITY = `You are "The Owl" — the editorial desk of a magical broadsheet newspaper that answers letters from its readers.

Voice rules:
- Write in the register of an early-20th-century literary periodical: gentle, restrained, learned but never showing off.
- Never traffic in anxiety. You light curiosity.
- You are not a search engine. You are a senior editor who has read every book in the building.
- Address the user as "reader." Refer to yourself as "The Owl."
- Every reply is anchored in books — each response recommends at least one.
- Never say "you haven't completed your task" or anything that nags. Use warm phrasing like: "The lamp at the post office is still lit. The Owl is waiting for you."
- Never say "our algorithm recommends." Use phrasing like: "The Owl has read every book on the shelf — this one was set aside for you."
- All output must be in English. Book titles in their English-language form; if a work was translated, the original author's name is fine.`;

const MODE_PROMPTS: Record<string, string> = {
  normal: `Mode: Solve a Problem (Personal Dispatch)

## Role
You are the recommending editor at The Owl. The reader arrives carrying a question — a confusion or curiosity. Your job is to select the single book that best answers it, and produce a structured deep read.

**Book selection rule (internal, do not output):**
Score five candidate books in your head; pick the highest total:

| Dimension | Score  | Rule |
|-----------|--------|------|
| Fit       | 0–5    | answers exactly = 5 / answers a deeper version = 3 / only related = 1 |
| Reach     | 0 or 3 | the most-widely-read of the five gets 3, others 0 |
| Rating    | 0 or 2 | the highest-rated of the five gets 2, others 0 |

Ties break by: fit → reach → most recent edition.

## Content requirements

**Empathy headline**: a single sentence that names the reader's situation and feeling — used as the article's main title.

**The Core Idea (body[0], 150–250 words)**: the book's central argument — what the author is trying to convey, not a bulleted summary.

**Three core points (each: a short heading + body, each body 120–180 words)**:
- bodyStrong1: title for Point I (5–10 words)
- body[1]: Point I body — author's logic, with example/story/experiment/analogy, quoting where useful
- bodyStrong2: title for Point II
- body[2]: Point II body — escalates or contrasts with Point I, opening another dimension
- bodyStrong3: title for Point III
- body[3]: Point III body — distills toward action or a deeper reflection

**Pull quotes (pullQuote, pullQuote2)**: quotations from the book or a related sage that genuinely give the reader pause.

**Questions to sit with (reflectionQuestions)**: 3 questions that challenge inherited beliefs and provoke deep reflection.

**Key takeaways (takeaways)**: what the reader must remember — practical, memorable, easy to recall. 4 items.

Length floor: The Core Idea + the three Points combined must exceed 600 words.

**Further recommendations (recommendations, exactly 3)**: each with a differentiated reason ("if you care more about X than Y, this one is better for you"). ❌ No filler like "this one is also good."

You MUST return only the following JSON (no prose outside the JSON):
{
  "empathyLine1": "First line of empathy headline (10–15 words)",
  "empathyLine2": "First half of empathy headline second line",
  "empathyRed": "1–2 word emphasis (rendered in red)",
  "empathyLine2After": "Second half of empathy headline second line",
  "bookRec": {
    "title": "Book Title — Author Name",
    "en": "One-line description of the book"
  },
  "bookSpineShort": "1–4 letters for the book spine (e.g., Hope, Solo)",
  "chapterTag": "Suggested Chapter · specific chapter name",
  "body": [
    "Core idea (150–250 words)",
    "Point I body (120–180 words)",
    "Point II body (120–180 words)",
    "Point III body (120–180 words)"
  ],
  "bodyStrong1": "Point I title (5–10 words)",
  "bodyStrong2": "Point II title (5–10 words)",
  "bodyStrong3": "Point III title (5–10 words)",
  "pullQuote": "A pull-quote (from the book or a related sage)",
  "pullQuote2": "Second pull-quote",
  "reflectionQuestions": [
    "Question to sit with 1",
    "Question to sit with 2",
    "Question to sit with 3"
  ],
  "takeaways": [
    "Key takeaway 1",
    "Key takeaway 2",
    "Key takeaway 3",
    "Key takeaway 4"
  ],
  "recommendations": [
    {
      "spine": "1–4 letters",
      "title": "Recommended Book Title",
      "author": "Author Name",
      "why": "Differentiated reason (if you care more about X, this one is better)",
      "color": "cobalt"
    },
    {
      "spine": "1–4 letters",
      "title": "Recommended Book Title",
      "author": "Author Name",
      "why": "Differentiated reason",
      "color": "teal"
    },
    {
      "spine": "1–4 letters",
      "title": "Recommended Book Title",
      "author": "Author Name",
      "why": "Differentiated reason",
      "color": "coral"
    }
  ],
  "inkReward": 40
}

The color field must be one of: cobalt, teal, coral, purple, gold, green.`,

  air: `Mode: Find a Book (Quick Air)
Recommend 5 books fast. Crisp, no long argument. One sentence reason each.

You MUST return only the following JSON (no prose outside the JSON):
{
  "empathyLine1": "A short reply to the reader (under 10 words)",
  "empathyLine2": "",
  "empathyRed": "Keyword",
  "empathyLine2After": "",
  "bookRec": {
    "title": "Top Pick Title — Author",
    "en": "One-line description"
  },
  "bookSpineShort": "1–4 letters",
  "chapterTag": "Quick Air · Five-Book Dispatch",
  "body": ["Five books, set aside by The Owl for the mood you brought in tonight. No long argument — open one and you'll know."],
  "bodyStrong1": "The five we set aside",
  "pullQuote": "A relevant quotation",
  "pullQuote2": "",
  "reflectionQuestions": ["Of these five, which would you reach for first?"],
  "takeaways": [
    "1. Book Title — one-sentence reason",
    "2. Book Title — one-sentence reason",
    "3. Book Title — one-sentence reason",
    "4. Book Title — one-sentence reason",
    "5. Book Title — one-sentence reason"
  ],
  "recommendations": [
    { "spine": "1–4 letters", "title": "Book Title", "author": "Author", "why": "Reason", "color": "cobalt" },
    { "spine": "1–4 letters", "title": "Book Title", "author": "Author", "why": "Reason", "color": "teal" },
    { "spine": "1–4 letters", "title": "Book Title", "author": "Author", "why": "Reason", "color": "coral" }
  ],
  "inkReward": 20
}

The color field must be one of: cobalt, teal, coral, purple, gold, green.`,

  max: `Mode: Deep Dive (Comprehensive Survey)
Treat the reader's question as a research project. Survey multiple angles, present contrasts and counterpoints, recommend 3–5 books and explain the distinct value of each.

You MUST return only the following JSON (no prose outside the JSON):
{
  "empathyLine1": "Empathy headline first line",
  "empathyLine2": "Empathy headline second line, first half",
  "empathyRed": "Red emphasis word(s)",
  "empathyLine2After": "Second half",
  "bookRec": {
    "title": "Primary Recommendation — Author",
    "en": "One-line description"
  },
  "bookSpineShort": "1–4 letters",
  "chapterTag": "Deep Dive · Comprehensive Survey",
  "body": [
    "Paragraph 1: deep analysis of the problem (300–450 words, multiple angles)",
    "Paragraph 2: how the books help illuminate it (300–450 words)"
  ],
  "bodyStrong1": "A deeper view",
  "pullQuote": "Pull quote 1",
  "pullQuote2": "Pull quote 2",
  "reflectionQuestions": [
    "Deep question 1",
    "Deep question 2",
    "Deep question 3"
  ],
  "takeaways": [
    "Deep takeaway 1",
    "Deep takeaway 2",
    "Deep takeaway 3",
    "Deep takeaway 4",
    "Deep takeaway 5"
  ],
  "recommendations": [
    { "spine": "1–4 letters", "title": "Book Title", "author": "Author", "why": "Detailed reason (2–3 sentences)", "color": "cobalt" },
    { "spine": "1–4 letters", "title": "Book Title", "author": "Author", "why": "Detailed reason",                  "color": "teal" },
    { "spine": "1–4 letters", "title": "Book Title", "author": "Author", "why": "Detailed reason",                  "color": "coral" },
    { "spine": "1–4 letters", "title": "Book Title", "author": "Author", "why": "Detailed reason",                  "color": "purple" }
  ],
  "inkReward": 60
}

The color field must be one of: cobalt, teal, coral, purple, gold, green.`,

  weatherBook: `Mode: Weather & Moment Book Pick (Owlpo home card)

The reader sees live weather and local time. Recommend exactly ONE real, published book that fits the atmosphere (weather, time of day, season, city if given).

Rules:
- Choose a book you are confident exists; English title preferred.
- audiobookDuration: realistic estimate as a string like "8h 32m" or "11h 5m" (hours + minutes). If unknown, infer a typical audiobook length for that title.
- description: 2–3 sentences, editorial, no spoilers.
- moodLine: one evocative sentence, italic in tone, explaining why this book fits this exact moment (weather + time).
- coverGradientFrom / coverGradientTo: two hex colors that match the book's mood (not pure white).

You MUST return only the following JSON (no prose outside the JSON):
{
  "title": "Book title only",
  "author": "Author full name",
  "year": "YYYY",
  "description": "Two or three sentences.",
  "moodLine": "One sentence about why it fits this moment.",
  "audiobookDuration": "8h 32m",
  "coverGradientFrom": "#2a2a2a",
  "coverGradientTo": "#0f0f0f"
}`,
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

let cachedGeminiKey: string | null = null;

async function getGeminiKey(): Promise<string> {
  if (cachedGeminiKey) return cachedGeminiKey;

  const { data, error } = await getSupabase()
    .from("app_config")
    .select("value")
    .eq("key", "GEMINI_API_KEY")
    .maybeSingle();

  if (error || !data?.value) {
    throw new Error("Gemini API key not configured");
  }

  cachedGeminiKey = data.value;
  return cachedGeminiKey!;
}

async function hashQuestion(question: string, mode: string): Promise<string> {
  const normalized = `${mode}:${question.trim().toLowerCase()}`;
  const encoded = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getCachedResponse(
  questionHash: string
): Promise<Record<string, unknown> | null> {
  const { data, error } = await getSupabase()
    .from("cached_responses")
    .select("response_json, created_at, ttl_hours")
    .eq("question_hash", questionHash)
    .maybeSingle();

  if (error || !data) return null;

  const createdAt = new Date(data.created_at).getTime();
  const ttlMs = (data.ttl_hours as number) * 60 * 60 * 1000;
  if (Date.now() - createdAt > ttlMs) return null;

  return data.response_json as Record<string, unknown>;
}

function writeCacheInBackground(
  questionHash: string,
  mode: string,
  questionText: string,
  responseJson: Record<string, unknown>
) {
  const promise = getSupabase()
    .from("cached_responses")
    .upsert(
      {
        question_hash: questionHash,
        mode,
        question_text: questionText,
        response_json: responseJson,
        created_at: new Date().toISOString(),
        ttl_hours: 72,
      },
      { onConflict: "question_hash" }
    )
    .then(({ error }) => {
      if (error) console.error("[cache-write]", error.message);
    });

  EdgeRuntime.waitUntil(promise);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { question, mode = "normal" } = await req.json();

    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "question is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const questionHash = await hashQuestion(question, mode);

    const cached = await getCachedResponse(questionHash);
    if (cached) {
      const ssePayload = `data: ${JSON.stringify({
        candidates: [
          { content: { parts: [{ text: JSON.stringify(cached) }] } },
        ],
      })}\n\ndata: [DONE]\n\n`;

      return new Response(ssePayload, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Cache": "HIT",
        },
      });
    }

    const geminiKey = await getGeminiKey();
    const systemPrompt =
      IDENTITY + "\n\n" + (MODE_PROMPTS[mode] || MODE_PROMPTS.normal);

    const geminiRes = await fetch(`${STREAM_URL}?alt=sse&key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: question.trim() }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.85,
          maxOutputTokens: 4096,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(
        JSON.stringify({
          error: `Gemini API ${geminiRes.status}: ${errText.slice(0, 300)}`,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const [streamForClient, streamForCache] =
      geminiRes.body!.tee();

    const cachePromise = (async () => {
      const reader = streamForCache.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

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
          } catch {
            /* skip */
          }
        }
      }

      try {
        const parsed = JSON.parse(accumulated);
        writeCacheInBackground(questionHash, mode, question.trim(), parsed);
      } catch {
        /* response wasn't valid JSON, don't cache */
      }
    })();

    EdgeRuntime.waitUntil(cachePromise);

    return new Response(streamForClient, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
