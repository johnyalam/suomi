// The six milestones from the original app, now based on real progress.
import { Footprints, Flame, Mountain, BookOpenCheck, Star, Crown } from "lucide-react";
import { completedDays, streak, wordsLearned } from "./selectors.js";
import { DAYS } from "../../data/curriculum.js";
import { dayProgress } from "./selectors.js";

export const BADGES = [
  { id: "first_step", name: "First Step", desc: "Complete your first day", Icon: Footprints, test: (s) => completedDays(s).length >= 1 },
  { id: "streak_3", name: "Dedicated", desc: "3-day study streak", Icon: Flame, test: (s) => streak(s) >= 3 },
  { id: "halfway", name: "Halfway There", desc: "Complete 10 days", Icon: Mountain, test: (s) => completedDays(s).length >= 10 },
  { id: "vocab_50", name: "Word Master", desc: "Know 50 words", Icon: BookOpenCheck, test: (s) => wordsLearned(s) >= 50 },
  { id: "quiz_ace", name: "Quiz Ace", desc: "Score 100% on a quiz", Icon: Star, test: (s) => DAYS.some((d) => dayProgress(s, d.day).score === 100) },
  { id: "champion", name: "Suomi Master", desc: "Complete all 20 days", Icon: Crown, test: (s) => completedDays(s).length >= 20 },
];

export const unlockedBadges = (state) => BADGES.filter((b) => b.test(state));
