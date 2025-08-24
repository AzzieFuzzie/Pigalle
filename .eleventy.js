import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import htmlmin from 'html-minifier';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import pluginPug from '@11ty/eleventy-plugin-pug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default function (eleventyConfig) {
  // --- Ensure temp folder exists ---
  const tempFolder = '.11ty-vite';
  if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

  // --- Server ---
  eleventyConfig.setServerOptions({ port: 3000 });

  // --- Plugins ---
  eleventyConfig.addPlugin(pluginPug);

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: tempFolder,
    viteOptions: {
      root: 'src',
      publicDir: 'public',
      build: {
        outDir: tempFolder,
        emptyOutDir: true,
        rollupOptions: {
          input: {}, // prevents Vite from trying to bundle index.html
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@import "@styles/utils/variables.scss";`,
          },
        },
      },
      resolve: {
        // Create alias for directories, simplifying import paths
        alias: {
          '@styles': path.resolve(__dirname, 'src/styles'),
          '@app': path.resolve(__dirname, 'src/app'),
          '@utils': path.resolve(__dirname, 'src/app/utils'),
          '@components': path.resolve(__dirname, 'src/app/components'),
          '@shaders': path.resolve(__dirname, 'src/app/shaders'),
          '@classes': path.resolve(__dirname, 'src/app/classes'),
          '@animations': path.resolve(__dirname, 'src/app/animations'),
          '@pages': path.resolve(__dirname, 'src/app/pages'),
          '@canvas': path.resolve(__dirname, 'src/app/components/Canvas'),
        },
      },
    },
  });

  // --- Passthrough copy ---
  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/app');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  // --- HTML minify ---
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  // --- Return directory config ---
  return {
    dir: {
      input: 'src/views/',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: 'pug',
  };
};
