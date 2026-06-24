// Lightweight client-side event bus for the site's hidden interactions
// (toasts + achievement unlocks). Components dispatch and listen on `window`
// so we avoid threading a context provider through the whole tree.

export type ToastTone = "primary" | "accent" | "danger";

export type ToastDetail = { id: number; message: string; tone: ToastTone };

let nextId = 1;

/** Fire a transient terminal-styled toast (rendered by EasterEggToaster). */
export function showToast(message: string, tone: ToastTone = "primary") {
  if (typeof window === "undefined") return;
  const detail: ToastDetail = { id: nextId++, message, tone };
  window.dispatchEvent(new CustomEvent<ToastDetail>("egg:toast", { detail }));
}
