import { Play, BookOpen, CalendarCheck, BookA, Flame, Trophy } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { completedDays, nextDay, streak, wordsLearned, averageScore } from "../progress/selectors.js";
import { BADGES, unlockedBadges } from "../progress/badges.js";
import { BOOK, TOTAL_DAYS, TOTAL_WORDS } from "../../data/curriculum.js";
import { go } from "../router/useRoute.js";
import { LearningCurve } from "./LearningCurve.jsx";
import { Badges } from "./Badges.jsx";
import { DayGrid } from "./DayGrid.jsx";

export function Dashboard() {
  const { state } = useProgress();
  const done = completedDays(state).length;
  const next = nextDay(state);
  const resumeTo = next ?? 1;
  const resumeLabel = done === 0 && !state.profile.lastDay ? "Start Day 1" : next ? `Continue Day ${next}` : "Review Day 1";
  const avg = averageScore(state);

  return (
    <div className="page">
      <section className="banner">
        <div className="banner-body">
          <span className="banner-eyebrow">{BOOK}</span>
          <h1>Tervetuloa oppimaan suomea!</h1>
          <p>
            Twenty days through Suomen mestari 1: book pages, grammar, {TOTAL_WORDS} words with flashcards and
            audio, quizzes and your own sentences. Every tick and score feeds your learning curve below.
          </p>
          <div className="banner-actions">
            <button className="btn btn-light" onClick={() => go.day(resumeTo)}>
              <Play size={16} /> {resumeLabel}
            </button>
            <button className="btn btn-glass" onClick={() => go.grammar()}>
              <BookOpen size={16} /> Grammar cheat sheet
            </button>
          </div>
        </div>
        <svg className="banner-art" viewBox="0 0 200 120" aria-hidden="true">
          <path d="M0 95 C40 80 60 100 100 88 S160 70 200 82 V120 H0Z" fill="currentColor" opacity=".18" />
          <path d="M0 105 C50 95 80 112 120 102 S170 92 200 98 V120 H0Z" fill="currentColor" opacity=".28" />
          <g fill="currentColor" opacity=".35">
            <path d="M150 88 l8 -30 l8 30z" /><path d="M164 90 l6 -22 l6 22z" /><path d="M136 92 l5 -18 l5 18z" />
          </g>
        </svg>
      </section>

      <section className="stats-grid" aria-label="Summary">
        <Stat Icon={CalendarCheck} tone="accent" label="Days completed" value={`${done} / ${TOTAL_DAYS}`} />
        <Stat Icon={BookA} tone="aurora" label="Words learned" value={`${wordsLearned(state)}`} sub={`of ${TOTAL_WORDS}`} />
        <Stat Icon={Flame} tone="amber" label="Study streak" value={`${streak(state)} ${streak(state) === 1 ? "day" : "days"}`} />
        <Stat
          Icon={Trophy}
          tone="violet"
          label="Badges"
          value={`${unlockedBadges(state).length} / ${BADGES.length}`}
          sub={avg === null ? "no quiz yet" : `avg quiz ${avg}%`}
        />
      </section>

      <LearningCurve />
      <Badges />
      <DayGrid />
    </div>
  );
}

function Stat({ Icon, tone, label, value, sub }) {
  return (
    <div className="stat card">
      <span className={`stat-icon tone-${tone}`} aria-hidden="true">
        <Icon size={20} />
      </span>
      <span className="stat-text">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        {sub && <span className="stat-sub">{sub}</span>}
      </span>
    </div>
  );
}
