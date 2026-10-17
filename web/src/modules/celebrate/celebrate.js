// Confetti when you pass a quiz (skipped for people who prefer reduced motion).
import confetti from "canvas-confetti";

export function celebrate() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  try {
    confetti({ particleCount: 90, spread: 65, origin: { y: 0.65 }, disableForReducedMotion: true });
  } catch {
    /* canvas unavailable */
  }
}
