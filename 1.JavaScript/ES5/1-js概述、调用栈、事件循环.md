# 概述
## js实现
### 核心（ECMAScript）
1. 与浏览器没有依赖关系
2. web浏览器只是ECMAScript实现的宿主环境之一，其他环境：如Node，Flash
3. 主要是用来规定：语法、类型、语句、关键字、保留字、操作符、对象

### DOM
1. 是针对XML，经过扩展用于HTML的应用程序编程接口
2. DOM并不是只针对js，很多语言也实现了DOM，web浏览器中，基于ECMAscript实现DOM是js的重要组成部分
3. DOM级别划分
	- 	DOM 1级
       ​         DOM 核心: 如何映射基于XML的文档结构，以便简化操作和访问
       ​         DOM HTML: 添加针对HTML的对象和方法
		 	DOM 2级
		​		引入一些新模板
		 	DOM 3级
		​		进一步扩展
	- *注意：*DOM0级标准并不存在，只是历史坐标中的一个参照点而已

### BOM
1. H5致力于把BOM功能写入规范
2. 人们习惯把针对浏览器的js扩展都算作BOM

## 混合JavaScript环境
### ``` <script>```
1. 各个script标签（内联或外联）运行方式相互为独立js程序，一个报错，另外的继续运行

1. 全局作用域的提升机制，不能在不同script标签进行,如下方式会出错

   ```javascript
   <script>foo()</script>
   <script>function foo(){}</script>
   ```

1. 内联代码和外部文件区别

   - 内联代码不能出现`</scirpt>`，只要出现就被认为是代码块结束
   - 内联代码则使用其所在页面文件的字符集，外联可以charset属性指定
   - 带有src的script元素，会忽略标签中js代码

### 延迟脚本(defer)

1. 表示：document解析完后再执行脚本，因此脚本不会影响html解析
2. `<script type="" src="" defer="defer"></script>`放在head中会延迟加载

### 异步脚本(async)

1. html5属性：表示，如果可以，异步加载js
2. 浏览器默认是`async="false"`，同步加载js；而动态插入（document.createElement()）会异步加载
3. `<script type="" src="" async ></script>`放在head中会异步加载
4. async属性的目的是：不让页面等待脚本下载和执行，从而异步加载页面其他内容
5. 由于异步加载，脚本加载顺序和页面中出现顺序不一定一致，故两个脚本不能有依赖关系

### 与DOMContentLoaded的关系

#### DOMContentLoaded与load

1. DOMContentLoaded：html文档加载解析完后触发，无需等待样式表、图像和子框架的完成加载

2. load：依赖资源全部加载完

3. 蓝线代表DOMContentLoaded，红线代表load

	![1546500606031](1-js概述、调用栈、事件循环.assets/1546500606031.png)

#### sync（同步）与DOMContentLoaded

1. html遇到js脚本后会进行加载与执行

	![1546500792359](1-js概述、调用栈、事件循环.assets/1546500792359.png)

#### async(异步)与DOMContentLoaded

1. async一定在loaded之前，但可能在DOMContentLoaded之前或之后

2. 在之前的情况：html内容很多，但js脚本很小执行很快

	![1546500906311](1-js概述、调用栈、事件循环.assets/1546500906311.png)

3. 在之后的情况：html很少，但js很长

	![1546500932263](1-js概述、调用栈、事件循环.assets/1546500932263.png)

4. **DomContentLoaded 事件只关注 HTML 是否被解析完，而不关注 async 脚本。**

#### defer与DOMContentLoaded

1. 下载完js也不会执行js，要等待html解析完![1546501160912](1-js概述、调用栈、事件循环.assets/1546501160912.png)
2. 注意：与async图非常像，关键是DOMContentLoaded触发点![1546501211713](1-js概述、调用栈、事件循环.assets/1546501211713.png)

### `<noscript>`

1. 放在`<body>`中，当脚本无效情况下向用户显示其中的信息
2. 如用户启动了脚本或脚本可用，用户永远不会看到

# js引擎

## 概述

1. 当今比较知名的js引擎是 
   - Google V8：用于chrome和node中
   - SpiderMonkey：Mozilla开发的，用于Firefox中
