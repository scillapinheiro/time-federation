import { getCMS, local, youtubeId } from "../../lib/cms.js";

export default async function () {
  const cms = await getCMS();
  if (!cms?.watch?.tapes) return local("watch");
  return {
    items: cms.watch.tapes
      .filter((t) => !t.hidden && t.youtubeUrl)
      .map((t) => ({
        youtubeId: youtubeId(t.youtubeUrl),
        type: t.type,
        label: t.label,
        title: t.title,
        description: t.description,
        duration: t.duration,
      })),
  };
}
