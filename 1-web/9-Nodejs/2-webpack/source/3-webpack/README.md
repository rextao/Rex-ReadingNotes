# 学习

1. 要求options，符合定义标准

   - schema-utils，可以先利用schema对options进行校验

2. 由于webpack通过钩子的方式，需要通过cmd+f，反查某个钩子具体在哪定义

   - 还可以办法，通过debug，执行到`this.hooks.make.callAsync`通过查看hooks.make上的taps数组，查看绑定的钩子

3. 为何默认入口，编译完的文件是main.js

   - getNormalizedWebpackOptions中，会对entry进行处理
   - getNormalizedEntryStatic，其中会调用此函数将入口为string的entry进行转换

4. webpack是基于回调的，通过tapable，增加了整个代码的灵活性

   - error与success回调，可以直接类似`this.hooks.xxxx.call`即可

5. Compilation.js 中从addEntry，关键步骤，实际都使用了异步队列，道理感觉有点像vue watch队列，一种处理异步的方式（在某一时机）

   ```javascript
   addEntry(context, entry, optionsOrName, callback) {
     this.factorizeQueue.add(options, (err, newModule) => {
       this.addModuleQueue.add(newModule, (err, module) => {
         this.buildQueue.add(module, err => {
           // 根据不同逻辑，最终会调用 callback
         });
       });
     });
   })
   ```

   

# 示例代码

1. clone下最新的webpack源码，在构建如下目录结构，主要为了debug代码

   ```json
   debug-|
         |--dist    // 打包后输出文件
         |--src
            |--index.js   // 源代码入口文件
         |--package.json  // debug时需要安装一些loader和plugin
         |--start.js      // debug启动文件
         |--webpack.config.js  // webpack配置文件
   ```

2. 代码

   ```javascript
   // webpack.config.js
   const path = require('path')
   module.exports = {
   	context: __dirname,
   	mode: 'production',
   	devtool: 'source-map',
   	entry: './index.js',
   	output: {
   		path: path.join(__dirname, './dist'),
   	},
   	optimization: {
   		usedExports: true,
   	},
   	module: {
   		rules: [
   			{
   				test: /\.js$/,
   				use: ['babel-loader'],
   				exclude: /node_modules/,
   			}
   		]
   	}
   }
   // start.js
   const webpack = require('../lib/index.js')  // 直接使用源码中的webpack函数
   const config = require('./webpack.config')
   const compiler = webpack(config)
   compiler.run((err, stats)=>{
   	if(err){
   		console.error(err)
   	}else{
   		console.log(stats)
   	}
   })
   ```

3. 可以执行`webpack ./debug/index.js --config ./debug/webpack.config.js`或debug `start.js`来确定

# 主入口

1. 对于start.js，我们可以看出webpack主入口是，webpack函数和`compiler.run`

2. webpack函数重要步骤（伪代码）

   ```javascript
   const webpack = /** @type {WebpackFunctionSingle & WebpackFunctionMulti} */ ((
   	options,
   	callback
   ) => {
     // 1. 校验schema
   	validateSchema(webpackOptionsSchema, options);
     // 2. 根据options类型，调用不同函数，生成compiler
   	if (Array.isArray(options)) {
   		compiler = createMultiCompiler(options);
   	} else {
   		compiler = createCompiler(options);;
   	}
     // 3. 运行compiler
     compiler.run();
   	return compiler;
   });
   ```

   - 实际webpack函数主要就3件事
     - 校验schema，保证传入的options是符合要求的
     - 生成编译器，生成编译器的本质逻辑是**为compiler 安装插件（由用户引入的options.plugins或webpack内置的插件）**
     - 运行编译器，即执行`compiler.run`方法

3. compiler.run 方法

   - 其实本质是调用一系列钩子
   - 钩子执行：beforeRun->run->执行`this.compiler`函数->done->afterDone
   - 而在`this.compiler`函数中，又调用一系列钩子
     - 钩子执行：beforeCompile->compile->make->afterCompile
   - 而这重中之重是make这个钩子的调用

4. 只能通过反向搜索`hooks.make`查看都有哪些钩子

   - 还有个办法，通过debug，执行到`this.hooks.make.callAsync`通过查看hooks.make上的taps数组，查看绑定的钩子

5. compiler和compilation对象

   - 这两个对象一直贯穿webpack始终
   - **Compiler**类(`./lib/Compiler.js`)：webpack的主要引擎，在compiler对象记录了完整的webpack环境信息，在webpack从启动到结束，`compiler`只会生成一次。你可以在`compiler`对象上读取到`webpack config`信息，`outputPath`等；
   - **Compilation**类(`./lib/Compilation.js`)：代表了一次单一的版本构建和生成资源。`compilation`编译作业可以多次执行，比如webpack工作在`watch`模式下，每次监测到源文件发生变化时，都会重新实例化一个`compilation`对象。一个`compilation`对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。

