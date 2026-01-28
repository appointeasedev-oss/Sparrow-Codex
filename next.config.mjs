/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "localhost:5000",
    "127.0.0.1:5000",
    "*.replit.dev",
    "*.janeway.replit.dev",
    "*.pike.replit.dev",
    "*.spock.replit.dev",
    "*.kirk.replit.dev",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
}

export default nextConfig
