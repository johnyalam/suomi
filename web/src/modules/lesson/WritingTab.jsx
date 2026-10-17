import { Volume2 } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { dayProgress } from "../progress/selectors.js";
import { speak, canSpeak } from "../speech/speak.js";

export function WritingTab({ day }) {
  const { state, setNote, toggleCheck } = useProgress();
  const p = dayProgress(state, day.day);
  return (
    <div className="stack">
      <section className="card">
        <span className="eyebrow accent">Lauseet · model sentences</span>
        <ul className="sentences">
          {day.sentences.map((s) => (
            <li key={s}>
              <span>{s}</span>
              {canSpeak() && (
                <button className="icon-btn" onClick={() => speak(s.replace(/_+/g, ""))} aria-label="Listen">
                  <Volume2 size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <span className="eyebrow accent">Tehtävä · today's task</span>
        <p className="task">{day.task}</p>
        <label className="field-label" htmlFor={`note-${day.day}`}>
          Write your sentences here (also copy them into <code>journal/</code> in your repo)
        </label>
        <textarea
          id={`note-${day.day}`}
          className="note"
          rows={6}
          value={p.note || ""}
          onChange={(e) => setNote(day.day, e.target.value)}
          placeholder="Hei! Minä olen…"
        />
        <div className="row">
          <button className={`btn ${p.sentences ? "btn-soft" : "btn-primary"}`} onClick={() => toggleCheck(day.day, "sentences")}>
            {p.sentences ? "Sentences done · undo" : "I've written my sentences"}
          </button>
          <span className="muted small">Saved automatically.</span>
        </div>
      </section>
    </div>
  );
}
