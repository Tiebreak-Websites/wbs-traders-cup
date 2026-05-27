import { defineConfig } from 'astro/config';

// Warren Bowie & Smith Traders Cup 2026
// Sub-path deployment on wbandsmith.com — adjust `base` to match the host's routing.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets',
    // Inline the CSS into the HTML so it isn't a render-blocking request
    inlineStylesheets: 'always'
  },
  vite: {
    css: { devSourcemap: true }
  }
});
