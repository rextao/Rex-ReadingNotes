Functional Programming

纯函数

1. 

核心概念：composition



Immutability => 副作用=> 纯函数

# 纯函数

## 概述

1. 纯函数是函数式编程的基础

   - 给相同的输入，总会产生相同的输出，函数内部不会受函数外部影响

     ```javascript
     // impure function due to external non-constants
     let x = 10
     const addx = (a) => a + x
     ```

     - 如果a是5，x改变，每次调用addx，结果是不一致的；

2. 常见的主要用途：
   - 将输入值与输出值进行映射
   - 处理一些列过程
   - 与系统的其他部分进行交流

3. 理解纯函数的目的，并不是也不可能所有函数都是纯函数，主要是为了分离两个过程，使程序更可读、可测试，最小化不稳定部分的代码

## 主要特征

1. 函数使用`arguments`与局部变量计算结果，故给定相同输入会得到相同的结果
2. 没有副作用（纯函数独立于外部状态）

## 副作用

1. 函数内部改变了函数外面某些值的状态，称为函数副作用

   ```javascript
   const joe = {
     firstName: 'Joe',
     lastName: 'Schmoe'
   }
   function impureUpdate () {
     joe.firstName = 'rex'
   }
   joe.firstName // 'Joe'
   unsafeUpdate() // changes `joe`'s `firstName` property
   joe.firstName // 'rex'
   ```

2. 副作用包括（但不限于）：

   - 改变文件系统
   - 数据库插入记录
   - http请求
   - 获取用户输入
   - 查询DOM
   - 访问系统状态

3. 因此，可以理解为纯函数是没有副作用的函数

## 纯函数的优势

### 可预测性

1. 纯函数给定相同输入，会得到相同结果，如下则不是一个纯函数

   ```javascript
   function hello(name){
       return `${name} say,time is ${new Date()}`
   }
   console.log(hello('rex'));
   console.log(hello('rex'));
   ```

   - 执行结果会因为时间的不同而不同
   - 由于new Date显示到秒级别，直接运行上述代码，结果会一致

### 易测试性

1. 由于可预测性，顾可以根据纯函数预测到应该得到结果

### 并行调用

1. 因为纯函数只是依赖于输入且并不改变外部状态，顾并行（几个函数同时计算）计算也不会出现竞争的情况

### 引用透明性

1. 函数调用可以被其返回值所代替，且并不会改变程序总体的运行效果

## 写纯函数时应注意

1. 不要更改全局状态
2. I/O、读写文件会有副作用，不允许在纯函数中；同样console到命令行一样具有副作用
3. AJAX，网络请求因为可能获得数据或发生错误，因此不允许在纯函数中使用
4. 一般通用规则是：处理数据时使用纯函数，操作结果时使用非纯函数

## 将非纯函数转纯函数

1. 这两种方式都类似于“欺诈”行为，即只是一种转换，将非纯函数转为纯函数
2. 但并不是消除了非纯函数的行为

### 依赖注入

1. 假设获取DOM，是非纯函数，因为引用了外部的document

	```javascript
	function getUserNameFromDOM() {
	    return document.querySelector('#username').value;
	}
	```

2. 依赖注入说白了，其实是将影响纯函数的部分作为参数传入，即

	```javascript
	function getUserNameFromDOM($) {
	    return $('#username').value;
	}
	const qs = document.querySelector.bind(document);
	getUserNameFromDOM(qs);
	```

3. 这样有什么好处呢，方便测试，即如果没有浏览器环境，可以将`$ =() => ({value: 'mhatter'}) `传入到getUserNameFromDom看是否能获得正确结果，但浏览器环境下的测试是必须的

4. 依赖注入主要的问题是，当很多参数时，会造成混乱









## Immutability

### 概述

1. immutable值是一旦创建就不能改变了，js中私有变量如numers，strings，booleans都是；而objects和arrays则不是了

2. 不可变性（immutable）是保证原始定义值不变

   ```javascript
   let list1 = Immutable.List.of(1, 2);
   // We need to capture the result through the return value:
   // list1 is not modified!
   let list2 = list1.push(3, 4, 5);
   ```

3. 如`Array.prototype.push` 会改变原定义数组的值，即并不会返回一个新数组；`Array.prototype.concat`会返回新数组，故前者变异了原始值，后者并没有

4. 不变性的理解：对于数组和对象，是指向内存，为了不变性，需要重新创建个对象再进行更改，而不是直接更改原对象

优势

1. 多线程不在是个问题，因为数据不会改变，所以不需要锁

2. 方便持久化，由于数据是不可变的，每次持久化可以diff出改变的地方进行存储

3.  惰性求值（ lazy evaluation）

   ```javascript
   function plusOne(n) {
       return n + 1;
   }
   function plusTen(n) {
       return n + 10;
   }
   
   var list = [1,2,3,4,5,6,7,8,9,10];
   var result = list.map(plusOne).map(plusTen);
   ```

   - 如要获取`result[0]`，map会执行两次，但如果是Immutable（Immutable.js Seq函数支持），只会执行一次
   - 如果支持 lazy evaluation，编译器是可以直接优化的，如上面调用两次map，可以合并为一次
   - 可能存在的问题：如果计算相当复杂，lazy evaluation不保留中间态，调试将非常复杂





Lambda calculus

1. 主要特性：接收单独input
