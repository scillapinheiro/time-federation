// Tape racks: a horizontal scroller that always shows a slice of the next tapes.
export function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const viewport = root.querySelector("[data-carousel-viewport]");
    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");
    const dots = root.querySelector("[data-carousel-dots]");

    const items = [...root.querySelectorAll(".rack__item")];
    // Two-row racks scroll in columns, but should read left to right like the design
    const orderItems = () => {
      const rows = getComputedStyle(root.querySelector(".rack__track")).gridTemplateRows.split(" ").length;
      items.forEach((item, i) => {
        if (rows < 2) return (item.style.order = "");
        const page = Math.floor(i / 4), k = i % 4;
        item.style.order = String(page * 4 + (k % 2) * 2 + Math.floor(k / 2));
      });
    };

    const pageWidth = () => viewport.clientWidth - 90; // keep the faded slice visible
    const pages = () => Math.max(1, Math.ceil((viewport.scrollWidth - 4) / pageWidth()));
    const current = () => Math.round(viewport.scrollLeft / pageWidth());

    const renderDots = () => {
      const n = pages();
      dots.replaceChildren();
      if (n < 2) return;
      for (let i = 0; i < n; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `${i + 1} / ${n}`);
        b.addEventListener("click", () => viewport.scrollTo({ left: i * pageWidth(), behavior: "smooth" }));
        dots.append(b);
      }
    };

    const update = () => {
      const max = viewport.scrollWidth - viewport.clientWidth - 2;
      const scrollable = max > 2;
      prev.hidden = next.hidden = !scrollable;
      prev.disabled = viewport.scrollLeft <= 2;
      next.disabled = viewport.scrollLeft >= max;
      const c = current();
      [...dots.children].forEach((d, i) => d.setAttribute("aria-current", String(i === c)));
    };

    prev.addEventListener("click", () => viewport.scrollBy({ left: -pageWidth(), behavior: "smooth" }));
    next.addEventListener("click", () => viewport.scrollBy({ left: pageWidth(), behavior: "smooth" }));
    viewport.addEventListener("scroll", update, { passive: true });
    new ResizeObserver(() => {
      orderItems();
      renderDots();
      update();
    }).observe(viewport);
    orderItems();
    renderDots();
    update();
  });
}
