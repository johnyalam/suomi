// scripts/build-data.mjs — merges the book plan and your original curriculum
//
// Inputs (repo root):
//   plan/plan.json                 the 20-day Suomen mestari 1 plan
//   vocab/day-XX.csv               the book-aligned words for each day
//   web/src/data/legacy-curriculum.json   your original 20 days (words, grammar, quizzes)
//   web/src/data/merge-map.json    which of your days goes into which book day
// Output:
//   web/src/data/curriculum.json   what the React app imports
//
// Runs automatically before `npm run dev` and `npm run build`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(WEB, "..");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const pad = (n) => String(n).padStart(2, "0");

const plan = read(path.join(ROOT, "plan/plan.json"));
const legacy = read(path.join(WEB, "src/data/legacy-curriculum.json"));
const map = read(path.join(WEB, "src/data/merge-map.json"));

// "Mitä kuuluu?" and "mitä kuuluu" are the same word
const norm = (s) => s.toLowerCase().replace(/[?!.,]/g, "").trim();

function readCsv(day) {
  const f = path.join(ROOT, "vocab", `day-${pad(day)}.csv`);
  if (!fs.existsSync(f)) return [];
  return fs
    .readFileSync(f, "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter((l) => l.trim())
    .map((l) => {
      const [fi, en, ...rest] = l.split(",");
      return { fi: fi.trim(), en: en.trim(), exampleFi: rest.join(",").trim(), source: "book" };
    });
}

const days = plan.days.map((d) => {
  const fromYours = legacy.filter((l) => map.days[String(l.day)] === d.day);
  const words = readCsv(d.day);
  const seen = new Set(words.map((w) => norm(w.fi)));
  for (const l of fromYours) {
    for (const v of l.vocab) {
      if (seen.has(norm(v.fi))) {
        // same word: keep the book entry, borrow your phonetic and translation of the example
        const w = words.find((x) => norm(x.fi) === norm(v.fi));
        w.phonetic ??= v.phonetic;
        if (!w.exampleEn && w.exampleFi === v.exampleFi) w.exampleEn = v.exampleEn;
        continue;
      }
      seen.add(norm(v.fi));
      words.push({ fi: v.fi, en: v.en, exampleFi: v.exampleFi, exampleEn: v.exampleEn, phonetic: v.phonetic, source: "yours" });
    }
  }
  return {
    day: d.day,
    chapter: d.chapter,
    title: d.title,
    theme: d.theme,
    category: map.categories[String(d.day)],
    pages: d.pages,
    grammar: d.grammar,
    grammarFile: d.grammarFile,
    sentences: d.sentences,
    task: d.task,
    words,
    lessons: fromYours.map((l) => ({ fromDay: l.day, title: l.title, subtitle: l.subtitle, html: l.grammar })),
    quiz: fromYours.flatMap((l) => l.quiz.map((q) => ({ ...q, fromDay: l.day }))),
  };
});

fs.writeFileSync(path.join(WEB, "src/data/curriculum.json"), JSON.stringify({ book: plan.book, days }, null, 2));
const words = days.reduce((a, d) => a + d.words.length, 0);
const quiz = days.reduce((a, d) => a + d.quiz.length, 0);
console.log(`curriculum.json: ${days.length} days, ${words} words, ${quiz} hand-written quiz questions`);
