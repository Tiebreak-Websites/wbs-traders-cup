import { defineConfig } from 'astro/config';

// 200Invest Traders Championship 2026
// Sub-path deployment on 200invest.com — adjust `base` to match the host's routing.
export default defineConfig({
  site: 'https://200invest.com',
  base: '/traders-championship-2026',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets'
  },
  vite: {
    css: { devSourcemap: true }
  }
});
