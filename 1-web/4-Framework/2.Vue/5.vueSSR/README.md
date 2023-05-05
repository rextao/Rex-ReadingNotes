# egg-vue-ssr

1. 学习vue-ssr基本实现
   - 主要是在基本的vue-webpack配置上，增加vue-ssr插件（server版本不使用插件，会生成js）
   - 关键是调用`createBundleRenderer`，第一参数可以是js或json文件，或是html的完整content
2. egg-vue-ssr，简单egg-view封装（egg插件的简单开发），csr与ssr切换
   - Egg 实现 vue-ssr的基本逻辑
   - 主要是熟悉下egg的插件+view插件
3. 大致了解，easy-webpack的ssr的实现原理
   - 实际还是启动一个egg进程+2个koa进程（分别利用koa中间件，热更新server和client文件）
   - 采用自己生产clientManifest+自己inject资源到html中的方式，优化了`createBundleRenderer(name, {..., clientManifest})`，依赖关系是在 Egg 运行期间解析的问题
   - 但clientManifest local环境生成在磁盘中，之后可以做优化？？？？？？
   - 修改server代码，egg会自动重启，webpack编译会重启，故在Agent里面启动 Webpack 编译服务解决 Webpack compiler 实例问题（其实就是在agent启动webpack编译，利用message机制，相互通信）

## 基础实现

1. 首先，使用 egg 官方提供的初始化方法，初始化 egg  项目

2. 参照官方文档：https://ssr.vuejs.org/zh/guide/build-config.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE-client-config，以及`webpack.base.config.js`

   ```javascript
   const path = require('path')
   const VueLoaderPlugin = require('vue-loader/lib/plugin')
   module.exports = {
     mode: 'development',
     module: {
       rules: [
         {
           test:/\.js$/,
           use: {
             loader: 'babel-loader',
             options: {
               presets: ['@babel/preset-env']
             }
           },
           exclude:[/node_modules/,/assets/]
         },
         {
           test:/\.vue$/,
           use: {
             loader: 'vue-loader',
           },
         }
       ]
     },
     plugins:[
       new VueLoaderPlugin()
     ]
   }
   
   ```

   - 形成最基本的vue webpack打包配置

3. 配置打包命令，即可以通过执行`webpack --config webpack.server.js` （文档有介绍）生成xxxxxx.json 文件，需要分别打包`webpack.server.js`和`webpack.client.js`，会分别生成两个xxxxx.json文件

4. 因此，通过在egg/app/router.js，调用如下命令，即可实现ssr渲染

   ```javascript
   const serverBundle = require('./dist/vue-ssr-server-bundle.json')
   const clientManifest = require('./dist/vue-ssr-client-manifest.json')
   const renderer = createBundleRenderer(serverBundle, {
     runInNewContext: false, // 推荐
     template, // （可选）页面模板
     clientManifest // （可选）客户端构建 manifest
   })
   renderer.renderToString()
   ```

   - 只使用 sever-bundle.json，由于只是服务端渲染，页面是没有js的。。。
   - 故需要加入clientManifest，实现事件机制
     - 注意：由于会挂载到`id=app`上，故模板`index.template.html`需要有 `id = app`

5. 因此，对于vue-ssr

   - 打包方面，server与client分别不同入口
   - 分别使用`vue-server-renderer`的`client-plugin`与`server-plugin`
   - 服务端在返回html时，调用createBundleRenderer即可
   - 可参见基础项目：https://github.com/rextao/vue-egg-ssr/tree/base-ssr   base-ssr分支

## egg view模板插件实现

1. 参照`egg-view-vue-ssr`，我们也利用egg -view 实现个egg-view插件

2. egg-view 插件，关键的是（以下是在自己的插件文件夹中）

   - `app.js` 绑定view 模板

     ```javascript
     module.exports = app => {
       app.view.use('vue', require('./lib/view'));
     };
     ```

   - 在`config/config.default.js`，告诉egg，使用的模板

     ```javascript
     module.exports = app => {
       const config = {};
       config.view = {
         mapping: {
           '.json': 'vue',
         },
       };
       return config;
     };
     ```

