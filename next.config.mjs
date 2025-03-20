// export default nextConfig;
/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack(config) {
    // 기존 SVG 설정 유지
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
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
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    // 추가 최적화
    config.optimization.minimize = true;

    return config;
  },
};

export default nextConfig;