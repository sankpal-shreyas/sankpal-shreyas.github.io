import { showToast } from "./eggs";

// Trophies for the site's easter eggs, persisted in localStorage. Unlocking is
// idempotent and fires a toast + an `egg:unlock` event the first time only.

export type AchievementId =
  | "konami"
  | "root-terminal"
  | "nyc-marker"
  | "logo-masher"
  | "flag"
  | "matrix"
  | "sudo"
  | "shortcuts";

export const ACHIEVEMENTS: Record<AchievementId, { title: string; blurb: string }> = {
  konami: { title: "the_contra_code", blurb: "↑↑↓↓←→←→ba" },
  "root-terminal": { title: "root_access", blurb: "reached the hidden shell" },
  "nyc-marker": { title: "pin_dropped", blurb: "found me on the globe" },
  "logo-masher": { title: "stop_clicking_that", blurb: "mashed the logo" },
  flag: { title: "flag_captured", blurb: "read the flag" },
  matrix: { title: "no_spoon", blurb: "followed the white rabbit" },
  sudo: { title: "nice_try", blurb: "tried to sudo" },
  shortcuts: { title: "rtfm", blurb: "opened the shortcuts overlay" },
};

const KEY = "egg:trophies";

export function getTrophies(): AchievementId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? (raw as AchievementId[]) : [];
  } catch {
    return [];
  }
}

export function unlock(id: AchievementId) {
  if (typeof window === "undefined") return;
  const have = getTrophies();
  if (have.includes(id)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify([...have, id]));
  } catch {
    // storage may be unavailable (private mode); the toast still fires.
  }
  const a = ACHIEVEMENTS[id];
  showToast(`achievement unlocked · ${a.title}`, "accent");
  window.dispatchEvent(new CustomEvent("egg:unlock", { detail: { id } }));
}
