# 学习

1. setupFeatures，setupHttps 这样的命名为 options添加一些值。。还不错

2. 热更新流程图

   ![preview](README.assets/16cf203824359397.jpeg)

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
   const Server = require('../lib/Server');
   // 处理依赖
   compiler = webpack(config); // 创建webpack编译任务
   server = new Server(compiler, options, log); // 新建一个server
   server.listen() // 监听接口
   ```

2. Server核心伪代码

   ```javascript
   class Server {
     constructor(compiler, options, log) {
       // 普通server
       this.setupApp();
       // 构造https，http，普通server
       this.createServer();
     }
     setupApp() {
       this.app = new express();
     }
     // 传入的主要参数是this.app
     createServer() {
       if (this.options.https) {}
       else {
         this.listeningApp = http.createServer(this.app);
       }
     }
     listen(port) {
       return this.listeningApp.listen(() => {
         this.createSocketServer();// 创建socket服务器
       });
     }
}
   ```
   
   - 由于上面最终会调用listen对端口进行监听，可以从`Server.listen`开始
   - 在listen中会创建sock服务器，之后再介绍
   
3. 添加中间件，处理webpack编译文件

   ```javascript
   class Server {
     constructor(compiler, options, log) {
       this.setupDevMiddleware();
       this.setupFeatures();
     }
     setupFeatures() {
       const features = {
         middleware: () => {
           this.setupMiddleware();
         },
       }
       // 经过一些处理，会执行每一个features的函数
     }
     setupMiddleware() {
       this.app.use(this.middleware);
     }
     setupDevMiddleware() {
       this.middleware = webpackDevMiddleware(
         this.compiler,
         Object.assign({}, this.options, { logLevel: this.log.options.level })
       );
     }
   }
   ```

   - webpackDevMiddleware主要是处理webpack的文件，优点1、在内存处理、2、支持热部署

4. 添加webpack钩子函数，方便在编译完成、失败等执行函数

   ```javascript
   class Server {
     constructor(compiler, options, log) {
       this.setupHooks();
     }
   setupHooks() {
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
     	// 执行addHooks
     }
     // 实际就是调用this.sockWrite,写入不同信息
     _sendStats() {
       // 类似
       this.sockWrite(sockets, 'hash', stats.hash);
     }
     sockWrite(sockets, type, data) {
       sockets.forEach((socket) => {
         this.socketServer.send(socket, JSON.stringify({ type, data }));
       });
     }
   }
   ```

   - 钩子的逻辑主要当编译完成，会将最新的hash值和一些状态信息等通过socket发送给客户端

5. socket服务

   ```javascript
   class Server {
     constructor(compiler, options, log) {
       // getSocketServerImplementation为外部封装的socket服务实现模块
       this.socketServerImplementation = getSocketServerImplementation();
     }
     createSocketServer() {
       const SocketServerImplementation = this.socketServerImplementation;
       this.socketServer = new SocketServerImplementation(this);
   
       this.socketServer.onConnection((connection, headers) => {}
     }
   }
   ```

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

   - 实际会执行check，然后执行wepack内部的一些逻辑更换修改的文件

2. 执行实际是hotCheck方法

   ```javascript
   function hotCheck(apply) {
   		if (hotStatus !== "idle") {
   			throw new Error("check() is only allowed in idle status");
   		}
   		hotApplyOnUpdate = apply;
   		hotSetStatus("check");
   		return hotDownloadManifest(hotRequestTimeout).then();
   	}
   ```

3. 首先执行`hotDownloadManifest方法`

   ```javascript
   function hotDownloadManifest(requestTimeout) {
   		requestTimeout = requestTimeout || 10000;
   		return new Promise(function(resolve, reject) {
   			try {
   				var request = new XMLHttpRequest();
   				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
   				request.open("GET", requestPath, true);
   				request.timeout = requestTimeout;
   				request.send(null);
   			}
   			request.onreadystatechange = function() {
   					// success
   					try {
   						var update = JSON.parse(request.responseText);
   					}
   					resolve(update);
   			};
   		});
   	}
   ```

4. 执行完hotDownloadManifest，获取到差异的`hash.hot-update.json`后，继续执行hotCheck的then方法

   ```javascript
   function hotCheck(apply) {
   		return hotDownloadManifest().then(function(update){
         if (
   				hotStatus === "prepare" &&
   				hotChunksLoading === 0 &&
   				hotWaitingFiles === 0
   			) {
   				hotUpdateDownloaded();
   			}
       });
   	}
   ```

   

