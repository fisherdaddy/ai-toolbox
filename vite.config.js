import { defineConfig } from 'vite';
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    sitemap({
      // plugin options
    }),
  ],
  server: {
    port: 3000
  }
})
