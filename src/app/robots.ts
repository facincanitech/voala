import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/caminho";
import { urlAbsoluta } from "@/lib/site";

export const dynamic = "force-static";

// Obs.: no endereço github.io/voala o Google lê o robots da raiz da conta,
// não este. Este vale quando tiver domínio próprio.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: `${BASE_PATH}/admin/` },
    sitemap: urlAbsoluta("/sitemap.xml"),
  };
}
