# 类

## 类理论

1. 面向对象编程强调的是数据和操作数据的行为本质上是互相关联的
	- 字符是数据，但对字符的处理（长度计算、搜索等）被设计为String类
	- 所有字符串都是 String 类的一个实例
2. 类是一种设计模式
	- js提供了近似类的语法
	- 与其他语言类是不一样的

## 混入（js）

1. js中只有对象，并不存在可以被实例化的“类"
2. js开发者想出一个方法模拟类的类的复制行为，这个方法称之为混入
3. 显式混入
	- 需要手动对子父类进行复制，许多库中被称为extend()

## 小结

1. 实例化（ 或者继承） 一个类意味着“ 把类的行为复制到对象中”，对于每一个新实例来说都会重复这个过程
2. js中没有类似的复制机制，不能创建一个类的多个实例，只能创建多个对象，并建立联系

# Class

## 概述

1. 是原型链继承的语法糖
2. 主要是让代码更可读，并为之后构建面向对象的特性奠定基础
3. Class是函数：`class Foo{};typeof Foo;//"function"`
4. 不使用new调用一个class会报错

## 定义Class

### Class声明

1. `class Animal {}`

### class表达式

1. 匿名表达式：`let animal = class {}`
2. 具名表达式：`let animal = class Animal{}`
	- Animal这个名是class内部的一个属性

### 不能提升

1. 构造函数是可以提升的（构造函数也是函数）
2. class并不能提升，故类调用需要在类定义之后



## 定义方法

### constructor

1. 目的是为初始化实例，这意味着，当class创建时，constructor会被调用
2. 一个class只能定义一个constructor
3. constructor可以调用super方法，指向父级的constructor

### 普通方法

1. class定义的普通方法，相当于定义在`prototype`上，不能被类调用

### 静态方法

1. 静态方法只能由类调用，实例不能调用静态方法

	```javascript
	  class Animal{
	    constructor(name){
	      this.name = name;
	    }
	    hi(){
	      console.log(this.name)
	    }
	    static hello(){
	      console.log('hello');
	    }
	  }
	  let a = new Animal('ha');
	  a.hi();        //  ha
	  Animal.hello();//  hello
	  Animal.hi();   //  TypeError: Animal.hi is not a function
	  a.hello();     //  TypeError: a.hello is not a function
	```

### class与es5构造函数的关系

1. 上述class对象转为es5的构造函数

	```javascript
	function Animal(){
	    this.name = name;
	}
	Animal.prototype.hi = funtion(){
	    console.log(this.name)
	}
	Animal.hello =function(){
	    console.log('hello');
	}
	```

	

## es6子类

### 概述

1. es6使用`extends`关键字构建原型继承

	```javascript
	class Animal{
	    constructor(name){
	        this.name = name;
	    }
	    sayName(){
	        console.log(this.name)
	    }
	}
	class Dog extends Animal{
	    constructor(name,age){
	        super(name);
	        this.age = age;
	    }
	    sayEge(){
	        console.log(this.age)
	    }
	}
	let a = new Dog('ha',18);
	a.sayName()
	```

	

### super

#### 概述

1. super的两个主要作用是：访问父级constructor，访问父类方法与属性
	- 子类如包含constructor，必须在使用this之前调用super，否则会报错
	- 可以在子类调用`super.sayName`(指向Animal的sayName方法)

#### [[HomeObject]]

1. 每个函数内部有个内部属性[[HomeObject]]存储着原始定义，即使用super.foo，内部实际访问的是[[HomeObject]].[[Prototype]].foo

2. [[HomeObject]]在定义时确定，并且不能之后更改，理解为class定义后，更改prototype也无效

	```javascript
	class A {
	    foo() {return 'foo in A';}
	}
	class B {
	    foo() {return 'foo in B';}
	}
	const a = new A();
	console.log(a.foo());      // foo in A
	A.prototype = B.prototype  
	console.log(a.foo());       // foo in A
	```

	

3. 必须是子类的constructor才能调用super，普通一个类的constructor调用super会报错

## 与ES5类的区别

1. ES6必须使用 new 调用
2. ES6不存在变量提升
3. class定义的prototype是不可写的，ES5函数定义的prototype是可写的，即es6定义了class后，不能更改prototype
4. ES6内部所有定义的方法都是不可枚举的

## 实现ES6

```javascript
// 主要是通过babel转义得到，https://www.babeljs.cn/repl
// 关键函数
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
// 创建一个Parent类转义后的结果
var Parent =
  /*#__PURE__*/
  function () {
    function Parent() {
      if (! (this instanceof Parent)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    _createClass(Parent,
      [{
        key: "construtor",
        value: function construtor(name) {
          this.name = name;
        }
      }, {
        key: "say",
        value: function say() {
          console.log(this.name);
        }
      }],
      [{
        key: "hello",
        value: function hello() {
          console.log('hello');
        }
      }]
    );
    return Parent;
  }();
// Child 继承父类Parent,主要函数
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, writable: true, configurable: true } });
    if (superClass)
        Object.setPrototypeOf(subClass, superClass);
}
```

1. 注意：提供一种直接使用Object.create绑定construtor的方法