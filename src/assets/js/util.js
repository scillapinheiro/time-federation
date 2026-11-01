export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

export function formatTime(seconds, withHours = false) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  if (withHours) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${sec}`;
  return `${String(m + h * 60).padStart(2, "0")}:${sec}`;
}


// Only one player at a time, and nothing keeps playing off screen.
export function pauseWhenHidden(section, pause, name) {
  document.addEventListener("tf:media-play", (e) => e.detail !== name && pause());
  if (!("IntersectionObserver" in window)) return;
  new IntersectionObserver((entries) => entries[0].isIntersecting || pause(), { threshold: 0.25 }).observe(section);
}

export function announcePlay(name) {
  document.dispatchEvent(new CustomEvent("tf:media-play", { detail: name }));
}
