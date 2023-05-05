> 项目底层使用的easy-team的一套，主要是将webpack配置搞出来。

# 背景

1. easy+egg+ssr ，easy搞的依赖包，无法对依赖进行提升
   - 虽然easy支持了升webpack5，但。。居然内部依赖关系会有依赖webpack4。。。。。
2. 为了兼容微前端改造，基本不再需要ssr
3. 但需要保留egg或说node能力，如inconft，kconf预请求，加载菜单等；
4. 目前代码可能是支持ssr的，如果用cli改造，代码改造成本较大
5. easy有些库版本太低

# 处理路径

1. 先将插件复制到`lib/plugins`

   - `pugin.local.ts` 改用：`path: path.join(__dirname, '../lib/plugins/egg-webpack'),`
   - 删除package.json对应插件后，不要npm install，否则依赖找不到（先暂时使用easy的依赖版本）

2. 提取webpack，web与node配置

   - lib/plugins/egg-webpack/lib/utils.js里的getWebpackConfig，直接读取配置（提取出来的）不再使用easy
   - 不再适配快捷增加loader或插件功能等
   - 实际是通过inspect 结果，重新配置可用的webapck配置

3. 由于璇玑微前端改造，ssr基本用到概率为0.1，故只拆web配置，保证拆出的web配置可用

4. 为避免不必要的项目启动不起来。。。。

   - 先将文件全部挪动到packages/node下，保证启动正常

5. 拆解为如下目录

   ```json
   - packages
   	- node
   	- polaris
   ```

   - 将entry，与resolve，layout 指向polaris/src目录即可



# egg-webpack

1. 这个包：webpack dev server plugin for egg
2. 主要编译逻辑
   - 在`agent.js`中，当 `egg-ready`，会触发` new XXXServer().start() `
   - 会在`child-process.js`子进程处理message，编译过程
3. easy build test，dev等参数有何作用
   - 会配置：`  process.env[`${CMD}_ENV`] = option.env;`
   - 会定义：EASY_ENV_IS_TEST与EASY_ENV，主要代码中可能用到这些变量
   - 根据此变量加载不同loader与plugins，看了下应该无差别



# dev环境处理

## 优化dev速度

1. dev-tool选用`cheap-module-eval-source-map`，参见：https://v4.webpack.docschina.org/guides/build-performance/#devtool
2. dev环境使用HardSourceWebpackPlugin，感觉更慢了

## tsx支持

1. tsx增加babel-loader+ts-loader的appednTsSuffixTo配置

   ```typescript
   {
     test: /\.tsx?$/,
       use: [
         {
           loader: 'thread-loader',
         },
         {
           loader: 'babel-loader',
         },
         {
           loader: 'ts-loader',
           options: {
             happyPackMode: true,
             appendTsSuffixTo: ['\\.vue$'],
           },
         },
       ],
   },
   ```

   - 文档参见：https://github.com/TypeStrong/ts-loader#appendtssuffixto

2. 文档写：If you're using [HappyPack](https://github.com/amireh/happypack) or [thread-loader](https://github.com/webpack-contrib/thread-loader) with `ts-loader`, you need use the `string` type for the regular expressions, not `RegExp` object.

   - 但是。。。使用字符串，会导致vue的tsx编译失败。。。

## dev环境使用cssExtract

1. easy的默认配置是dev环境使用vue-style-loader，线上使用MiniCssExtractPlugin
2. vue-style-loader在style-loader基础上增加ssr支持
3. 解析css的loader
   - 默认webpack是只解析js代码的，想要解析css文件，需要css-loader
   - 但解析的css结果并不会应用到html中，故使用style-loader会将css-loader解析的样式挂载到html中
   - 由于style-loader全挂载到html，可能会浪费，用cssExtract将样式文件提取到单独文件，然后引入到html

## dev问题

