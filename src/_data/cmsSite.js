import { getCMS } from "../../lib/cms.js";

// Social links, channel and share info managed in Sanity (merged over site.json in templates)
export default async function () {
  const s = (await getCMS())?.settings;
  if (!s) return {};
  return {
    social: s.socials?.length ? s.socials : undefined,
    youtubeChannel: s.youtubeChannel,
    shareImage: s.shareImage,
    shareText: s.shareText,
  };
}
