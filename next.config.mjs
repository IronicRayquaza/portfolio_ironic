import path from "node:path";

const projectRoot = import.meta.dirname;

/**
 * D:\ root contains a stray package.json / package-lock.json from some earlier
 * project. Without pinning the root here, Next walks up, decides the workspace
 * is the whole D: drive, and tries to trace 447GB of games and video — which
 * looks exactly like a silent hang. Both keys below must point at this folder.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
};

export default nextConfig;
