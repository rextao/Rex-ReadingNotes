

# webpack 流程分析

## debug Webpack

1. `npm install --global node-nightly`
2. 在浏览器中访问 `chrome://inspect`
3. `node-nightly --inspect-brk ./node_modules/webpack/bin/webpack.js`
	- --inspect-brk：会在脚本第一句有断点

## shell与config解析

1. 每次在命令行输入 webpack 后，操作系统都会去调用 `./node_modules/.bin/webpack` 这个 shell 脚本
2. 这个脚本会去调用 `./node_modules/webpack/bin/webpack.js` 并追加输入的参数，如 -p , -w
3. cmd的脚本看不懂，但在本地文件的node_modules/webpack/bin/webpack.js写个console
4. 在命令行运行时，会发现运行的确实是这个脚本

# 代码分离

## 手动配置entry

1. 如入口有多个重复模块，会被引入到各个bundle中
2. 不够灵活

## 防止重复

1. 利用`SplitChunksPlugin`替换之前的`commonsChunkPlugin`，由于之前插件无法进一步优化

2. 如使用splitChunksPlugin默认行为，则直接使用：

	```javascript
	optimization: {
	    splitChunks: {
	        chunks: 'all'
	    }
	}
	```

## 动态代码拆分

1. 推荐方式：es的import()提案，实现动态导入
	- import()会在内部用到promises
2. 遗留方式：webpack的require.ensure

# tree-shaking

## 概述

1. 消除无用的js代码，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为DCE（dead code elimination）。
2. tree-shaking是DCE的新实现，传统方法消灭不可能执行的代码，而Tree-shaking 更关注消除没有用到的代码

# 文件Hash值

## hash

1. hash是跟整个项目的构建相关

2. 只要项目里有文件更改，整个项目构建的hash值都会更改，并且全部文件都共用相同的hash值

3. 主要作用可以是：

   ```json
   output: {
       filename: '/dest/[hash]/[name].js'
   }
   ```

   - 将每次编译放在一个文件夹内

## chunkhash

1. 采用hash计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变，这样子是没办法实现缓存效果
2. chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值
3. 只要公共库代码不改变，就可以保证hash值不变

## contenthash

1. 假如index.css被index.js引用，两个共用相同是chunkhash
2. 如js改变导致css文件重新构建，会生成新的chunkhash
3. 因此使用contenthash保证文件内容不变化

# 如何调试webpack程序

1. 不知如何调试整个webapck的项目，可以调试某个具体文件
2. node --inspect-brk build/utils.js，控制台会输出![1531904382795](/1531904382795.png)
3. 在浏览器地址栏输入，chrome://inspect/#devices，并点击Open dedicated DevTools for Node，打开node调试的控制台
4. 在Node控制台输入要监听的地址![1531904417346](/1531904417346.png)
5. 