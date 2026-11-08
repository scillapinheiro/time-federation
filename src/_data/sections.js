import { getCMS, local } from "../../lib/cms.js";

// Order and visibility of the sections after Home, managed in the Sanity panel
// ("Geral, seções e Booking"). Store and Live start switched off; test links
// (PREVIEW=1) always show them. Sections missing from the panel list keep
// their default place at the end.
const DEFAULT = ["storytelling", "watch", "music", "gallery", "store", "live", "join", "booking"];
const OFF_BY_DEFAULT = new Set(["store", "live"]);

// Keep only the languages that were actually filled in
const clean = (value) => {
  const out = {};
  for (const lang of ["en", "pt"]) if (value?.[lang]?.trim()) out[lang] = value[lang].trim();
  return out;
};

export default async function () {
  const s = (await getCMS())?.settings;
  const preview = process.env.PREVIEW === "1";

  let list;
  if (s?.sections?.length) {
    list = s.sections
      .filter((i) => DEFAULT.includes(i.section))
      .map((i) => ({ id: i.section, enabled: i.enabled !== false, title: clean(i.title), subtitle: clean(i.subtitle) }));
  } else {
    // No list in the panel yet: old switches for Store and Live, everything else on
    const offline = { store: local("store").enabled === true, live: local("live").enabled === true };
    list = DEFAULT.map((id) => ({
      id,
      enabled: OFF_BY_DEFAULT.has(id) ? (s ? s[id === "store" ? "showStore" : "showLive"] === true : offline[id]) : true,
    }));
  }
  for (const id of DEFAULT) if (!list.some((i) => i.id === id)) list.push({ id, enabled: !OFF_BY_DEFAULT.has(id) });
  if (preview) list.forEach((i) => OFF_BY_DEFAULT.has(i.id) && (i.enabled = true));

  const order = list.filter((i) => i.enabled).map((i) => i.id);
  // Custom names and subtitles typed in the panel ({ en, pt }), empty when not set
  const text = Object.fromEntries(list.map((i) => [i.id, { title: i.title || {}, subtitle: i.subtitle || {} }]));
  return { order, on: Object.fromEntries(DEFAULT.map((id) => [id, order.includes(id)])), text };
}
