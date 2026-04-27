const MOCK_RESPONSES = {
  normal: {
    empathyLine1: "You do not need another list",
    empathyLine2: "You need one book with a",
    empathyRed: "job",
    empathyLine2After: ".",
    bookRec: {
      title: "Atomic Habits - James Clear",
      description: "A practical system for making small behaviors obvious, easy, and repeatable.",
    },
    bookSpineShort: "HABIT",
    chapterTag: "Recommended chapter · The 1 percent rule",
    body: [
      "The question is not whether you are motivated enough. Motivation is weather. A habit needs architecture. Atomic Habits is useful because it moves the problem out of personality and into design: make the cue visible, the action small, the reward immediate, and the environment harder to ignore.",
      "The most useful idea is that identity follows evidence. You do not become a runner by promising to run forever. You become one by collecting proof, one small repeatable act at a time. The goal is not intensity. The goal is a behavior so small it survives a bad day.",
      "For a U.S. reader drowning in apps, plans, and productivity advice, this book has a rare advantage: it is simple without being shallow. It gives you a way to start today without pretending your life is less crowded than it is.",
    ],
    bodyStrong1: "Design beats willpower",
    bodyStrong2: "Shrink the first move",
    bodyStrong3: "Let identity follow evidence",
    pullQuote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    pullQuote2: "Every action is a vote for the person you are becoming.",
    reflectionQuestions: [
      "What is the smallest version of this habit that still counts?",
      "Where could the cue live so you do not need to remember it?",
      "What proof do you need this week, not this year?",
    ],
    takeaways: [
      "Start with the environment, not the motivational speech.",
      "Make the first action small enough to survive a bad day.",
      "Track proof of identity, not perfection.",
      "A habit is built by reducing friction until repetition becomes normal.",
    ],
    recommendations: [
      {
        spine: "TINY",
        title: "Tiny Habits",
        author: "BJ Fogg",
        why: "If you want an even smaller behavior design method, this is the clearest next read.",
        color: "cobalt",
      },
      {
        spine: "FOCUS",
        title: "Deep Work",
        author: "Cal Newport",
        why: "If the habit is about attention rather than fitness, this gives you a stronger work container.",
        color: "teal",
      },
      {
        spine: "MIND",
        title: "Mindset",
        author: "Carol S. Dweck",
        why: "If shame keeps breaking the habit, this helps reframe practice as learning.",
        color: "coral",
      },
    ],
    inkReward: 40,
  },

  air: {
    empathyLine1: "Five books, one door open",
    empathyLine2: "",
    empathyRed: "open",
    empathyLine2After: "",
    bookRec: {
      title: "The Midnight Library - Matt Haig",
      description: "A readable novel about regret, choice, and the lives we imagine for ourselves.",
    },
    bookSpineShort: "OPEN",
    chapterTag: "Book Scout · Five quick picks",
    body: ["Here are five books with different doors into the question. Pick the one that feels useful tonight."],
    bodyStrong1: "Five starting points",
    pullQuote: "The right book is not always the biggest book. It is the one you will actually open.",
    pullQuote2: "",
    reflectionQuestions: ["Which of these feels like relief, and which feels like a challenge?"],
    takeaways: [
      "Book 1: The Midnight Library - a gentle entry into regret and alternate lives.",
      "Book 2: Man's Search for Meaning - meaning under pressure, without sentimentality.",
      "Book 3: The Art of Loving - relationships as practice, not luck.",
      "Book 4: The Psychology of Money - financial behavior without jargon.",
      "Book 5: The Shallows - attention, reading, and life after the feed.",
    ],
    recommendations: [
      { spine: "MEAN", title: "Man's Search for Meaning", author: "Viktor E. Frankl", why: "Best if the question is about endurance and purpose.", color: "cobalt" },
      { spine: "LOVE", title: "The Art of Loving", author: "Erich Fromm", why: "Best if the question is really about closeness and maturity.", color: "teal" },
      { spine: "MONEY", title: "The Psychology of Money", author: "Morgan Housel", why: "Best if the question touches anxiety, status, or financial security.", color: "coral" },
    ],
    inkReward: 20,
  },

  max: {
    empathyLine1: "Loneliness is not just absence",
    empathyLine2: "It may be a request for",
    empathyRed: "language",
    empathyLine2After: ".",
    bookRec: {
      title: "The Lonely City - Olivia Laing",
      description: "A searching book about art, isolation, and how private loneliness becomes visible.",
    },
    bookSpineShort: "CITY",
    chapterTag: "Deep Research · Loneliness and attention",
    body: [
      "Loneliness is often treated as a personal defect, but The Lonely City frames it as a human condition shaped by place, art, shame, and visibility. Laing is valuable because she does not rush to cure loneliness. She studies what it reveals: the ache to be seen, the fear of being seen wrongly, and the strange comfort of discovering that private pain has public forms.",
      "For a reader in the United States, where independence is often praised and isolation is often hidden, this matters. The problem may not be that you are failing socially. It may be that your life contains too few spaces where your full self can appear without performance. Books do not replace people, but they can give loneliness language before it finds company.",
    ],
    bodyStrong1: "Loneliness wants language",
    pullQuote: "Loneliness is personal, and it is also political.",
    pullQuote2: "Art can make isolation visible without making it smaller.",
    reflectionQuestions: [
      "Do you want more people, or do you want to be less edited around the people you know?",
      "Where in your week can you be seen without performing competence?",
      "What kind of company would make solitude feel chosen instead of imposed?",
    ],
    takeaways: [
      "Loneliness is not proof that something is wrong with you.",
      "The feeling often asks for language before it asks for a solution.",
      "A good book can reduce shame by making a private state visible.",
      "Connection requires spaces where performance can drop.",
      "Solitude becomes healthier when it is chosen, bounded, and meaningful.",
    ],
    recommendations: [
      { spine: "BELL", title: "All About Love", author: "bell hooks", why: "Best if loneliness is tied to how you define care, intimacy, and responsibility.", color: "cobalt" },
      { spine: "BOWL", title: "The Gift of Therapy", author: "Irvin D. Yalom", why: "Best if you want a humane clinical lens on isolation and connection.", color: "teal" },
      { spine: "WOLF", title: "A Room of One's Own", author: "Virginia Woolf", why: "Best if the question is about solitude, creative life, and independence.", color: "coral" },
      { spine: "CITY", title: "How to Do Nothing", author: "Jenny Odell", why: "Best if isolation is tangled with attention, platforms, and modern life.", color: "purple" },
    ],
    inkReward: 60,
  },
};

export async function askPressStreamMock(questionText, mode = "normal", onPartial) {
  const response = MOCK_RESPONSES[mode] || MOCK_RESPONSES.normal;
  const json = JSON.stringify(response);
  const totalChars = json.length;
  const chunkSize = Math.max(8, Math.floor(totalChars / 25));
  let delivered = 0;

  return new Promise((resolve) => {
    const tick = () => {
      delivered = Math.min(delivered + chunkSize + Math.floor(Math.random() * 12), totalChars);
      const partial = json.slice(0, delivered);

      let parsed = null;
      try {
        parsed = JSON.parse(partial);
      } catch {
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
        try { parsed = JSON.parse(text); } catch { /* skip */ }
      }

      if (parsed) {
        onPartial(parsed);
      }

      if (delivered >= totalChars) {
        onPartial(response);
        resolve(response);
      } else {
        setTimeout(tick, 80 + Math.random() * 120);
      }
    };

    setTimeout(tick, 400);
  });
}
