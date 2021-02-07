# egg-vue-ssr



## 基础实现

1. 首先，使用 egg 官方提供的初始化方法，初始化 egg  项目
2. 实现简单vue ssr项目，主要参见ssr官方文档 
   - 即可以通过执行`webpack --config webpack.server.js` （文档有介绍）生成xxxxxx.json 文件
3. 使用egg，将请求利用 `renderer.renderToString`返回
   - 只使用`entry-server.js`， 由于只是服务端渲染，页面是没有js的。。。
4. 加入`entry-client.js`， 实现事件机制
   - 注意：由于会挂载到`id=app`上，故模板`index.template.html`需要有 `id = app`
5. 至此，实现了，通过执行webpack命令生成xxxxx.json 文件，实现egg 服务端渲染
   - 主要问题是，每次修改文件，都需要手动触发webpack编译新的json文件

## 监视文件改动，重新生成json

1. 最简单的方式是，直接通过`webpack --watch`，文件改变后，会重新编译

   ```javascript
   "dev-client": "webpack --watch --progress --config config/webpack.client.js",
   "dev-server": "webpack --watch --progress --config config/webpack.server.js"
   ```

   - 主要问题是，需要启动两个编译进程加一个egg运行node进程
   - 无法实现修改文件后，热更新代码
   - webpack 使用普通文件系统来读取文件并将文件写入磁盘，效率肯定不高

2. 利用egg访问时，监测文件变化，在egg，router里，增加使用`webpack.watch`监测变化，生成server.json文件

   ```javascript
   const {createBundleRenderer} = require('vue-server-renderer')
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
   
   const clientManifest = require('./../web/dist/vue-ssr-client-manifest.json');
   
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
   
       const renderer = createBundleRenderer(bundle,{
         runInNewContext: false,
         template: require('fs').readFileSync('./app/index.template.html', 'utf-8'),
         clientManifest,
       })
       ctx.body = await renderToString(ctx,renderer);
     });
   };
   ```

   - 将bundle输出到内存中，加快读取速度

3. 加入devserver实现dev环境，实时渲染

   - 在`devDependencies`加入`webpack-dev-server`

   - 启动脚本为：`webpack serve  --config config/webpack.client.js`

   - 关键

     - 由于egg，启动在http://127.0.0.1:7001/

     - 而js等会被devServer启动在`http://localhost:8080`在

     - 由于使用127.0.0.1访问egg-ssr服务，故访问main.js等静态资源会404，解决办法

       - 修改node server将这些静态资源的请求代理到 webpack dev server中

       - 改变webpack的baseUrl，直接引用到webpack dev server中（这样更简单）

         ```javascript
         output:{
           publicPath: 'http://127.0.0.1:8080'
         },
         ```

4. 至此完成 egg-vue-ssr简单项目



## 使用egg替换dev-server

1. 







如何切换ssr与csr







问题

1. node，执行`webpack.run` 并没有打包结果，但命令行执行是可以的

   - 主要原因是入口配置存在问题，开始配置是`entry: './../entry/entry-server.js',`
   - 改用：`entry: path.resolve(__dirname,'../entry/entry-server.js'),` ，保证从当前文件的路径开始
   - 解决：最终是因为entry，配置不对导致，node执行js和命令行执行会导致差异
   - 注意打印错误信息，定位错误，status会报具体错误，开始未打印错误，导致查了很久

2. egg 执行目录的问题，如下代码在单独js文件中执行，是无问题的

   ```javascript
   const webpackConfig = require('./../web/config/webpack.server.js');
   const webpack = require("webpack");
   const MemoryFS = require('memory-fs')
   const path = require('path');
   const compiler =webpack(webpackConfig);
   const mfs = new MemoryFS();
   
   compiler.outputFileSystem = mfs
   compiler.watch({},(err, stats) => {
       const bundlePath = path.join(
           webpackConfig.output.path,
           'vue-ssr-server-bundle.json'
       )
       const bundle = JSON.parse(mfs.readFileSync(bundlePath,'utf-8'))
       console.log(bundle)
   });
   
   ```

   - 但利用egg： `npm run dev`，把代码整合在router中，会报 `bundlePath`找不到
   - 解决：要打印watch的stats 报错信息，最终是因为babel-loader，没有安装导致的问题















