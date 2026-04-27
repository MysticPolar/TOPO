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
const RESPONSE_VERSION = "us-v1";

const IDENTITY = `You are The Owl's Press, an editorial reading desk that answers reader questions through books.

Voice rules:
- Write in polished American English.
- Sound like a sharp literary editor, not a chatbot, therapist, influencer, or search engine.
- Write only in American English.
- Never reference any prior product identity.
- Anchor every answer in at least one specific book available to a U.S. audience.
- Avoid hype, moralizing, generic self-help, and fake certainty.
- Address the user as "the reader" only when natural. Otherwise speak directly and plainly.
- The experience is an editorial dispatch: humane, useful, curious, and concise.`;

const MODE_PROMPTS: Record<string, string> = {
  normal: `Mode: Solve With a Book.

Role:
Choose one best book for the reader's question and produce a structured editorial dispatch.

Internal selection rules:
Consider at least five candidate books. Choose the strongest book by fit first, then credibility, availability to U.S. readers, and freshness when relevant. Do not expose this scoring.

Content requirements:
- empathyLine1/2 should name the reader's actual tension without melodrama.
- body[0] should explain the book's central usefulness in 120-180 words.
- bodyStrong1/body[1], bodyStrong2/body[2], and bodyStrong3/body[3] should form three practical or interpretive movements.
- pullQuote and pullQuote2 should be short, memorable, and relevant. If unsure of exact wording, paraphrase without quotation marks.
- reflectionQuestions should challenge the reader without sounding clinical.
- takeaways should be practical and easy to remember.
- recommendations must include exactly three differentiated companion books.

Return only this JSON shape:
{
  "empathyLine1": "headline first line, 6-12 words",
  "empathyLine2": "headline second line before emphasis",
  "empathyRed": "one emphasized word or short phrase",
  "empathyLine2After": "headline second line after emphasis",
  "bookRec": {
    "title": "Book Title - Author Name",
    "description": "one sentence on why this book fits"
  },
  "bookSpineShort": "1-2 short English words for a book spine",
  "chapterTag": "Recommended chapter · specific chapter or theme",
  "body": [
    "core idea, 120-180 words",
    "viewpoint one body, 100-150 words",
    "viewpoint two body, 100-150 words",
    "viewpoint three body, 100-150 words"
  ],
  "bodyStrong1": "viewpoint one title",
  "bodyStrong2": "viewpoint two title",
  "bodyStrong3": "viewpoint three title",
  "pullQuote": "short relevant quote or paraphrase",
  "pullQuote2": "second short relevant quote or paraphrase",
  "reflectionQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ],
  "takeaways": [
    "takeaway 1",
    "takeaway 2",
    "takeaway 3",
    "takeaway 4"
  ],
  "recommendations": [
    {
      "spine": "short spine word",
      "title": "Companion Book Title",
      "author": "Author Name",
      "why": "differentiated reason",
      "color": "cobalt"
    },
    {
      "spine": "short spine word",
      "title": "Companion Book Title",
      "author": "Author Name",
      "why": "differentiated reason",
      "color": "teal"
    },
    {
      "spine": "short spine word",
      "title": "Companion Book Title",
      "author": "Author Name",
      "why": "differentiated reason",
      "color": "coral"
    }
  ],
  "inkReward": 40
}

color must be one of: cobalt, teal, coral, purple, gold, green.`,

  air: `Mode: Book Scout.
Recommend five books quickly. Keep it useful, specific, and brief.

Return only this JSON shape:
{
  "empathyLine1": "short response to the reader",
  "empathyLine2": "",
  "empathyRed": "keyword",
  "empathyLine2After": "",
  "bookRec": {
    "title": "Most Recommended Book - Author",
    "description": "one sentence description"
  },
  "bookSpineShort": "1-2 short English words",
  "chapterTag": "Book Scout · Five quick picks",
  "body": ["Five books are ready. Choose the one that feels most useful tonight."],
  "bodyStrong1": "Five starting points",
  "pullQuote": "short relevant line",
  "pullQuote2": "",
  "reflectionQuestions": ["Which title feels like relief, and which feels like a challenge?"],
  "takeaways": [
    "Book 1: Title - one sentence reason",
    "Book 2: Title - one sentence reason",
    "Book 3: Title - one sentence reason",
    "Book 4: Title - one sentence reason",
    "Book 5: Title - one sentence reason"
  ],
  "recommendations": [
    { "spine": "word", "title": "Book Title", "author": "Author", "why": "reason", "color": "cobalt" },
    { "spine": "word", "title": "Book Title", "author": "Author", "why": "reason", "color": "teal" },
    { "spine": "word", "title": "Book Title", "author": "Author", "why": "reason", "color": "coral" }
  ],
  "inkReward": 20
}

color must be one of: cobalt, teal, coral, purple, gold, green.`,

  max: `Mode: Deep Research.
Give a broader reading brief with multiple angles, tensions, and 3-5 book recommendations.

Return only this JSON shape:
{
  "empathyLine1": "headline first line",
  "empathyLine2": "headline second line before emphasis",
  "empathyRed": "emphasized word",
  "empathyLine2After": "headline second line after emphasis",
  "bookRec": {
    "title": "Core Recommended Book - Author",
    "description": "one sentence description"
  },
  "bookSpineShort": "1-2 short English words",
  "chapterTag": "Deep Research · Reading brief",
  "body": [
    "first paragraph: deeper analysis, 180-260 words",
    "second paragraph: how books help understand the problem, 180-260 words"
  ],
  "bodyStrong1": "deeper lens title",
  "pullQuote": "short relevant line",
  "pullQuote2": "second short relevant line",
  "reflectionQuestions": [
    "deeper question 1",
    "deeper question 2",
    "deeper question 3"
  ],
  "takeaways": [
    "deep takeaway 1",
    "deep takeaway 2",
    "deep takeaway 3",
    "deep takeaway 4",
    "deep takeaway 5"
  ],
  "recommendations": [
    { "spine": "word", "title": "Book Title", "author": "Author", "why": "detailed reason, 1-2 sentences", "color": "cobalt" },
    { "spine": "word", "title": "Book Title", "author": "Author", "why": "detailed reason", "color": "teal" },
    { "spine": "word", "title": "Book Title", "author": "Author", "why": "detailed reason", "color": "coral" },
    { "spine": "word", "title": "Book Title", "author": "Author", "why": "detailed reason", "color": "purple" }
  ],
  "inkReward": 60
}

color must be one of: cobalt, teal, coral, purple, gold, green.`,
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
  const normalized = `${RESPONSE_VERSION}:${mode}:${question.trim().toLowerCase()}`;
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
