# ES5

## 1-js概述

1. 内联js代码和外部文件区别？一个script出错是否会影响其他script？不同script之间的全局作用域提升机制？
2. DOMContentLoaded与load区别
3. defer与async的区别
4. `<noscript>`标签含义
5. 执行上下文的类型？
6. 什么是调用栈？栈阻塞？
7. 为何需要垃圾回收机制？回收的方法？
8. 常见的js引擎？v8主要特点？
9. 什么事件循环？与调用栈的关系？什么是事件队列？task与microtask？为何要有microtask

## 2-类型与值

1. 内置类型？
2. 两种数据类型存储有什么区别？
3. typeof？null为何类型是object？如何正确判断null？constructor判断对象是某个函数实例的问题？基本类型的继承链？何为鸭子类型？正确获取类型的方式？
4. void运算符？是否有整数类型？`42.toFixed(3) `结果？`0.1+0.2 ==0.3 // false`如何解决？何为最大安全数？isNaN与Number.isNaN()区别?
5. 正负零有何用？负零如何判断？`Object.is()`为了解决的问题？
6. string类型的特点？字符串与字符数组的异同，如何进行互转？
7. 属性描述符？获取与配置属性描述符？对象不变性的3种方式？
8. 如何判断一个属性值为undefined还是不存在？`4 in [2, 4, 6]` 的结果以及why?如何检测属性只在当前对象而不搜索Prototype链？区别是否可以枚举？
9. 利用类似`for key in obj`方式复制对象的问题？浅复制的方式？node8深复制的方式？
10. 检测数组的方式？toString与toLocalString区别？push多参数用法？concat、splice、slice方法？
11. 显示几位小数？指数形式显示？URI编码？普通缺失值的判断？对象缺失值的判断？
12. 值类型与引用类型？~~使用？



## 3-作用域

1. var a =2的理解？从RHS角度理解异常抛出？
2. js定义变量的两种作用域？哪些方式可以形成块作用域？循环与闭包？



## 4- this全面解析

1. 为什么使用this？绑定规则？



## 5-强制类型转换

1. toString方法转换不同类型值？JSON字符串化
2. toNumber方法转换规则？Object.create(null) 的问题？
3. 假值有哪些？对象转基本类型？`Symbol.toPrimitive `?Date对象的特殊性？
4. 字符串和数字互转？a + ""（隐式）和 String(a)（显式）的差别？
5. 转换为布尔值？symbol的特殊性？
6. 解析和转换两者之间有明显的差别？parseInt的坑？
7. || 和 &&？==的比较过程？

## 6-函数

1. 函数的两种方式？length？call模拟实现？具名函数？
2. 为何需要立即执行函数？IIFE的形式？IIFE与闭包？
3. 函数与变量提升的顺序？
4. 纯函数？和为副作用？
5. 防抖和节流的区别？典型应用

## 7-构造函数

1. 构造函数的两个约定？构造函数的目的？
2. 使用new操作符会发生？new.target？
3. 字面量的`__proto__`
4. prototype概述？
5. [[Prototype]]链主要解决？
6. `obj.foo = "bar"`的过程？隐式屏蔽的问题？
7. Object.create？Object.create(null)？new与Object.create
8. ES5原型继承的方式？修改对象的prototype关联的方式？
9. 检查类的关系4种方式？
10. 面向委托的设计风格？

## 8-BOM

1. top、parent、self对象的含义？
2. 如何移动窗口、如何修改窗口大小？两个方法的异同
3. setInterval的问题？
4. window.location？？search属性？改变浏览器位置的方法？replace方法的特点？reload含义及传入不同参数的含义？
5. navigator？可以获取哪些信息？
6. screen？
7. history的方法与属性？

## 9-DOM

1. node常用属性以及常用方法？
2. 创建元素？返回元素的指定的属性值？直接node.id与利用Dom方法的不同？设置与删除属性？attributes属性是？
3. 创建文本节点？
4. 创建文档片段
5. 访问元素样式及注意事项？计算样式如何获取？如何获取伪元素样式？CSSStyleDeclaration API？CSSStyleDeclaration 属性及常用方法？
6. CSSStyleSheet API优势？cssText使用？与CSSStyleDeclaration API关系

## 10-事件

