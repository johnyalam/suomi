import { Award } from "lucide-react";
import { useProgress } from "../progress/ProgressProvider.jsx";
import { BADGES } from "../progress/badges.js";

export function Badges() {
  const { state } = useProgress();
  return (
    <section className="card" aria-label="Badges">
      <div className="card-head">
        <h2>
          <Award size={18} className="amber" /> Merkit · badges & milestones
        </h2>
      </div>
      <div className="badges">
        {BADGES.map(({ id, name, desc, Icon, test }) => {
          const on = test(state);
          return (
            <div key={id} className={`badge${on ? " on" : ""}`}>
              <span className="badge-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <strong>{name}</strong>
              <small>{desc}</small>
              <span className="sr-only">{on ? "unlocked" : "locked"}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
