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

## 

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

1. 子类如包含constructor，必须在使用this之前调用super，否则会报错
2. 必须是子类的constructor才能调用super，普通一个类的constructor调用super会报错
3. super会指向父类，故可以在子类的其他方法调用`super.sayName`(指向Animal的sayName方法)

