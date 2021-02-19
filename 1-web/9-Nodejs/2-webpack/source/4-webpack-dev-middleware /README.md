### express中间件的要求

```javascript
const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

app.use(myLogger)
```

1. app.use需要传入一个函数

### 如何使用？

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
// 传入 compiler
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
}));

app.listen(8080, function () {
    console.log('listening on port 8080')
})
```

1. 因此，`webpackDevMiddleware`应该返回一个函数

### 做了些什么？

```javascript
export default function wdm(compiler, options = {}) {
  // 1. schema验证 + 配置mimeTypes
  validate(schema, options, {
    name: 'Dev Middleware',
    baseDataPath: 'options',
  });

  const { mimeTypes } = options;

  if (mimeTypes) {
    const { types } = mime;
    mime.types = { ...types, ...mimeTypes };
  }
  // 1. 设置上下文
  const context = {
    state: false,
    stats: null,
    callbacks: [],
    options,
    compiler,
    watching: null,
  };

  // 1. 设置compiler.hooks
  setupHooks(context);

  if (options.writeToDisk) {
    setupWriteToDisk(context);
  }
  // 1. 设置compiler的输出文件系统 memfs
  setupOutputFileSystem(context);

  // Start watching
  if (context.compiler.watching) {
    context.watching = context.compiler.watching;
  } else {
    let watchOptions;

    if (Array.isArray(context.compiler.compilers)) {
      watchOptions = context.compiler.compilers.map(
        (childCompiler) => childCompiler.options.watchOptions || {}
      );
    } else {
      watchOptions = context.compiler.options.watchOptions || {};
    }
    // 默认调用watch
    context.watching = context.compiler.watch(watchOptions, (error) => {
      if (error) {
        context.logger.error(error);
      }
    });
  }
	// 利用middleware包装，满足express要求
  const instance = middleware(context);

  // API
  instance.waitUntilValid = (callback = noop) => {
    ready(context, callback);
  };
  instance.invalidate = (callback = noop) => {
    ready(context, callback);

    context.watching.invalidate();
  };
  instance.close = (callback = noop) => {
    context.watching.close(callback);
  };
  instance.context = context;

  return instance;
}
```

1. 整体逻辑比较简单，主要分为
   - 校验schema，避免配置的key无法识别
   - 设置`compiler.hooks`，主要是在编译结束或编译中，进行一些处理
   - 设置文件系统，默认是内存，如果配置了`context.options.outputFileSystem`，则使用自己的文件系统
   - 调用`compiler.watch`实时监视文件改动
   - 利用middleware包装，满足express要求
   - 外露`compiler.watch`相关的close等api

### compiler.hooks做了什么

1. webpack编译是有时间的，故hook要做的事情的主要事情是，在编译过程中或编译完成，回调函数

2. 在编译过程中，设置编译中状态

   ```javascript
   context.compiler.hooks.watchRun.tap('webpack-dev-middleware', invalid);
   context.compiler.hooks.invalid.tap('webpack-dev-middleware', invalid);
   function invalid() {
     if (context.state) {
       context.logger.log('Compilation starting...');
     }
     context.state = false;
     context.stats = undefined;
   }
   ```

3. 编译完成

   ```javascript
   (context.compiler.webpack
    ? context.compiler.hooks.afterDone
    : context.compiler.hooks.done
   ).tap('webpack-dev-middleware', done);
   function done(stats) {
     // 设置编译完成状态
     context.state = true;
     context.stats = stats;
   
     // Do the stuff in nextTick, because bundle may be invalidated if a change happened while compiling
     process.nextTick(() => {
       const { compiler, logger, options, state, callbacks } = context;
   
       // 再次检查状态，避免出错
       if (!state) {
         return;
       }
   
       const isMultiCompilerMode = Boolean(compiler.compilers);
   
       let statsOptions;
       // 此处省略.........
       // 由于支持多compiler模式，故，主要是判断 确实是 done状态
   
       const printedStats = stats.toString(statsOptions);
   
       if (printedStats) {
         console.log(printedStats);
       }
   		// 如果callback存在，则循环调用
       context.callbacks = [];
       callbacks.forEach((callback) => {
         callback(stats);
       });
     });
   }
   ```

4. 小结

   - 编译中，设置编译状态
   - 编译完成（要确保确实都完成），执行callback

### middleware包装做了什么

1. middleware这个包装函数，是当请求进入express时，会进入此函数，故可以根据上述webpack编译状态，设置不同的返回结果

2. 如处于编译状态`context.state !== true`，则将回调函数push到callback中，使用统一的`ready`函数；不满足条件，则调用`goNext`函数

   ```javascript
   export default function wrapper(context) {
     return async function middleware(req, res, next) {
       const acceptedMethods = context.options.methods || ['GET', 'HEAD'];
       // fixes #282. credit @cexoso. in certain edge situations res.locals is undefined.
       res.locals = res.locals || {};
   		
       if (!acceptedMethods.includes(req.method)) {
         await goNext();
         return;
       }
       ready(context, processRequest, req);
     }
   }
   ```

   ```javascript
   // ready 函数
   export default function ready(context, callback, req) {
     if (context.state) {
       return callback(context.stats);
     }
   
     const name = (req && req.url) || callback.name;
     context.callbacks.push(callback);
   }
   ```

   ```javascript
   // goNext函数，返回promise，简单的封装
   async function goNext() {
     if (!context.options.serverSideRender) {
       return next();
     }
   
     return new Promise((resolve) => {
       ready(
         context,
         () => {
           res.locals.webpack = { devMiddleware: context };
           resolve(next());
         },
         req
       );
     });
   }
   ```

3. 当webpack编译状态为done时，会调用`processRequest`

   ```javascript
   async function processRequest() {
     // 通过请求url，找到对应请求的文件
     const filename = getFilenameFromUrl(context, req.url);
     const { headers } = context.options;
     let content;
   
     if (!filename) {
       await goNext();
       return;
     }
   
     try {
       // 读取文件内容
       content = context.outputFileSystem.readFileSync(filename);
     } catch (_ignoreError) {
       await goNext();
       return;
     }
   
     const contentTypeHeader = res.get
     ? res.get('Content-Type')
     : res.getHeader('Content-Type');
   	// 配置response  contentType
     if (!contentTypeHeader) {
       // 暂略。。。
     }
   	// 根据请求header，配置response header
     if (headers) {
       // 暂略。。。
     }
   
     // 根据 req.headers.range  获取内容
     content = handleRangeHeaders(context, content, req, res);
   
     // 使用express api或 node api，发送内容
     if (res.send) {
       res.send(content);
     }
     // Node.js API
     else {
       res.setHeader('Content-Length', content.length);
   
       if (req.method === 'HEAD') {
         res.end();
       } else {
         res.end(content);
       }
     }
   }
   ```

   



