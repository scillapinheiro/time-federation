import { getCMS, local } from "../../lib/cms.js";

export default async function () {
  const cms = await getCMS();
  if (!cms) return local("live");
  return {
    shows: (cms.live?.shows || []).map((s) => ({ date: s.date, city: s.city, venue: s.venue, status: s.status || "soon", ticketsUrl: s.ticketsUrl || "" })),
  };
}
