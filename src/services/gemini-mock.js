const MOCK_RESPONSES = {
  normal: {
    empathyLine1: "Everyone, in some late hour,",
    empathyLine2: "has asked: is this path",
    empathyRed: "worth",
    empathyLine2After: " staying on?",
    bookRec: {
      title: "The Courage to Be Disliked — Ichiro Kishimi & Fumitake Koga",
      en: "A dialogue on Adlerian psychology that frees you from the need for approval.",
    },
    bookSpineShort: "Courage",
    chapterTag: "Suggested Chapter · Night Three: Let those who interfere with your life go to hell",
    body: [
      "The Owl has read this letter many times. The trouble isn't that you're not trying hard enough. It's that you've mistaken other people's expectations for your own map. The sharpest blade in Adlerian psychology is the principle of separation of tasks — your life's task has nothing to do with how others judge you. Kishimi frames it through a young man and a philosopher, and the conversation lands gently but absolutely. You don't need everyone to like you. You need the courage to be disliked.",
      "What makes the book unusual is what it refuses to do: it doesn't sell anxiety, and it doesn't promise a quick cure. The philosopher returns again and again to a single sentence: change begins now. Not tomorrow, not when you're ready — now. Many readers keep the book by the bed. Open any page on a hard night and a sentence is waiting that quiets the room.",
    ],
    bodyStrong1: "Change begins now",
    pullQuote: "What determines us is not the experience itself, but the meaning we give it.",
    pullQuote2: "It is not the world that is complicated; it is you who has made it complicated.",
    reflectionQuestions: [
      "The opinion you most fear right now — is it actually your task to manage?",
      "If no one were ever going to evaluate you, what would you most want to do?",
      "Are you willing to trade being liked for being yourself?",
    ],
    takeaways: [
      "Separation of tasks: distinguish what is yours to carry from what is theirs.",
      "Self-acceptance is not self-affirmation — it's accepting the imperfect self.",
      "The end goal of relationships is community feeling, not competition.",
      "The courage to be happy is the courage to live an ordinary life.",
    ],
    recommendations: [
      {
        spine: "Free",
        title: "Escape from Freedom",
        author: "Erich Fromm",
        why: "If you want a deeper read on why we crave freedom and fear it in equal measure.",
        color: "cobalt",
      },
      {
        spine: "Mean",
        title: "Man's Search for Meaning",
        author: "Viktor Frankl",
        why: "Meaning found inside extreme suffering — stronger than any inspirational poster.",
        color: "teal",
      },
      {
        spine: "Flow",
        title: "Flow",
        author: "Mihaly Csikszentmihalyi",
        why: "Once you find a task that's truly yours, this teaches you how to lose yourself inside it.",
        color: "coral",
      },
    ],
    inkReward: 40,
  },

  air: {
    empathyLine1: "Five books, set aside for tonight.",
    empathyLine2: "",
    empathyRed: "set aside",
    empathyLine2After: "",
    bookRec: {
      title: "The Little Prince — Antoine de Saint-Exupéry",
      en: "The little prince who taught the world to see with the heart.",
    },
    bookSpineShort: "Star",
    chapterTag: "Quick Air · Five-Book Dispatch",
    body: ["Five books from the Owl's stacks for the mood you've brought in tonight. No long argument — open one and you'll know."],
    bodyStrong1: "The five we've set aside",
    pullQuote: "What is essential is invisible to the eye.",
    pullQuote2: "",
    reflectionQuestions: ["Of these five, which would you reach for first?"],
    takeaways: [
      "1. The Little Prince — answers an adult's questions with a child's voice.",
      "2. The Moon and Sixpence — the eternal pull between ideal and reality.",
      "3. No Longer Human — radical honesty as another kind of courage.",
      "4. Totto-Chan: The Little Girl at the Window — education begins by seeing each child.",
      "5. The Alchemist — when you truly want something, the universe conspires to help.",
    ],
    recommendations: [
      { spine: "Moon",  title: "The Moon and Sixpence",          author: "W. Somerset Maugham", why: "Before asking “is it worth it,” ask if you have the courage.", color: "cobalt" },
      { spine: "Hum.",  title: "No Longer Human",                author: "Osamu Dazai",         why: "Don't fear the dark — some books are meant to be read inside it.", color: "teal" },
      { spine: "Totto", title: "Totto-Chan: The Little Girl",    author: "Tetsuko Kuroyanagi",  why: "A warm book for any tired night.",                                  color: "coral" },
    ],
    inkReward: 20,
  },

  max: {
    empathyLine1: "On the matter of solitude —",
    empathyLine2: "the answer is not far away. It is between",
    empathyRed: "the pages",
    empathyLine2After: ".",
    bookRec: {
      title: "One Hundred Years of Solitude — Gabriel García Márquez",
      en: "Seven generations of solitude — a mirror for every human who has ever felt alone.",
    },
    bookSpineShort: "Solo",
    chapterTag: "Deep Dive · Comprehensive Survey",
    body: [
      "Loneliness is not a disease. It is the basic condition of human existence. From existentialism to psychoanalysis, from Eastern Zen to Western psychotherapy, nearly every serious tradition has answered the same question: how does a person live with their own solitude? García Márquez tells us, through seven generations of the Buendía family — that is, all of humanity — that solitude is not a personal flaw. It is a shared inheritance. When Colonel Aureliano sits in silence before his small gold fishes, you realize: solitude is the most loyal companion of creativity.",
      "But to read solitude only through literature is too thin. Donald Winnicott, in The Capacity to Be Alone, makes a startling claim: the ability to be alone is, paradoxically, evidence that you were sufficiently accompanied early in life. The capacity for solitude is not coldness — it's the proof of an inner abundance. Echoing him from a different tradition, Chiang Hsun's Six Lectures on Solitude reframes solitude across erotic, linguistic, revolutionary, and other dimensions, restoring its aesthetic value. The Owl's advice: don't rush to “cure” solitude. Learn to taste it first.",
    ],
    bodyStrong1: "The capacity to be alone is evidence of inner abundance",
    pullQuote: "Every brilliance life ever gave us, in the end, must be repaid with loneliness.",
    pullQuote2: "Solitude is one person's carnival. Carnival is a crowd's solitude.",
    reflectionQuestions: [
      "When did you last enjoy solitude — rather than endure it?",
      "If solitude were a capacity rather than a deficit, how would that change how you spend your alone time?",
      "Which of the most important ideas in your life arrived in solitude?",
    ],
    takeaways: [
      "Solitude is the basic condition of being human, not a problem to be repaired.",
      "The capacity to be alone is rooted in early experiences of being well-attended.",
      "Literary solitude turns private feeling into shared human experience.",
      "Eastern traditions (Zen, Daoism) are better than the West at converting solitude into beauty.",
      "The highest social skill is the ability to be at ease alone.",
    ],
    recommendations: [
      { spine: "Six",  title: "Six Lectures on Solitude",          author: "Chiang Hsun",         why: "Six dimensions to redefine solitude. Chiang's prose is gentle as jade — read it slowly on a quiet night. This isn't a cure for solitude; it teaches you to admire it.", color: "cobalt" },
      { spine: "Cap.", title: "The Capacity to Be Alone",          author: "D. W. Winnicott",     why: "Psychoanalysis on solitude. A short essay that overturns the equation of alone-ness with ill-health.",                                                                color: "teal" },
      { spine: "Zen",  title: "Zen and the Art of Motorcycle Maintenance", author: "Robert Pirsig", why: "A man's solo road trip; deep meditation on quality, reason, and romance. A gospel for the well-companioned alone.",                                                       color: "coral" },
      { spine: "Wood", title: "Norwegian Wood",                    author: "Haruki Murakami",     why: "Murakami's gentlest take on solitude. “Death is not the opposite of life, but a part of it.”",                                                                            color: "green" },
    ],
    inkReward: 60,
  },
};

export async function askOwleryStreamMock(questionText, mode = "normal", onPartial) {
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
          if (ch === '"' && (i === 0 || text[i - 1] !== '\\')) { inString = !inString; continue; }
          if (inString) continue;
          if (ch === '{' || ch === '[') stack.push(ch);
          if (ch === '}' && stack.length && stack[stack.length - 1] === '{') stack.pop();
          if (ch === ']' && stack.length && stack[stack.length - 1] === '[') stack.pop();
        }
        while (stack.length) {
          const last = stack.pop();
          text += last === '{' ? '}' : ']';
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
