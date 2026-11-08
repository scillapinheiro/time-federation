import { getCMS, local, img, focal } from "../../lib/cms.js";

export default async function () {
  const cms = await getCMS();
  if (!cms?.store) {
    const data = local("store");
    data.product.photos = data.product.photos.map((p) => ({ ...p, src: `/assets/img/gallery/${p.file}.webp`, srcSm: `/assets/img/gallery/${p.file}-sm.webp`, position: "" }));
    return data;
  }
  const s = cms.store;
  return {
    product: {
      name: s.name,
      kicker: s.kicker,
      description: s.description,
      shopifyUrl: s.shopifyUrl || "",
      photos: (s.photos || []).map((p) => ({ src: img(p.url, 1600), srcSm: img(p.url, 600), alt: p.alt, crop: p.framing || "center", position: focal(p.hotspot) })),
    },
  };
}
