/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
module.exports = {
    env: {
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  };
  