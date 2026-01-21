/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ATTENTION : Cela permet de builder même s'il y a des erreurs TS
    ignoreBuildErrors: true,
  },
};

export default nextConfig;