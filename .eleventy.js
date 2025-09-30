import path from "path";
import fs from "fs";
import htmlmin from "html-minifier";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import pluginPug from "@11ty/eleventy-plugin-pug";

export default function (eleventyConfig) {
  // --- Ensure temp folder exists ---


  // --- Dev server port ---
  eleventyConfig.setServerOptions({ port: 3000 });

  // --- Plugins ---
  eleventyConfig.addPlugin(pluginPug);

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite",
    viteOptions: {
      root: "src",
      publicDir: "public",
      build: {
        emptyOutDir: false, // prevent conflicts on Vercel
        // CRITICAL FIX: Explicitly define the main JavaScript entry point 
        // to ensure Vite properly registers and serves it in both dev and prod mode.
        rollupOptions: {
          input: {

          }
        }
      },
      resolve: {
        alias: {
          "@styles": path.resolve(process.cwd(), "src/styles"),
          "@app": path.resolve(process.cwd(), "src/app"),
          "@utils": path.resolve(process.cwd(), "src/app/utils"),
          "@components": path.resolve(process.cwd(), "src/app/components"),
          "@classes": path.resolve(process.cwd(), "src/app/classes"),
          "@animations": path.resolve(process.cwd(), "src/app/animations"),
          "@pages": path.resolve(process.cwd(), "src/app/pages"),
        },
      },
    },
  });

  // --- Passthrough copy ---
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/app");

  // --- HTML minify ---
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

  // --- Return directory config ---
  return {
    dir: {
      input: "src/views",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "pug",
    templateFormats: ["pug", "html"],
  };
}
