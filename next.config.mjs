/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  basePath: "/nfc", // GitHub Pages 레포지토리 이름
  assetPrefix: "/nfc/", // 정적 자산 경로 설정

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 기존 webpack 설정 유지
  webpack(config) {
    // SVG 관련 설정
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

  // GitHub Pages를 위한 추가 설정
  experimental: {
    images: {
      unoptimized: true,
    },
  },
};

export default nextConfig;
