// Derived numbers: what's done, how many words, streak, learning curve.
import { DAYS, TOTAL_DAYS } from "../../data/curriculum.js";
import { dayKey } from "./storage.js";

export const CHECKS = [
  { id: "grammar", fi: "Kielioppi", en: "Grammar read" },
  { id: "words", fi: "Sanat", en: "Words learned" },
  { id: "quiz", fi: "Visa", en: "Quiz passed" },
  { id: "sentences", fi: "Lauseet", en: "Sentences written" },
];

export const PASS_MARK = 60;

export const dayProgress = (state, n) => state.days[dayKey(n)] || {};

export const checksDone = (state, n) => CHECKS.filter((c) => dayProgress(state, n)[c.id]).length;

export const isComplete = (state, n) => checksDone(state, n) === CHECKS.length;

export const knownCount = (state, n) => (dayProgress(state, n).known || []).length;

export function completedDays(state) {
  return DAYS.filter((d) => isComplete(state, d.day)).map((d) => d.day);
}

export function wordsLearned(state) {
  return DAYS.reduce((n, d) => n + knownCount(state, d.day), 0);
}

export function nextDay(state) {
  const d = DAYS.find((x) => !isComplete(state, x.day));
  return d ? d.day : null;
}

export function averageScore(state) {
  const s = DAYS.map((d) => dayProgress(state, d.day).score).filter((x) => typeof x === "number");
  return s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : null;
}

export const isoDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Consecutive study days ending today (or yesterday, so the streak survives until you study today). */
export function streak(state) {
  const dates = new Set(state.profile.studyDates || []);
  if (!dates.size) return 0;
  const cursor = new Date();
  if (!dates.has(isoDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (dates.has(isoDate(cursor))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

/** One point per day: words planned so far vs words you marked as known, plus the quiz score. */
export function learningCurve(state) {
  let planned = 0;
  let known = 0;
  return DAYS.map((d) => {
    planned += d.words.length;
    known += knownCount(state, d.day);
    const p = dayProgress(state, d.day);
    return {
      day: d.day,
      planned,
      known,
      touched: Object.keys(p).some((k) => k !== "updated" && p[k]),
      score: typeof p.score === "number" ? p.score : null,
    };
  });
}

export const percentDone = (state) => Math.round((completedDays(state).length / TOTAL_DAYS) * 100);
