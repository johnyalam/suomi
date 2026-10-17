// plan/build.js — rebuilds plan/20-days.md from plan/plan.json and vocab/day-XX.csv
//
//   npm run plan
//
// Edit plan.json (pages, grammar, sentences, tasks), then run this.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "plan/plan.json"), "utf8"));
const pad = (n) => String(n).padStart(2, "0");

const vocab = (day) => {
  const f = path.join(ROOT, "vocab", `day-${pad(day)}.csv`);
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, "utf8").split(/\r?\n/).slice(1).filter((l) => l.trim()).map((l) => l.split(","));
};

const reviewRange = { 7: "1-6", 14: "8-13", 20: "20" };
const weeks = {
  1: "## Week 1 — Basics (Kappaleet 1–3)",
  8: "## Week 2 — Me, my day, my home (Kappaleet 4–6)",
  15: "## Week 3 — Out in the world (Kappaleet 7–9)",
};

const out = [
  `# 🗓️ 20-day plan — ${plan.book}`,
  "",
  "Each day = **book pages → grammar → new words → quiz → sentences → commit**.",
  "Start every day with `npm run day N`. Page numbers are the ones printed in the book (sivu).",
  "Exercise answers are at the back of the book, from p. 329 (*Harjoitusten ratkaisut*).",
  "",
  "| Day | Chapter | Topic | Pages | Grammar | Words |",
  "|---|---|---|---|---|---|",
];

for (const d of plan.days) {
  const ch = d.chapter ? `K${d.chapter}` : "Review";
  const g = d.grammar.split(" (")[0].split(":")[0];
  out.push(`| [${d.day}](#day-${d.day}) | ${ch} | ${d.theme} | ${d.pages} | ${g} | ${vocab(d.day).length} |`);
}
out.push("");

for (const d of plan.days) {
  if (weeks[d.day]) out.push(weeks[d.day], "");
  const words = vocab(d.day);
  const head = d.chapter ? `Kappale ${d.chapter}: *${d.title}*` : d.title;
  const review = reviewRange[d.day] ? ` · review: \`npm run quiz -- --review ${reviewRange[d.day]} --n 30\`` : "";
  out.push(
    `### Day ${d.day}`,
    "",
    `**${head}** · pages ${d.pages} · ${d.theme}`,
    "",
    `- [ ] 📖 **Book:** pages ${d.pages} — read the text, then do the exercises`,
    `- [ ] 📐 **Grammar:** ${d.grammar} → [\`${d.grammarFile}\`](../${d.grammarFile})`,
    `- [ ] 📝 **Words:** ${words.length} in [\`vocab/day-${pad(d.day)}.csv\`](../vocab/day-${pad(d.day)}.csv) — ${words
      .slice(0, 8)
      .map((w) => w[0])
      .join(", ")}${words.length > 8 ? "…" : ""}`,
    `- [ ] 🎯 **Quiz:** \`npm run quiz -- --day ${d.day}\`, then add \`--reverse\`${review}`,
    `- [ ] ✍️ **Sentences:** ${d.task}`,
    `- [ ] 📈 **Track:** \`npm run progress\` → commit \`day ${pad(d.day)}: ${d.theme.toLowerCase()}\``,
    "",
    "Model sentences:",
    "",
    ...d.sentences.map((s) => `> ${s}  `),
    ""
  );
}

fs.writeFileSync(path.join(ROOT, "plan/20-days.md"), out.join("\n"));
console.log(`Wrote plan/20-days.md (${plan.days.length} days)`);
