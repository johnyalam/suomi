# 🇫🇮 Suomi — learning Finnish, one commit a day

This repo is my Finnish study log. Every day I add vocabulary, write a few
sentences in Finnish, and commit. The GitHub contribution graph is my streak.

## Goals

- [ ] **A1** — greetings, numbers, food, shopping, basic present tense
- [ ] **A2** — all six verb types, the main cases, past tense, small talk
- [ ] **B1** — read Yle Selkouutiset comfortably, hold everyday conversations (YKI level)

**Current level:** A1 (starting)

## Daily loop (15–30 min)

1. Add 5–10 words to a file in `vocab/`
2. Run the quiz: `npm run quiz`
3. Write 3–5 sentences in today's `journal/` file, using the new words
4. Commit and push

```bash
git add .
git commit -m "vocab: food words (+8)"
git push
```

### Commit message style

| Prefix | Use for | Example |
|---|---|---|
| `vocab:` | new words | `vocab: kitchen words (+8)` |
| `grammar:` | grammar notes | `grammar: partitive rules` |
| `journal:` | daily writing | `journal: day 12` |
| `reading:` | words from articles | `reading: Selkouutiset 17.10.` |
| `quiz:` | changes to the quiz tool | `quiz: add --reverse mode` |

## Repo structure

```
suomi/
├── README.md            ← goals, current level, progress table
├── package.json         ← npm scripts for the quiz
├── progress.json        ← created by the quiz: right/wrong counts per word
├── vocab/               ← finnish,english,example (CSV)
├── grammar/             ← cases, verb types, notes
├── journal/             ← one file per day, written in Finnish
├── reading/             ← new words from things I read
└── quiz/quiz.js         ← terminal flashcard quiz
```

## The quiz

```bash
npm run quiz              # 10 questions, Finnish → English
npm run quiz:reverse      # English → Finnish
node quiz/quiz.js --n 20  # more questions
node quiz/quiz.js --file food   # only vocab files with "food" in the name
```

Words you miss are asked more often. Answers must match exactly, including ä and ö.
Commit `progress.json` so the history shows how you improve.

### Vocab file format

```csv
finnish,english,example
kauppa,shop/store,Menen kauppaan.
```

Use `/` for several accepted answers.

## Progress

| Week | New words | Total | Topic | Notes |
|------|-----------|-------|-------|-------|
| 1 | 55 | 55 | greetings, numbers, food, first verbs | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

## Resources

- [Yle Selkouutiset](https://yle.fi/selkouutiset) — news in simple Finnish, with audio
- *Suomen Mestari* — textbook series used in many Finnish courses
- [Uusi kielemme](https://uusikielemme.fi/) — free grammar explanations in English
- [Wiktionary](https://en.wiktionary.org/) — full inflection tables for any word
- Everyday life: shop signs, receipts, bus announcements → write unknown words in `reading/`
