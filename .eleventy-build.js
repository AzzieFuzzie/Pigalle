import path from "path";
import htmlmin from "html-minifier";
import pluginPug from "@11ty/eleventy-plugin-pug";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {
  // Set server port
  eleventyConfig.setServerOptions({ port: 3000 });

  // Add Pug plugin
  eleventyConfig.addPlugin(pluginPug);

  // Add Vite plugin (handles dev + prod)
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite", // where Vite keeps temp files in dev
    viteOptions: {
      clearScreen: false,
      appType: "mpa", // multi-page app
      build: {
        rollupOptions: {
          input: "src/app/index.js", // your JS entry point
        },
      },
    },
  });

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // HTML minify transform
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
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
      input: "src/views/",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "pug",
  };
}
