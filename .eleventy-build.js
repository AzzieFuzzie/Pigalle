import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {
  // … your existing config …

  // Add Vite integration
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite", // temp dir for dev server
    viteOptions: {
      build: {
        rollupOptions: {
          input: "src/app/index.js", // entry file
        },
      },
    },
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
