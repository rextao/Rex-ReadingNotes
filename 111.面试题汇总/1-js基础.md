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
2. typeof？null为何类型是object？如何正确判断null？constructor判断对象是某个函数实例的问题？基本类型的继承链？何为鸭子类型？正确获取类型的方式？
3. void运算符？是否有整数类型？`42.toFixed(3) `结果？`0.1+0.2 ==0.3 // false`如何解决？何为最大安全数？isNaN与Number.isNaN()区别?
4. 正负零有何用？负零如何判断？`Object.is()`为了解决的问题？
5. string类型的特点？字符串与字符数组的异同，如何进行互转？
6. 属性描述符？获取与配置属性描述符？对象不变性的3种方式？
7. 如何判断一个属性值为undefined还是不存在？`4 in [2, 4, 6]` 的结果以及why?如何检测属性只在当前对象而不搜索Prototype链？区别是否可以枚举？
8. 利用类似`for key in obj`方式复制对象的问题？浅复制的方式？node8深复制的方式？
9. 检测数组的方式？toString与toLocalString区别？push多参数用法？concat、splice、slice方法？
10. 显示几位小数？指数形式显示？URI编码？普通缺失值的判断？对象缺失值的判断？
11. 值类型与引用类型？~~使用？



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

1. 函数的两种方式？length？具名函数？
2. 为何需要立即执行函数？IIFE的形式？IIFE与闭包？
3. 函数与变量提升的顺序？
4. 纯函数？和为副作用？

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





防抖

节流



ES6

## modules

1. 使用`<script>`标签的问题？
2. 模块化的不同方式以及问题？
3. CommonJS概述？导入与导出模块？
4. AMD？requireJS解决的问题？
5. UMD？
6. ES6 modules的优势？设计思想及这样做的优点？普通script脚本与modules区别？不是值或引用的导出绑定的理解？
7. 与CommonJs的语法区别、加载方式的区别、导入方式不同？
8. 如何在浏览器使用modules？如何应对回退？