3. 使用egg-view模板，有一些egg的限制，需要遵守

   - `router.js`的render方法，会为`ctx.body`赋值，故直接使用`await ctx.render('vue-ssr-server-bundle.json');`即可

   - `render`需传入name，且此文件需在app/view文件夹下可找到（为了方便，会将打包的生成文件从dist，输出到app/view文件夹下）；之后，在使用name时，会被解析为绝对路径

   - `config/config.default.js`的配置是告诉view模板，.json 的文件，使用我自己定义的view模板：`app.view.use('vue', require('./lib/view'));`

   - 简单的render函数为：

     ```javascript
     async render(name) {
       const clientManifest = this.readFile('vue-ssr-client-manifest.json');
       const renderer = createBundleRenderer(name,{
         runInNewContext: false,
         template: fs.readFileSync('./app/index.template.html', 'utf-8'),
         clientManifest,
       })
       return await renderer.renderToString();
     }
     ```

4. 如何实现csr渲染的`renderClient` 方法

   - 通过`webpack --config config/webpack.client.js`会打包出csr需要的js
   - 即csr就是输出一个html，里面插入这个几个js文件即可

5. 最简单的方式是，使用`HtmlWebpackPlugin`，让webpack打包时，生成一个已经插入好js的的 html

   ```javascript
   plugins: [
     new VueSSRClientPlugin(),
     new HtmlWebpackPlugin({
       filename: 'index.csr.html',
       template:path.resolve(__dirname,'./index.template.html'),
     })
   ]
   ```

   - 因此，renderClient也非常简单

     ```javascript
     async renderClient() {
       return fs.readFileSync('./app/view/index.csr.html','utf-8')
     }
     ```

6. easy采用，读取`index.template.html`模板，生成vue实例，利用`renderer.renderToString`，然后再手动注入main.js等resource文件

7. 补充：

   - server 的bundle不一定非要是json文件，可以不加入vue ssr插件，让server的打包生成js
   - `createBundleRenderer`也可读取js文件

8. 最终

   - 实现简单csr与ssr
   - 结合egg，利用插件方式实现 
   - 可参见：https://github.com/rextao/vue-egg-ssr/tree/egg-view-vue-ssr   egg-view-vue-ssr分支



## 本地开发模式的尝试

### 最简单的方式

1. 直接通过`webpack --watch`，文件改变后，会重新编译，即启动egg服务时（egg-bin dev）同时，启动如下两个watch

   ```javascript
   "dev-client": "webpack --watch --progress --config config/webpack.client.js",
   "dev-server": "webpack --watch --progress --config config/webpack.server.js"
   ```

   - 主要问题是，需要启动两个编译进程加一个egg运行node进程
   - 无法实现修改文件后，热更新代码
   - webpack 使用普通文件系统来读取文件并将文件写入磁盘，效率肯定不高

### egg插件方式

1. 这种启动3个命令行的方式，肯定不友好，我们希望

   - 编写一个egg-webpack插件，在本地环境使用
   - 这个插件，可以监听vue文件变化生成新的xxxxx.json文件
   - egg-view-vue-ssr，会读取app/view 文件夹下的对应json文件

2. 最简单的方式，是在`egg-webpack/app.js`，写两个`compiler.watch`，在启动egg的同时，启动两个webpack watch进程

   ```javascript
   const webpackConfig = require('./../../../web/config/webpack.server.js');
   const webpackClientConfig = require('./../../../web/config/webpack.client.js');
   const webpack = require("webpack");
   const compilerServer =webpack(webpackConfig);
   const compilerClient =webpack(webpackClientConfig);
   module.exports = app => {
       compilerServer.watch({},(err, stats) => {
           console.log('server bundle update')
       });
       compilerClient.watch({},(err, stats) => {
           console.log('client bundle update')
       });
   }
   ```

   - 这种方式，本质和简单方式没啥区别，只是通过egg，启动webpack watch
   - 还是无法实现文件改动时，自动页面热更新