1. 访问首页空白页

   - 页面html有，js，css请求正常，但页面空白，发现无vendor.js等
   - manifest.json 生成有问题。
   - 主要是web模式下的optimization配置不对。。。照搬一下，解决

2. 首次访问（用easy）移动文件夹后，导致500，但刷新是ok的

   - template模板配置不对。但按easy重新指向template无效。
   - 饿。。。config.default.js，有 layout的配置。。。。

3. 不知改了啥，编译无问题，但启动后，http://polaris-local.test.xxxxxx.com:9000/public/js/vendor.js 为404

   - 可能是public配置不对。。。后来重新整理项目，又好了

4. easy会自动分配port，是如何处理

   - 在`easywebpack.getWebpackConfig`，内部会使用`node-tool-utils`处理端口问题

5. 为何都走了getWebpackConfig，web模式会导致9000占用报错

   - muti模式，实例化WebpackTool时，传入了最新的port。。。

   - web模式，传入了默认的port。。

     ```javascript
     const port = utils.getPort(config.port);
     pluginConfig.port = port;
     ```

6. Lazy-loader这个插件，如果不修改内容，会利用缓存，每次并不重新加载？？？？

   - 由于ts-loader配置了cache-loader导致

7. 热更新无效

   - Hot-update.json并未发到浏览器 -> webpack-hot-middleware/client配置有误
   - 有信息，但前端页面不热更新 -> 需要配置 path=http://polaris-local.test.xxxxxxx.com:9000/，host+port 对应上egg服务才可以
   
8. dev环境下会输出文件到磁盘

   - 多配了WriteFileWebpackPlugin，导致webpack-dev-middleware的writeToDisk会被认为true，writeToDisk This option provides the same capabilities as the WriteFilePlugin.
   - 因此。。如果想看devserver的输出结果。可以配置此插件或，配置writeToDisk



# 编译抽取

1. 编译执行的命令是：easy build prod

   - 在npm run build 打断点，获取easy具体是如何执行build的
   - 拿到build过程编译配置

2. 针对编译配置抽离：webpack.web.prod.js

   - 对比与easy生成的文件差别

