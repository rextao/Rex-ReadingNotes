# 概述

1. js最常用的引入函数的方式是使用`<script>`标签，但这存在一些问题
    - 会污染全局变量，因此很多库会提供`noConfict()`方法
    - 无法解决循环引用，如a依赖b，b依赖a，script标签哪个先哪个后呢？
    - 很多库的引入意味着很多script标签，并不知道标签的依赖关系，很难维护
    - 每一个标签是一个HTTP请求（HTTP/2可以缓解这个问题），影响页面性能

# 模块化的不同方式

## 普通函数方式

1. 普通函数方式， 无法传递函数内的变量，如jQuery与jQuery的插件
2. 解决办法：是将jQuery变量定义在函数的外层，即window对象上

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



## 模块加载器

1. 模块加载器解释并加载模块。
2. 模块加载器在运行时运行
	- 将模块加载器加载到浏览器中
	- 告诉模块加载器main文件要加载
	- 它去下载并解释main文件
	- 其他引用的模块按需下载
3. 常用的有requireJS

## 模块捆绑器

1. 运行在代码编译阶段
2. 编译阶段将模块打包为一个bundle文件，程序运行时直接加载
3. 常用的有Browserify或Webpack

# ES6 modules

## 概述

1. modules兼容了CommonJs的近似语法，与AMD的异步加载，但更具优势
      - 比CommonJs语法更兼容（声明性语法）
      - 可以进行静态分析与优化(modules是静态模块)
      - 支持比CommonJs更好的循环引用机制
      - 可编程的加载器API：配置模块的加载方式和选择性地加载模块

2. ES6模块内默认使用`"use strict"`并且内部定义的变量都为私有变量，公有变量、函数、class需要通过`export`导出

3. import与export必须在模块的顶层，即不能被语句嵌套

      ```javascript
      if (Math.random()) {
          import 'foo'; // SyntaxError
      }
      {
          import 'foo'; // SyntaxError
      }
      ```



## Modules是静态模块

### 概述

1. 除ES6 modules 都是动态结构，比如CommonJs需要运行时，才会知道导入的是哪个脚本，导出的是哪个脚本

      ```javascript
      // a.js
      var my_lib;
      if (Math.random()) {
          my_lib = require('foo');
      } else {
          my_lib = require('bar');
      }
      // b.js
      if (Math.random()) {
          exports.baz = ···;
      }
      ```

      - 但ES6在语法上强制import和export只能在顶层（不能嵌套在条件语句中）等
      - 使的ES6 Modules变为静态模块

### 优点1：代码打包期间消除死码

1. 前端开发，通常是：在开发阶段，将代码分为多个Modules；在部署阶段，将全部模块打包为一个
2. 进行模块打包（bunding）的原因
	- 压缩单个打包文件比压缩多个模块效率略高
	- 打包阶段，未使用的export可以被移除，节省空间
	- 单个文件不打包，会造成多个http请求（http/2）可以解决

### 优点2：更快的查找import

1. CommonJs，导入时会返回一个object，如下lib为一个对象，因此当调用lib.someFunc()时，实际进行了一项属性查找

	```javascript
	var lib = require('lib');
	lib.someFunc(); // property lookup
	```

2. ES6 Modules导入时，获取了模块的全部内容，并可以进行优化

## 普通脚本与modules区别

|                    | 普通脚本   | Modules                  |
| ------------------ | ---------- | ------------------------ |
| HTML元素           | `<script>` | `<script type="module">` |
| 默认模式           | no-strict  | strict                   |
| 最顶层的变量       | global     | 指向module的局部变量     |
| this值             | window     | undefined                |
| 执行               | 同步       | 异步                     |
| 是否可以使用import | no         | yes                      |
| 动态导入脚本       | yes        | yes                      |




## Export

### 概述

1. 声明在模块内的变量都不能被其他模块使用
2. 除非这个变量被export并在另一个模块中用import引入
3. exports有两种类型一个是default（只能有一个），另一个是命名exports

### 不是值或引用的导出绑定

1. 导出的所有值都可以理解为“实际绑定”，即模块内部的改变都会影响模块外

	```javascript
	// test.js
	export var foo = 'bar';
	setTimeout(() => {
	  console.log('timer');
	  foo = 'baz';
	}, 1000);
	// main.js
	import { foo } from './test.js'
	    setTimeout(()=>{
	      console.log(foo)；// baz
	    },2000)
	```

###  

## Import

### import会提升

1. import会提升

	```javascript
	foo();// 不会报错
	import { foo } from 'my_module';
	```


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

1. Es6Modules：在代码执行前预解析（更好的理解是，import会提升）

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

