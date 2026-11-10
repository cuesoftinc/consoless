import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained production server (.next/standalone/server.js)
  // for the Docker image that `docker compose up` builds.
  output: "standalone",
  // The API reference lives on the docs site until an OpenAPI document
  // exists to render in-app; the marketing footer links to /docs/api.
  async redirects() {
    return [
      {
        source: "/docs/api",
        destination: "https://cuesoft.gitbook.io/consoless/system/api",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
