import { useMemo, useState } from "react";
import { Check, Search, LayoutDashboard, BookMarked, Cloud, CloudOff, HardDrive } from "lucide-react";
import { DAYS, TOTAL_DAYS } from "../../data/curriculum.js";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { checksDone, completedDays, dayProgress, isComplete } from "../progress/selectors.js";

const SYNC_TEXT = {
  synced: { Icon: Cloud, text: "Synced across your devices" },
  connecting: { Icon: Cloud, text: "Connecting…" },
  error: { Icon: CloudOff, text: "Offline: saved in this browser" },
  local: { Icon: HardDrive, text: "Saved in this browser" },
};

export function Sidebar({ route, open, onNavigate }) {
  const { state, sync } = useProgress();
  const [query, setQuery] = useState("");

  const days = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DAYS;
    return DAYS.filter((d) =>
      [d.theme, d.title, d.category, String(d.day), ...d.words.map((w) => w.fi + " " + w.en)].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  const { Icon: SyncIcon, text: syncText } = SYNC_TEXT[sync] || SYNC_TEXT.local;

  return (
    <aside className={`sidebar${open ? " open" : ""}`} aria-label="Days">
      <div className="sidebar-search">
        <Search size={15} aria-hidden="true" />
        <input
          id="day-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search days or words…"
          aria-label="Search days or words"
        />
      </div>

      <nav className="sidebar-nav">
        <a href="#dashboard" className={`side-link${route.view === "dashboard" ? " active" : ""}`} onClick={onNavigate}>
          <LayoutDashboard size={16} /> Dashboard
        </a>
        <a href="#grammar" className={`side-link${route.view === "grammar" ? " active" : ""}`} onClick={onNavigate}>
          <BookMarked size={16} /> Grammar cheat sheet
        </a>
      </nav>

      <div className="sidebar-days">
        {days.map((d) => {
          const done = isComplete(state, d.day);
          const active = route.view === "lesson" && route.day === d.day;
          const score = dayProgress(state, d.day).score;
          const partial = checksDone(state, d.day);
          return (
            <a
              key={d.day}
              href={`#day-${d.day}`}
              onClick={onNavigate}
              className={`day-link${active ? " active" : ""}${done ? " done" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="day-num">{done ? <Check size={14} strokeWidth={3} /> : d.day}</span>
              <span className="day-link-text">
                <strong>{d.theme}</strong>
                <small>
                  {d.category} · {partial}/4
                </small>
              </span>
              {typeof score === "number" && <span className="score-tag">{score}%</span>}
            </a>
          );
        })}
        {!days.length && <p className="muted small pad">No day matches “{query}”.</p>}
      </div>

      <div className="sidebar-foot">
        <span>
          <strong>{completedDays(state).length}</strong>/{TOTAL_DAYS} days
        </span>
        <span className="sync" title={syncText}>
          <SyncIcon size={14} /> {syncText}
        </span>
      </div>
    </aside>
  );
}
