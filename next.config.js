/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@remotion/renderer'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, '@remotion/bundler', 'esbuild'];
    }
    return config;
  },
};

module.exports = nextConfig;
