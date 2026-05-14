import { defineConfig } from 'astro/config';

// BrainTrade Champions Cup
// Sub-path deployment on thebraintrade.com — adjust `base` to match the host's routing.
export default defineConfig({
  site: 'https://thebraintrade.com',
  base: '/traders-cup-2026',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets'
  },
  vite: {
    css: { devSourcemap: true }
  }
});
