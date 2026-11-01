import { getCMS, local, spotifyId } from "../../lib/cms.js";

export default async function () {
  const cms = await getCMS();
  if (!cms?.music?.tracks) return local("music");
  return {
    releases: cms.music.tracks
      .filter((t) => !t.hidden && t.spotifyUrl)
      .map((t) => ({
        spotifyId: spotifyId(t.spotifyUrl),
        title: t.title,
        label: t.label,
        artists: t.artists,
        releaseDate: t.releaseDate,
      })),
  };
}
