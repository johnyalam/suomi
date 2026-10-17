// Light / dark toggle. "system" follows the device; the choice is remembered in this browser.
const KEY = "oppimaan_suomea_theme";

export function initialTheme() {
  try {
    return localStorage.getItem(KEY) || "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}

export function isDarkNow() {
  const t = document.documentElement.getAttribute("data-theme");
  if (t) return t === "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}
