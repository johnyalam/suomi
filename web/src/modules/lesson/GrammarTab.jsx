import { BookOpen, FileText } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { dayProgress } from "../progress/selectors.js";

export function GrammarTab({ day }) {
  const { state, toggleCheck } = useProgress();
  const read = !!dayProgress(state, day.day).grammar;
  return (
    <div className="stack">
      <section className="card grammar-main">
        <span className="eyebrow accent">Kielioppi · from the book plan</span>
        <h2>{day.grammar}</h2>
        <p className="muted">
          <BookOpen size={14} /> Read {day.chapter ? `Kappale ${day.chapter}, ` : ""}pages {day.pages} in Suomen mestari 1.
        </p>
        <p className="muted">
          <FileText size={14} /> Full notes in your repo: <code>{day.grammarFile}</code>
        </p>
      </section>

      {day.lessons.map((l) => (
        <section key={l.fromDay} className="card lesson-html">
          <span className="eyebrow">From your original course · day {l.fromDay}: {l.subtitle}</span>
          {/* content from your own curriculum file */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: l.html }} />
        </section>
      ))}

      <button className={`btn ${read ? "btn-soft" : "btn-primary"} self-start`} onClick={() => toggleCheck(day.day, "grammar")}>
        {read ? "Marked as read · undo" : "I've read the grammar"}
      </button>
    </div>
  );
}
