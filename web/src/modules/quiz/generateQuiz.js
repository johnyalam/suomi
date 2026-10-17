// Builds a fresh quiz for a day: questions generated from its words,
// plus the hand-written questions from your original curriculum.
import { DAYS, getDay } from "../../data/curriculum.js";

const shuffle = (a) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};
const pick = (a, n) => shuffle(a).slice(0, n);
const clean = (s) => s.toLowerCase().replace(/[?!.,]/g, "").replace(/\s+/g, " ").trim();
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Review days quiz the whole week; other days quiz their own words. */
function wordPool(n) {
  const range = { 7: [1, 7], 14: [8, 14], 20: [1, 20] }[n];
  if (!range) return getDay(n).words;
  return DAYS.filter((d) => d.day >= range[0] && d.day <= range[1]).flatMap((d) => d.words);
}

function options(correct, pool, key) {
  // never offer two options that read the same ("What?" and "what")
  const seen = new Set([clean(correct)]);
  const others = [];
  for (const v of shuffle(pool.map((w) => w[key]))) {
    const c = clean(v);
    const overlaps = [...seen].some((s) => s === c || s.split("/").some((p) => c.split("/").includes(p.trim())));
    if (!overlaps) {
      seen.add(c);
      others.push(v);
    }
    if (others.length === 3) break;
  }
  const opts = shuffle([correct, ...others]);
  return { options: opts, correct: opts.indexOf(correct) };
}

export function generateQuiz(n) {
  const day = getDay(n);
  const pool = wordPool(n);
  const distractors = pool.length >= 8 ? pool : DAYS.flatMap((d) => d.words);
  const chosen = pick(pool, Math.min(9, pool.length));
  const qs = [];

  chosen.slice(0, 4).forEach((w) =>
    qs.push({
      type: "mc",
      question: `What does “${w.fi}” mean?`,
      ...options(w.en, distractors, "en"),
      explanation: w.exampleFi ? `${w.exampleFi}${w.exampleEn ? ` — ${w.exampleEn}` : ""}` : "",
      word: w.fi,
    })
  );
  chosen.slice(4, 7).forEach((w) =>
    qs.push({
      type: "mc",
      question: `How do you say “${w.en}” in Finnish?`,
      ...options(w.fi, distractors, "fi"),
      explanation: w.exampleFi || "",
      word: w.fi,
    })
  );
  chosen.slice(7, 9).forEach((w) =>
    qs.push({
      type: "fitb",
      question: `Type the Finnish word for “${w.en}”`,
      correctAnswer: w.fi.split("/")[0].trim(),
      explanation: w.exampleFi || "",
      word: w.fi,
    })
  );

  // a sentence with one word missing, from the day's example sentences
  const withSentence = shuffle(pool).find(
    (w) => w.exampleFi && !w.fi.includes(" ") && new RegExp(`(^|[\\s,!?.])${escapeRe(w.fi)}($|[\\s,!?.])`, "i").test(w.exampleFi)
  );
  if (withSentence) {
    const blanked = withSentence.exampleFi.replace(new RegExp(escapeRe(withSentence.fi), "i"), "_____");
    qs.push({
      type: "mc",
      question: `Complete the sentence: “${blanked}”`,
      ...options(withSentence.fi, distractors, "fi"),
      explanation: withSentence.exampleFi,
      word: withSentence.fi,
    });
  }

  return [...qs, ...day.quiz.map((q) => ({ ...q, yours: true }))];
}

export const checkAnswer = (q, answer) =>
  q.type === "mc" ? answer === q.correct : typeof answer === "string" && clean(answer) === clean(q.correctAnswer);
