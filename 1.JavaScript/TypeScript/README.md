# TypeScript

## 概述

1. TypeScript是JavaScript的一个超集类型编译为普通的JavaScript 
2. 是纯面向对象与类，接口和静态类型如C#或Java 
3. 可以编译出纯净、简洁的JavaScript代码，并且可以运行在任何浏览器上、Node.js环境中和任何支持ECMAScript3 （或更高版本）的JavaScript引擎中
4. 可以使用ES高特性，但会被编译为简洁的低版本js

## 安装

1. npm install -g typescript

2. 创建greeter.ts文件，然后运行tsc greeter.ts 

	- ```typescript
		function greeter(person: string) {
		    return "Hello, " + person;
		}
		let user = "Jane User";
		document.body.innerHTML = greeter(user);
		```

3. 如果将，user改为[1,2,3]，在运行编译ts文件命令时，就会报错

4. 运行TypeScript Web应用

	- 将编译后的js引入的html中即可

	- ```html
		<!DOCTYPE html>
		<html>
		    <head><title>TypeScript Greeter</title></head>
		    <body>
		        <script src="greeter.js"></script>
		    </body>
		</html>
		```

## 基础类型 

### 元组 Tuple

1. 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为`string`和`number`类型的元组。 

	```typescript
	// Declare a tuple type
	let x: [string, number];
	// Initialize it
	x = ['hello', 10]; // OK
	// Initialize it incorrectly
	x = [10, 'hello']; // Error
	```

2. 当访问一个已知索引的元素，会得到正确的类型，但访问一个越界的元素，会使用联合类型替代

	```typescript
	console.log(x[0].substr(1)); // OK
	console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
	x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
	console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
	x[6] = true; // Error, 布尔不是(string | number)类型
	```

### 枚举

1. 对js的一个补充，默认从0开始编码，也可以手动赋值

	```typescript
	enum Color {Red = 1, Green = 2, Blue = 4}
	let c: Color = Color.Green;// 2
	```

2. 可以通过枚举值得到它的名字

	```typescript
	enum Color {Red = 1, Green, Blue}
	let colorName: string = Color[2];
	console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
	```

3. 枚举主要作用是

	- 可以提供有限个选择，避免用户因错误输入其他信息
	- 增加可读性，比如星期1,2,3，在程序中可以使用c.monday，实际这个值是1

### Void

1. 表示没有任何类型，如一个函数没有返回值

	```typescript
	function warnUser(): void {
	    console.log("This is my warning message");
	}
	```

### Null 和 Undefined

1. TypeScript里，`undefined`和`null`两者各自有自己的类型分别叫做`undefined`和`null`
2. void类型可以赋值为null或undefined
3. 默认情况下，null与undefined是任何类型的子类型
4. 当你指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自 

### Never

1. `never`类型表示的是那些永不存在的值的类型

### 类型断言

1. 类似于，强制类型转换，在编译期间起作用，没有运行的影响，TypeScript会假设你已经做了类型检查

2. 尖括号语法

	```typescript
	let someValue: any = "this is a string";
	let strLength: number = (<string>someValue).length;
	```

3. as语法

	```typescript
	let someValue: any = "this is a string";
	let strLength: number = (someValue as string).length;
	```