2. node或浏览器中运行js，引擎会创建
   - 全局执行上下文（Global Execution Context）
   - 创建保存变量和函数声明的全局内存（Global Memory）（也称为全局作用域、全局变量）
   - 调用栈（ Call Stack）

## 运行时

1. 浏览器简单的可以视为：![1544755518500](1-js概述、调用栈、事件循环.assets/1544755518500.png)
2. memory Heap：负责内存分配
3. call stack：调用栈，负责执行代码
4. web apis：是由浏览器提供，而不是由js引擎提供

## 执行上下文

### 概述

1. 任何代码在JavaScript中运行时，都在执行上下文中运行

### 执行上下文的类型

1. 全局执行上下文（Global Execution Context）
	- 代码不是在某个函数而是在全局执行上下文中运行
	- 创建全局执行上下文一般执行两件事：1、创建全局对象（浏览器中为window对象），2、设置this值为全局对象
2. 函数执行上下文（Functional Execution Context）：
	- 函数被调用时，会创建函数的执行上下文和局部内存![1544718387484](1-js概述、调用栈、事件循环.assets/1544718387484.png)
	- 注意：此函数执行上下文在函数调用时才被创建！！！！

### 执行上下文是如何创建的

1. 执行上下文创建分为两个阶段
	- 创建阶段
	- 执行阶段

#### 创建阶段

1. 在执行任何JavaScript代码之前，执行上下文将经历创建阶段。在创建阶段有三件事情发生
	- 进行this绑定
	- 词法环境（LexicalEnvironment）组件创建
	- 变量环境（VariableEnvironment ）组件创建
	- 名词定义在https://tc39.github.io/ecma262/#sec-executable-code-and-execution-contexts
	- 作者对协议进行了介绍https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0
2. this绑定（具体可以看4-this全面解析）
	- 在全局执行上下的this绑定到全局对象上（浏览器为window）
	- 函数执行上下文的this，根据函数调用绑定

## 调用栈

### 概述

1. Javascript是一种单线程的语言，这意味着它可以一次处理一个任务或一段代码。
1. 由于调用堆栈是单个的，所以从上到下逐个执行函数，这意味着调用堆栈是同步的，代码执行是同步的

### 代码解释

1. 这是一个记录函数调用的数据结构，如调用一个函数来执行，我们将其推入堆栈，当函数返回时，弹出堆栈的顶部 

    ```javascript
    function foo(b){
        var a = 5;
        return a*b;
    }
    function bar(x) {
        return foo(x*3)
    }
    console.log(bar(6))
    ```

1. 调用栈内容，main>console.log(bar(6))>bar(6)>foo(18)，然后再依次弹出返回值

### 栈阻塞

1. 如递归出现问题时，会一直往栈中push值，导致报错Maximum call stack size exceeded
2. 如一个非常大计算的函数在栈中，会阻塞浏览器干其他事情，一旦堆栈中处理如此多的任务，页面就可能会长时间停止响应。大多浏览器会提示如下信息：![1544756007907](1-js概述、调用栈、事件循环.assets/1544756007907.png)
3. 基于这个原因，需要异步处理一些事情，即利用事件循环

## 垃圾回收机制

### 为何需要这样的机制

1. JavaScript程序每次创建字符串、数组或对象时，解释器都必须分配内存来存储这个实体。当这些值不再需要时，需要释放内存，否则，Js会消耗完全部内存，造成系统崩溃。
2. 垃圾回收的方法：标记清除、计数引用。

### 标记清除

1. 最常见的垃圾回收方式
2. 会为进入环境和离开环境的变量打上标记
3. 可以使用任何方式来标记变量，如通过翻转某个特殊位来记录何时进入环境，何时离开环境
4. 垃圾回收器会定期清除标记为离开环境的变量，以释放内存

### 引用计数（不常见）

1. 跟踪记录每个值被引用的次数

2. 当声明一个变量，并用一个引用类型值a赋值时，会将a引用次数标记为1，如变量更换了引用值，则a的引用次数标记减1，为0

3. 垃圾回收器会定时回收标记为0的

