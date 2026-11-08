import { getCMS, local, img, focal } from "../../lib/cms.js";

const paragraphs = (text) => {
  const out = {};
  for (const [lang, value] of Object.entries(text || {})) {
    if (typeof value === "string") out[lang] = value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }
  return out;
};

export default async function () {
  const story = (await getCMS())?.storytelling;
  if (!story) {
    const data = local("storytelling");
    for (const key of ["whoWeAre", "whatWeSee", "whatWeFight", "mission"]) data[key] = paragraphs(data[key]);
    data.members = data.members.map((m) => ({ ...m, src: `/assets/img/gallery/${m.file}.webp`, srcSm: `/assets/img/gallery/${m.file}-sm.webp`, position: "" }));
    return data;
  }
  return {
    headline: story.headline,
    whoWeAre: paragraphs(story.whoWeAre),
    whatWeSee: paragraphs(story.whatWeSee),
    whatWeFight: paragraphs(story.whatWeFight),
    mission: paragraphs(story.mission),
    crewIntro: story.crewIntro,
    members: (story.members || []).map((m) => ({
      name: m.name,
      bio: m.bio,
      alt: m.photo?.alt || { en: m.name, pt: m.name },
      src: m.photo?.url ? img(m.photo.url, 1000) : "",
      srcSm: m.photo?.url ? img(m.photo.url, 600) : "",
      position: focal(m.photo?.hotspot),
    })),
  };
}
