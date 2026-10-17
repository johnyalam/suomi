import { Check } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { CHECKS, PASS_MARK, dayProgress, knownCount } from "../progress/selectors.js";
import { getDay } from "../../data/curriculum.js";

// The four steps of a day. "Sanat" ticks itself when every card is known,
// "Visa" when you pass the quiz; you can always tick or untick by hand.
export function DayChecklist({ dayNum }) {
  const { state, toggleCheck } = useProgress();
  const p = dayProgress(state, dayNum);
  const day = getDay(dayNum);
  const hint = {
    grammar: "Read the grammar tab",
    words: `${knownCount(state, dayNum)}/${day.words.length} cards known`,
    quiz: typeof p.score === "number" ? `Best ${p.score}% · pass ${PASS_MARK}%` : `Pass with ${PASS_MARK}%`,
    sentences: "Write today's task",
  };
  return (
    <div className="checklist">
      {CHECKS.map((c) => (
        <label key={c.id} className={`check${p[c.id] ? " on" : ""}`}>
          <input type="checkbox" id={`check-${dayNum}-${c.id}`} checked={!!p[c.id]} onChange={() => toggleCheck(dayNum, c.id)} />
          <span className="check-box" aria-hidden="true">
            {p[c.id] && <Check size={13} strokeWidth={3} />}
          </span>
          <span>
            <strong>{c.fi}</strong>
            <small>{hint[c.id]}</small>
          </span>
        </label>
      ))}
    </div>
  );
}
