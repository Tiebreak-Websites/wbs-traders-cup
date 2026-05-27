import { defineConfig } from 'astro/config';

// Warren Bowie & Smith Traders Cup 2026
// Sub-path deployment on wbandsmith.com — adjust `base` to match the host's routing.
export default defineConfig({
  site: 'https://wbandsmith.com',
  base: '/traders-cup-2026',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets'
  },
  vite: {
    css: { devSourcemap: true }
  }
});