3. 简单的解决使用内存方式读写

   ```javascript
   const MemoryFS = require('memory-fs')
   const mfs = new MemoryFS();
   module.exports = app => {
     compilerServer.outputFileSystem = mfs;
     if (app.view) {
       app.view.resolve = function (name) {
         return Promise.resolve(name);
       };
     }
     if (app.vue) {
       const render = app.vue.render;
       app.vue.render = (name) => {
         const bundle = JSON.parse(mfs.readFileSync(name,'utf-8'))
         return render.bind(app.vue)(bundle);
       }
     }
   }
   ```

   - 所谓内存方式读写，主要是将webpack compiler编译结果输出到内存（可通过memory-fs）
   - 读取`vue-ssr-server-bundle.json`时，不使用fs，而用 `memory-fs`的实例
   - 重写render方法，解决读取文件差异；

4. 特别注意

   - 由于将server.json 文件输出到内存，故egg/view文件夹下并不会生成文件
   - 由于egg -view render默认会读取这个文件夹下对应的文件，如果找不到，会报错
   - 因此，需要对`app.view.resolve`方法进行重写

5. 可参见：https://github.com/rextao/vue-egg-ssr/tree/egg-webpack-base  

### 结合devServer

1. 页面热更新，首先会想到使用devServer，插件中app.js 则无需监听生成***.client.json，这个工作让devServer来处理

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

2. 我们使用相同的套路，重写`clientManifest`的获取方式

   - 本例子，其实就是在egg-webpack，重写readFile这个方法

     ```javascript
     const axios = require('axios');
     module.exports = app => {
         if (app.vue) {
             app.vue.readFile = async (name) => {
                 const clientManifestResp = await axios.get(`http://localhost:8080/${name}`);
                 const clientManifest = clientManifestResp.data;
                 return clientManifest
             }
         }
     }
     
     ```

3. 最终

   - 这样，我们就可以同时利用devServer特性，实现修改vue文件热更新
   - 参见：https://github.com/rextao/vue-egg-ssr/tree/egg-view-devServer

4. Vue ssr 本质是`createBundleRenderer`，分别读取server和client的bundle

   - 默认文件输出在硬盘，也从硬盘读取，（线上环境）
   - 文件输出到内存，从内存中读server的bundle（本地开发，服务器加快编译）
   - devServer方式，从devServer读取client的bundle，（本地开发，热更新）

   

### middleware方式

1. `easy-team`，使用`webpack-dev-middleware`方式实现

   - 暂不考虑，agent.js等

   - 其实，主要还是在子进程，分别启动2个webpack，利用自己封装的koa-wepack-dev-middleware + koa-hot(热更新)实现

     ```javascript
     // lib/child-process.js
     const webpackTool = new WebpackTool({ port });
     compiler = webpackTool.createWebpackCompiler(webpackConfig, () => {
       process.send({ action: 'done', port: webPort });
     });
     webpackTool.createWebpackServer(compiler);
     ```

     - webpackTool功能封装在wepack-tool这个包
     - `createWebpackServer`启动koa，增加相关插件，并监听端口

2. `easy-team`将client.json 生成在view/manifest.json 中

   - 我采用的方式是`createBundleRenderer(name, {..., clientManifest})`，依赖关系是在 Egg 运行期间解析的
   - 而 easy 利用`webpack-manifest-resource-plugin`，将生成的文件，即解析好的（与默认的clientManifest格式有所不同）
   - 然后利用`server-side-render-resource`插件，对html进行改写，即根据manfest，插入对应js与css

3. 主要问题是：每次修改文件，会重新生成manifest文件在磁盘上？？

   - 在easywebpack/plugin.js 中的exports.manifest，配置`writeToFileEmit: true`会，默认启用插件内部`     fse.outputFileSync(outputFile, json);`
   - 将manifest文件输出在文件夹中
   - 不知为何这样，此特性，并未区别local还是pro环境，线上，可以使用manifest文件，直接渲染页面



# 问题

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
   
3. 由于egg - view 插件，默认的render方法的name参数，必须在view/文件夹下要找到此文件

   - Easy 采用的方式是重写resolve方法，保持view文件下还是方式server的bundle文件
   - 重写了 resolve 方法





参考

1. https://zhuanlan.zhihu.com/p/29838551









*