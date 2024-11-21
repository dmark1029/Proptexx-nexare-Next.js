/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
    },
  ],
  reactStrictMode: true,
  images: {
    domains: ["dev-app.proptexx.ai"],
  },
  webpack: (config) => {
    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/virtual_staging",
        destination: "/virtual-staging",
      },
      {
        source: "/virtual_renovation",
        destination: "/virtual-renovation",
      },
      {
        source: "/virtual_refurnishing",
        destination: "/virtual-refurnishing",
      },
      {
        source: "/object_removal",
        destination: "/object-removal",
      },
      {
        source: '/partner/receiver',
        destination: '/api/partner/receiver',
      },
      {
        source: '/partner/signup',
        destination: '/api/partner/signup',
      },
      {
        source: '/api/upload',
        destination: '/api/upload',
      },
    ];
  },
};

module.exports = nextConfig;
