# 学习

1. webpack内部使用enhanced-resolve库，来处理resolve这个配置参数
   - 用于生产不同type不同options的resolver



# 定义阶段

1. 在Compiler.js

   - compile -> this.newCompilationParams -> createNormalModuleFactory -> NormalModuleFactory

2. NormalModuleFactory 构造函数constructor，除了初始化一些数据

   - 主要是定义`this.hooks.factorize.tapAsync`，`this.hooks.resolve.tapAsync`，伪代码如下

     ```javascript
     class NormalModuleFactory extends ModuleFactory {
     	constructor() {
         this.hooks.factorize.tapAsync({}, () => {
           this.hooks.resolve.callAsync(resolveData, () => {})
         });
         this.hooks.resolve.tapAsync({},()=> {})
       }
     }
     ```

3. hooks定义好后，开始进入执行阶段

4. 特别注意：

   - NormalModuleFactory的构造函数分别绑定了`hooks.factorize`与`hooks.resolve`
   - 可以认为这两个钩子对应的数组已经有一个回调函数，每当被call时，会先执行其中的回调函数



# 执行阶段

1. 在Compilation.js中，进入entry后会执行如下伪代码：

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

2. 我们首先来看`this.factorizeQueue.add`，会执行其定义的processor，即执行`_factorizeModule`

3. 执行` factory.create`后进入`NormalModuleFactory`中的create函数，伪代码：

   ```javascript
   create(data, callback) {
     const resolveData = {};
     this.hooks.beforeResolve.callAsync(resolveData, (err, result) => {
       // 先对result进行有效性判断
       this.hooks.factorize.callAsync(resolveData, (err, module) => {});
     });
   }
   ```

   - 构建resolveData

   - 调用`this.hooks.beforeResolve`，由于当前情况，此hook未tap函数，直接进入其回调

     - 先对result进行有效性判断
     - 调用：`this.hooks.factorize.callAsync`
     - 根据定义阶段，我们得知，会执行NormalModuleFactory在实例化时为`hooks.factorize` tap的函数
     - 最终会执行constructor中的，`this.hooks.resolve.tapAsync({},()=> {})`

     

     

## 执行 constructor中的 `this.hooks.resolve`

1. `this.hooks.resolve.tapAsync`回调函数伪代码

   ```javascript
   this.hooks.resolve.tapAsync(({
       name: "NormalModuleFactory",
       stage: 100
     }),
     (data, callback) => {
     	// 1.创建resolver
       const loaderResolver = this.getResolver("loader");
       const normalResolver = this.getResolver("normal", resolveOptions);
   		// 2. 解析形如import Styles from 'style-loader!css-loader?modules!./styles.css';的参数
       // 代码省略。。。。
       const continueCallback = needCalls(2, err => {});
       this.resolveRequestArray(
         contextInfo,
         context,
         elements,
         loaderResolver,
         resolveContext,
         (err, result) => {
           if (err) return continueCallback(err);
           loaders = result;
           continueCallback();
         }
       );
   
       normalResolver.resolve(
         contextInfo,
         context,
         unresolvedResource,
         resolveContext,
         (err, resolvedResource, resolvedResourceResolveData) => {
           if (err) return continueCallback(err);
           resource = resolvedResource;
           resourceResolveData = resolvedResourceResolveData;
           continueCallback();
         }
       );
     }
   );
   ```

