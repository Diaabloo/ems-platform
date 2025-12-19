const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Active SWC uniquement (pas de Babel)
  experimental: {
    forceSwcTransforms: true,
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      babel: false,
    };
    return config;
  },

  generateBuildId: async () => {
    // Change cette valeur à chaque fois que vous voulez forcer un nouveau cache
    return 'build-' + Date.now();
  },

  async rewrites() {
          // En mode production (Kubernetes), nous AVONS BESOIN du proxy
          // pour que les appels client (ex: /api/departments) aillent au backend interne.
          return [
              // {
              //     source: '/api/:path*',
              //     // Utilisez la variable BACKEND_API_URL définie dans le Dockerfile
              //     destination: `${process.env.BACKEND_API_URL}/:path*`,
              // },
          ];
      },
};

export default nextConfig;