4. 此方式会导致内存泄漏

	```javascript
	function problem() {
	    var objA = new Object();
	    var objB = new Object();
	    objA.someOtherObject = objB;
	    objB.anotherObject = objA;
	}
	```

	- objA与objB相互引用，会被标记为2，当两个对象离开作用域后，计数不为0
	- 垃圾回收器并不能回收这样的对象，故会造成内存泄露

# 引擎介绍

## 常见引擎

1. V8：开源，Google开发，C++
2. [Rhino](https://en.wikipedia.org/wiki/Rhino_%28JavaScript_engine%29)：开源，Mozilla ，java开发
3. [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey_%28JavaScript_engine%29)：第一个js引擎，原来服务于网景公司，现在Firfox
4. [JavaScriptCore](https://en.wikipedia.org/wiki/JavaScriptCore) ：开源，Apple为Safari开发
5. [JerryScript](https://en.wikipedia.org/wiki/JerryScript)：为互联网开发的轻量级引擎
6. [Chakra (JScript9)](https://en.wikipedia.org/wiki/Chakra_%28JScript_engine%29)：IE引擎
7. [Chakra (JavaScript)](https://en.wikipedia.org/wiki/Chakra_%28JavaScript_engine%29) ：Edge引擎

## v8引擎介绍

### 概述

1. v8引擎开始的设计目标是提高js在web浏览器的性能
2. 为了提高速度，v8引擎不是使用js解释器，而是直接利用JIT(Just-In-Time)编译器将js代码直接编译为机器码
3. SpiderMonkey or Rhino (Mozilla)也是这样做的，v8与他们主要区别是v8不会产生字节码或任何中间代码

### v8使用2个编译器

1. full-codegen编译器
	- 简单、非常迅速的编译器，产生简单但相对比较慢的机器码
	- 主要用于代码第一次执行时，此编译器将js代码转换为机器码，不进行任何优化
2. Crankshaft 编译器
	- 更复杂的（Just-In-Time）优化编译器
	- 代码运行多次后，Crankshaft 会启用一个线程将js抽象逻辑树转换为名为Hydrogen的高级static single-assignment (SSA)  ，然后优化Hydrogen

### Crankshaft优化举例

#### 提前内联函数

1. 提前内联尽可能多的代码，即提前找到每个函数对应的位置。 ![1544757505464](1-js概述、调用栈、事件循环.assets/1544757505464.png)

#### 隐藏class

1. js是基于原型的语言，没有class，对象的创建是通过克隆，并且js是动态语言，因此对象实例化后可以添加或删除属性

2. 大多解释器使用hash结构在内存定位obj，如java这样固定类型，可以通过key（类型确定），预测value在内存的最大偏移量，但js的类型可以在运行期改变，这就造成这种方式存储会比java存储花费更大的计算成本

3. v8使用hidden class这样的方式，如代码

	```javascript
	function Point(x, y) {
	    this.x = x;
	    this.y = y;
	}
	var p1 = new Point(1, 2);
	```

4. 当new Point(1, 2) 调用，v8会创建一个C0的hidden class ，由于Point没有属性，故C0为空![1544758161096](1-js概述、调用栈、事件循环.assets/1544758161096.png)

5. 如运行到this.x = x为Point添加x属性，v8会构建一个hidden Class C1，将状态转为C1，this.y= y 时，会构建个C2![1544758478199](1-js概述、调用栈、事件循环.assets/1544758478199.png)

6. 最终，相当于构建了一个从c0到c2的路径

7. 结论

	- 虽然不知道这个如何起到高效的作用！！

	- 但由于v8会构建路径，因此，对于如下不同顺序的赋值操作，v8会构建两条不一样的path

		```javascript
		function Point(x, y) {
		    this.x = x;
		    this.y = y;
		}
		var p1 = new Point(1, 2);
		p1.a = 5;
		p1.b = 6;
		var p2 = new Point(3, 4);
		p2.b = 7;
		p2.a = 8;
		```

# 事件循环

## 概述

1. js引擎不是独立运行的，他运行在宿主环境中（web，nodejs等）
2. 所有环境都有一个共同“点”（线程），即都提供了一种机制来处理程序中多个块的执行，且执行每块时调用 JavaScript 引擎，这种机制被称为事件循环（Event Loop）。这里面的“事件”调度由环境决定
3. Js引擎本身并没有时间的概念，只是一个按需执行 Js任意代码片段的环境
   - 如写一个setTimeout并不是将回调函数挂载事件循环中，而是告诉环境，我需要1分钟后运行这个函数，当时间到了，才会将回调函数挂上事件循环中，但可能事件循环还有其他未运行函数，这也解释了为何setTimeout不准
   - 故可简单理解异步机制：如ajax，写一个回调函数，告诉宿主环境拿到数据后就调用，当监听到数据后，会将回调函数放到事件循环中准备调用
4. ES6标准指定了事件循环应该如何工作，故将事件循环的管理纳入js引擎，这样做主要原因是ES6中Promise（promise需要对事件循环进行直接、细粒度的控制）的引入

## 与调用栈的关系

1. 事件循环（event loop）会检查调用栈（call stack）是否为空，如空，则去查询事件队列（ Event Loop queue）
2. 如事件队列有内容，则将内容加入调用栈并执行
3. 事件循环会不断的运行，直到浏览器内容loaded完或关闭浏览器
4. 事件表（ event table ）跟踪已触发的所有事件，并将它们发送到要执行的事件队列。 

## task

1. 是严格按照时间顺序压栈和执行的
2. 可以理解为事件循环中的每个正常事件（task）

## microtask（jobs）

1. ES6引入新的“Job 队列”，主要是为了处理promise
2. microtask：通常来说就是需要在当前 task 执行结束后立即执行的任务
3. microtask 任务队列是一个与 task 任务队列相互独立的队列，microtask 任务将会在每一个 task 任务执行结束之后执行。
4. 每一个 task 中产生的 microtask 都将会添加到 microtask 队列中，microtask 中产生的 microtask 将会添加至当前队列的尾部，并且 microtask 会按序的处理完队列中的所有任务。
5. microtask 类型的任务目前包括了 MutationObserver (DOM3 Events，会在指定的DOM发生变化时被调用 )以及 Promise 的回调函数。

## 如何判断 task 和 microtask

1. 直接测试输出是个很好的办法，看看输出的顺序是更像 Promise 还是更像 setTimeout，趋向于 Promise 的则是 microtask，趋向于 setTimeout 的则是 task。
2. 为啥要用 microtask？根据HTML Standard（https://link.zhihu.com/?target=https%3A//html.spec.whatwg.org/multipage/webappapis.html%23event-loop-processing-model），在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。



## 时钟

### setInterval 的问题

1. 问题1：某些func未执行

	- 如setInterval(func,100)，即100ms往队列添加一个事件，100ms后的某个事件，101ms，func调用；![1542960198163](1-js概述、调用栈、事件循环.assets/1542960198163.png)
		- 根据事件循环，100ms添加一个定时器事件；在过了300ms后，应该t3创建，但此时t2创建的func还未执行完，故跳过t3创建

2. 问题2：使用 setInterval 时，func 函数的实际调用间隔要比代码给出的间隔时间要短

	![1547198210894](1-js概述、调用栈、事件循环.assets/1547198210894.png)

	- setInterval，比如设置100ms运行func一次，但如果func执行时间就是100ms，则实际调用时，则无函数间隔（不考虑事件循环）

3. 在Chrome/Opera/Safari中，弹窗会使周期时钟暂停

### 递归setTimeout

1. 比setInterval更灵活，如服务器过载，可以降低请求频率

	```javascript
	let delay = 5000;
	
	let timerId = setTimeout(function request() {
	  // ...send request...
	  if (request failed due to server overload) { 
	    delay *= 2;
	  }
	  timerId = setTimeout(request, delay);
	}, delay);
	```

### 时间间隔问题

1. 利用递归形式的setTimeout，则可以保证函数间隔为100ms

	![1547198366288](1-js概述、调用栈、事件循环.assets/1547198366288.png)

### 嵌套定时器的最小间隔

1. 在浏览器环境下，嵌套定时器的运行频率是受限制的。
2. 根据 [HTML5 标准](https://www.w3.org/TR/html5/webappapis.html#timers) 所言：“经过 5 重嵌套之后，定时器运行间隔强制要求至少达到 4 毫秒”。

## requestAnimationFrame

1. 见《Rex-ReadingNotes\2.HTML\2-HTML5\window.requestAnimationFrame.md》






