/** @type {import('next').NextConfig} */

let nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
    dangerouslyAllowSVG: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// Only apply PWA in production
if (process.env.NODE_ENV === 'production') {
  try {
    const withPWA = require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
    });
    nextConfig = withPWA(nextConfig);
  } catch {
    // next-pwa not available
  }
}

module.exports = nextConfig;
