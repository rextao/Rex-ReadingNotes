'use strict';

// const serverBundle = require('./../public/vue-ssr-server-bundle.json');
const serverBundle = require('./../web/dist/vue-ssr-server-bundle.json');
const clientManifest = require('./../web/dist/vue-ssr-client-manifest.json');
// const clientManifest = require('./../public/vue-ssr-client-manifest.json');
const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle,{
  runInNewContext: false,
  template: require('fs').readFileSync('./app/index.template.html', 'utf-8'),
  clientManifest,
})
module.exports = app => {
  const { router, controller } = app;
  router.get('/', ctx => {
    renderer.renderToString(ctx, (err, html) => {
      if (err) {
        ctx.body =err;
      } else {
        ctx.body = html
      }
    })
  });
};


