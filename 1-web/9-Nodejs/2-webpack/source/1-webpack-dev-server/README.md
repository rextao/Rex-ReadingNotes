# 备注

1. 可先学`webpack-dev-middleware`，再看此

# 总结

1. 关键是构造了一个http+ express的主服务，主要是为了
   - 适配https,http2,http 不同的 server
   - 增加 proxy，compress，contentBase等 一系列 特性给express
2. server 与webpack-hot-middleware 基本类似
   - 都是利用webpack-dev-middleware作为webpack 编译 watch
   - devServer  使用express + http模式，提供很多http 特性，如proxy等，通过配置就可以实现功能， webpack-hot-middleware 则没有
   - 本文使用socket，而 中间件使用 eventSource
   - 本文是通过`hotEmitter.emit('webpackHotUpdate', currentHash);`， 触发webpack内部调用 `module.hot.check`，而中间件，则是直接调用（因为中间件对 `__webpack_require__` 等进行了改下，而本文并没有）



## webpack-dev-server职责

1. 构造http server与 socket server，分别用于传输数据和发送消息给客户端
2. webpack-dev-server的客户端，实际就是发送webpack/hot的 webpackHotUpdate事件
3. 数据获取逻辑，实际是webpack向http server请求数据

## 某些函数并未引入

1. 对于`eslint-disable no-unused-vars`的变量，实际打包时应该进行了赋值，即在打包后的文件中，并不存在变量的声明
2. 因此，有些函数定义可能并不在当前文件中

# 概述

1. 热更新在官方文档里叫热模块替换（hot module replacement），即代码修改后，可以及时同步修改代码
2. 运行`npm run dev`可以执行src下的html代码，测试热更新

# server端

## 概述

1. 入口文件`bin/webpack-dev-server.js`
   - `bin`：包含的是一个或多个可执行文件，初始化时npm会链接到到`prefix/bin`（全局初始化）或者`./node_modules/.bin/`（本地初始化）
   - `main`：require时指向的入口文件

## 源码分析

1. `webpack-dev-server.js`主要逻辑伪代码：

   ```javascript
   // processOptions 处理config与argv等，处理完后，执行startDevServer
   processOptions(config, argv, (config, options) => {
     // 关键代码
     startDevServer(config, options);
   });
   ```

   - 通过`processOptions`处理命令行参数
   - 然后执行：`startDevServer`

2. `startDevServer` 关键伪代码

   ```javascript
   const Server = require('../lib/Server');
   // 处理依赖
   function startDevServer(config, options) {
     compiler = webpack(config); // 创建webpack编译任务
     server = new Server(compiler, options, log); // 新建一个server
     server.listen() // 监听接口
   }
   ```

   - 创建 webpack编译
   - 将 compiler 传入 Server 核心类
   - 调用listen，监听端口

3. 首先，看一下`construtor`，初始化做了什么

   ```javascript
   class Server {
     constructor(compiler, options = {}, _log) {
       // ....省略 初始化变量
       if (this.progress) {
         this.setupProgressPlugin();
       }
       // webpack钩子函数
       // 配置，done， invalid 钩子
       this.setupHooks();
       // 搞一个express服务
       // this.app = new express();
       this.setupApp();
       // 检查header的host是否正确
       this.setupCheckHostRoute();
       // 加入 webpack-dev-middleware express 中间件
       this.setupDevMiddleware();
   
       // set express routes
       // 配置 devserver 内置的一些router
       routes(this.app, this.middleware, this.options);
   
       // Keep track of websocket proxies for external websocket upgrade.
       this.websocketProxies = [];
       // 根据options.compress 等配置，增加server的一些特性，如proxy等
       this.setupFeatures();
       // 粗略感觉：实际就是如options.https = true,就是再往https添加一些配置
       this.setupHttps();
       // 构造https，http2 或 http 的 server
       // this.listeningApp =
       this.createServer();
       // 这样，可以非常迅速地终止服务器连接。
       killable(this.listeningApp);
   
       // Proxy websockets without the initial http request
       // https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
       this.websocketProxies.forEach(function(wsProxy) {
         this.listeningApp.on('upgrade', wsProxy.upgrade);
       }, this);
     }
   }
   ```

   - 根据 options 变量，初始化 `this.xxxxxx`
   - 配置compiler 的hook
   - 构造一个express，增加内置router，需要的中间件（webpack-dev-middleware）
   - 根据配置，增加proxy，https所需的特性
   - 构建http server 将这些特性与express 传入
   - 因此，关键是，配置hook，构造一个http+express的server

4. Server类初始化后，会调用`server.listen()`

   ```javascript
   listen(port, hostname, fn) {
     this.hostname = hostname;
     return this.listeningApp.listen(port, hostname, (err) => {
       // 创建 socket 服务
       this.createSocketServer();
       if (this.options.bonjour) {
         runBonjour(this.options);
       }
       // 打印log
       this.showStatus();
       // 执行回调
       if (fn) {
         fn.call(this.listeningApp, err);
       }
       // 执行onListening回调
       if (typeof this.options.onListening === 'function') {
         this.options.onListening(this);
       }
     });
   }
   ```

   - 因此，监听端口后，重点是创建 socket 服务
   - 然后，执行回调函数`fn` 与`options.onListening`

