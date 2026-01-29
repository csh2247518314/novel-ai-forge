/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.openai.com',
      },
      {
        protocol: 'https',
        hostname: 'api.anthropic.com',
      },
    ],
  },
  // 生产环境优化
  output: 'standalone',
  trailingSlash: true,
};

module.exports = nextConfig;
