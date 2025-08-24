// vite.config.js
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
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
});
