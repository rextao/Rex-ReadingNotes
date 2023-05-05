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