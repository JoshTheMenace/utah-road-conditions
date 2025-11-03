/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable image optimization for Vercel free tier
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
