import { getCMS, local } from "../../lib/cms.js";

export default async function () {
  const cms = await getCMS();
  const fallback = local("booking");
  return {
    whatsapp: cms?.settings?.whatsapp || fallback.whatsapp,
    whatsappMessage: cms?.settings?.whatsappMessage || fallback.whatsappMessage,
  };
}
