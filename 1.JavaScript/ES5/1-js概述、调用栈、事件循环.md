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
                DOM 核心: 如何映射基于XML的文档结构，以便简化操作和访问
                DOM HTML: 添加针对HTML的对象和方法
		 	DOM 2级
				引入一些新模板
		 	DOM 3级
				进一步扩展
	- *注意：*DOM0级标准并不存在，只是历史坐标中的一个参照点而已

### BOM
1. H5致力于把BOM功能写入规范
2. 人们习惯把针对浏览器的js扩展都算作BOM

## 混合JavaScript环境
## ``` <script>```
1. 各个script标签（内联或外联）运行方式相互为独立js程序，一个报错，另外的继续运行

1. 全局作用域的提升机制，不能在不同script标签进行,如下方式会出错

   ```javascript
   <script>foo()</script>
   <script>function foo(){}</script>
   ```

1. 内联代码和外部文件区别

   - 内联代码不能出现</scirpt>，只要出现就被认为是代码块结束
   - 内联代码则使用其所在页面文件的字符集，外联可以charset属性指定

# js引擎

## 概述

1. 当今比较知名的js引擎是 
   - Google V8：用于chrome和node中
   - SpiderMonkey：Mozilla开发的，用于Firefox中
2. node或浏览器中运行js，引擎会创建
   - 全局执行上下文（Global Execution Context）
   - 创建保存变量和函数声明的全局内存（Global Memory）（也称为全局作用域、全局变量）
   - 调用栈（ Call Stack）
3. 当你调用一个函数时，引擎会创建一个局部上下文和局部内存![1544718387484](1-js概述、调用栈、事件循环.assets/1544718387484.png)

## 执行上下文

1. 

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

## 注意

1. 堆栈被阻塞，则网页会崩溃的，如一直递归会往堆栈一直push
2. 异步的回调并没有立即push到堆栈中，因此不会阻塞js其他函数调用

# 事件循环

## 概述

1. js引擎不是独立运行的，他运行在宿主环境中（web，nodejs等）
2. 所有环境都有一个共同“点”（线程），即都提供了一种机制来处理程序中多个块的执行，且执行每块时调用 JavaScript 引擎，这种机制被称为事件循环（Event Loop）。这里面的“事件”调度由环境决定
3. Js引擎本身并没有时间的概念，只是一个按需执行 Js任意代码片段的环境
   - 如写一个setTimeout并不是将回调函数挂载事件循环中，而是告诉环境，我需要1分钟后运行这个函数，当时间到了，才会将回调函数挂上事件循环中，但可能事件循环还有其他未运行函数，这也解释了为何setTimeout不准
   - 故可简单理解异步机制：如ajax，写一个回调函数，告诉宿主环境拿到数据后就调用，当监听到数据后，会将回调函数放到事件循环中准备调用
4. ES6从本质上改变了在哪里管理事件循环，将事件循环的管理纳入js引擎，主要原因是ES6中Promise的引入

## task

1. 是严格按照时间顺序压栈和执行的
2. 可以理解为事件循环中的每个正常事件（task）

## microtask

1. microtask：通常来说就是需要在当前 task 执行结束后立即执行的任务
2. microtask 任务队列是一个与 task 任务队列相互独立的队列，microtask 任务将会在每一个 task 任务执行结束之后执行。
3. 每一个 task 中产生的 microtask 都将会添加到 microtask 队列中，microtask 中产生的 microtask 将会添加至当前队列的尾部，并且 microtask 会按序的处理完队列中的所有任务。
4. microtask 类型的任务目前包括了 MutationObserver (DOM3 Events，会在指定的DOM发生变化时被调用 )以及 Promise 的回调函数。

## 如何判断 task 和 microtask

1. 直接测试输出是个很好的办法，看看输出的顺序是更像 Promise 还是更像 setTimeout，趋向于 Promise 的则是 microtask，趋向于 setTimeout 的则是 task。
2. 为啥要用 microtask？根据HTML Standard（https://link.zhihu.com/?target=https%3A//html.spec.whatwg.org/multipage/webappapis.html%23event-loop-processing-model），在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。

## setInterval 的问题

1. 如setInterval(func,100)，即100ms往队列添加一个事件，100ms后的某个事件，101ms，func调用；
2. ![1542960198163](1-js概述、调用栈、事件循环.assets/1542960198163.png)
3. 根据事件循环，100ms添加一个定时器事件；在过了300ms后，应该t3创建，但此时t2创建的func还未执行完，故跳过t3创建










