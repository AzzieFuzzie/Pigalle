import path from "path";
import fs from "fs";
import htmlmin from "html-minifier";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import pluginPug from "@11ty/eleventy-plugin-pug";

export default function (eleventyConfig) {
  // Temp folder for Vite
  const tempFolder = ".11ty-vite";
  if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

  // Plugins
  eleventyConfig.addPlugin(pluginPug);

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: tempFolder,
    viteOptions: {
      root: "src",
      publicDir: "public",
      build: {

        emptyOutDir: false, // Prevents Eleventy files from being deleted
        rollupOptions: {
          input: {},
        },
      },
    },
  });

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/app");


  // HTML minify
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

  // Directory config
  return {
    dir: {
      input: "src/views",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "pug",
    pathPrefix: "/", // important for root-relative links
  };
};
