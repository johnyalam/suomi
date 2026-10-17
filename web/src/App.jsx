import { useState } from "react";
import { ProgressProvider } from "./modules/progress/ProgressProvider.jsx";
import { useRoute } from "./modules/router/useRoute.js";
import { Header } from "./modules/layout/Header.jsx";
import { Sidebar } from "./modules/layout/Sidebar.jsx";
import { Dashboard } from "./modules/dashboard/Dashboard.jsx";
import { LessonView } from "./modules/lesson/LessonView.jsx";
import { GrammarReference } from "./modules/grammar/GrammarReference.jsx";

export default function App() {
  const route = useRoute();
  const [menu, setMenu] = useState(false);
  return (
    <ProgressProvider>
      <Header onMenu={() => setMenu((m) => !m)} menuOpen={menu} />
      <div className="shell">
        <Sidebar route={route} open={menu} onNavigate={() => setMenu(false)} />
        {menu && <button className="scrim" aria-label="Close day list" onClick={() => setMenu(false)} />}
        <main className="main">
          {route.view === "dashboard" && <Dashboard />}
          {route.view === "lesson" && <LessonView dayNum={route.day} />}
          {route.view === "grammar" && <GrammarReference />}
        </main>
      </div>
    </ProgressProvider>
  );
}
