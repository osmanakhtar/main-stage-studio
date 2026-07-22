import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Single-file HTML pages, matching the puremed pipeline convention —
    // keeps CSS inline so the page works whether served by Cloudways or
    // previewed standalone by the Stage review tool.
    inlineStylesheets: 'always',
  },
});
