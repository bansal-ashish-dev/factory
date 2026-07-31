const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "asset.threadbuy.com",
      },
      {
        protocol: "https",
        hostname: "lsxbwigpsqytehupjass.supabase.co",
      },
      {
        protocol: "https",
        hostname: "gcmhbsjkpcfrtduabhpe.storage.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "pub-47602b7b28424220ad1b5c085c2c66c9.r2.dev",
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
