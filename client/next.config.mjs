/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Désactiver complètement le cache Babel
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Forcer SWC et désactiver Babel
    config.resolve.fallback = {
      ...config.resolve.fallback,
      babel: false,
    };
    return config;
  },
}

export default nextConfig