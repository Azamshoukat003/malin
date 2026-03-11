/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://malinkiddy-backend.vercel.app/api/:path*'
      }
    ];
  }
};

export default nextConfig;
