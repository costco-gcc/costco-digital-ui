import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoBase = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Enable with `ANALYZE=true npm run build` — opens a treemap report so we
// can spot bundle bloat (heavy deps, unused chunks) before it ships.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? repoBase : '',
  assetPrefix: isProd && repoBase ? repoBase + '/' : undefined,
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
