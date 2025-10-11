const ImgixClient = require('@imgix/js-core');
require('dotenv').config();

const repoName = process.env.PRISMIC_REPOSITORY;

const client = new ImgixClient({
  domain: 'images.prismic.io',
  useHTTPS: true,
  includeLibraryParam: false,
});

module.exports = {
  imgix: function (imageField, params = {}, widths = [400, 800, 1200, 1600]) {
    if (!imageField || !imageField.url) return {};

    const urlWithoutParams = imageField.url.split('?')[0];
    const filename = urlWithoutParams.split('/').pop();
    const path = `${repoName}/${filename}`;

    // 1. Define safe, universal defaults.
    const defaultParams = {
      auto: 'compress,format', // Always optimize the image.
      fit: 'crop',              // This is almost always what you want.
      crop: 'center',             // A safe default crop mode.
    };

    // 2. Merge the defaults with params from your Pug file.
    //    Anything in 'params' will overwrite the default.
    const finalParams = { ...defaultParams, ...params };

    return {
      src: client.buildURL(path, finalParams),
      srcset: client.buildSrcSet(path, finalParams, { widths }),
      alt: imageField.alt || '',
    };
  }
};