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

    // A page is the set of whole columns that fit in the rack (4 tapes on every screen size)
    const track = root.querySelector(".rack__track");
    const rows = () => getComputedStyle(track).gridTemplateRows.split(" ").length;
    const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
    const colWidth = () => items[0]?.getBoundingClientRect().width || 1;
    const colsPerPage = () => Math.max(1, Math.floor((root.clientWidth + gap() + 1) / (colWidth() + gap())));
    const pageWidth = () => colsPerPage() * (colWidth() + gap());
    const pages = () => Math.max(1, Math.ceil(Math.ceil(items.length / rows()) / colsPerPage()));
    const current = () => {
      const max = viewport.scrollWidth - viewport.clientWidth - 2;
      if (viewport.scrollLeft >= max && max > 2) return pages() - 1;
      return Math.min(pages() - 1, Math.round(viewport.scrollLeft / pageWidth()));
    };

    // Leave enough room at the end so the last page can line up with the first column
    const padEnd = () => {
      track.style.paddingInlineEnd = "";
      const need = (pages() - 1) * pageWidth() - (viewport.scrollWidth - viewport.clientWidth);
      if (need > 0) track.style.paddingInlineEnd = `${Math.ceil(need)}px`;
    };

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
      padEnd();
      renderDots();
      update();
    }).observe(viewport);
    orderItems();
    padEnd();
    renderDots();
    update();
  });
}
