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

    return {
      src: client.buildURL(path, params),
      srcset: client.buildSrcSet(path, params, { widths }),
      alt: imageField.alt || '',
    };
  }
};

