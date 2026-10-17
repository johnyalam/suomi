# Oppimaan Suomea — the React app

The interactive version of the 20-day course: dashboard, flashcards with audio, word lists,
grammar, quizzes, writing tasks, badges and a learning curve. It merges two sources:

- the **book plan** (`../plan/plan.json` and `../vocab/day-XX.csv`): 311 words, pages, grammar, tasks
- **your original course** (`src/data/legacy-curriculum.json`): 65 more words, grammar notes and 22 quiz questions

## Run it

```bash
cd web
npm install        # once
npm run dev        # http://localhost:5173 — edits reload instantly
npm run build      # dist/index.html: one self-contained file you can open anywhere
```

Or from the repo root: `npm run web` and `npm run web:build`.

Locally, progress is saved in your browser. The published claude.ai version syncs it across your devices.

## Change the content

| You want to… | Edit | Then |
|---|---|---|
| add or fix a word | `../vocab/day-XX.csv` | `npm run dev` (data rebuilds itself) |
| change pages, grammar, sentences, tasks | `../plan/plan.json` | same |
| change your own words / quizzes / notes | `src/data/legacy-curriculum.json` | same |
| move one of your days to another book day | `src/data/merge-map.json` | same |

`scripts/build-data.mjs` merges everything into `src/data/curriculum.json` before every run. Don't edit that file by hand.

## Structure

```
web/
├── index.html
├── vite.config.js            ← React + single-file build
├── scripts/
│   ├── build-data.mjs        ← merges book plan + your course → curriculum.json
│   └── to-artifact.mjs       ← dist/index.html → dist/artifact.html (claude.ai format)
└── src/
    ├── main.jsx, App.jsx     ← app shell: header, sidebar, routes
    ├── data/                 ← curriculum.json (generated), legacy-curriculum.json, merge-map.json, curriculum.js
    ├── styles/               ← tokens.css (colours, light + dark), app.css
    └── modules/
        ├── router/           ← #dashboard, #day-5, #grammar
        ├── layout/           ← Header, Sidebar (search), theme toggle
        ├── dashboard/        ← Dashboard, LearningCurve, Badges, DayGrid
        ├── lesson/           ← LessonView, DayChecklist, Flashcards, WordList, GrammarTab, WritingTab
        ├── quiz/             ← Quiz, generateQuiz (questions from the day's words + yours)
        ├── grammar/          ← GrammarReference (cheat sheet)
        ├── progress/         ← ProgressProvider (all tracking), selectors, badges, storage
        ├── speech/           ← Finnish text-to-speech
        └── celebrate/        ← confetti when you pass
```

## How tracking works

Each day has four steps: **Kielioppi** (grammar), **Sanat** (words), **Visa** (quiz), **Lauseet** (sentences).

- **Sanat** ticks itself when every flashcard is marked "I know it"
- **Visa** ticks itself when you score 60% or more (your best score is kept)
- **Kielioppi** and **Lauseet** you tick yourself
- A day is complete when all four are done
- **Words learned** = cards marked as known · **Streak** = days in a row you did something
- Badges: First Step, Dedicated (3-day streak), Halfway There, Word Master (50 words), Quiz Ace (100%), Suomi Master
