import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../_site/assets', // bundled files go into Eleventy's output folder
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@utils': path.resolve(__dirname, 'src/app/utils'),
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@shaders': path.resolve(__dirname, 'src/app/shaders'),
      '@classes': path.resolve(__dirname, 'src/app/classes'),
      '@animations': path.resolve(__dirname, 'src/app/animations'),
      '@pages': path.resolve(__dirname, 'src/app/pages'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@styles/utils/variables.scss";`,
      },
    },
  },
});
