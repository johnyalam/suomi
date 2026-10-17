import { useEffect, useState } from "react";
import { Flame, BookA, Gauge, Moon, Sun, RotateCcw, Menu, X } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { percentDone, streak, wordsLearned } from "../progress/selectors.js";
import { TOTAL_WORDS } from "../../data/curriculum.js";
import { go } from "../router/useRoute.js";
import { applyTheme, initialTheme, isDarkNow } from "./theme.js";

export function Header({ onMenu, menuOpen }) {
  const { state, resetAll } = useProgress();
  const [dark, setDark] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    applyTheme(initialTheme());
    setDark(isDarkNow());
  }, []);

  const toggleTheme = () => {
    const next = isDarkNow() ? "light" : "dark";
    applyTheme(next);
    setDark(next === "dark");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <button className="icon-btn menu-btn" onClick={onMenu} aria-label={menuOpen ? "Close day list" : "Open day list"}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <a className="brand" href="#dashboard" onClick={() => go.dashboard()}>
          <span className="brand-mark" aria-hidden="true">Ä</span>
          <span className="brand-text">
            <strong>Oppimaan Suomea</strong>
            <small>Suomen mestari 1 · 20 päivää</small>
          </span>
        </a>

        <div className="header-stats" aria-label="Your progress">
          <span className="chip chip-amber" title="Study streak">
            <Flame size={14} /> {streak(state)} day streak
          </span>
          <span className="chip chip-accent" title="Words you marked as known">
            <BookA size={14} /> {wordsLearned(state)}/{TOTAL_WORDS} words
          </span>
          <span className="chip chip-aurora" title="Days completed">
            <Gauge size={14} /> {percentDone(state)}% done
          </span>
        </div>

        <div className="header-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {confirming ? (
            <span className="confirm">
              <span>Reset all progress?</span>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  resetAll();
                  setConfirming(false);
                }}
              >
                Reset
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <button className="icon-btn" onClick={() => setConfirming(true)} aria-label="Reset progress">
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
