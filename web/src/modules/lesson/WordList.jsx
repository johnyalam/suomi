import { Volume2 } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { dayProgress } from "../progress/selectors.js";
import { speak, canSpeak } from "../speech/speak.js";

export function WordList({ day }) {
  const { state, setKnown } = useProgress();
  const known = new Set(dayProgress(state, day.day).known || []);
  const book = day.words.filter((w) => w.source === "book").length;
  return (
    <div className="card">
      <div className="card-head">
        <h2>Sanasto · {day.words.length} words</h2>
        <span className="muted small">
          {book} from the book plan · {day.words.length - book} from your original course
        </span>
      </div>
      <div className="word-table">
        {day.words.map((w) => (
          <div key={w.fi} className={`word-row${known.has(w.fi) ? " known" : ""}`}>
            {canSpeak() ? (
              <button className="icon-btn" onClick={() => speak(w.fi)} aria-label={`Listen to ${w.fi}`}>
                <Volume2 size={16} />
              </button>
            ) : <span />}
            <div className="word-main">
              <strong>{w.fi}</strong>
              {w.phonetic && <span className="mono muted small"> [{w.phonetic}]</span>}
              <span className="word-en">{w.en}</span>
            </div>
            <div className="word-ex muted small">
              {w.exampleFi}
              {w.exampleEn && <em> · {w.exampleEn}</em>}
            </div>
            <span className={`src-tag ${w.source}`}>{w.source === "book" ? "book" : "yours"}</span>
            <label className="toggle small">
              <input type="checkbox" id={`known-${day.day}-${w.fi}`} checked={known.has(w.fi)} onChange={(e) => setKnown(day.day, w.fi, e.target.checked)} /> known
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
