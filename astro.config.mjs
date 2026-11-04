import { defineConfig } from 'astro/config';

const guidePreview = process.env.GUIDE_PREVIEW_DIR === 'dist-guide';
const behindPreview = process.env.BEHIND_PREVIEW_DIR === 'dist-behind';

export default defineConfig({
  site: 'https://coconsult.fr',
  ...(guidePreview ? { outDir: 'dist-guide' } : {}),
  ...(behindPreview ? { outDir: 'dist-behind' } : {}),
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
