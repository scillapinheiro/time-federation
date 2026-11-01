import { getCMS, local, img, focal } from "../../lib/cms.js";

export default async function () {
  const cms = await getCMS();
  const photos = cms?.gallery?.photos?.length
    ? cms.gallery.photos.map((p) => ({ src: img(p.url, 1600), srcSm: img(p.url, 800), alt: p.alt, featured: p.featured !== false, position: focal(p.hotspot) }))
    : local("gallery").photos.map((p) => ({ src: `/assets/img/gallery/${p.file}.webp`, srcSm: `/assets/img/gallery/${p.file}-sm.webp`, alt: p.alt, featured: true, position: "" }));
  photos.forEach((p, i) => (p.index = i));
  const featured = photos.filter((p) => p.featured);
  return { photos, mosaic: (featured.length >= 7 ? featured : photos).slice(0, 7) };
}
