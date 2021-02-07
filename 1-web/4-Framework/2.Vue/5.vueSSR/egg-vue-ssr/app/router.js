const {createBundleRenderer} = require('vue-server-renderer')
const axios = require('axios');
const webpackConfig = require('./../web/config/webpack.server.js');
const webpack = require("webpack");
const MemoryFS = require('memory-fs')
const path = require('path');
const compiler =webpack(webpackConfig);
const mfs = new MemoryFS();
let bundle = ''
compiler.outputFileSystem = mfs
compiler.watch({},(err, stats) => {
  const bundlePath = path.join(
      webpackConfig.output.path,
      'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath,'utf-8'))
  console.log('bundle update')
});

function renderToString(context,renderer) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
}

module.exports = app => {
  const { router, controller } = app;
  router.get('/', async (ctx) => {
    if (!bundle) {
      ctx.body = '等待webpack打包完成后在访问在访问'
      return
    }
    const clientManifestResp = await axios.get('http://localhost:8080/vue-ssr-client-manifest.json');
    const clientManifest = clientManifestResp.data;
    const renderer = createBundleRenderer(bundle,{
      runInNewContext: false,
      template: require('fs').readFileSync('./app/index.template.html', 'utf-8'),
      clientManifest,
    })
    ctx.body = await renderToString(ctx,renderer);
  });
};

