import { ArrowRight, CircleCheck, Layers } from "lucide-react";
import { DAYS, WEEKS } from "../../data/curriculum.js";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { CHECKS, dayProgress, isComplete, knownCount, nextDay } from "../progress/selectors.js";

export function DayGrid() {
  const { state } = useProgress();
  const next = nextDay(state);
  return (
    <section className="weeks" aria-label="20-day plan">
      {WEEKS.map((w) => {
        const days = DAYS.filter((d) => d.day >= w.from && d.day <= w.to);
        const done = days.filter((d) => isComplete(state, d.day)).length;
        return (
          <div key={w.title} className="week">
            <div className="week-head">
              <h2>
                {w.title} <span className="muted">· {w.subtitle}</span>
              </h2>
              <span className="eyebrow">{done}/{days.length} done</span>
            </div>
            <div className="day-grid">
              {days.map((d) => {
                const p = dayProgress(state, d.day);
                const complete = isComplete(state, d.day);
                return (
                  <a key={d.day} href={`#day-${d.day}`} className={`day-card card${complete ? " done" : ""}${next === d.day ? " next" : ""}`}>
                    <span className="day-card-top">
                      <span className="day-pill">Day {d.day}</span>
                      <span className="muted small">{d.category}</span>
                    </span>
                    <strong className="day-card-title">{d.theme}</strong>
                    <span className="muted small clamp">
                      {d.chapter ? `Kappale ${d.chapter} · ` : ""}s. {d.pages}
                    </span>
                    <span className="checks-row" aria-label="Progress">
                      {CHECKS.map((c) => (
                        <span key={c.id} className={`check-dot${p[c.id] ? " on" : ""}`} title={`${c.fi}: ${p[c.id] ? "done" : "not yet"}`} />
                      ))}
                    </span>
                    <span className="day-card-foot">
                      <span className="muted small">
                        <Layers size={12} /> {knownCount(state, d.day)}/{d.words.length} cards
                      </span>
                      {complete ? (
                        <span className="aurora small strong">
                          <CircleCheck size={13} /> Passed{typeof p.score === "number" ? ` (${p.score}%)` : ""}
                        </span>
                      ) : (
                        <span className="accent small strong">
                          {next === d.day ? "Up next" : "Open"} <ArrowRight size={12} />
                        </span>
                      )}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