3. 希望可以通过启动本地egg，加载编译后文件，查看编译是否正确

   - 但遇到 [egg无法在本地启动](#egg无法在本地启动)
   - 虽然启动ok，但考虑，实际理解加载逻辑，正常生成编译文件即可

4. 简单探究easy-egg，csr情况下，访问读取文件逻辑

   - renderClient("index/index.js")
   - renderVueClient
   - app.vue.render => getTemplate（会拿template模板）
   - 调用ssr的【renderString】方法，将vue转为string
   - 利用easy的resource包，从manifest读取deps，注入到html中

5. 根据读取逻辑，只需保证public与manifest文件对应即可

   - 观察到optimization配置会导致public文件生成与easy差别比较大
   - 直接注释掉optimization，使用基本配置，生成public
   - 编译文件可以正常访问

   
   
   

## egg无法在本地启动

1. 特别注意：不要执行npm run clean，线上使用的是js文件
2. egg启动正常，但访问页面500
   - 查看启动日志：[egg:core] All *.log files save on "/home/web_server/xxxxxxxxx-nodejs/logs/xxxxxxxxx-frontend-polaris"
   - nodejs.Error: Please set config.keys first
   - 应该是编译不正确，如果正确是无问题的
3. 报错：operation not supported on socket, mkdir '/home/web_server'
   - 直接在命令行前增加sudo，如：`sudo egg-scripts start --workers 1 --env prod`

## 莫名不生成编译文件

1. conf/postcss.config.js，没有导致的，但编译过程没报错。。。。有点难受



## 编译优化

1. 分析打包数据：`require('webpack-bundle-analyzer').BundleAnalyzerPlugin`

2. 提取runtime

   ```javascript
   runtimeChunk: {
     // Default is false: each entry chunk embeds runtime
     name: 'runtime', // 只使用一个runtime，
   },
   ```

3. 分析图中，node_modules很多地方都有，将node_modules打包为一个文件

   ```javascript
   vendors: {
     name: 'vendors',
       test: /[\\/]node_modules[\\/]/,
         priority: -10,
           chunks: 'all',
   },
   ```

   - 会导致vendors很大（4M多）
   - 要么将某些依赖external，要么将某些包单独打

4. 将几个大的库，如echarts，xlsx等单独打包

   ```javascript
   xlsx: {
     chunks: 'all',
       name: 'xlsx',
         test: /[\\/]xlsx[\\/]/,
           priority: 0,
   },
     moment: {
       chunks: 'all',
         name: 'moment',
           test: /[\\/]moment[\\/]/,
             priority: 0,
     },
   ```


## 编译问题

1. 编译后，页面没有插入指定的js
   - manifest生成有误 -> webpack配置问题
   - easy默认会将public文件编译在node，ManifestPlugin 会读此文件，生成manifest
2. `npm run build`  cli打断点
   - webstorm，直接在源码打断点（非debgger）
   - 由于想debugger，easy build prod， 可以简化下npm命令，删除如 npm run tsc 等，
     - 可能是由`cross-env NODE_ENV=production ` 引起的，无法debugger
   - 开始不行。。后来可以debugger了
3. CleanWebpackPlugin 不自动删除输出目录
   - easy使用1.0.0版本，需要指定root与要删除的文件夹。。。
   - 新版本会自动根据output删除
4. 如何整合拆分test/prod/dev webpack 配置
   - 遇到的问题是，如果module，某个load在dev与prod是有区别的
   - 需要写为`...isDev ? [{xxxxxx}] : []`
   - 如果返回null等，webpack编译会报错
5. 执行npm run build 不报错，莫名卡死npm
   - 分析了下，可能是重复配置了MiniCssExtractPlugin.loader与vue-style-loader



# 问题

1. 正则无法转换为JSON

   - RegExp.prototype.toJSON = RegExp.prototype.toString;

2. TypeError: The 'compilation' argument must be an instance of Compilation

   - npm ls webpack 有两个不同版本
   - npm 安装依赖会出现两个不同的版本，但yarn不会

3. 开始会出现2s多的白屏？？

   - 图片加载1s，测试环境确实是1s，线上会快
   - 接口请求代理的服务，响应2s多，故白屏时间很长

4. 栈溢出？？？

  - `cross-env NODE_OPTIONS=--max_old_space_size=2048   `
  
  

# 其他优化

## 强制使用yarn 安装依赖

1. swiftengineering默认使用npm，线上与预发使用yarn
   - 某些依赖使用npm安装有yarn会有区别，如webpack，npm安装会在某些情况下，莫名安装webpack4与wepack5版本，yarn不会；
2. 使用preinastall钩子，保证安装依赖使用yarn
   - 会先构建idealTree，然后才执行preinstall钩子
3. 问题
   - swiftengineering平台，由于使用execa执行sh脚本，故实际的process.env.npm_execpath是swiftengineering后端安装时用的yarn或npm

## 删除无用代码

1. 插件
   -  useless-files-webpack-plugin   3years  与remove-unused-files-webpack-plugin，基本是在afterEmit后，获取依赖进行对比，但实际对无用文件进行分析，无需要afterEmit阶段，可在更早阶段就进行判断
2. 为何不用npm命令行
   - 未找到合适的，简单的
   - 实际实现较为简单
   - 使用webpack实现，保证读取module一致性，之后可以类似admin，分析某个文件的依赖树
3. 使用`compilation.tap`
   - 利用succeedModule,finishModules，可以提前结束，目前webpack没有callback可以提前结束webpack进程，故throw了error
   - shouldEmit 这个hook可以提前结束，但会过很多compilation优化过程

# 学

1. entry还可以这么配
   - entry: { 'index/index': [a,b,c]}

