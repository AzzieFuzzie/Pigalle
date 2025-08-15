import path from 'path';
import htmlmin from 'html-minifier';
import pluginPug from '@11ty/eleventy-plugin-pug';

export default async function (eleventyConfig) {
  // Set server port
  eleventyConfig.setServerOptions({ port: 3000 });

  // Add Pug plugin
  eleventyConfig.addPlugin(pluginPug);

  // Only use Vite plugin in development
  if (process.env.ELEVENTY_ENV === 'development') {
    const { default: EleventyVitePlugin } = await import('@11ty/eleventy-plugin-vite');
    const { default: glslifyPlugin } = await import('vite-plugin-glslify');
    const { default: vitePluginClean } = await import('vite-plugin-clean');

    eleventyConfig.addPlugin(EleventyVitePlugin, {
      tempFolderName: '.11ty-vite',
      viteOptions: {
        publicDir: 'public',
        root: 'src',
        css: {
          preprocessorOptions: {
            scss: {
              additionalData: `@import "@styles/utils/variables.scss";`,
            },
          },
        },
        plugins: [
          vitePluginClean({ targets: ['_site'] }),
          glslifyPlugin(),
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
  }

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
};
