# 1-js概述

1. 内联js代码和外部文件区别？一个script出错是否会影响其他script？不同script之间的全局作用域提升机制？
2. DOMContentLoaded与load区别
3. defer与async的区别
4. `<noscript>`标签含义
5. 执行上下文的类型？
6. 什么是调用栈？栈阻塞？
7. 为何需要垃圾回收机制？回收的方法？
8. 常见的js引擎？v8主要特点？
9. 什么事件循环？与调用栈的关系？什么是事件队列？task与microtask？为何要有microtask

# 2-类型与值

1. 内置类型？
2. typeof？null为何类型是object？如何正确判断null？constructor判断对象是某个函数实例的问题？基本类型的继承链？何为鸭子类型？正确获取类型的方式？
3. void运算符？是否有整数类型？`42.toFixed(3) `结果？`0.1+0.2 ==0.3 // false`如何解决？何为最大安全数？isNaN与Number.isNaN()区别?
4. 正负零有何用？负零如何判断？`Object.is()`为了解决的问题？

# 类型转换

## 转Boolean

1. 在条件判断时，除了 `undefined`， `null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`。

## 对象转基本类型

1. 对象在转换基本类型时，首先会调用 `valueOf` 然后调用 `toString`。并且这两个方法你是可以重写的。
2. 可以重写 `Symbol.toPrimitive` ，该方法在转基本类型时调用优先级最高。

## 四则运算符

1. 只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。
2. 其他运算只要其中一方是数字，那么另一方就转为数字

## `==` 操作符

1. == 比较过程，[标准](http://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison)，如比较`x == y`
	- x与y如类型相同，则调用===比较
		- x或y为NaN（NaN是number类型），返回false
	- 如比较的是undefined和null，则直接返回true
	- 如比较的是`number`和`string`、`boolean`，则将string的转为`number`类型
	- 如比较x为Boolean类型，则比较ToNumber(x) == y的结果
	- 如一边是对象，将对象转为基本类型
		- 有valueOf并返回基本类型，则使用
		- 否则调用toString，返回基本类型，则使用
		- 否则抛出异常

## 比较运算符

1. 如果是对象，就通过 `toPrimitive` 转换对象
2. 如果是字符串，就通过 `unicode` 字符索引来比较



# 原型

1. test1

	```javascript
	var obj = {};
	var arr = [];
	function fn() {}
	console.log(obj.__proto__ === ???); 
	// Object.prototype
	console.log(arr.__proto__ === ???); 
	// -> Array.prototype
	console.log(fn.__proto__ === ???); 
	// -> Function.prototype
	```

2. `__proto__`与[[Prototype]]链的关系??

# new

1. 参见《7-构造函数、原型、行为委托》
2. 构造函数是？
3. 当使用new操作符时，会发生？
4. new.target是？

# instanceof

1. 检查类关系的4种方式
2. 修改对象的[[Prototype]]关联，es5与es6方式？
3. 继承实现的方式？？

# this

1. 绑定的4条规则

# 执行上下文

1. 参见《1-js概述》