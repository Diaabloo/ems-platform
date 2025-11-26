/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ Ignorer les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignorer les erreurs ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  // ✅ Activer SWC au lieu de Babel
  swcMinify: true,
  // ✅ Désactiver la télémétrie
  telemetry: false,
}

export default nextConfig