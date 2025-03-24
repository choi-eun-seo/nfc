/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  basePath: "/nfc",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    const svgrQuery = /comp/;

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: {
          not: [...fileLoaderRule.resourceQuery.not, svgrQuery],
        },
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: svgrQuery,
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
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;
    config.optimization.minimize = true;

    return config;
  },
};

export default nextConfig;
