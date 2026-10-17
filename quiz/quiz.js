// quiz/quiz.js — a tiny Finnish flashcard quiz for the terminal
//
// Usage (from the repo root):
//   node quiz/quiz.js              → 10 questions, Finnish → English
//   node quiz/quiz.js --reverse    → English → Finnish
//   node quiz/quiz.js --n 20       → 20 questions
//   node quiz/quiz.js --file food  → only vocab/*food*.csv
//
// Vocab CSV format (vocab/*.csv), first line is the header:
//   finnish,english,example
//   kiitos,thank you/thanks,Kiitos paljon!
// Use "/" to allow several correct answers.

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VOCAB_DIR = path.join(ROOT, "vocab");
const PROGRESS_FILE = path.join(ROOT, "progress.json");

// ---------- command-line options ----------
const args = process.argv.slice(2);
const reverse = args.includes("--reverse");
const n = Number(args[args.indexOf("--n") + 1]) || 10;
const fileFilter = args.includes("--file") ? args[args.indexOf("--file") + 1] : "";

// ---------- load words ----------
function loadWords() {
  if (!fs.existsSync(VOCAB_DIR)) {
    console.error(`No vocab folder found at ${VOCAB_DIR}`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(VOCAB_DIR)
    .filter((f) => f.endsWith(".csv") && f.includes(fileFilter));

  const words = [];
  for (const file of files) {
    const lines = fs.readFileSync(path.join(VOCAB_DIR, file), "utf8").split(/\r?\n/);
    for (const line of lines.slice(1)) {          // skip header
      if (!line.trim()) continue;
      // split on the first two commas only, so the example may contain commas
      const [finnish, english, ...rest] = line.split(",");
      if (!finnish || !english) continue;
      words.push({
        finnish: finnish.trim(),
        english: english.trim(),
        example: rest.join(",").trim(),
      });
    }
  }
  return words;
}

// ---------- progress (right/wrong counts per word) ----------
function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2) + "\n");
}

// Words you get wrong more often are picked more often.
function weightOf(word, progress) {
  const p = progress[word.finnish] ?? { right: 0, wrong: 0 };
  return (p.wrong + 1) / (p.right + 1);
}

function pickWeighted(words, progress) {
  const total = words.reduce((sum, w) => sum + weightOf(w, progress), 0);
  let r = Math.random() * total;
  for (const w of words) {
    r -= weightOf(w, progress);
    if (r <= 0) return w;
  }
  return words[words.length - 1];
}

// ---------- answer checking ----------
const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

function isCorrect(answer, expected) {
  return expected.split("/").some((option) => normalize(option) === normalize(answer));
}

// ---------- main ----------
const words = loadWords();
if (words.length === 0) {
  console.error("No words found. Add some to vocab/*.csv first.");
  process.exit(1);
}

const progress = loadProgress();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const lines = rl[Symbol.asyncIterator]();

// Ask a question and wait for one line; returns null if input ends (Ctrl+D).
async function ask(prompt) {
  process.stdout.write(prompt);
  const { value, done } = await lines.next();
  if (!process.stdin.isTTY && !done) console.log(value); // echo when input is piped
  return done ? null : value;
}

console.log(`\n🇫🇮  ${words.length} words loaded. ${n} questions. Type "q" to quit.\n`);

let score = 0;
let asked = 0;
let last = null;

for (let i = 0; i < n; i++) {
  // avoid asking the same word twice in a row
  let word = pickWeighted(words, progress);
  if (words.length > 1) while (word === last) word = pickWeighted(words, progress);
  last = word;

  const question = reverse ? word.english : word.finnish;
  const expected = reverse ? word.finnish : word.english;

  const answer = await ask(`${i + 1}. ${question} → `);
  if (answer === null || answer.trim().toLowerCase() === "q") break;
  asked++;

  const p = (progress[word.finnish] ??= { right: 0, wrong: 0 });
  if (isCorrect(answer, expected)) {
    score++;
    p.right++;
    console.log("   ✅ Oikein!");
  } else {
    p.wrong++;
    console.log(`   ❌ Väärin. Answer: ${expected}`);
  }
  if (word.example) console.log(`   💬 ${word.example}`);
  console.log();
}

rl.close();
saveProgress(progress);

console.log(`Score: ${score}/${asked}`);

// show your 5 hardest words
const hardest = Object.entries(progress)
  .filter(([, p]) => p.wrong > 0)
  .sort(([, a], [, b]) => b.wrong - b.right - (a.wrong - a.right))
  .slice(0, 5);
if (hardest.length) {
  console.log("\nWords to review:");
  for (const [fi, p] of hardest) console.log(`  ${fi}  (✅ ${p.right}  ❌ ${p.wrong})`);
}
