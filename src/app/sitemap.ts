import type { MetadataRoute } from "next";
import { listarEmpresasPublicas } from "@/lib/empresas";
import { urlAbsoluta } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const empresas = await listarEmpresasPublicas();
  return [
    { url: urlAbsoluta("/"), changeFrequency: "daily", priority: 1 },
    { url: urlAbsoluta("/anuncie/"), changeFrequency: "monthly", priority: 0.5 },
    ...empresas.map((e) => ({
      url: urlAbsoluta(`/empresa/${e.slug}/`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
