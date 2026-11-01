import { reduceMotion } from "./util.js";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Split-flap departures board: rows cascade in, then a random row refreshes now and then.
export function initLive() {
  const root = document.querySelector("[data-live]");
  if (!root) return;

  const clock = root.querySelector("[data-clock]");
  const updateClock = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    clock.innerHTML = `${h}<span class="board__colon">:</span>${m}`;
  };
  updateClock();
  setInterval(updateClock, 15000);

  if (!("IntersectionObserver" in window)) return;

  let rows = [...root.querySelectorAll("[data-board-list]:not([hidden]) .board__row")];

  const spinFlap = (flap, steps, delay) =>
    new Promise((resolve) => {
      const target = flap.dataset.char;
      if (!target.trim()) return resolve();
      let left = steps;
      const step = () => {
        flap.classList.remove("is-flipping");
        void flap.offsetWidth;
        flap.classList.add("is-flipping");
        flap.textContent = left > 0 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : target;
        if (left-- > 0) setTimeout(step, 85);
        else resolve();
      };
      setTimeout(step, delay);
    });

  const spinRow = (row, rowDelay = 0, steps = 6) =>
    Promise.all([...row.querySelectorAll(".flap")].map((f, i) => spinFlap(f, steps + (i % 5), rowDelay + i * 35)));

  // "Past shows" swaps the board to the shows that already happened
  const toggle = root.querySelector("[data-board-toggle]");
  const title = root.querySelector("[data-board-title]");
  toggle?.addEventListener("click", () => {
    const showPast = toggle.getAttribute("aria-pressed") !== "true";
    // Keep the board height so the page does not jump when the list is shorter
    const board = root.querySelector(".board");
    board.style.minHeight = `${Math.max(board.offsetHeight, parseFloat(board.style.minHeight) || 0)}px`;
    toggle.setAttribute("aria-pressed", String(showPast));
    toggle.textContent = showPast ? toggle.dataset.labelUpcoming : toggle.dataset.labelPast;
    title.textContent = showPast ? title.dataset.past : title.dataset.upcoming;
    root.querySelector('[data-board-list="upcoming"]').hidden = showPast;
    root.querySelector('[data-board-list="past"]').hidden = !showPast;
    rows = [...root.querySelectorAll("[data-board-list]:not([hidden]) .board__row")];
    rows.forEach((row, i) => spinRow(row, i * 200, 8));
  });

  let idle = null;
  const startIdle = () => {
    idle = setInterval(() => {
      const row = rows[Math.floor(Math.random() * rows.length)];
      spinRow(row, 0, 3);
    }, 9000);
  };

  // Once scrolling settles, flip the rows that are really on screen.
  // Rows that leave the screen are reset so they flip again next time.
  let settleTimer = null;
  const checkRows = () => {
    const vh = window.innerHeight;
    let order = 0;
    for (const row of rows) {
      const r = row.getBoundingClientRect();
      const visible = r.top >= 0 && r.bottom <= vh * 0.92;
      const gone = r.bottom < 0 || r.top > vh;
      if (visible && !row.dataset.shown) {
        row.dataset.shown = "1";
        spinRow(row, order++ * 450, 13);
      } else if (gone) {
        delete row.dataset.shown;
      }
    }
  };
  const scheduleCheck = () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(checkRows, 220);
  };
  window.addEventListener("scroll", scheduleCheck, { passive: true });
  window.addEventListener("resize", scheduleCheck);
  window.addEventListener("load", () => setTimeout(checkRows, 400));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries[0].isIntersecting;
      if (visible && !idle && !reduceMotion) startIdle();
      if (!visible) {
        clearInterval(idle);
        idle = null;
      }
    },
    { threshold: 0 }
  );
  sectionObserver.observe(root);
}
