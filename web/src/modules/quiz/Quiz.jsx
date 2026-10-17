import { useState } from "react";
import { Send, Check, X, RefreshCw } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { PASS_MARK, dayProgress } from "../progress/selectors.js";
import { generateQuiz, checkAnswer } from "./generateQuiz.js";
import { celebrate } from "../celebrate/celebrate.js";

export function Quiz({ day }) {
  const { state, recordQuiz } = useProgress();
  const [questions, setQuestions] = useState(() => generateQuiz(day.day));
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const best = dayProgress(state, day.day).score;

  const answeredAll = questions.every((_, i) => answers[i] !== undefined && answers[i] !== "");

  const submit = () => {
    const right = questions.filter((q, i) => checkAnswer(q, answers[i])).length;
    const percent = Math.round((right / questions.length) * 100);
    setResult({ right, percent });
    recordQuiz(day.day, percent);
    if (percent >= PASS_MARK) celebrate();
  };

  const retry = () => {
    setQuestions(generateQuiz(day.day));
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="card quiz">
      <div className="card-head">
        <h2>Visa · Day {day.day} quiz</h2>
        <span className="muted small">
          {questions.length} questions · pass {PASS_MARK}%{typeof best === "number" ? ` · best ${best}%` : ""}
        </span>
      </div>

      {result && (
        <div className={`quiz-result ${result.percent >= PASS_MARK ? "pass" : "fail"}`} role="status">
          <strong>
            {result.right}/{questions.length} oikein · {result.percent}%
          </strong>
          <span>{result.percent >= PASS_MARK ? "Hienoa! “Visa” is ticked off for today." : `Not yet. Review the cards and try a new set; you need ${PASS_MARK}%.`}</span>
          <button className="btn btn-outline btn-sm" onClick={retry}>
            <RefreshCw size={14} /> New questions
          </button>
        </div>
      )}

      <ol className="questions">
        {questions.map((q, i) => {
          const done = !!result;
          const ok = done && checkAnswer(q, answers[i]);
          return (
            <li key={i} className={`question${done ? (ok ? " right" : " wrong") : ""}`}>
              <p className="q-text">
                {q.question}
                {q.yours && <span className="src-tag yours">your course</span>}
              </p>
              {q.type === "mc" ? (
                <div className="options">
                  {q.options.map((opt, j) => {
                    const chosen = answers[i] === j;
                    const isAnswer = done && j === q.correct;
                    return (
                      <button
                        key={j}
                        className={`option${chosen ? " chosen" : ""}${isAnswer ? " answer" : ""}`}
                        disabled={done}
                        aria-pressed={chosen}
                        onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  className="text-input"
                  id={`q-${day.day}-${i}`}
                  value={answers[i] || ""}
                  disabled={done}
                  onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                  placeholder="Kirjoita suomeksi…"
                  autoComplete="off"
                  spellCheck="false"
                />
              )}
              {done && (
                <p className="feedback">
                  {ok ? <Check size={14} /> : <X size={14} />}
                  {ok ? "Oikein! " : `Väärin. ${q.type === "fitb" ? `Answer: ${q.correctAnswer}. ` : ""}`}
                  {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {!result && (
        <div className="row end">
          {!answeredAll && <span className="muted small">Answer every question to submit.</span>}
          <button className="btn btn-primary" onClick={submit} disabled={!answeredAll}>
            <Send size={16} /> Submit answers
          </button>
        </div>
      )}
    </div>
  );
}
