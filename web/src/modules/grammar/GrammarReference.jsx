// Grammar cheat sheet: the three cards from your original app, plus the topics the book plan adds.
import { BookMarked } from "lucide-react";

const SECTIONS = [
  {
    title: "Vokaaliharmonia · vowel harmony",
    days: "Day 2",
    body: (
      <>
        <p>A word uses back vowels or front vowels, and endings follow it.</p>
        <table>
          <tbody>
            <tr><th>Back</th><td className="mono">a o u</td><td>talo<b>ssa</b>, auto<b>lla</b></td></tr>
            <tr><th>Front</th><td className="mono">ä ö y</td><td>kylä<b>ssä</b>, työ<b>ssä</b></td></tr>
            <tr><th>Neutral</th><td className="mono">e i</td><td>only e/i → ä: tie<b>llä</b></td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: "Persoonapäätteet · personal endings",
    days: "Days 1, 4, 10",
    body: (
      <table>
        <thead><tr><th>Pronoun</th><th>Ending</th><th>puhua</th><th>olla</th></tr></thead>
        <tbody>
          <tr><td>minä</td><td className="mono">-n</td><td>puhun</td><td>olen</td></tr>
          <tr><td>sinä</td><td className="mono">-t</td><td>puhut</td><td>olet</td></tr>
          <tr><td>hän</td><td className="mono">vowel ×2</td><td>puhuu</td><td>on</td></tr>
          <tr><td>me</td><td className="mono">-mme</td><td>puhumme</td><td>olemme</td></tr>
          <tr><td>te</td><td className="mono">-tte</td><td>puhutte</td><td>olette</td></tr>
          <tr><td>he</td><td className="mono">-vat/-vät</td><td>puhuvat</td><td>ovat</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    title: "Verbityypit · verb types",
    days: "Days 4, 10, 19",
    body: (
      <table>
        <thead><tr><th>Type</th><th>Ends in</th><th>Example</th><th>minä</th></tr></thead>
        <tbody>
          <tr><td>1</td><td className="mono">vowel + a/ä</td><td>puhua</td><td>puhun</td></tr>
          <tr><td>2</td><td className="mono">-da/-dä</td><td>syödä</td><td>syön</td></tr>
          <tr><td>3</td><td className="mono">-la/-na/-ra/-sta</td><td>tulla</td><td>tulen</td></tr>
          <tr><td>4</td><td className="mono">-ata/-ota/-uta</td><td>haluta</td><td>haluan</td></tr>
          <tr><td>5</td><td className="mono">-ita</td><td>tarvita</td><td>tarvitsen</td></tr>
          <tr><td>6</td><td className="mono">-eta</td><td>vanheta</td><td>vanhenen</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    title: "K-p-t-vaihtelu · consonant gradation",
    days: "Days 3, 6",
    body: (
      <>
        <p>k, p, t weaken when an ending closes the syllable (-n, -ssa, -lla, -t…).</p>
        <table>
          <tbody>
            <tr><td className="mono">kk → k</td><td>pankki → pankissa</td><td className="mono">p → v</td><td>leipä → leivän</td></tr>
            <tr><td className="mono">pp → p</td><td>kauppa → kaupassa</td><td className="mono">t → d</td><td>katu → kadulla</td></tr>
            <tr><td className="mono">tt → t</td><td>konsertti → konsertin</td><td className="mono">nk → ng</td><td>Helsinki → Helsingissä</td></tr>
            <tr><td className="mono">k → –</td><td>Turku → Turussa</td><td className="mono">nt → nn</td><td>ranta → rannalla</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    title: "Paikallissijat · place cases",
    days: "Days 12, 13",
    wide: true,
    body: (
      <div className="two-col">
        <div>
          <h4>Inside</h4>
          <p><b className="mono">-ssa/-ssä</b> in · talossa</p>
          <p><b className="mono">-sta/-stä</b> out of · talosta</p>
          <p><b className="mono">-Vn/-hVn/-seen</b> into · taloon</p>
        </div>
        <div>
          <h4>On / at</h4>
          <p><b className="mono">-lla/-llä</b> on, at · pöydällä · also <i>minulla on</i> = I have</p>
          <p><b className="mono">-lta/-ltä</b> off, from · pöydältä</p>
          <p><b className="mono">-lle</b> onto, to · pöydälle</p>
        </div>
      </div>
    ),
  },
  {
    title: "Partitiivi · partitive",
    days: "Days 8, 9, 17",
    body: (
      <>
        <p><b className="mono">-a/-ä, -ta/-tä</b></p>
        <ul>
          <li>after numbers (not 1): <i>kaksi kissaa</i></li>
          <li>in negatives: <i>Minulla ei ole autoa.</i></li>
          <li>uncountable things: <i>Juon kahvia.</i></li>
          <li>some verbs: <i>rakastan, odotan, autan</i></li>
        </ul>
      </>
    ),
  },
  {
    title: "Imperfekti · past tense",
    days: "Day 16",
    body: (
      <>
        <p>Add <b className="mono">-i-</b> before the ending.</p>
        <table>
          <tbody>
            <tr><td>olla</td><td>olin, olit, oli</td><td>en ollut</td></tr>
            <tr><td>tulla</td><td>tulin, tulit, tuli</td><td>en tullut</td></tr>
            <tr><td>mennä</td><td>menin, menit, meni</td><td>en mennyt</td></tr>
            <tr><td>puhua</td><td>puhuin, puhuit, puhui</td><td>en puhunut</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
];

export function GrammarReference() {
  return (
    <div className="page">
      <section className="card">
        <h1 className="with-icon">
          <BookMarked size={22} className="accent" /> Kielioppi · grammar cheat sheet
        </h1>
        <p className="muted">The core rules of Days 1–20. The book's own summary is <i>Minikielioppi</i>, p. 310.</p>
      </section>
      <div className="ref-grid">
        {SECTIONS.map((s) => (
          <section key={s.title} className={`card ref${s.wide ? " wide" : ""}`}>
            <div className="card-head">
              <h2>{s.title}</h2>
              <span className="eyebrow">{s.days}</span>
            </div>
            <div className="ref-body">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
