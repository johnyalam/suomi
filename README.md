# 🇫🇮 Suomi — 20 days with Suomen mestari 1

My Finnish study log. I follow the textbook **Suomen mestari 1** (Gehring & Heinzmann,
Finn Lectura 2020) for 20 days. Every day I study one part of the book, learn its words,
quiz myself, write sentences, and commit. The GitHub contribution graph is my streak and
[`PROGRESS.md`](PROGRESS.md) is my learning curve.

## Goals

- [ ] **Days 1–7** — greetings, numbers, countries, weather, verb type 1 (Kappaleet 1–3)
- [ ] **Days 8–14** — family, shopping, daily routine, home, partitive, place cases (Kappaleet 4–6)
- [ ] **Days 15–20** — travel, past tense, food, dates, work (Kappaleet 7–9)
- [ ] **After day 20** — move on to Suomen mestari 2

**Current level:** A1 (starting) · **Plan:** [`plan/20-days.md`](plan/20-days.md)

---

## Setup in 10 steps

**1. Install Node.js** (version 18 or newer) and check it:

```bash
node --version
```

**2. Unzip the project** and open the folder in your terminal:

```bash
cd ~/Documents/Development/suomi
```

**3. Start a git repo and make the first commit:**

```bash
git init
git add .
git commit -m "start: 20-day Suomen mestari 1 plan"
```

**4. Create an empty repo called `suomi` on GitHub** (no README, no .gitignore), then connect and push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/suomi.git
git branch -M main
git push -u origin main
```

**5. Check the quiz works** (no `npm install` needed; it uses only Node built-ins):

```bash
npm run quiz -- --n 3
```

Type `q` to stop.

**6. Read the plan:** open [`plan/20-days.md`](plan/20-days.md). Each day lists book pages,
grammar, words, model sentences and a writing task.

**7. Open the tracker:** the interactive *Suomi 20 Päivää* page (your claude.ai artifact) has the same
20 days with checkboxes, a built-in flashcard quiz and the learning-curve chart. It syncs across
your devices. A local copy is in [`tracker.html`](tracker.html) (that copy saves to your browser only).

**8. Get the book ready** next to your keyboard. Page numbers in the plan are the ones printed
in the book. Exercise answers start on p. 329.

**9. Start Day 1:**

```bash
npm run day 1
```

This prints the lesson and creates today's file in `journal/`.

**10. Do the daily loop below every day, and commit.** That's it.

---

## The daily loop (30–45 min)

| Step | What | Command |
|---|---|---|
| 1 | See today's lesson, create the journal file | `npm run day 5` |
| 2 | Read the book pages, do the exercises | — |
| 3 | Read the grammar note | `grammar/*.md` |
| 4 | Quiz today's words, both directions | `npm run quiz -- --day 5` then `npm run quiz -- --day 5 --reverse` |
| 5 | Write 3–5 sentences in today's journal | `journal/YYYY-MM-DD.md` |
| 6 | Tick the day off in the tracker | 4 checkboxes: Kielioppi, Sanat, Visa, Lauseet |
| 7 | Update your learning curve | `npm run progress` |
| 8 | Commit and push | see below |

```bash
git add .
git commit -m "day 05: weather, seasons, months"
git push
```

On review days (7, 14, 20), quiz across several days:

```bash
npm run quiz -- --review 1-6 --n 30     # day 7
npm run quiz -- --review 8-13 --n 30    # day 14
npm run quiz -- --review 20 --n 40      # day 20: everything
```

## All commands

| Command | What it does |
|---|---|
| `npm run day N` | Print day N's lesson and create today's journal file |
| `npm run quiz` | 10 random questions from all vocab |
| `npm run quiz -- --day N` | Only day N's words |
| `npm run quiz -- --review N` | Days 1 to N |
| `npm run quiz -- --review A-B` | Days A to B |
| `npm run quiz -- --reverse` | English → Finnish (add to any of the above) |
| `npm run quiz -- --n 20` | Number of questions |
| `npm run progress` | Rebuild `PROGRESS.md` (learning curve, scores, hard words) |
| `npm run plan` | Rebuild `plan/20-days.md` after you edit `plan/plan.json` |

Words you miss are asked more often. Answers must match exactly, including ä and ö.

## Repo structure

```
suomi/
├── README.md              ← this file: goals, setup, daily loop
├── PROGRESS.md            ← generated learning curve (npm run progress)
├── tracker.html           ← local copy of the interactive tracker
├── package.json           ← npm scripts
├── progress.json          ← created by the quiz: right/wrong per word
├── history.json           ← created by the quiz: every quiz score
├── plan/
│   ├── plan.json          ← the 20 days as data (edit this)
│   ├── 20-days.md         ← the readable plan (generated)
│   └── build.js
├── vocab/
│   ├── day-01.csv … day-20.csv   ← ~310 words, one file per day
│   ├── 01-basics.csv      ← finnish,english,example
│   ├── 02-food.csv
│   └── verbs.csv
├── grammar/
│   ├── pronouns-olla.md        day 1
│   ├── vowel-harmony.md        day 2
│   ├── consonant-gradation.md  days 3, 6
│   ├── verb-types.md           days 4, 10, 11
│   ├── cases.md                days 5, 8, 9, 12, 13, 17 — partitive, genitive, inessive…
│   ├── word-types.md           day 15
│   ├── past-tense.md           day 16
│   ├── dates-postpositions.md  day 18
│   └── object.md               day 19
├── journal/
│   └── 2026-10-17.md      ← 3–5 sentences written in Finnish daily
├── reading/
│   └── selkouutiset.md    ← new words from Yle Selkouutiset
└── quiz/
    ├── quiz.js            ← CLI flashcard tool
    ├── today.js           ← npm run day
    └── progress.js        ← npm run progress
```

## Commit message style

| Prefix | Use for | Example |
|---|---|---|
| `day NN:` | a finished study day | `day 08: family, appearance, colours` |
| `vocab:` | extra words | `vocab: kitchen words (+8)` |
| `grammar:` | grammar notes | `grammar: partitive rules` |
| `reading:` | words from articles | `reading: Selkouutiset 17.10.` |
| `quiz:` | changes to the tools | `quiz: add --review mode` |

## Resources

- **Suomen mestari 1** — the textbook. Its *Minikielioppi* (p. 310) summarises all the grammar.
- [Yle Selkouutiset](https://yle.fi/selkouutiset) — news in simple Finnish, with audio
- [Uusi kielemme](https://uusikielemme.fi/) — free grammar explanations in English
- [Wiktionary](https://en.wiktionary.org/) — full inflection tables for any word
- Everyday life: shop signs, receipts, bus announcements → write unknown words in `reading/`
