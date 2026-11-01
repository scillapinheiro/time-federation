export function initStore() {
  const root = document.querySelector("[data-store]");
  if (!root) return;
  const main = root.querySelector("[data-store-main]");
  const thumbs = [...root.querySelectorAll("[data-store-thumb]")];
  const original = { src: main.getAttribute("src"), crop: main.className, alt: main.alt };

  thumbs.forEach((btn) =>
    btn.addEventListener("click", () => {
      const active = btn.getAttribute("aria-current") === "true";
      thumbs.forEach((b) => b.removeAttribute("aria-current"));
      if (active) {
        main.src = original.src;
        main.className = original.crop;
        main.alt = original.alt;
        return;
      }
      btn.setAttribute("aria-current", "true");
      main.src = btn.dataset.src;
      main.className = `crop-${btn.dataset.crop}`;
      main.alt = btn.dataset.alt;
    })
  );
}