### createSocketServer

1. 伪代码

   ```javascript
   createSocketServer() {
     // sockjs 或 ws 实现
     const SocketServerImplementation = this.socketServerImplementation;
     this.socketServer = new SocketServerImplementation(this);
   
     this.socketServer.onConnection((connection, headers) => {
       // 处理错误。。。暂略
       // 存储当前连接connection ，可能存在多个socket
       this.sockets.push(connection);
   		// socket关闭后，在sockets数组删除对应连接
       this.socketServer.onConnectionClose(connection, () => {
         const idx = this.sockets.indexOf(connection);
         if (idx >= 0) {
           this.sockets.splice(idx, 1);
         }
       });
   
   		// 根据一些配置，发送一些socket信息给客户端 。。。。。暂略
   		// 内部会调用 this.sockWrite, 想每个socket输出信息
       // 后面具体介绍
       this._sendStats([connection], this.getStats(this._stats), true);
     });
   }
   ```

2. 至此，整个devserver，启动结束， 在listen中，启动socket连接，并发送一些初始化信息

### 监听文件改动

1. 文件改动，会触发webpack编译，根据不同阶段，执行不同hook

   ```javascript
   setupHooks() {
     const invalidPlugin = () => {
       this.sockWrite(this.sockets, 'invalid');
     };
   
     const addHooks = (compiler) => {
       // webpack的介个钩子函数，
       // compile： 一个新的编译(compilation)创建之后
       // invalid： 编译无效
       // done: 完成
       // 通过tap方法访问
       const { compile, invalid, done } = compiler.hooks;
       compile.tap('webpack-dev-server', invalidPlugin);
       invalid.tap('webpack-dev-server', invalidPlugin);
       done.tap('webpack-dev-server', (stats) => {
         this._sendStats(this.sockets, this.getStats(stats));
         this._stats = stats;
       });
     };
     if (this.compiler.compilers) {
       this.compiler.compilers.forEach(addHooks);
     } else {
       // 执行 addHooks
       addHooks(this.compiler);
     }
   }
   ```

   - 主要是为compiler 添加 hook
   - 非 done  的hook，会向客户端发送invalid 信息：`this.sockWrite(this.sockets, 'invalid');`
   - webpack编译完成，会调用`this._sendStats(this.sockets, this.getStats(stats));`

2. `this._sendStats`

   ```javascript
   _sendStats(sockets, stats, force) {
     if (shouldEmit) {
       return this.sockWrite(sockets, 'still-ok');
     }
     this.sockWrite(sockets, 'hash', stats.hash);
     if (stats.errors.length > 0) {
       this.sockWrite(sockets, 'errors', stats.errors);
     } else if (stats.warnings.length > 0) {
       this.sockWrite(sockets, 'warnings', stats.warnings);
     } else {
       this.sockWrite(sockets, 'ok');
     }
   }
   ```

   - 实际是对`this.sockWrite`的包装，根据不同情况，发送不同信息到客户端
   - `this.sockWrite`会 forEach sockets， 即向每个socket 连接发送消息

3. 

   

# 客户端

## 概述

1. 根据常识入口在：`webpack-dev-server/client/index.js`

## 源码分析

1. 首先可以看到，`client/index`是最终执行

   ```javascript
   socket(socketUrl, onSocketMessage);
   ```

   - 可以想到的是，封装的socket客户端，用户监听不同message消息

2. `onSocketMessage`的几个主要key

   ```javascript
   var onSocketMessage = {
     hot: function hot() {
       options.hot = true;
       log.info('[WDS] Hot Module Replacement enabled.');
     },
     hash: function hash(_hash) {
       status.currentHash = _hash;
     },
     ok: function ok() {
       sendMessage('Ok');
       reloadApp(options, status);
     },
   };
   ```

   - 其实客户端接收的socketMessage是与服务端`_sendStats`对应的
   - 实际就是，服务端会根据不同情况发送不同key，客户端，根据不同key执行不同代码

3. 对于`ok`这个message，会执行`reloadApp`方法

   ```javascript
   function reloadApp(_ref, _ref2) {
     if (hot) {
       var hotEmitter = require('webpack/hot/emitter');
       hotEmitter.emit('webpackHotUpdate', currentHash);
     }
     else if (liveReload) {// 不支持hot，则直接reload当前页面
   		rootWindow.location.reload();
     }
   }
   ```

   - hotEmitter 是使用的webpack里面的，本质就是一个`event`模块，只是webpack内部会对webpackHotUpdate进行监听

## 进入webpack/hot模块

1. 在`node_modules/webpack/hot/dev-server.js`中，会对webpackHotUpdate进行监听

   ```javascript
   hotEmitter.on("webpackHotUpdate", function(currentHash) {
     lastHash = currentHash;
     if (!upToDate() && module.hot.status() === "idle") {
       check();
     }
   });
   ```

   - 此时，执行check 实际，会执行 module.hot.check 方法
   - 后面的逻辑与webpack-hot-middleware 是一致的

   


