// /** @type {import('next').NextConfig} */
// const nextConfig = {
  
//   experimental: {},
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */

  webpack(config) {
    // Grab the existing rule that handles SVG imports

    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    const svgrQuery = /comp/;

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: {
          not: [...fileLoaderRule.resourceQuery.not, svgrQuery],
        }, // exclude if *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: svgrQuery, // *.svg?url
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
              replaceAttrValues: {
                "#000": "{props.color ?? 'currentColor'}",
              },
            },
          },
        ],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
