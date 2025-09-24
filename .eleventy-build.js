import path from 'path';
import fs from 'fs';
import htmlmin from 'html-minifier';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import pluginPug from '@11ty/eleventy-plugin-pug';

export default function (eleventyConfig) {
  // --- Ensure temp folder exists ---
  const tempFolder = '.11ty-vite';
  if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

  // --- Server ---
  eleventyConfig.setServerOptions({ port: 3000 });

  // --- Plugins ---
  eleventyConfig.addPlugin(pluginPug);

  // --- EleventyVitePlugin ---
  // Do NOT set outDir to _site here — let Eleventy handle it
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: tempFolder,
    viteOptions: {
      root: 'src',
      publicDir: 'public',
      build: {
        rollupOptions: {
          input: {}, // optional: entry points for JS/CSS
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
        alias: {
          '@styles': path.resolve(process.cwd(), 'src/styles'),
          '@app': path.resolve(process.cwd(), 'src/app'),
          '@utils': path.resolve(process.cwd(), 'src/app/utils'),
          '@components': path.resolve(process.cwd(), 'src/app/components'),
          '@shaders': path.resolve(process.cwd(), 'src/app/shaders'),
          '@classes': path.resolve(process.cwd(), 'src/app/classes'),
          '@animations': path.resolve(process.cwd(), 'src/app/animations'),
          '@pages': path.resolve(process.cwd(), 'src/app/pages'),
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
      output: '_site', // Vercel expects _site
      includes: '_includes',
      data: '_data',
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: 'pug',
  };
};
