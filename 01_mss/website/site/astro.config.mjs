import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    // Single-file HTML pages, matching the puremed pipeline convention —
    // keeps CSS inline so the page works whether served by Cloudways or
    // previewed standalone by the Stage review tool.
    inlineStylesheets: 'always',
  },
});
