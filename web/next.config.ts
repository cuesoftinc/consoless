import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained production server (.next/standalone/server.js)
  // for the Docker image that `docker compose up` builds.
  output: "standalone",
};

export default nextConfig;
