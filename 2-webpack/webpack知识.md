# Plugin

## 概述

1.  在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
2.  插件都是一个类，最好是使用大写字母命名

## Compiler和Compilation

1. 开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation
2. Compiler 对象包含了 Webpack 环境所有的的配置信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
3. Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象
4. 区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。
5. Compiler 和 Compilation 都继承自 Tapable

## 事件流

1. webpack像是一条生产线，经过一系列loader后输出结果，每个loader职责都是单一的，多个流程存在依赖关系，只有处理完一个才能进入下一个
2. plugin就像插入生产线的一个功能，在特定的时机对资源进行处理，webpack运行过程中会广播事件，plugin只需要监听关心的事件即可
3.  Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。
4. 主要使用如下方法

    ```javascript
    /**
    * 广播出事件
    * event-name 为事件名称，注意不要和现有的事件重名
    * params 为附带的参数
    */
    compiler.apply('event-name',params);

    /**
    * 监听名称为 event-name 的事件，当 event-name 事件发生时，函数就会被执行。
    * 同时函数中的 params 参数为广播事件时附带的参数。
    */
    compiler.plugin('event-name',function(params) {

    });
    ```

   



## 常用插件

### 模块热替换

1. 它允许在运行时更新各种模块，而无需进行完全刷新
2. webpack-dev-server的hot功能是重新加载整个页面

### 配置Html模板

1. 文件打包好（js、css文件生成了），但不能每次我们使用时候都去dist目录新建一个html文件，然后引用js吧
2. 故利用html-webpack-plugin插件

### extract-text-webpack-plugin

1. 通常情况下，使用style-load与css-loader，css文件是以行内样式style的标签写进打包后的html页面中
2. 如果想将css拆分出来，用link方式引入的话可以使用此插件
3. 但webpack4应该使用mini-css-extract-plugin（插件还有一些bug）

### 打包前先清空dist下文件

1. 每次build都需要手动清除dist文件夹，比较麻烦
2. `yarn add --dev clean-webpack-plugin`
3. 利用此插件可以在清除dist下文件

### babel-plugin-import

1. 可以从组件库中仅仅引入需要的模块，而不是把整个库都引入，从而提高性能（antd使用）
2. 一般通过`import Button from 'antd/lib/button'`按需引入组件
3. 实际上，这个插件就是将`import {Button} from 'antd'`转换为`import Button from 'antd/lib/button'`

# Loader

## 概述

1. 用于对模块的源代码进行转换，在 `import` 或"加载"模块时预处理文件
2. 如可以将文件从不同的语言（如 TypeScript）转换为JavaScript，或将内联图像转换为 data URL
3. 详细loader api在<https://webpack.docschina.org/api/loaders/>

## Loader基础

1. 由于 Webpack 是运行在 Node.js 之上的，一个 Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数，函数则是输入源文件，然后loader处理后的文件

   ```javascript
   module.exports = function(source) {
       // source 为 compiler 传递给 Loader 的一个文件的原内容
       // ....进行source处理
       //  返回处理后的内容
       return newSource;
   };
   ```

## 同步异步

1. Loader 有同步和异步之分，如需要通过网络请求才能得出结果，采用同步方式会阻塞整个构建过程，构建会非常慢

2. 可以这样

   ```javascript
   module.exports = function(source) {
       // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
       var callback = this.async();
       ajax(source, function(err, result, sourceMaps, ast) {
           // 通过 callback 返回异步执行后的结果
           callback(err, result, sourceMaps, ast);
       });
   };
   ```

## 缓存加速

1. 某些转换操作需要大量计算，是非常耗时的，故在处理的文件或依赖没有变化时，webpack会缓存计算结果，不会重新调用loader去执行转换操作

2. 如想让webpack不缓存该loader的处理结果，可以

   ```javascript
   module.exports = function(source) {
     // 关闭该 Loader 的缓存功能
     this.cacheable(false);
     return source;
   };
   ```

## 常用Loader介绍

### 处理图片

#### css文件引用图片

1. 在css文件里引入的如背景图之类的图片，就需要指定一下相对路径
2. `yarn add --dev file-loader url-loader`
3. file-loader
   - webpack打包后，css中引用的路径是项目开发时的相对路径，导致引入图片失败
   - 此loader，解析项目中的url引入（不仅限于css），根据配置，将图片拷贝到相应的路径，并修改打包后文件引用路径，使之指向正确的文件
4. url-loader：
   - 如果项目中引用很多小图，会发很多http请求，降低性能
   - 此loader，将引入的图片编码，生成dataURl
   - url-loader封装了file-loader，可以只引入url-loader

#### 页面img引用图片

1. html中常需要使用img标签引用图片地址
2. `yarn add --dev html-withimg-loader`

#### 引用字体图片和svg图片

1. 字体图标和svg图片都可以通过file-loader来解析

#### 处理css

### 添加css3前缀

1. 为了兼容性，CSS3有些属性需要增加前缀
2. `yarn add --dev postcss-loader autoprefixer`

# Mode

1. 可以设置`development`, `production` or `none`参数，webpack会根据不同环境进行优化

2. 默认是production

   ```javascript
   module.exports = {
     mode: 'production'
   };
   ```

3. 从 webpack v4 开始, 指定 mode 会自动地配置 DefinePlugin（之前配置环境是开发环境还是生产环境时使用）

4. 配置为production时，会默认启用压缩

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