2. 创建了两种类型的resolver，分别处理有无loader的情况

   ```javascript
   const loaderResolver = this.resolverFactory.get("loader");
   const normalResolver = this.resolverFactory.get("normal", resolveOptions);
   ```

   - `resolverFactory`是ResolverFactory实例，伪代码：

     ```javascript
     get(type, resolveOptions = EMPTY_RESOLVE_OPTIONS) {
       let typedCaches = this.cache.get(type);
       if (!typedCaches) {
         typedCaches = {
           direct: new WeakMap(),
           stringified: new Map()
         };
         this.cache.set(type, typedCaches);
       }
       // ......
       const newResolver = this._create(type, resolveOptions);
       return newResolver;
     }
     _create(type, resolveOptions) {
       const resolver = (Factory.createResolver(resolveOptions));
       return resolver;
     }
     ```

   - 而相同resolver重复生成是一种浪费，webpack利用ResolverFactory 对resolve进行缓存，创建等处理，因此，调用get，实际会先判断是否有缓存，无则创建一个resolver

   - 由于不同类型，不同参数，可能有不同的resolver，webpack利用webpack/enhanced-resolve 库，构建不同resolver

     - `Factory.createResolver(resolveOptions)`是用来创建一个resolver

     - 暂粗略阅读：node_modules/enhanced-resolve/lib/ResolverFactory.js（详下后文：[插件执行顺序原因](###插件执行顺序原因)）

       - 实际就是，如传入的options未配置resolve，则用内部`Resolver.js`创建一个实例

       - 并为resolve 配置hooks和各个插件

       - 主要目的是获取文件路径，用官方的例子说明下：

         ```javascript
         resolve.sync("/some/path/to/folder", "../../dir");
         // === "/some/path/dir/index.js"
         ```

3. 为了处理类似`import Styles from 'style-loader!css-loader?modules!./styles.css';`

   - 需要将类似这样的结构解析，获取loader（style-loader，css-loader）和文件路径（`./styles.css`）

   - 对于此种情况，使用loaderResolver，获取loader的绝对路径，而其他情况（如仅是`import a from './a.js'`）使用normalResolver进行resolve操作，伪代码为

     ```javascript
     this.resolveRequestArray(
       contextInfo,
       context,
       elements,
       loaderResolver,
       resolveContext,
       (err, result) => {}
     );				
     normalResolver.resolve(
       contextInfo,
       context,
       unresolvedResource,
       resolveContext,
       (err, resolvedResource, resolvedResourceResolveData) => {}
     );
     ```

4. 小结：`hoos.resolve `可以认为主要做了

   - 创建resolver
   - 解析路径，拿到loader和文件
   - 调用xxxx.resolve 方法

## Resolver.resolve 到底做了什么

1. 根据上述介绍，处理resolve，webpack主要使用的是`enhanced-resolve`库

2. 而如未从options传入，resolver会默认使用内部的resolver，调用`xxxx.resolve`的伪代码为：

   ```javascript
   resolve(context, path, request, resolveContext, callback) {
     const finishResolved = result => {};
     const finishWithoutResolve = log => {};
     return this.doResolve(
       this.hooks.resolve,
       obj,
       message,
       {},
       (err, result) => {
         return this.doResolve(
           this.hooks.resolve,
           obj,
           message,
           {},
           (err, result) => {}
         );
       }
     );
   }
   ```

   - resolve方法，实际就是`return this.doResolve`，要注意doResolve第一个参数为：`this.hooks.resolve`，`resolver.resolve`是从`hooks.resolve`开始执行的

3. `doResolve`伪代码：

   ```javascript
   doResolve(hook, request, message, resolveContext, callback) {
     const stackLine = hook.name + "xxxxxxxxx";
     let newStack;
     if (resolveContext.stack) {
       newStack = new Set(resolveContext.stack);
       newStack.add(stackLine);
     } else {
       newStack = new Set([stackLine]);
     }
   
     if (hook.isUsed()) {
       const innerContext = createInnerContext({
         stack: newStack,
       }, message);
       return hook.callAsync(request, innerContext, (err, result) => {
         if (err) return callback(err);
         if (result) return callback(null, result);
         callback();
       });
     } else {
       callback();
     }
   }
   ```

   - 保存hook到stack中，即hook的先后调用关系会保存在stack中（目前没看到这个stack的作用是何，`createInnerContext`伪代码如下：并未处理stack，又作为childContext的属性返回了？？？？？？）

     ```javascript
     module.exports = function createInnerContext(
     	options,
     	message,
     	messageOptional
     ) {
     	let messageReported = false;
     	let innerLog = undefined;
     	if (options.log) {}
     	const childContext = {
     		log: innerLog,
     		fileDependencies: options.fileDependencies,
     		contextDependencies: options.contextDependencies,
     		missingDependencies: options.missingDependencies,
     		stack: options.stack
     	};
     	return childContext;
     };
     
     ```

   - 然后调用`hook.callAsync`，调用此hook绑定的回调函数

4. `this.hook.resolve`绑定了两个插件回调函数，先执行`ResolverCachePlugin，然后是ParsePlugin`

   - `ResolverCachePlugin`定义在`lib/cache/ResolverCachePlugin.js`，看名字大致是处理缓存，暂时略过，执行完后，会执行`enhanced-resolve`中的`ParsePlugin`

   - 这里插件大多都是类似这样的逻辑：

     ```javascript
     	apply(resolver) {
     		const target = resolver.ensureHook(this.target);
     		resolver
     			.getHook(this.source)
     			.tapAsync("ParsePlugin", (request, resolveContext, callback) => {
           	// xxxxxxx一段逻辑
     				resolver.doResolve(target, obj, null, resolveContext, callback);
     			});
     	}
     ```

     - 通过doResolve，去执行当前插件的下一个插件（target）绑定的回调函数，依次执行一系列定义的插件

5. 小结

   - `Resolver.resolve`是从`this.hook.resolve`开始，依次执行定义的插件

   

### 插件执行顺序原因

1. `ResolverFactory.js`的`createResolver`函数主要逻辑

   - 为`webpack.resolve`的各个配置项赋默认值

   - 利用`resolver.ensureHook`创建不同名称的hook，这个方法同时兼顾的通过name获取hook的功能

   - 将各种各样的插件push到plugins中

   - 最终执行每个插件的apply方法

     ```javascript
     plugins.forEach(plugin => {
       plugin.apply(resolver);
     });
     ```

2. 根据上文，我们知道，每个插件会传入一个source和一个target，source表示，当前插件回调函数绑定到哪个（source）hook上，target表示，这个插件执行完，执行哪个（target）hook

3. 假设以resolve开始为例，执行顺序为：

   ```javascript
   plugins.push(new ParsePlugin("resolve", "parsed-resolve"));
   plugins.push(
     new DescriptionFilePlugin(
       "parsed-resolve",
       descriptionFiles,
       false,
       "described-resolve"
     )
   );
   plugins.push(new NextPlugin("after-parsed-resolve", "described-resolve"));
   aliasFields.forEach(item => {
     plugins.push(new AliasFieldPlugin("described-resolve", item, "resolve"));
   });
   ```

   - `after-parsed-resolve`会在`resolver.ensureHook`处理为特殊的`parsed-resolve`

     ```javascript
     	ensureHook(name) {
         name = name.replace(/-([a-z])/g;
     		if (/^before/.test(name)) {
     			return this.ensureHook(
     				name[6].toLowerCase() + name.substr(7)
     			).withOptions({
     				stage: -10
     			});
     		}
     		if (/^after/.test(name)) {
     			return this.ensureHook(
     				name[5].toLowerCase() + name.substr(6)
     			).withOptions({
     				stage: 10
     			});
     		}
     		return hook;
     	}
     ```

   - 因此hook会依次执行resolve->parsed-resolve-> described-resolve ->resolve

   - 为了避免循环，插件apply中会根据某些情况，直接调用callback，而非`resolver.doResolve`继续下一个插件

### 最终的结果是什么

1. 插件执行到最后，每个文件会执行`resolver.hooks.resolved`（在`ResultPlugin`中）
2. 最终执行：`resolver.hooks.result.callAsync`，目前未在`hooks.result` tap其他函数，故直接执行回调





如何确定这个顺序的？

resolve初始化时，会plugins.push全部插件，每个插件可以有source与target，push完插件后，会统一进行apply安装操作，为每个source的hook绑定回调，回调处理最后，是到target 钩子执行