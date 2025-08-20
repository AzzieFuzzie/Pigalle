import path from 'path';
import htmlmin from 'html-minifier';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import glslifyPlugin from 'vite-plugin-glslify';
import vitePluginClean from 'vite-plugin-clean';
import pluginPug from '@11ty/eleventy-plugin-pug';
// import imgix from './src/views/_data/imgix.js';


export default function (eleventyConfig) {
  //Global Data
  // eleventyConfig.addGlobalData('imgix', imgix);

  // Set server port
  eleventyConfig.setServerOptions({ port: 3000 });
  eleventyConfig.ignores.add("public/reels/*.mp4");  // temporarily ignore during dev
  // Add Pug plugin
  eleventyConfig.addPlugin(pluginPug);

  // Vite plugin integration
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: '.11ty-vite',
    viteOptions: {
      publicDir: 'public',
      root: 'src',
      build: {
        outDir: '.11ty-vite', // make sure Vite builds here, not _site
        emptyOutDir: true,
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@import "@styles/utils/variables.scss";`,
          },
        },
      },
      plugins: [
        glslifyPlugin(),
        // don't clean _site directly in Vercel builds
        // vitePluginClean({ targets: ['_site'] }),
      ],
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


  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/app');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  // HTML minify transform
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
}