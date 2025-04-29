import type { NextConfig } from "next";
import path from "path";


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.ibb.co', 'jardinage.lemonde.fr'],
  },
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     "@": path.resolve(__dirname, "src"),
  //   };
  //   return config;
  // },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during build
  },
};

export default nextConfig;
