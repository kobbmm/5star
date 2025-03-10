/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable static optimization for email-verified page
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // เพิ่ม serverExternalPackages แทน serverComponentsExternalPackages
  serverExternalPackages: ['@prisma/client'],
  
  // จำเป็นต้องปิดการใช้ Static Export เพราะใช้ API routes
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // เพิ่ม distDir เพื่อให้แน่ใจว่า build ถูกที่
  distDir: '.next',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // เพิ่ม trailingSlash false เพื่อหลีกเลี่ยงปัญหาการ redirect
  trailingSlash: false,
};

module.exports = nextConfig;