1. 事件流的两种方式？如何让事件先冒泡后捕获？事件流的三个阶段？三种方式为DOM元素注册事件处理函数以及异同？
2. event.currentTarget、event.target、event.type、preventDefault()、stopPropogation()、eventPhase属性
3. event.detail?
4. MouseEvent获取客户区坐标位置、页面坐标位置、屏幕坐标位置、修改键、鼠标按钮判断、relatedTaget
5. 如何准确判断滚动方向；WheelEvent.deltaX？
6. KeyboardEvent.key与KeyboardEvent.code区别？location？getModifierState()
7. load、unload事件?
8. 不冒泡的事件有？当焦点从a元素移动到b元素，触发事件顺序是?
9. mouseenter、mouseleave、mouseover、mouseout的区别？双击一个元素，事件发生顺序?
10. contextmenu事件、beforeunload事件

## 11- 表单脚本

1. 获取form的引用？提交表单？重置表单？
2. 选择文本框全部文本？选择文本的起始、终止？选择部分文本？获取选择项序号？默认选中？添加options、删除option?
3. 设置全document可编辑？设置某个元素可编辑？操作富文本？

## 13-错误处理

1. 常见的js错误

## 14- Ajax

1. 什么是ajax？解决缓存的3个办法？xhr的局限性？
2. 同源策略？创建XHR对象？ XHR常用方法？发送异步请求时需要检测xxx属性？xx属性改变会触发xx事件？如何设置HTTP头？如何获取响应头？
3. get请求特点？post请求特点？两者异同？
4. FormData类型？timeout属性，overrideMimeType？
5. XHR事件？progress事件，position属性，totalSize属性？
6. responseType的ArrayBuffer、Blob、Document、JSON、Text表示的含义
7. 定时轮询？定时时间的长短有何影响？改进方式？
8. 跨资源共享？背后的思想是？与XHR的异同？CORS默认的安全措施？
9. SSE目的？局限性？
10. WebSocket？资源URL的自定义模式？

# ES6

## Class

1. 与ES5类的区别
	- ES6必须使用 new 调用
	- ES6不存在变量提升
	- class定义的prototype是不可写的，ES5函数定义的prototype是可写的，即es6定义了class后，不能更改prototype
	- ES6内部所有定义的方法都是不可枚举的

## modules

1. 使用`<script>`标签的问题？
2. 模块化的不同方式以及问题？
3. CommonJS概述？导入与导出模块？
4. AMD？requireJS解决的问题？
5. UMD？
6. ES6 modules的优势？设计思想及这样做的优点？普通script脚本与modules区别？不是值或引用的导出绑定的理解？
7. 与CommonJs的语法区别、加载方式的区别、导入方式不同？
8. 如何在浏览器使用modules？如何应对回退？

## Promise

1. 回调方式主要的缺点？promise的状态？
2. Promise的构造函数？

# 其他

### document.write和innerHTML的区别

1. document.write是直接写入到页面的内容流，会导致页面全部重绘
2. innerHTML将内容写入某个DOM节点，不会导致页面全部重绘

### 谈谈你对JS执行上下文栈和作用域链的理解

1. 执行上下文就是当前 JavaScript 代码被解析和执行时所在环境,

2. JS执行上下文栈可以认为是一个存储函数调用的栈结构，遵循先进后出的原则。

3. LHS和RHS查询，但无论LHS与RHS查询，都会在当前的作用域开始查找，如果没有找到，就会向上级作用域继续查找目标标识符，每次上升一个作用域，一直到全局作用域为止。

4. RHS在所有作用域都查询不到，会抛出ReferenceError（未声明）错误
	
	- 如查询到变量，但对变量值进行不合理操作（应用null中的属性等），会抛出TypeError
	
5. LHS在所有作用域查询不到，会在全局作用域创建这个变量（非严格模式）
	
	- 严格模式禁止隐式或自动创建全局变量
	
	

### ES6新的特性有哪些？

1. 新增了块级作用域(let,const)
2. 提供了定义类的语法糖(class)
3. 新增了一种基本数据类型(Symbol)
	新增了变量的解构赋值
4. 扩展运算符
5. ES6 新增了模块化(import/export)
6. ES6 新增了 Set 和 Map 数据结构
7. ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例
8. ES6 新增了生成器(Generator)和遍历器(Iterator)

### form表单提交没有跨域问题

1. 跨域本质是个域名下面的JS，没有经过允许是不能读取另外一个域名的内容，是针对js而言的
2. 提交form表单到另外一个域名，原来页面是无法获取新页面的内容，或者说form提交后不需要返回，但是ajax是需要返回的。

### 跨域综述

1. jsonp
	- HTML标签里，一些标签比如script、img这样的获取资源的标签是没有跨域限制的，利用这一点
	- html写一个script标签，请求一个url带一个function的参数
	- 后台配合，返回一个函数，函数体内为需要的数据
	- 但只能get请求
2. CORS
	- 跨域资源共享，后台需要设置Access-Control-Allow-Origin
