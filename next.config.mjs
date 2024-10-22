/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    imageSizes: [16, 32, 64, 128, 256, 384], // default: [16, 32, 48, 64, 96, 128, 256, 384]
    deviceSizes: [640, 1080, 1920], // default:[640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yopick-s3.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.naepick.co.kr',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['naepick.co.kr', 'localhost:3000'],
    },
  },
};

export default nextConfig;
