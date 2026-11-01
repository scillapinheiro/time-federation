export function initNav() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = nav.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) menu.querySelector("a")?.focus();
  };
  toggle?.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  menu?.querySelectorAll("[data-menu-link]").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Keep the current section when switching language
  document.querySelectorAll("[data-lang-link]").forEach((a) =>
    a.addEventListener("click", () => {
      if (location.hash) a.href = a.href.split("#")[0] + location.hash;
    })
  );

  // Highlight the section in view
  const links = [...nav.querySelectorAll("[data-nav-link]")];
  const sections = [document.getElementById("home"), ...links.map((l) => document.getElementById(l.dataset.navLink))].filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((l) => {
          if (l.dataset.navLink === entry.target.id) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}
