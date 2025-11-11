/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper handling of images and API routes
  images: {
    domains: [],
    unoptimized: false,
  },
  // Ensure API routes use Node.js runtime by default
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
