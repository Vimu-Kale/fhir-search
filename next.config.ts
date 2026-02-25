import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? "/fhir-search" : "",
  assetPrefix: isGhPages ? "/fhir-search/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