3. nginx代理

对动画的理解

1. setTimeInterval，setTimeout定时时间不准
2. requestAnimationFrame
3. css3 animation,transition

### 小知识

1. undefined和null区别
   - null： Null类型，代表“空值”，代表一个空对象指针，使用typeof运算得到 “object”，它是一个特殊的对象值。
   - undefined： Undefined类型
   - null是javascript的关键字，undefined是预定义的全局变量

2. JS哪些操作会造成内存泄露

	- 闭包引起的内存泄露
	- 没有清理的DOM元素引用
	- 被遗忘的定时器或者回调 

3. 怎样添加、移除、移动、复制、创建和查找节点？

	- 创建新节点

		createDocumentFragment() //创建一个DOM片段

		createElement() //创建一个具体的元素

		createTextNode() //创建一个文本节点

	- 2）添加、移除、替换、插入
		appendChild() //添加
		removeChild() //移除
		replaceChild() //替换
		insertBefore() //插入

	- 3）查找
		getElementsByTagName() //通过标签名称
		getElementsByName() //通过元素的Name属性的值getElementById() //通过元素Id，唯一性
	
4. 如何判断一个变量是不是数组？

  - 使用 Array.isArray 判断，如果返回 true, 说明是数组
  - 使用 instanceof Array 判断，如果返回true, 说明是数组
  - 使用 Object.prototype.toString.call 判断，如果值是 [object Array], 说明是数组
  - 通过 constructor 来判断，如果是数组，那么 `arr.constructor === Array`. (不准确，因为我们可以指定 `obj.constructor = Array`)

5. 类数组可以转换为数组:

	- Array.prototype.slice.call(arrayLike, start);
	- [...arrayLike];
	- Array.from(arrayLike);
	
6. 数组api哪些能改变原数组哪些不能

	- 直接修改的：splice，reverse，sort，push，pop，shift，unshift
	- 不修改的：concat，join，slice
	
7. 词法作用域和this的区别

	- 词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的
	- this 是在调用时被绑定的，this 指向什么，完全取决于函数的调用位置
	
8. 闭包的作用有:

	- 封装私有变量
	- 模仿块级作用域(ES5中没有块级作用域)
	- 实现JS的模块
	
9. 取数组的最大值（ES5、ES6）

	- `Math.max.apply(null, [14, 3, 77, 30]);`
	- Math.max(...[14, 3, 77, 30]);
	
10. 请求中如何传中文？

	- 利用encodeURIComponent或encodeURI编码
	
11. 什么情况下用相等==

	- 简而言之：没有，使用===会更清晰，也可以代替==的情况
	- 如可以用来比较：`new String('123') == '123'
	- 但可以用来比较undefined与null
	- if(!x)，但undefined，null，false，0，""
	
12. 为何jsonp不支持post请求
	
	- jsonp本质就是使用js的script标签 进行传参，那么必然是get方式的了，和浏览器中敲入一个url一样
	
13. html5对于input新增的属性

	- autoComplete
- autoFocus
	- required

14. 介绍localstorage的API

	- getItem，setItem，removeItem，clear，key(n)

15. 类数组转为数组

	- Array.prototype.slice.call(arguments)
	- Array.from
	- 扩展运算符

16. 判断`JavaScript`数据类型的方式

    - typeof，只能判断基本类型
    - instanceof，判断对象
    - toString.call
    - constructor，`c.constructor === Array` constructor可以被重写

17. 准确判断array

    - toString.call
    - isArray

18. `JavaScript`可以存储的最大数字、最大安全数、解决精度丢失的方法

    - 最大安全数：2^53-1
    - 最大数：由于js数是按照双精度浮点数，故最大值可以是1.79*10^308
    - 解决小数精度丢失：通常是*100转为整数运算，或使用bigInt（stage3非标准）

    





# 实现代码

## 模拟实现instanceof

```javascript
function _instanceof(leftVaule, rightVaule) { 
    let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
    leftVaule = Object.getProtyotypeOf(leftVaule); // 取左表达式的__proto__值
    while (true) {
        if (leftVaule === null) {
            return false;	
        }
        if (leftVaule === rightProto) {
            return true;	
        } 
        leftVaule = Object.getProtyotypeOf(leftVaule)
    }
}
```



### 手动实现new

```javascript
function _new(fn, ...arg) {
    const obj = {}; //创建一个新的对象
    obj.__proto__ = fn.prototype; //把obj的__proto__指向fn的prototype,实现继承
    fn.apply(obj, arg) //改变this的指向
    return {} //返回新的对象obj
}
```