6. 流程图

   ![1-整理流程](README.assets/1-整理流程.svg)

# hooks.make

## 何时定义的

1. 反向查找`hooks.make`， 在EntryPlugin中调用了`compiler.hooks.make.tapAsync`

2. 反向查找`new EntryPlugin`，`new EntryOptionPlugin`，`new WebpackOptionsApply` 可以得到如下，程序流程图

   ![1-2hook.make何时定义](README.assets/1-2hook.make何时定义.svg)

3. 在EntryOptionPlugin中，伪代码：

   ```javascript
   apply(compiler) {
   		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
   			if (typeof entry === "function") {
   				new DynamicEntryPlugin(context, entry).apply(compiler);
   			} else {
   				// 处理entry的对象写法
   				for (const name of Object.keys(entry)) {
   					const desc = entry[name];
   					for (const entry of desc.import) {
   						new EntryPlugin(context, entry, options).apply(compiler);
   					}
   				}
   			}
   			return true;
   		});
   	}
   ```

   - 如entry是函数，则直接调用DynamicEntryPlugin
   - 否则，调用`new EntryPlugin`处理每个import

4. 在EntryPlugin中

   ```javascript
   	apply(compiler) {
   		compiler.hooks.compilation.tap(
   			"EntryPlugin",
   			() => {}
   		);
   		compiler.hooks.make.tapAsync("EntryPlugin", () => {});
   	}
   ```

   - 实际就是往`compiler`的不同`hooks`，tap函数
   - 因此，对于n个import，`compiler.hooks.make`和`compiler.hooks.compilation`会被tap多个函数

5. 补充：webpack使用了tapable作为流程控制，是一个包含异步，promise等的订阅-发布模式的库

## 执行

1. 根据上述分析，主入口最后最后执行`hooks.make`，实际是执行EntryPlugin.js的compiler.hooks.make.tapAsync()`，会执行compilation.addEntry函数

   ```javascript
   compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
     const { entry, options, context } = this;
     const dep = EntryPlugin.createDependency(entry, options);
     // context： 入口文件夹，dep：被包装的entry
     compilation.addEntry(context, dep, options, err => {
       callback(err);
     });
   });
   ```

2. addEntry之后的伪代码：

   ```javascript
   addEntry(context, entry, optionsOrName, callback) {
     this.factorizeQueue.add(options, (err, newModule) => {
       this.addModuleQueue.add(newModule, (err, module) => {
         this.buildQueue.add(module, err => {
           // 根据不同逻辑，最终会调用 callback
         });
       });
     });
   })
   ```

3. 而`this.factorizeQueue`又是什么呢？

   ```javascript
   constructor() {
     this.factorizeQueue = new AsyncQueue({
       name: "factorize",
       parallelism: options.parallelism || 100,
       processor: this._factorizeModule.bind(this)
     });
     this.addModuleQueue = new AsyncQueue({
       name: "addModule",
       parallelism: options.parallelism || 100,
       getKey: module => module.identifier(),
       processor: this._addModule.bind(this)
     });
     this.buildQueue = new AsyncQueue({
       name: "build",
       parallelism: options.parallelism || 100,
       processor: this._buildModule.bind(this)
     });
   }
   ```

4. 而`factorizeQueue.add` 实际是在某个时机，调用processor，我们先关注下关键步骤build，即buildQueue.add的process执行，即执行_buildModule，其伪代码

   ```javascript
   _buildModule(module, callback) {
     module.needBuild(context, (err, needBuild) =>{
       module.build(options, compilation, resolver, fs, callback)
     })
   }
   ```

5. 然后进入NormalModule.js

   ```javascript
   build() {
     retrun this.doBuild(options, compilation, resolver, fs, callback)
   }
   ```

   

   

   

   

   

   

   

   即执行`compilation.addEntry`

   - 而compilation实际是在`this.compiler中`，调用`this.hooks.make.callAsync`，传入的，实际就是一个Compilation（lib/Compilation.js）

6. Compilation中的addEntry函数被最终执行，此函数

   - 利用传入参数，构造一个entryData
   - 调用：this.hooks.addEntry.call
   - this.addModuleChain()

7. `this.addModuleChain`最终被执行handleModuleCreation，然后执行factorizeModule，最终实际是执行了`this.factorizeQueue.add(options, callback);`

8. factorizeQueue.add，实际会经过一系列流程控制，最终执行到factorizeQueue的callback函数，执行addModule函数

9. addModule函数，最终还是执行其回调函数

### 小结

1. Compilation.js的addModule，buildModule，factorizeModule这几个函数，都是往相应的数组中add，然后在某些时机执行回调

AsyncQueue.js 这个文件逻辑

