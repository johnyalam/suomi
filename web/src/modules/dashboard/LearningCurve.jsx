// Oppimiskäyrä: words planned per day (dashed) vs words you know (filled), plus quiz scores.
import { useProgress } from "../progress/ProgressProvider.jsx";
import { learningCurve } from "../progress/selectors.js";
import { TOTAL_WORDS } from "../../data/curriculum.js";

const W = 760, H = 270, L = 46, R = 46, T = 16, B = 38;

export function LearningCurve() {
  const { state } = useProgress();
  const curve = learningCurve(state);
  const yMax = Math.ceil(TOTAL_WORDS / 50) * 50;
  const x = (d) => L + ((d - 1) / 19) * (W - L - R);
  const y = (v) => T + (1 - v / yMax) * (H - T - B);
  const yp = (p) => T + (1 - p / 100) * (H - T - B);

  const lastTouched = curve.reduce((m, c) => (c.touched ? c.day : m), 0);
  const mine = curve.filter((c) => c.day <= Math.max(lastTouched, 1));
  const end = mine[mine.length - 1];
  const scores = curve.filter((c) => c.score !== null);
  const empty = !lastTouched;

  const ticks = [];
  for (let v = 0; v <= yMax; v += 100) ticks.push(v);

  return (
    <section className="card curve" aria-label="Learning curve">
      <div className="card-head">
        <h2>Oppimiskäyrä · learning curve</h2>
        <div className="legend">
          <span><i className="lg-plan" /> Plan (words)</span>
          <span><i className="lg-you" /> You (words known)</span>
          <span><i className="lg-score" /> Quiz %</span>
        </div>
      </div>
      <div className="scroll-x">
        <svg viewBox={`0 0 ${W} ${H}`} className="curve-svg" role="img" aria-label={`You know ${end.known} of ${TOTAL_WORDS} words`}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="grid" />
              <text x={L - 8} y={y(v) + 4} textAnchor="end">{v}</text>
            </g>
          ))}
          {[0, 50, 100].map((p) => (
            <text key={p} x={W - R + 8} y={yp(p) + 4} className="score-axis">{p}%</text>
          ))}
          {[7, 14, 20].map((d) => (
            <line key={d} x1={x(d)} x2={x(d)} y1={T} y2={H - B} className="review-line" />
          ))}
          {curve.filter((c) => c.day === 1 || c.day % 2 === 0).map((c) => (
            <text key={c.day} x={x(c.day)} y={H - 18} textAnchor="middle">{c.day}</text>
          ))}
          <text x={(L + W - R) / 2} y={H - 2} textAnchor="middle">päivä (day) · dotted lines = review days</text>

          <polyline className="plan" points={curve.map((c) => `${x(c.day)},${y(c.planned)}`).join(" ")} />
          {!empty && (
            <>
              <polygon
                className="you-area"
                points={`${x(1)},${y(0)} ${mine.map((c) => `${x(c.day)},${y(c.known)}`).join(" ")} ${x(end.day)},${y(0)}`}
              />
              <polyline className="you" points={mine.map((c) => `${x(c.day)},${y(c.known)}`).join(" ")} />
              <circle cx={x(end.day)} cy={y(end.known)} r="5" className="you-dot" />
              <text x={x(end.day) + 9} y={y(end.known) - 9} className="you-label">{end.known}</text>
            </>
          )}
          {scores.length > 1 && <polyline className="score" points={scores.map((c) => `${x(c.day)},${yp(c.score)}`).join(" ")} />}
          {scores.map((c) => (
            <circle key={c.day} cx={x(c.day)} cy={yp(c.score)} r="4" className="score-dot">
              <title>Day {c.day}: {c.score}%</title>
            </circle>
          ))}
          {empty && (
            <text x={(L + W - R) / 2} y={y(yMax * 0.5)} textAnchor="middle" className="empty-note">
              Mark your first flashcard as known to start your curve
            </text>
          )}
        </svg>
      </div>
    </section>
  );
}
