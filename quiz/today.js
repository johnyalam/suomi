// quiz/today.js — start a study day
//
//   npm run day 5
//
// Prints the plan for that day (book pages, grammar, words, sentences, task)
// and creates today's journal file from a template if it doesn't exist yet.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "plan/plan.json"), "utf8"));

const n = Number(process.argv[2]);
const d = plan.days.find((x) => x.day === n);
if (!d) {
  console.error(`Usage: npm run day <1-${plan.days.length}>`);
  process.exit(1);
}

const pad = (x) => String(x).padStart(2, "0");
const vocabFile = `vocab/day-${pad(n)}.csv`;
const words = fs.existsSync(path.join(ROOT, vocabFile))
  ? fs
      .readFileSync(path.join(ROOT, vocabFile), "utf8")
      .split(/\r?\n/)
      .slice(1)
      .filter((l) => l.trim())
      .map((l) => l.split(","))
  : [];

console.log(`
═══ Päivä ${n} / ${plan.days.length} — ${d.title} ═══
📖 Book: ${d.chapter ? `Kappale ${d.chapter}, ` : ""}pages ${d.pages}
🎯 Theme: ${d.theme}
📐 Grammar: ${d.grammar}
   → notes in ${d.grammarFile}

📝 Words (${words.length}) in ${vocabFile}:
${words.map(([fi, en]) => `   ${fi.padEnd(22)} ${en}`).join("\n")}

💬 Model sentences:
${d.sentences.map((s) => `   • ${s}`).join("\n")}

✍️  Task: ${d.task}

Next:
   npm run quiz -- --day ${n}
   npm run quiz -- --day ${n} --reverse
   npm run progress
`);

// create the journal file for today
const now = new Date();
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const journalPath = path.join(ROOT, "journal", `${date}.md`);
if (fs.existsSync(journalPath)) {
  console.log(`Journal already exists: journal/${date}.md`);
} else {
  fs.mkdirSync(path.dirname(journalPath), { recursive: true });
  fs.writeFileSync(
    journalPath,
    `# ${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} — Päivä ${n}: ${d.title}

**Grammar:** ${d.grammar}

## Model sentences (copy, then change them to be about you)

${d.sentences.map((s) => `- ${s}`).join("\n")}

## Tehtävä (task)

${d.task}

<!-- write 3–5 sentences here -->


## New words I used

-

## Questions / mistakes

-

## Quiz score

- Day ${n}: __ / __
`
  );
  console.log(`Created journal/${date}.md — write your sentences there.`);
}
