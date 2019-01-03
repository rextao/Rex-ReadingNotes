# 概述

1. js最常用的引入函数的方式是使用`<script>`标签，但这存在一些问题
	- 会污染全局变量，因此很多库会提供`noConfict()`方法
	- 无法解决循环引用，如a依赖b，b依赖a，script标签哪个先哪个后呢？
	- 很多库的引入意味着很多script标签，很难维护，每一个标签是一个HTTP请求，影响页面性能
2. ES6模块内默认使用`"use strict"`并且内部定义的变量都为私有变量，公有变量、函数、class需要通过`export`导出

# 模块化的不同方式

## IIFE

1. 使用IIFE形式，将代码封装在IIFE中

	```javascript
	(function () {
		console.log('rextao');
	}());
	```

2. 将IIFE返回一个对象，将IIFE的某些函数暴露

	```javascript
	var a = (function () {
	    return {
	        add: function(){
	           console.log('hah') 
	        }
	    }
	}());
	a.add();//hah
	```

3. IIFE方法的主要问题：

	- 如函数依赖Backbone.js，而Backbone.js又依赖underscore.js，需要最先加载underscore.js，而控制加载顺序会很头疼
	- IIFE暴露函数需要占用全局变量的命名空间

## CommonJS

### 概述

1. CommonJS采用服务器优先的方法和同步加载模块。
	- 由于同步加载模块，浏览器加载模块要比直接从硬盘加载慢的多
	- 在浏览器中使用可能会造成阻塞页面的情况（模块加载非常慢时），但可以通过模块打包来解决

### 定义模块

1. 利用`module.exports`导出模块

	```javascript
	function myModule() {
	  this.hello = function() {
	    return 'hello!';
	  }
	
	  this.goodbye = function() {
	    return 'goodbye!';
	  }
	}
	module.exports = myModule;
	```

### 导入模块

1. 利用`require`导入模块

	```javascript
	var myModule = require('myModule');
	var myModuleInstance = new myModule();
	myModuleInstance.hello(); // 'hello!'
	myModuleInstance.goodbye(); // 'goodbye!'
	```

## AMD

### 概述

1. 异步加载模块，浏览器优先的方法
2. 缺点是不兼容IO，文件系统等服务端特性，语法稍显麻烦

### requireJS

1. requireJS实现了AMD规范
2. 主要解决：
	- 多个文件有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器
	- 加载的时候浏览器会停止页面渲染，加载文件越多，页面失去响应的时间越长。

### 加载模块

1. `define`会先加载数组中的模块，当模块中的js加载完，会调用回调函数

	```javascript
	define(['a.js', 'b.js'], function(a, b) {
	  return {
	    hello: function() {
	      console.log('hello');
	    },
	    goodbye: function() {
	      console.log('goodbye');
	    }
	  };
	});
	```

## UMD

1. Universal Module Definition (UMD)通用模块定义，即想获取浏览器和服务端的双重特性

2. 即通过代码判断，分别支持commonJS与AMD

	```javascript
	(function (root, factory) {
	  if (typeof define === 'function' && define.amd) {
	      // AMD
	    define(['a.js', 'b.js'], factory);
	  } else if (typeof exports === 'object') {
	      // CommonJS
	    module.exports = factory(require('a.js'), require('b.js'));
	  } else {
	    // Browser globals (Note: root is window)
	    root.returnExports = factory(root.a, root.b);
	  }
	}(this, function (a, b) {
	  // Methods
	  function hello(){}; // A private method
	  function goodbye(){}; // A public method because it's returned (see below)
	  // Exposed public methods
	  return {
	      goodbye: goodbye
	  }
	}));
	```

# ESmodules

## 概述

## 与CommonJs的区别

### 语法区别

1. 导入模块

	```javascript
	const { helloWorld } = require('./b.js') // CommonJS
	import { helloWorld } from './b.js' // ES modules
	```

2. 导出模块

	```javascript
	// CommonJS
	exports.helloWorld = () => {
	  console.log('hello world')
	}
	// ES modules
	export function helloWorld () {
	  console.log('hello world')
	}
	```

### 加载方式不同

1. Es6Modules

	```javascript
	// main.js
	console.log('executing a.js')
	import { helloWorld } from './test.js'
	helloWorld();
	// test.js
	console.log('executing b.js')
	export function helloWorld () {
	  console.log('hello world')
	}
	```

	- executing b.js
	- executing a.js
	- hello world

2. CommonJs（Node.js）

	```javascript
	// main.js
	console.log('executing a.js');
	const helloWorld = require('./b.js');
	helloWorld();
	// b.js
	console.log('executing b.js')
	module.exports = function helloWorld () {
	  console.log('hello world')
	}
	```

	- executing a.js
	- executing b.js
	- hello world

3. 注意：两者加载模块的先后顺序不同

	- CommonJs模块在代码执行时按需加载
	- ES6Modules会在代码执行前预解析

4. 由于加载顺序的不同，nodejs将`.mjs`文件使用ES6 modules方式加载，`.js`按照CommonJs加载

### 其他不同

1. Es6Modules

	```javascript
	// main.js
	import * as b from './test.js'
	console.log(b.num);
	b.add();
	console.log(b.num);
	// test.js
	export let num = 0;
	export function add() {
	  num++;
	}
	```

	- 0
	- 1

2. CommonJs（Node.js）

	```javascript
	// main.js
	const b = require('./b.js');
	console.log(b.num);
	b.add();
	console.log(b.num);
	// b.js
	// b.js
	let num = 0;
	function add () {
	  num++;
	}
	module.exports = {
	  add ,
	  num
	};
	```

	- 0
	- 0

## 浏览器使用

### 概述

1. 在`<script>`中使用modules，需要在script上设置`type="module"`属性，如：

	```javascript
	<script type="module">
	  import { something } from './somewhere.js';
	  // ...
	</script>
	// 或者
	<script type="module" src="./main.js"></script>
	```

### 模块默认延迟加载

1. `<script defer>`属性会延迟执行脚本直到document加载并解析完

	```html
	<!-- 第2个运行-->
	<script type="module">
	  // do something...
	</script>
	<!-- 第3个运行 -->
	<script defer src="c.js"></script>
	<!-- 第1个运行 -->
	<script src="a.js"></script>
	```
