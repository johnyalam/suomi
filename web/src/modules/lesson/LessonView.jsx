import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Layers, List, BookOpen, PenLine, ClipboardCheck } from "lucide-react";
import { getDay, TOTAL_DAYS, REVIEW_RANGE } from "../../data/curriculum.js";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { go } from "../router/useRoute.js";
import { DayChecklist } from "./DayChecklist.jsx";
import { Flashcards } from "./Flashcards.jsx";
import { WordList } from "./WordList.jsx";
import { GrammarTab } from "./GrammarTab.jsx";
import { WritingTab } from "./WritingTab.jsx";
import { Quiz } from "../quiz/Quiz.jsx";

const TABS = [
  { id: "cards", label: "Flashcards", Icon: Layers },
  { id: "words", label: "Words", Icon: List },
  { id: "grammar", label: "Grammar", Icon: BookOpen },
  { id: "quiz", label: "Quiz", Icon: ClipboardCheck },
  { id: "write", label: "Sentences", Icon: PenLine },
];

export function LessonView({ dayNum }) {
  const day = getDay(dayNum);
  const { setLastDay } = useProgress();
  const [tab, setTab] = useState("cards");

  useEffect(() => {
    setLastDay(dayNum);
    setTab("cards");
  }, [dayNum, setLastDay]);

  const review = REVIEW_RANGE[dayNum];

  return (
    <div className="page lesson">
      <section className="lesson-head card">
        <div className="lesson-title">
          <span className="day-pill big">Päivä {day.day}</span>
          <div>
            <h1>{day.theme}</h1>
            <p className="muted">
              {day.chapter ? `Kappale ${day.chapter}: ${day.title}` : day.title} · book pages {day.pages}
            </p>
          </div>
        </div>
        <div className="day-nav">
          <button className="icon-btn" disabled={dayNum <= 1} onClick={() => go.day(dayNum - 1)} aria-label="Previous day">
            <ChevronLeft size={18} />
          </button>
          <span className="muted small tabular">
            {dayNum} / {TOTAL_DAYS}
          </span>
          <button className="icon-btn" disabled={dayNum >= TOTAL_DAYS} onClick={() => go.day(dayNum + 1)} aria-label="Next day">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <DayChecklist dayNum={dayNum} />

      <div className="tabs" role="tablist" aria-label="Lesson sections">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            className={`tab${tab === id ? " active" : ""}`}
            onClick={() => setTab(id)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "cards" && <Flashcards day={day} />}
        {tab === "words" && <WordList day={day} />}
        {tab === "grammar" && <GrammarTab day={day} />}
        {tab === "quiz" && <Quiz key={dayNum} day={day} />}
        {tab === "write" && <WritingTab day={day} />}
      </div>

      <p className="terminal muted small">
        In your repo: <code>npm run day {dayNum}</code> <code>npm run quiz -- --day {dayNum}</code>
        {review && <code>npm run quiz -- --review {review} --n 30</code>}
      </p>
    </div>
  );
}
