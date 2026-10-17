// Where progress is saved.
//
// Published on claude.ai, the app uses the artifact's database (synced across
// your devices). Opened locally (npm run dev, or dist/index.html) it falls back
// to localStorage in this browser.
//
// Shape:
//   days/d01   { grammar, words, quiz, sentences, score, attempts, known: [fi…], note, updated }
//   meta/profile { studyDates: ["2026-10-18", …], lastDay }

const LOCAL_KEY = "oppimaan_suomea_v2";

export const dayKey = (n) => "d" + String(n).padStart(2, "0");

export function loadLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || "null");
    return raw && typeof raw === "object" ? { days: raw.days || {}, profile: raw.profile || {} } : { days: {}, profile: {} };
  } catch {
    return { days: {}, profile: {} };
  }
}

export function saveLocal(state) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    /* private mode or blocked storage: progress lives in memory for this visit */
  }
}

/**
 * Connects to the artifact database if this page has one.
 * Returns null when unavailable (local file, signed out, or not granted).
 */
export async function connectRemote({ onDays, onProfile, onError }) {
  const claude = typeof window !== "undefined" ? window.claude : null;
  if (!claude?.use) return null;
  let db = null;
  try {
    db = await claude.use("db");
  } catch {
    db = null;
  }
  if (!db) return null;

  const daysCol = db.collection("days");
  const profileDoc = db.doc("meta/profile");

  const unsubDays = daysCol.onSnapshot(
    (snap) => {
      const out = {};
      snap.docs.forEach((d) => {
        if (d.exists) out[d.id] = { ...d.data() };
      });
      onDays(out, snap.empty);
    },
    (e) => onError?.(e)
  );
  const unsubProfile = profileDoc.onSnapshot(
    (snap) => onProfile(snap.exists ? { ...snap.data() } : null),
    (e) => onError?.(e)
  );

  // one write at a time per document: chain writes on a per-doc promise
  const chains = {};
  const write = (ref, id, data) => {
    chains[id] = (chains[id] || Promise.resolve()).catch(() => {}).then(() => ref.set(data));
    return chains[id];
  };

  return {
    saveDay: (key, data) => write(daysCol.doc(key), "days/" + key, data),
    saveProfile: (data) => write(profileDoc, "meta/profile", data),
    deleteAll: async (keys) => {
      for (const k of keys) await daysCol.doc(k).delete();
      await profileDoc.delete();
    },
    close: () => {
      unsubDays();
      unsubProfile();
    },
  };
}
