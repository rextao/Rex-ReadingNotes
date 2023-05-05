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

