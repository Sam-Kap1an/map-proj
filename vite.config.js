import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Set this to '/' since you're using root or docs/
  build: {
    outDir: 'docs', // Output build files to 'docs/'
  },
});