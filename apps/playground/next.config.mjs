/** Static export so the playground deploys to GitHub Pages. */
const pages = process.env.GITHUB_PAGES === 'true';
export default {
  output: 'export',
  basePath: pages ? '/ui-system' : '',
  images: { unoptimized: true },
  transpilePackages: ['@ui-system/core', '@ui-system/react'],
  trailingSlash: true,
};
