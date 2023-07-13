# 使用的基本准则

1. 必须是`production`模式
2. `usedExports`配置必须为`true`
3. 必须使用支持`tree-shaking`的压缩器， 这种压缩器将识别Webpack标记的未被使用的代码，并将其删除，可以用`TerserPlugin`
4. 必须编译到`es2015 modules`，`commonjs modules`是不兼容的
5. 不支持`npm link`的包，可以改使用`yalc`工具

# 配置Side-Effect

1. 默认`webpack`会认为全部文件是`side-effect`故不会做`tree-shaking`操作

2. 配置

   ```javascript
   // All files have side effects, and none can be tree-shaken
   {
    "sideEffects": true
   }
   // No files have side effects, all can be tree-shaken
   {
    "sideEffects": false
   }
   // Only these files have side effects, all other files can be tree-shaken, but these must be kept
   {
    "sideEffects": [
     "./src/file1.js",
     "./src/file2.js"
    ]
   }
   ```

# 处理全局样式

1. 如配置`main.js`为非`sideEffects`，文件有如下引用

   ```javascript
   // Global CSS import
   import './MyStylesheet.css';
   ```

   - 那么这个css会被`tree-shaking`掉

2. 可以如下配置：

   ```javascript
   // Webpack config for global CSS side effects rule
   const config = {
       module: {
           rules: [
               {
                   test: /regex/,
                   use: [loaders],
                   sideEffects: true
               }
           ]
       } 
   };
   ```

# 与node程序兼容

1. 如以Jest 为例，`Jest `是基于`nodeJs`的，但`nodeJs`不支持`es2015 modules`

2. 先可以通过`babel`的配置，不同环境下，编译为不同版本(commonJs或es2015)

   ```javascript
   // Babel config for separate environments, we move the "preset" to the "env" section
   const config = {
       env: {
           development: {
               presets: [
                   [
                       '@babel/preset-env',
                       {
                           modules: false
                       }
                   ]
               ]
           },
           production: {
               presets: [
                   [
                       '@babel/preset-env',
                       {
                           modules: false
                       }
                   ]
               ]
           },
           test: {
               presets: [
                   [
                       '@babel/preset-env',
                       {
                           modules: 'commonjs'
                       }
                   ]
               ],
               plugins: [
                   'transform-es2015-modules-commonjs' // Not sure this is required, but I had added it anyway
               ]
           }
       }
   };
   ```

3. 对于已经编译好的第三方包，可以尝试在test时，重新编译第三方包



[Scope hositing](https://webpack.js.org/plugins/module-concatenation-plugin/#root)

1. 根据ES6的特性，将本要创建多个函数的闭包的方式，转换为在一个文件中创建
   - 占据的内存会更小
   - 天然支持Tree-shaking
     - 未使用Scope hosting，需要分析模块之间的依赖关系，导出的变量哪些被使用了，哪些没被使用。还要保证这段代码没有副作用，才能把它删除掉；
     - 使用了Scope hosting，甚至可以使用TerserWebpackPlugin就可以过滤掉未使用的代码
2. production模式默认支持
3. 大致的实现原理
   - 底层通过ModuleConcatenationPlugin插件实现
   - 在seal阶段（将module进行分组，形成chunk，构建chunkGroup）执行
   - 大致的步骤：
     - 遍历module，把不适合hosting的过滤掉
     - 从每个入口模块开始，递归分析 import，把可以被 scope hositing 的模块都放到一个对象里（类型ConcatenatedModule，相当于创建一个新module替换之前的 module）
     - 在代码生成阶段，针对ConcatenatedModule类型，使用不同的codeGen方法，即做一些同名变量的重命名，以及最终模块代码的拼接等；





