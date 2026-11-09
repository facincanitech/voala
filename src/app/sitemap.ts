import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/caminho";
import { listarEmpresasPublicas } from "@/lib/empresas";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `${SITE.url}${BASE_PATH}`;
  const empresas = await listarEmpresasPublicas();
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/anuncie/`, changeFrequency: "monthly", priority: 0.5 },
    ...empresas.map((e) => ({
      url: `${base}/empresa/${e.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
