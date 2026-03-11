/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://malin1-backend.vercel.app/api/:path*'
      }
    ];
  }
};

export default nextConfig;
