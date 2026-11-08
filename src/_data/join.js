import { getCMS, local } from "../../lib/cms.js";

export default async function () {
  const join = (await getCMS())?.join;
  const fallback = local("join");
  return {
    groupUrl: join?.groupUrl || fallback.groupUrl,
    lead: join?.lead || fallback.lead,
    text: join?.text || fallback.text,
  };
}
