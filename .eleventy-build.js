import path from 'path';
import fs from 'fs';
import htmlmin from 'html-minifier';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import pluginPug from '@11ty/eleventy-plugin-pug';

export default function (eleventyConfig) {
  const tempFolder = '.11ty-vite';
  if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

  eleventyConfig.setServerOptions({ port: 3000 });
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
          input: {},
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

  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/app');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

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
