import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Volume2, Check, Undo2, Shuffle } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { dayProgress } from "../progress/selectors.js";
import { speak, canSpeak } from "../speech/speak.js";

export function Flashcards({ day }) {
  const { state, setKnown } = useProgress();
  const known = new Set(dayProgress(state, day.day).known || []);
  const [onlyNew, setOnlyNew] = useState(false);
  const [order, setOrder] = useState(() => day.words.map((_, i) => i));
  const deck = useMemo(() => order.map((i) => day.words[i]).filter((w) => !onlyNew || !known.has(w.fi)), [order, onlyNew, day, state]); // eslint-disable-line
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck[Math.min(i, deck.length - 1)];

  useEffect(() => {
    setI(0);
    setFlipped(false);
  }, [day.day, onlyNew]);

  const move = (d) => {
    setFlipped(false);
    setI((x) => (deck.length ? (x + d + deck.length) % deck.length : 0));
  };
  const mark = (isKnown) => {
    setKnown(day.day, card.fi, isKnown);
    if (!onlyNew) move(1);
    else setFlipped(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches("input, textarea, select")) return;
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const knownTotal = day.words.filter((w) => known.has(w.fi)).length;

  return (
    <div className="flash">
      <div className="flash-bar">
        <span className="muted small">Click the card or press Space to flip · ← → to move</span>
        <span className="flash-tools">
          <label className="toggle small">
            <input type="checkbox" id={`only-new-${day.day}`} checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} /> Only cards I'm still learning
          </label>
          <button className="btn btn-ghost btn-sm" onClick={() => { setOrder((o) => [...o].sort(() => Math.random() - 0.5)); setI(0); setFlipped(false); }}>
            <Shuffle size={14} /> Shuffle
          </button>
        </span>
      </div>

      <div className="progress-line" aria-label={`${knownTotal} of ${day.words.length} known`}>
        <div style={{ width: `${(knownTotal / day.words.length) * 100}%` }} />
      </div>

      {!card ? (
        <div className="card flash-empty">
          <strong>Kaikki osattu! You know every card for Day {day.day}.</strong>
          <p className="muted">Untick “Only cards I'm still learning” to review them all, or take the quiz.</p>
        </div>
      ) : (
        <>
          <div className="flash-stage">
            <div
              className={`flashcard${flipped ? " flipped" : ""}`}
              onClick={() => setFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              aria-label={flipped ? `${card.fi}: ${card.en}` : `${card.fi}. Press to reveal the translation`}
              onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
            >
              <div className="face front">
                <span className="eyebrow accent">Suomi · {i + 1} / {deck.length}</span>
                <h2 className="card-word">{card.fi}</h2>
                {card.phonetic && <p className="mono muted">[{card.phonetic}]</p>}
                {known.has(card.fi) && <span className="known-tag"><Check size={12} /> known</span>}
                {canSpeak() && (
                  <button className="speak-btn" onClick={(e) => { e.stopPropagation(); speak(card.fi); }} aria-label={`Listen to ${card.fi}`}>
                    <Volume2 size={22} />
                  </button>
                )}
                <p className="muted small">Tap to reveal</p>
              </div>
              <div className="face back">
                <span className="eyebrow">English</span>
                <h2 className="card-word">{card.en}</h2>
                {card.exampleFi && (
                  <div className="example">
                    <p>
                      “{card.exampleFi}”
                      {canSpeak() && (
                        <button className="speak-inline" onClick={(e) => { e.stopPropagation(); speak(card.exampleFi); }} aria-label="Listen to the example">
                          <Volume2 size={14} />
                        </button>
                      )}
                    </p>
                    {card.exampleEn && <small>“{card.exampleEn}”</small>}
                  </div>
                )}
                <div className="judge" onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm on-dark" onClick={() => mark(false)}>
                    <Undo2 size={14} /> Still learning
                  </button>
                  <button className="btn btn-aurora btn-sm" onClick={() => mark(true)}>
                    <Check size={14} /> I know it
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flash-controls">
            <button className="btn btn-outline" onClick={() => move(-1)}><ArrowLeft size={16} /> Previous</button>
            <button className="btn btn-soft" onClick={() => setFlipped((f) => !f)}><RotateCw size={16} /> Flip</button>
            <button className="btn btn-primary" onClick={() => move(1)}>Next <ArrowRight size={16} /></button>
          </div>
        </>
      )}
      <p className="muted small center">{knownTotal} of {day.words.length} cards known. Marking all of them ticks off “Sanat”.</p>
    </div>
  );
}
