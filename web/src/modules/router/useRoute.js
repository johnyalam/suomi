// Tiny hash router: #dashboard, #day-5, #grammar. Links can be shared and survive reloads.
import { useEffect, useState } from "react";
import { TOTAL_DAYS } from "../../data/curriculum.js";

function parse(hash) {
  const h = hash.replace(/^#/, "");
  const m = /^day-(\d+)$/.exec(h);
  if (m) {
    const day = Number(m[1]);
    if (day >= 1 && day <= TOTAL_DAYS) return { view: "lesson", day };
  }
  if (h === "grammar") return { view: "grammar" };
  return { view: "dashboard" };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export const go = {
  dashboard: () => (window.location.hash = "dashboard"),
  day: (n) => (window.location.hash = `day-${n}`),
  grammar: () => (window.location.hash = "grammar"),
};
