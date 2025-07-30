import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // NO pongas output:'export'
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" }, // si cargas imágenes de Supabase Storage
    ],
  },
  eslint: { ignoreDuringBuilds: true }, // evita fallos por ESLint en deploy
  typescript: { ignoreBuildErrors: false }, // falla si hay errores TS (mejor calidad)
};

export default nextConfig;
