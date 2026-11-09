import type { NextConfig } from "next";

// GitHub Pages: site 100% estático. Sem domínio próprio ele fica em
// facincanitech.github.io/voala, por isso o basePath (vazio com domínio próprio).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  trailingSlash: true, // /empresa/x/index.html: é o formato que o Pages serve
  basePath,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false, // sem .map: não publica o código-fonte junto
};

export default config;
