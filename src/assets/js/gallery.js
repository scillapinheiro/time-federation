export function initGallery() {
  const root = document.querySelector("[data-gallery]");
  if (!root) return;
  const dialog = root.querySelector("[data-lightbox]");
  const img = root.querySelector("[data-lightbox-img]");
  const photos = JSON.parse(root.querySelector("[data-gallery-data]").textContent);
  const lang = document.documentElement.lang.startsWith("pt") ? "pt" : "en";
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + photos.length) % photos.length;
    const p = photos[index];
    img.src = p.src;
    img.alt = p.alt[lang] || p.alt.en;
  };

  root.querySelectorAll("[data-gallery-open]").forEach((btn) =>
    btn.addEventListener("click", () => {
      opener = btn;
      show(Number(btn.dataset.galleryOpen));
      dialog.showModal();
    })
  );
  root.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(index - 1));
  root.querySelector("[data-lightbox-next]").addEventListener("click", () => show(index + 1));
  root.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => opener?.focus());
  dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  let startX = null;
  dialog.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
}
