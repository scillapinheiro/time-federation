import { initNav } from "./nav.js";
import { initCarousels } from "./carousel.js";
import { initWatch } from "./watch.js";
import { initMusic } from "./music.js";
import { initGallery } from "./gallery.js";
import { initStore } from "./store.js";
import { initLive } from "./live.js";
import { reduceMotion } from "./util.js";

function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

// Replay the hourglass drawing every time the visitor comes back to the home screen
function initHomeReplay() {
  const home = document.querySelector(".home");
  const logo = home?.querySelector(".home__logo");
  if (!home || !logo || reduceMotion || !("IntersectionObserver" in window)) return;
  let left = false;
  const replay = () => {
    logo.querySelectorAll(".logo-line, .logo-fill").forEach((el) => {
      el.style.animation = "none";
      void el.getBoundingClientRect();
      el.style.animation = "";
    });
  };
  new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio < 0.2) left = true;
      else if (entry.intersectionRatio > 0.6 && left) {
        left = false;
        replay();
      }
    },
    { threshold: [0, 0.2, 0.6, 1] }
  ).observe(home);
}

function initTimeline() {
  const now = document.querySelector(".timeline__now i");
  if (now) now.title = String(new Date().getFullYear());
}


initNav();
initReveal();
initTimeline();
initHomeReplay();
initCarousels();
initWatch();
initMusic();
initGallery();
initStore();
initLive();
