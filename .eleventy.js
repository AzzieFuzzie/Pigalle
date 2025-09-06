// Essential module imports for the configuration
import path from 'path';
import htmlmin from 'html-minifier';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import { VitePWA } from 'vite-plugin-pwa';
import vitePluginClean from 'vite-plugin-clean';


export default function (eleventyConfig) {
  // Configuring the Eleventy server to run on port 3000
  eleventyConfig.setServerOptions({
    port: 3000,
  });

  // Integrate Vite with Eleventy using the Eleventy Vite Plugin
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    // Specify the directory where Vite-specific temporary files will be stored
    tempFolderName: '.11ty-vite',
    // Options tailored for the Vite build tool
    viteOptions: {
      // Directory to serve static assets from
      publicDir: 'public',
      // Set the root directory for Vite
      root: 'src',
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@import "@styles/utils/variables.scss";`,
          },
        },
      },
      // List of Vite plugins to use
      plugins: [
        // PWA (Progressive Web App) settings using VitePWA plugin
        // VitePWA({
        //   injectRegister: 'script',
        //   registerType: 'autoUpdate',
        //   includeAssets: [],
        //   workbox: {
        //     globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff,woff2}'],
        //   },
        // }),
        vitePluginClean({ targets: ['_site'] }),
        glslifyPlugin.default(), // Note: glslifyPlugin is default export
      ],

      // Module resolve options
      resolve: {
        // Create alias for directories, simplifying import paths
        alias: {
          '@styles': path.resolve(process.cwd(), 'src/styles'),
          '@app': path.resolve(process.cwd(), 'src/app'),
          '@utils': path.resolve(process.cwd(), 'src/app/utils'),
          '@components': path.resolve(process.cwd(), 'src/app/components'),
          '@shaders': path.resolve(process.cwd(), 'src/app/shaders'),
          '@classes': path.resolve(process.cwd(), 'src/app/classes'),
          '@animations': path.resolve(process.cwd(), 'src/app/animations'),
          '@pages': path.resolve(process.cwd(), 'src/app/pages'),
          '@canvas': path.resolve(process.cwd(), 'src/app/components/Canvas'),
        },
      },
    },
  });

  // Specify directories and files that should bypass Eleventy's processing and be copied "as-is"
  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/app');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  // Minify HTML files before writing to the output directory
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

  // Define input and output directories for Eleventy, set passthrough copy, and set template engine to Pug
  return {
    dir: {
      input: 'src/views',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: 'pug',
  };
}
