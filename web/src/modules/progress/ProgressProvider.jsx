// Progress store for the whole app: one React context, all tracking actions.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DAYS, getDay } from "../../data/curriculum.js";
import { connectRemote, dayKey, loadLocal, saveLocal } from "./storage.js";
import { PASS_MARK, isoDate } from "./selectors.js";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, setState] = useState(loadLocal);
  const [sync, setSync] = useState("local"); // local | connecting | synced | error
  const remote = useRef(null);
  const stateRef = useRef(state);
  const dirty = useRef({}); // day keys with a pending (debounced) remote write
  const timers = useRef({});
  stateRef.current = state;

  // keep a local copy in every case
  useEffect(() => saveLocal(state), [state]);

  // connect to the artifact database when available
  useEffect(() => {
    let alive = true;
    let first = true;
    setSync("connecting");
    connectRemote({
      onDays: (days, empty) => {
        if (!alive) return;
        const local = stateRef.current.days;
        if (first && empty && Object.keys(local).length) {
          // first time online: upload what this browser already has
          for (const [k, v] of Object.entries(local)) remote.current?.saveDay(k, v);
        } else {
          setState((s) => {
            const merged = { ...days };
            for (const k of Object.keys(dirty.current)) if (s.days[k]) merged[k] = s.days[k];
            return { ...s, days: merged };
          });
        }
        first = false;
        setSync("synced");
      },
      onProfile: (profile) => {
        if (!alive) return;
        if (profile) setState((s) => ({ ...s, profile }));
        else if (stateRef.current.profile.studyDates?.length) remote.current?.saveProfile(stateRef.current.profile);
      },
      onError: () => alive && setSync("error"),
    }).then((r) => {
      if (!alive) return r?.close();
      remote.current = r;
      if (!r) setSync("local");
    });
    return () => {
      alive = false;
      remote.current?.close();
    };
  }, []);

  const pushDay = useCallback((key, data, delay = 0) => {
    clearTimeout(timers.current[key]);
    if (!remote.current) return;
    dirty.current[key] = true;
    timers.current[key] = setTimeout(() => {
      remote.current
        ?.saveDay(key, stateRef.current.days[key] ?? data)
        .then(() => setSync("synced"))
        .catch(() => setSync("error"))
        .finally(() => delete dirty.current[key]);
    }, delay);
  }, []);

  /** Merge a patch into one day and record today as a study day. */
  const updateDay = useCallback(
    (n, patch, { delay = 0 } = {}) => {
      const key = dayKey(n);
      const today = isoDate();
      setState((s) => {
        const prev = s.days[key] || {};
        const next = { ...prev, ...(typeof patch === "function" ? patch(prev) : patch), updated: today };
        const dates = s.profile.studyDates || [];
        const profile = dates.includes(today) ? s.profile : { ...s.profile, studyDates: [...dates, today].slice(-400) };
        if (profile !== s.profile) remote.current?.saveProfile(profile).catch(() => setSync("error"));
        const out = { ...s, days: { ...s.days, [key]: next }, profile };
        stateRef.current = out;
        return out;
      });
      pushDay(key, null, delay);
    },
    [pushDay]
  );

  const actions = useMemo(
    () => ({
      toggleCheck: (n, id) => updateDay(n, (p) => ({ [id]: !p[id] })),

      /** After a quiz: keep the best score, tick the quiz off when passed. */
      recordQuiz: (n, percent) =>
        updateDay(n, (p) => ({
          score: Math.max(percent, typeof p.score === "number" ? p.score : 0),
          attempts: (p.attempts || 0) + 1,
          quiz: p.quiz || percent >= PASS_MARK,
        })),

      /** Flashcards: mark a word known or not; all words known ticks "Sanat". */
      setKnown: (n, fi, known) =>
        updateDay(n, (p) => {
          const set = new Set(p.known || []);
          known ? set.add(fi) : set.delete(fi);
          const all = getDay(n).words.every((w) => set.has(w.fi));
          return { known: [...set], words: all ? true : p.words && known };
        }),

      setNote: (n, note) => updateDay(n, { note }, { delay: 800 }),

      setLastDay: (n) =>
        setState((s) => {
          if (s.profile.lastDay === n) return s;
          const profile = { ...s.profile, lastDay: n };
          remote.current?.saveProfile(profile).catch(() => {});
          return { ...s, profile };
        }),

      resetAll: async () => {
        const keys = DAYS.map((d) => dayKey(d.day));
        setState({ days: {}, profile: {} });
        try {
          await remote.current?.deleteAll(keys);
        } catch {
          setSync("error");
        }
      },
    }),
    [updateDay]
  );

  const value = useMemo(() => ({ state, sync, ...actions }), [state, sync, actions]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