2. CommonJs（Node.js）：按需加载

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

4. 由于加载顺序的不同，nodejs将`.mjs`文件使用ES6 modules方式加载，`.js`按照CommonJs加载

### 解决循环引用

1. 应尽量避免循环引用，循环引用会导致两个模块紧耦合

#### CommonJs

1. node官网例子

	```javascript
	//a.js
	exports.done = false;// 2
	var b = require('./b.js');// 3
	// 9 由于b全部加载完，故b获得的结果是 done=true，故输出：在a.js中，b.done = true
	console.log('在a.js中，b.done = %j', b.done);
	exports.done = true;// 10 
	console.log('a.js执行完毕！')// 11
	//b.js
	exports.done = false;// 4
	var a = require('./a.js');// 5 取回a.js已执行的
	console.log('在b.js中，a.done = %j', a.done);// 6 输出结果：在b.js中，a.done = false
	exports.done = true;// 7
	console.log('b.js执行完毕！') // 8,执行完后回a.js执行
	
	//main.js
	var a = require('./a.js');// 1
	var b = require('./b.js');// 12，由于b已经加载完，故直接使用缓存 done=true；a.js执行完毕将done=true返回，故a的值更改了
	// 13输出结果：在main.js中，a.done = true, b.done = true
	console.log('在main.js中，a.done = %j, b.done = %j', a.done, b.done);
	```

	- 输出结果：
	- 在b.js中，a.done = false
	- b.js执行完毕！
	- 在a.js中，b.done = true
	- a.js执行完毕！
	- 在main.js中，a.done = true, b.done = true

#### Modules

1. ES6遇到模块加载命令import时不会去执行模块，只是生成一个指向被加载模块的引用

	```javascript
	// a.js
	import { odd  } from './b.js';
	export var counter = 0;
	export function even() {
	  console.log('a.js even')
	  odd();
	}
	export function even2() {
	  console.log('a.js even2');
	}
	// b.js
	import { even2 } from './a.js ';
	export function odd() {
	  even2();
	}
	// main.js
	import * as even from './a.js'
	even.even();
	```

	- 并不会报错，可以得到正确结果
	- 如果将所有modules语法改为CommonJs，会报错

### 导入方式不同

#### CommonJs

1. CommonJs导入是导出值的赋值

2. 无论是导入一个变量还是一个对象，这个值是被复制的

    ![img](Modules.assets/31_cjs_variable.png)

3. A、B这两个地方复制两次，因为引入的b.js是原来b.js的复制，因此原来b.js发生了什么，不会影响外面结果，故结果都为0

    ```javascript
    // main.js
    const b = require('./b.js');// (B)
    console.log(b.num);// 0
    b.add();
    console.log(b.num);// 0
    // b.js
    let num = 0;
    function add () {
        num++;
    }
    module.exports = {
        add ,// (A)
        num
    };
    ```

#### Modules

1. ES6 modules是导出值的可读版本

1. ES6中，每个import相当于和exports的数据进行了连接

1. import只是可读不能写

1. `import x from 'foo'`导入后x类似于const声明的变量

    ```javascript
    // main.js
    import { num , add} from './test.js'
    console.log(num); // 0
    add();
    console.log(num); // 1
    // test.js
    export let num = 0;
    export function add() {
    	num++;
    }
    ```

1. `import * as b from 'foo'`，b类似一个frozen对象

    ```javascript
    // main.js
    import * as b from './test.js'
    console.log(b.num); // 0
    b.add();
    console.log(b.num); // 1
    b = {} // TypeError
    ```

1. 注意：虽然不能导入改变的值，但可以改变对象内部值

    ```javascript
    //------ lib.js ------
    export let obj = {};
    //------ main.js ------
    import { obj } from './lib';
    obj.prop = 123; // OK
    obj = {}; // TypeError
    ```



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

2. `type="module"`使用CORS请求数据

	- 其他域名，注意跨域问题

3. modules不会发送cookies或请求头凭证，除非设置crossorigin属性，并设置服务器的响应头`Access-Control-Allow-Credentials: true`

	```javascript
	<script type="module" src=".." crossorigin="use-credentials"></script>
	```




### 回退办法

1. 为了支持那些不支持`type="module"`，可以使用`nomodule`属性提供js的回退版本

	```javascript
	<script type="module" src="runs-if-module-supported.js"></script>
	<script nomodule src="runs-if-module-not-supported.js"></script>
	```


### 模块默认延迟加载

1. `<script defer>`属性会延迟执行脚本直到document加载并解析完

2. 所有的`type="module"`默认使用defer属性不会阻塞页面

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

