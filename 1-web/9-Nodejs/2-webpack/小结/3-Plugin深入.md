# Plugin

## 概述

1. 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
2. 插件都是一个类，最好是使用大写字母命名
3. 开发插件时，需要知道某个钩子函数在哪里调用，故需要查看webpack源码，搜索`hooks.<hook name>.call`



## Compiler和Compilation

1. 开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation
2. Compiler 对象包含了 Webpack 环境所有的的配置信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
3. Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象
4. 区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。
5. Compiler 和 Compilation 都继承自 Tapable

## 钩子的调用方式

### 概述

1. compiler与Compilation都可以使用相同方式调用生命周期钩子

	```javascript
	compiler.hooks.someHook.tap(/* ... */);
	compilation.hooks.someHook.tap(/* ... */);
	```

	- 在某些钩子上还可以访问`tapAsync`和`tapPromise`

### 钩子类型

1. 钩子分为：基本钩子，Waterfall钩子，Bail钩子
2. 根据同步异步等可以分为：
	- Sync钩子，只能调用myHook.tap()方法
	- AsyncSeries与AsyncParallel，可以调用`myHook.tap()`, `myHook.tapAsync()` and `myHook.tapPromise()`，分别表示同步，异步和promise
3. 在官网，可以看到各钩子的类型，如：
	- emit：AsyncSeriesHook
	- 生成资源到 output 目录之前
	- 参数：compilation


## 插件构成

1. 一个具名 JavaScript 函数。
2. 在它的原型上定义 `apply` 方法。
3. 指定一个触及到 webpack 本身的 事件钩子。
4. 操作 webpack 内部的实例特定数据。
5. 在实现功能后调用 webpack 提供的 callback。

### 举例

```javascript
class MyPlugin {
    apply(compiler) {
        // 生成资源到 output 目录之前。
        compiler.hooks.emit.tapAsync(
            'MyPlugin',
            (compilation, callback) => {
                console.log('ahahahha');               
                callback();
            }
        );
    }
}
module.exports = MyPlugin;
// webpack.config.js
const path = require('path');
const MyPlugin = require('./src/MyPlugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new MyPlugin()]
};
```



## 事件流

1. webpack像是一条生产线，经过一系列loader后输出结果，每个loader职责都是单一的，多个流程存在依赖关系，只有处理完一个才能进入下一个

2. plugin就像插入生产线的一个功能，在特定的时机对资源进行处理，webpack运行过程中会广播事件，plugin只需要监听关心的事件即可

3. Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

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