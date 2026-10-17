// Text-to-speech in Finnish using the browser's built-in voices.

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

function finnishVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang?.toLowerCase().startsWith("fi")) || null;
}

/** Speak Finnish text. Returns false when the device has no speech support. */
export function speak(text) {
  if (!canSpeak()) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ", "));
    u.lang = "fi-FI";
    u.rate = 0.9;
    const v = finnishVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

/** True when a Finnish voice is installed (may be false until voices load). */
export const hasFinnishVoice = () => canSpeak() && !!finnishVoice();
