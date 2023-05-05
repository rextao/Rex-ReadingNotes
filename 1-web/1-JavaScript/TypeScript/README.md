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

### 与js相同的类型

1. boolean：`let isDone: boolean = false;`
2. 数字：`let decLiteral: number = 6;`
3. 字符串：`let name: string = "bob";`同样可以使用模板字符串
4. 数组：
   - `let list: number[] = [1, 2, 3];`
   - 泛型方式：`let list: Array<number> = [1, 2, 3];`

### 元组 Tuple

1. 表示一个已知元素数量和类型的数组，元素的类型不必相同

2. 表示方法：`let x: [string, number];`

  - 设置x值，第一个值需为string，第二个值为number
  - 获取值，x[0]为string类型，x[1]为number类型
  - 设置越界值，需string或number。`x[3]='world'`

  

3. 当访问一个已知索引的元素，会得到正确的类型，但访问一个越界的元素，会使用联合类型替


### 枚举

#### 概述

1. 支持数字的和基于字符串的枚举

#### 数字枚举

1. 默认是从0开始自增长

2. 也可以手动赋值

  ```typescript
  enum Color {Red = 1, Green = 2, Blue = 4}
  let c: Color = Color.Green;// 2
  ```

3. 可以通过枚举值得到它的名字，或使用对象方式

  ```typescript
  enum Color {Red = 1, Green, Blue}
  let colorName: string = Color[2];
  let color: number = Color.Red;
  console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
  ```

4. 每个枚举成员都是一个常量或是一个计算出来的值

  - 枚举的第一个成员且没有赋默认值时，会默认从0开始
  - 不带默认值的值，会根据前一个枚举值+1
  - 可以使用常量枚举表达式（四则运算，一元运算符，或之前枚举值）

5. 枚举主要作用是

  - 可以提供有限个选择，避免用户因错误输入其他信息
  - 增加可读性，比如星期1,2,3，在程序中可以使用c.monday，实际这个值是1

#### 字符串枚举

1. 每个成员都必须用字符串字面量

   ```typescript
   enum Direction {
       Up = "UP",
       Down = "DOWN",
       Left = "LEFT",
       Right = "RIGHT",
   }
   ```

   - 没有自增长的行为

#### 异构枚举(不建议使用)

1. 枚举可以同时写数字与字符串类型，但不要这么做

#### 联合枚举

1. 枚举类型本身变成了每个枚举成员的联合，即ts能捕获类似如下的错误

   ```typescript
   enum E {
       Foo,
       Bar,
   }
   function f(x: E) {
       if (x !== E.Foo || x !== E.Bar) {// error
       }
   }
   ```

   - 由于E只有Foo与Bar，故if这个比较就是有问题的

#### 枚举成员类型（作为接口）

1. 枚举成员可以作为类型

   ```typescript
   enum ShapeKind {
       Circle,
       Square,
   }
   interface Circle {
       kind: ShapeKind.Circle;
       radius: number;
   }
   let c: Circle = {
       kind: ShapeKind.Square,// Error!
       radius: 100,
   }
   ```

#### 运行时枚举

1. 枚举是在运行时真正存在的对象，因此是可以被整体使用的

   ```typescript
   enum E {
       X, Y, Z
   }
   function f(obj: { X: number }) {
       return obj.X;
   }
   f(E);
   ```

   - 因为E这个枚举，存在X且值就是0（默认值）

#### 反向映射

1. 不会为字符串枚举成员生成反向映射

   ```typescript
   enum Enum {
       A
   }
   let a = Enum.A;
   let nameOfA = Enum[a]; // "A"
   ```

#### const枚举

1. 不同于常规枚举，会在编译时删除，使用的地方会被内联进去
2. 因此对于：`const enum E` ，就不能被作为普通对象传入上面（运行时枚举）f函数中使用

#### 枚举兼容性

1. 所谓兼容性，即可以进行赋值

2. 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容

   ```typescript
   enum Status { Ready, Waiting };
   enum Color { Red , Blue, Green };
   let status1 = Status.Ready;
   let num = 3;
   num = Status.Waiting; // ok
   status1 = 1;// ok
   status = Color.Green;  // Error
   ```

   - 实际是，数字类型的枚举，结果值实际是数字
   - 不同枚举类型之间是不兼容的



### Any

1. 编程阶段不确定类型，需要动态指定类型
2. 表示方法：`let notSure: any = 4;`

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
3. 默认情况下，null与undefined是任何类型的子类型，即可以赋值给任意类型
4. 当你指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自 

### Never

1. `never`类型表示的是那些永不存在的值的类型，常用于如下几种情况

2. 那些总是会抛出异常

   ```typescript
   // 返回never的函数必须存在无法达到的终点
   function error(message: string): never {
       throw new Error(message);
   }
   ```

3. 根本就不会有返回值的函数表达式

   ```typescript
   // 返回never的函数必须存在无法达到的终点
   function infiniteLoop(): never {
       while (true) {
       }
   }
   ```

### Object

1. 使用`object`类型，就可以更好的表示像`Object.create`这样的AP

2. 例如

   ```typescript
   declare function create(o: object | null): void;
   create({ prop: 0 }); // OK
   create(null); // OK
   ```

   

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



## 接口

### 概述

1. 假设我们书写一个函数

   ```typescript
   function printLabel(labelledObj: { label: string }) {
     console.log(labelledObj.label);
   }
   ```

   - 假设要求传入参数，需要满足有个label为字符串的属性
   - 假设多个输入参数都是一样的，且需要些相当多，这样书写会非常麻烦

2. 利用接口形式

   ```typescript
   interface LabelledValue {
     label: string;
   }
   function printLabel(labelledObj: LabelledValue) {
     console.log(labelledObj.label);
   }
   ```

3. 描述JavaScript中对象拥有的各种各样的外形



### 可选属性

1. 使用 `?`的形式

   ```typescript
   interface SquareConfig {
     color?: string;
     width?: number;
   }
   ```

2. 好处

   - 可以对可能存在的属性进行预定义
   - 可以捕获引用了不存在的属性时的错误

### 只读属性

1. 使用`readonly`关键字

   ```typescript
   interface Point {
       readonly x: number;
       readonly y: number;
   }
   ```

2. 赋值后，则值则不能被改变

   ```typescript
   let p1: Point = { x: 10, y: 20 };
   p1.x = 5; // error!
   ```

3. `vs const`

   - 做为变量使用的话用 `const`，
   - 做为属性则使用`readonly`。

### 额外的属性检查

1. 通常情况下，是不允许传入非接口定义的属性的，如

   ```typescript
   interface LabelledValue {
       label?: string;
   }
   function printLabel(labelledObj: LabelledValue) {
       console.log(labelledObj.label);
   }
   printLabel({ name : '123'})// error: xxx
   ```

   - 并不推荐用以下方法绕过这个检查，如果需要传入name，应该再接口中写明

2. 添加一个字符串索引签名

   ```typescript
   interface SquareConfig {
       name?: string;
       width?: number;
       [propName: string]: any;
   }
   ```

   - 表示的是`SquareConfig`可以有任意数量的属性

3. 使用断言的方式

   ```typescript
   printLabel({ name : '123'} as LabelledValue)
   ```

4. 利用重新赋值的方式

   ```typescript
   const name = { name: '123'};
   printLabel(name);
   ```

   

### 函数类型

1. 描述一个函数的数值与返回值

   ```typescript
   interface SearchFunc {
     (source: string, subString: string): boolean;
   }
   ```

2. 使用方式

   ```typescript
   let mySearch: SearchFunc;
   mySearch = function(source: string, subString: string) {
     let result = source.search(subString);
     return result > -1;
   }
   ```

3. 注意

   - 定义函数时的参数，可以与接口中定义的参数名不同

   - 可以不定义接口的返回值类型，ts会默认自动推断

     ```typescript
     interface SearchFunc {
         (source: string, subString: string);
     }
     ```

### 可索引类型

1. 注意：

   - 支持两种索引签名：字符串和数字
   - 数字索引的返回值必须是字符串索引返回值类型的子类型

2. 数字索引

   ```typescript
   interface StringArray {
     [index: number]: string;
   }
   ```

   - 表示了当用 `number`去索引`StringArray`时会得到`string`类型的返回值

3. 字符串索引

   ```typescript
   interface StringArray {
       [index: string]: number;
       name: string; // error
   }
   ```

   - 含义是，使用字符串去索引StringArray，获得是number类型，这与`stringArray.name`是string不符合

4. 只读索引

   ```typescript
   interface ReadonlyStringArray {
       readonly [index: number]: string;
   }
   let myArray: ReadonlyStringArray = ["Alice", "Bob"];
   myArray[2] = "Mallory"; // error!
   ```

   - 防止给索引赋值

### 类类型

1. 类似于java，实现某个接口

   ```typescript
   interface ClockInterface {
       currentTime: Date;
       setTime(d: Date);
   }
   class Clock implements ClockInterface {
       currentTime: Date;
       setTime(d: Date) {
           this.currentTime = d;
       }
       constructor(h: number, m: number) { }
   }
   ```

   - 含义是：接口定义的方法与变量，实现时也需要有
   - 不会检查类是否具有某些私有成员。

2. 注意：类静态部分与实例部分的区别

   - 当一个类实现了一个接口时，只对其实例部分进行类型检查
   -  constructor存在于类的静态部分，所以不在检查的范围内

### 接口继承

1. 基本使用

   ```typescript
   interface Shape {
       color: string;
   }
   
   interface Square extends Shape {
       sideLength: number;
   }
   
   let square = <Square>{};
   square.color = "blue";
   square.sideLength = 10;
   ```

2. 一个接口可以同时继承多个

   ```typescript
   interface Square extends Shape, PenStroke {
       sideLength: number;
   }
   ```

### 接口继承类

1. 当接口继承了一个类类型时，它会继承类的成员但不包括其实现，会继承到类的private和protected成员
2. 接口的实现，只是会实现方法，不会继承属性

### 泛型兼容性

1. 兼容性判断的基本原则是：如果`x`要兼容`y`，那么`y`至少具有与`x`相同的属性，或者说x满足y的条件

2. 例如

   ```typescript
   interface Empty<T> {
   }
   let x: Empty<number>;
   let y: Empty<string>;
   x = y;  // OK, because y matches structure of x
   ```

   - 它们的结构使用类型参数时并没有什么不同

3. 但是，如果Empty是这样的

   ```typescript
   interface NotEmpty<T> {
       data: T;
   }
   ```

   - 这也很好理解，x的data是number类型，y的data是string类型，故无法进行赋值



## 类

### 基础功能与ES6相同

### 修饰符

#### public

1. 默认是public

#### private

1. 当成员被标记成 `private`时，它就不能在声明它的类的外部访问

   ```typescript
   class Animal {
       private name: string;
       constructor(theName: string) { this.name = theName; }
   }
   
   new Animal("Cat").name; // 错误: 'name' 是私有的.
   ```

2. 如果其中一个类型里包含一个 `private`成员，那么只有当另外一个类型中也存在这样一个 `private`成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的

3. 对于两个类，都具有name属性，是不能相互赋值的，因为这类型并不兼容；但继承类会被认为是兼容的

   ```typescript
   class Animal {
       private name: string;
   }
   class Dog extends Animal {
   }
   class Employee {
       private name: string;
   }
   let animal = new Animal();
   let employee = new Employee();
   let dog = new Dog();
   animal = dog;
   animal = employee; // 错误: Animal 与 Employee 不兼容.
   ```

#### protected

1.  `protected`成员在派生类中仍然可以访问
2.  `protected`如果加在构造函数前，则表示当前类不能被实例化

#### readonly修饰符

1. 只读属性必须在声明时或构造函数里被初始化

#### 参数属性

1. 通常的变量声明模式为：

   ```typescript
   class Animal {
       private name: string;
       constructor(props) {
   
       }
   }
   ```

2. 利用参数属性，直接改写为

   ```typescript
   class Animal {
       constructor(private name: string) {
       }
   }
   ```

### getter/setter

1. 可以为类设置getter与setter

   ```typescript
   class Employee {
       get fullName(): string {
       }
       set fullName(newName: string) {
       }
   }
   ```

2. 只带有 `get`不带有 `set`的存取器自动被推断为 `readonly`

### 静态属性

```typescript
class Employee {
    static name1: string = '123';
    static hello(name: string): string {
        return name;
    }
}
```



### 抽象类

1. 不能直接被实例化

2. 可以包含某个成员的实现，接口不可以

3. 使用abstract修饰的方法必须在派生类中实现

   ```typescript
   abstract class Department {
       constructor(public name: string) {
       }
       printName(): void {
           console.log('Department name: ' + this.name);
       }
       abstract printMeeting(): void; // 必须在派生类中实现
   }
   ```


### 类兼容性

1.  ts是基于结构类型的，而不是名义类型的语言（java）,因此下面代码是可以的

   ```typescript
   interface Named {
       name: string;
   }
   
   class Person {
       name: string;
   }
   
   let p: Named;
   // OK, because of structural typing
   p = new Person();
   ```

   - 不像java，即使Person没有实现Named接口，也是可以进行赋值的

2. 比较两个类类型的对象时，只有实例的成员会被比较。 静态成员和构造函数不在比较的范围内

   ```typescript
   class Animal {
       feet: number;
       constructor(name: string, numFeet: number) { }
   }
   
   class Size {
       feet: number;
       constructor(numFeet: number) { }
   }
   
   let a: Animal;
   let s: Size;
   
   a = s;  // OK
   s = a;  // OK
   ```

3. 当检查类实例的兼容时，如果目标类型包含一个私有成员，那么源类型必须包含来自同一个类的这个私有成员

## 函数

### 函数类型

1. 为函数增加类型

   ```typescript
   function add(x: number, y: number): number {
       return x + y;
   }
   ```

2. 完整的函数类型

   ```typescript
   let myAdd: (baseValue: number, increment: number) => number =
       function(x: number, y: number): number { return x + y; };
   ```

   - 定义一个myAdd，参数是：baseValue与increment，返回值是number类型

3. 但实际并不需要这么写，如下方式并不会报错，由于编译器会自动识别出类型

   ```typescript
   let myAdd = function(x: number, y: number): number { return x + y; };
   ```

### 可选参数与默认参数

1. 基础事例

   ```typescript
   function buildName(firstName: string, lastName: string) {
       return firstName + " " + lastName;
   }
   ```

   - 必须传入2个参数，多了或少了多会报错

2. 可选参数

   ```typescript
   function buildName(firstName: string, lastName?: string) {
       return firstName + " " + lastName;
   }
   ```

   - 不能多于两个参数，但可以是1个参数
   - 可选参数必须跟在必须参数后面

3. 默认参数

   ```typescript
   function buildName(firstName: string, lastName = 'rextao') {
       return firstName + " " + lastName;
   }
   ```

   - 提供默认值的参数，也可以省略
   - 默认值参数不用在最后，如在前面，不传需要传undefined，否则会报错

### 剩余参数

1. 用于表示多个参数
2. 剩余参数需要是一个数组类型

### this

### this参数

1. this指向会引起问题，可以使用箭头函数避免，还可以指明this的类型

   ```typescript
   let deck: Deck = {
       suits: ["hearts", "spades", "clubs", "diamonds"],
       createCardPicker: function() {
           return function (this: Deck){
               return {suit: this.suits};
           }
       }
   }
   ```

   - 由于实际this并不指向Deck，但设置了`this: Deck`，ts编译器会报错

2. 通过 this参数约束回调函数

   ```typescript
   interface UIElement {
       addClickListener(onclick: (this: void, e: Event) => void): void;
   }
   class Handler {
       info: string;
       onClickGood(this: void, e: Event) {
           // can't use this here because it's of type void!
           console.log('clicked!');
       }
   }
   let h = new Handler();
   uiElement.addClickListener(h.onClickGood);
   ```

   - 如果想用this，需要使用箭头函数

### 重载

1. Js函数根据传入不同的参数而返回不同类型的数据是很常见的

2. 用ts控制输入与返回的类型

   ```typescript
   function pickCard(x: {suit: string; card: number; }[]): number;
   function pickCard(x: number): {suit: string; card: number; };
   function pickCard(x): any {
       if (typeof x == "object") {
           return 1;
       }
       else if (typeof x == "number") {
           return { suit:1, card: 2 };
       }
   }
   ```

   - 注意：`function pickCard(x): any`并不是重载列表的一部分
   - 因此只能传入一个数组和数值，返回值是number或对象

### 函数兼容性

1. 参数列表不同时

   ```typescript
   let x = (a: number) => 0;
   let y = (b: number, s: string) => 0;
   
   y = x; // OK
   x = y; // Error
   ```

   - y = x 相当于少传入参数

2. 返回值不同时

   ```typescript
   let x = () => ({name: 'Alice'});
   let y = () => ({name: 'Alice', location: 'Seattle'});
   
   x = y; // OK
   y = x; // Error, because x() lacks a location property
   ```

   - 返回值类型必须是目标函数返回值类型的子类型

## 泛型

1. 可以使用`泛型`来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件

### 基础

1. 对于如下代码，使用any是可以传入不同参数，但是缺少了传入的类型与返回的类型应该是相同的

   ```typescript
   function identity(arg: any): any {
       return arg;
   }
   ```

2. 使用泛型解决这个问题

   ```typescript
   function identity<T>(arg: T): T {
       return arg;
   }
   ```

   - 这个版本的`identity`函数叫做泛型，因为它可以适用于多个类型

3. 调用方式1：传入所有的参数，包含类型参数（一般用于编译器无法识别的复杂情况）

   ```typescript
   let output = identity<string>("myString");  // type of output will be 'string'
   ```

4. 调用方式2：类型推断

   ```typescript
   let output = identity("myString");  // type of output will be 'string'
   ```

   - 编译器会通过传入参数，推断出返回值的类型

5. 注意：

   - 在函数体内要谨慎使用T，如上面函数调用`T.length`会报错，因为可能传入number类型

   - 可以用元素类型为数组的方式保证调用length无错

     ```typescript
     function loggingIdentity<T>(arg: T[]): T[] {
         console.log(arg.length);  // Array has a .length, so no more error
         return arg;
     }
     ```

### 泛型接口

1. 可以利用接口定义一个泛型

   ```typescript
   interface GenericIdentityFn {
       <T>(arg: T): T;
   }
   
   function identity<T>(arg: T): T {
       return arg;
   }
   let myIdentity: GenericIdentityFn = identity;
   ```

2. 通过接口指定泛型类型

   ```typescript
   interface GenericIdentityFn<T> {
       (arg: T): T;
   }
   
   function identity<T>(arg: T): T {
       return arg;
   }
   
   let myIdentity: GenericIdentityFn<number> = identity;
   ```

   - 特别注意，GenericIdentityFn内定义的函数是没有使用泛型的

### 类

1. 使用方式

   ```typescript
   class GenericNumber<T> {
       zeroValue: T;
       add: (x: T, y: T) => T;
   }
   ```

2. 类的静态属性不能使用这个泛型类型。

### 泛型约束

1. 最上面的例子，利用泛型，我们想访问.length，会有与编译器无法验证所有类型都有length属性而报错

2. 为此，我们定义一个接口来描述约束条件

   ```typescript
   interface Lengthwise {
       length: number;
   }
   
   function loggingIdentity<T extends Lengthwise>(arg: T): T {
       console.log(arg.length);  // Now we know it has a .length property, so no more error
       return arg;
   }
   ```

#### 使用类型参数

1. 约束取值只能在obj中

   ```typescript
   function getProperty<T, K extends keyof T>(obj: T, key: K) {
       return obj[key];
   }
   let x = { a: 1, b: 2, c: 3, d: 4 };
   getProperty(x, "a"); // okay
   getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'
   ```




## 高级类型

### 交叉类型

1. 使用`&`，如 `Person & Serializable & Loggable`表示：这个类型的对象同时拥有了这三种类型的成员

### 联合类型

1. 使用`|`，如`number | string | boolean`表示一个值可以是 `number`， `string`，或 `boolean`

2. 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员

   ```typescript
   interface Bird {
       fly();
       layEggs();
   }
   interface Fish {
       swim();
       layEggs();
   }
   function getSmallPet(): Fish | Bird {
       // ...
   }
   let pet = getSmallPet();
   pet.layEggs(); // okay
   pet.swim();    // errors
   ```

   

### 类型保护区分类型

#### 用户自定义的类型保护

1. 使用联合类型面临的问题是，如何在代码中区分Bird并调用fly函数

2. 首先的解决办法是使用断言

   ```typescript
   let pet = getSmallPet();
   // 不使用断言，会报错
   if ((<Fish>pet).swim) {
       (<Fish>pet).swim();
   }
   else {
       (<Bird>pet).fly();
   }
   ```

3. 断言的方式不得不多次使用，可以改用ts的类型保护机制

   - 类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型

   - 主要是定义一个这样的函数

     ```typescript
     function isFish(pet: Fish | Bird): pet is Fish {
         return (<Fish>pet).swim !== undefined;
     }
     ```

     - `pet is Fish`就是类型谓词。 
     - 谓词为 `parameterName is Type`这种形式， `parameterName`必须是来自于当前函数签名里的一个参数名。

   - 利用类型保护可以改写为

     ```typescript
     // 'swim' 和 'fly' 调用都没有问题了
     if (isFish(pet)) {
         pet.swim();
     }
     else {
         pet.fly();
     }
     ```

     - ts知道if一定是fish类型，else一定是pet类型

#### typeof类型保护

1. 但使用类型保护的机制，如果处理基础类型，也是非常麻烦的，可以直接使用typeof作为类型保护

   ```typescript
   function padLeft(value: string, padding: string | number) {
       if (typeof padding === "number") {
           return Array(padding + 1).join(" ") + value;
       }
       if (typeof padding === "string") {
           return padding + value;
       }
       throw new Error(`Expected string or number, got '${padding}'.`);
   }
   ```

2.  `typeof`类型保护只有两种形式能被识别： `typeof v === "typename"`和 `typeof v !== "typename"``

3. `"typename"`必须是 `"number"`， `"string"`， `"boolean"`或 `"symbol"` 

4. typof与其他字符串比较，ts不会识别为类型保护。

#### instanceof 类型保护

1. 主要是判断是哪个实例

   ```typescript
   function getRandomPadder() {
       return Math.random() < 0.5 ?
           new SpaceRepeatingPadder(4) :
           new StringPadder("  ");
   }
   
   // 类型为SpaceRepeatingPadder | StringPadder
   let padder: Padder = getRandomPadder();
   if (padder instanceof SpaceRepeatingPadder) {
       padder; // 类型细化为'SpaceRepeatingPadder'
   }
   if (padder instanceof StringPadder) {
       padder; // 类型细化为'StringPadder'
   }
   ```



### 可以为null类型

1. ts中类型检查器认为 `null`与 `undefined`可以赋值给任何类型
2. 意味着，你阻止不了将它们赋值给其它类型
3. `--strictNullChecks`标记可以解决此错误：当你声明一个变量时，它不会自动地包含 `null`或 `undefined`
   - 同时可选参数会变为`| undefined`，即可选参数不能传null参数
   - 同样，可选属性会有相同处理

#### 类型保护

1. 与js相同，直接使用`st == null`判断

2. 设置个默认值：`st || '123'`

3. 对于某些复杂情况，编译器不能够去除 `null`或 `undefined`，利用`!`手动去除 `null`和 `undefined`

   ```typescript
   function fixed(name: string | null): string {
     function postfix(epithet: string) {
       return name!.charAt(0) + '.  the ' + epithet; 
     }
     return postfix("great");
   }
   ```

### 类型别名

1. 类型别名会给一个类型起个新名字

   ```typescript
   type Name = string;
   ```

   - Name就可以代表string
   - 与接口较为类似

2. 与接口的区别

   - 类型别名并不创建新名字，错误信息不会使用别名
   - 编译器，鼠标悬停在变量上，显示的可能也不是别名
   - 别名不能被extends和implements
   - 一般是无法用接口描述并且需要使用一个元组或联合类型时，使用类型别名

#### 字符串字面量类型

1. 允许你指定字符串必须的固定值

   ```typescript
   type Easing = "ease-in" | "ease-out" | "ease-in-out";
   class UIElement {
       animate(dx: number, dy: number, easing: Easing) {
       }
   }
   let button = new UIElement();
   button.animate(0, 0, "ease-in");
   button.animate(0, 0, "uneasy"); // error: "uneasy" is not allowed here
   ```

2. 用于区别重载

   ```typescript
   function createElement(tagName: "img"): HTMLImageElement;
   function createElement(tagName: string): Element {
       // ... code goes here ...
   }
   ```

#### 可辨识联合

1. 类似如下的模式，我们有两个接口

   ```typescript
   interface Square {
       kind: "square";
       size: number;
   }
   interface Rectangle {
       kind: "rectangle";
       width: number;
       height: number;
   }
   ```

2. 利用类型别名，创建一个新的类型

   ```typescript
   type Shape = Square | Rectangle;
   ```

3. 现在使用可识别联合了

   ```typescript
   function area(s: Shape) {
       switch (s.kind) {
           case "square": return s.size * s.size;
           case "rectangle": return s.height * s.width;
       }
   }
   ```

##### 完整性检查

1. 主要是想，如果没有涵盖所有可辨识联合的变化时，想让编译器可以通知我们

   ```typescript
   type Shape = Square | Rectangle | Circle | Triangle;
   function area(s: Shape) {
       switch (s.kind) {
           case "square": return s.size * s.size;
           case "rectangle": return s.height * s.width;
           case "circle": return Math.PI * s.radius ** 2;
       }
       // should error here - we didn't handle case "triangle"
   }
   ```

2. 启用 `--strictNullChecks`并且指定一个返回值类型

   ```typescript
   function area(s: Shape): number { // error: returns number | undefined
   }
   ```

   - 如存在未涵盖的类型，会返回undefined，与要求的返回类型不同

3. 使用 `never`类型

   ```typescript
   function assertNever(x: never): never {
       throw new Error("Unexpected object: " + x);
   }
   function area(s: Shape) {
       switch (s.kind) {
           case "square": return s.size * s.size;
           case "rectangle": return s.height * s.width;
           case "circle": return Math.PI * s.radius ** 2;
           default: return assertNever(s); // error here if there are missing cases
       }
   }
   ```

   - 如遗漏了某个类型，传入assertNever的s参数是具体类型，则会报错



## 模块

### 概述

1. 默认语法与es一致

### 兼容CommonJS和AMD（注意与node的不同）

1. 需要使用`export =`语法，然后必须使用语法`import module = require("module")`导入模块

   ```typescript
   // ZipCodeValidator.ts
   let numberRegexp = /^[0-9]+$/;
   class ZipCodeValidator {
       isAcceptable(s: string) {
           return s.length === 5 && numberRegexp.test(s);
       }
   }
   export = ZipCodeValidator;
   // main.ts
   import zip = require("./ZipCodeValidator");
   ```

### 使用其他js库

1. 需要声明类库所暴露出的API，通常是在 `.d.ts`文件里定义

   ```typescript
   // declarations.d.ts
   declare module "url" {
       export interface Url {
           protocol?: string;
           hostname?: string;
           pathname?: string;
       }
   
       export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
   }
   
   /// <reference path="node.d.ts"/>
   import * as URL from "url";
   let myUrl = URL.parse("http://www.typescriptlang.org");
   ```

   - 三斜线是指令，之后介绍

2. 如果声明接口比较繁琐，可以

   ```typescript
   // declarations.d.ts
   declare module "hot-new-module";
   
   import x, {y} from "hot-new-module";
   x(y);
   ```

   - 简写模块里所有导出的类型将是`any`

#### 模块声明通配符

1. 利用前缀或后缀导入一些非js文件

   ```typescript
   declare module "*!text" {
       const content: string;
       export default content;
   }
   // Some do it the other way around.
   declare module "json!*" {
       const value: any;
       export default value;
   }
   import fileContent from "./xyz.txt!text";
   import data from "json!http://example.com/data.json";
   ```

### 模块解析

#### 相对与非相对导入

1. 相对导入是：以`/`，`./`或`../`开头的
2. 所有其他形式导入被称为非相对导入

#### 解析策略

1. 共有两种可用的模块解析策略：Node和Classic
2. 你可以使用 `--moduleResolution`标记来指定使用哪种模块解析策略。
3. 若未指定，那么在使用了 `--module AMD | System | ES2015`时的默认值为Classic，其它情况时则为Node

##### Classic

1. 相对导入只会查找moduleB.ts与moduleB.d.ts
2. 而对于非相对导入，会从包含导入文件的目录开始依次向上级目录遍历

##### Node

1. 使用node的解析策略
   - 先查找`moduleB.js`文件
   - 查看package.json文件（存在main的指定文件）
   - 查看index.js
   - 向上层查找
2. Ts在 `package.json`里使用字段`"types"`来表示类似`"main"`的意义 - 编译器会使用它来找到要使用的"main"定义文件

#### 附加的模块解析标记

1. TypeScript编译器有一些额外的标记用来通知编译器在源码编译成最终输出的过程中都发生了哪个转换
2. 有一点要特别注意的是编译器不会进行这些转换操作； 它只是利用这些信息来指导模块的导入。

##### base url

1. 设置`baseUrl`来告诉编译器到哪里去查找模块。 
2. 所有非相对模块导入都会被当做相对于 `baseUrl`,相对模块不会受影响

##### 路径依赖

1. 有时模块不放在baseUrl下，而是在node_modules，如jquery，可以通过path来进行映射

   ```json
   {
     "compilerOptions": {
       "baseUrl": ".", // This must be specified if "paths" is.
       "paths": {
         "jquery": ["node_modules/jquery/dist/jquery"] // 此处映射是相对于"baseUrl"
       }
     }
   }
   ```

   - path也是相对于baseUrl进行解析的
   -  如果上例中设置了 `"baseUrl": "./src"`，那么jquery应该映射到`"../node_modules/jquery/dist/jquery"`

2. 指定多个回退位置

   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "*": [
           "*",
           "generated/*"
         ]
       }
     }
   }
   ```

   - `"*"`： 表示名字不发生改变，所以映射为`` => `/`
   - `"generated/*"`表示模块名添加了“generated”前缀，所以映射为`` => `/generated/`
   - 因此，文件使用`import a from 'a/b'`，会先查找baseUrl/a/b文件是否存在，否则baseUrl/generated/a/b

#### rootDirs

1. rootDirs指定的列表，内容会在运行时合并，如一个工程结构

   ```
    src
    └── views
        └── view1.ts (imports './template1')
        └── view2.ts
   
    generated
    └── templates
            └── views
                └── template1.ts (imports './view2')
   ```

2. 指定了rootDirs

   ```json
   {
     "compilerOptions": {
       "rootDirs": [
         "src/views",
         "generated/templates/views"
       ]
     }
   }
   ```

   - 相对路径'./template1'，可以找到`generated/templates/views`文件夹下的template1.ts

#### 跟踪模块解析

1. 提供一种查看模块为什么没有被解析，或解析错误的位置的方法
2. 使用`tsc --traceResolution`会打印模块解析过程发生了什么

## 命名空间

1. 提供一种归类接口与实现的方法

   ```typescript
   namespace Validation {
       export interface StringValidator {
           isAcceptable(s: string): boolean;
       }
       const lettersRegexp = /^[A-Za-z]+$/;
       export class LettersOnlyValidator implements StringValidator {
           isAcceptable(s: string) {
               return lettersRegexp.test(s);
           }
       }
   }
   let validate: { [s: string]: Validation.StringValidator} = {}
   validate['a'] = new Validation.LettersOnlyValidator();
   ```

### 别名

1. 简化命名空间的操作：使用`import q = x.y.z`语法，注意与模块的 `import x = require('name')`区别开

   ```typescript
   import StringValidator = Validation.LettersOnlyValidator;
   let validate: { [s: string]: StringValidator} = {};
   validate['a'] = new StringValidator();
   ```

   

### 分离到多个文件

1. 相同的命名空间，可以写在不同的文件中，通过三斜杠指令建立联系

   ```typescript
   namespace Validation {
       export interface StringValidator {
           isAcceptable(s: string): boolean;
       }
   }
   /// <reference path="Validation.ts" />
   namespace Validation {
       const lettersRegexp = /^[A-Za-z]+$/;
       export class LettersOnlyValidator implements StringValidator {
           isAcceptable(s: string) {
               return lettersRegexp.test(s);
           }
       }
   }
   ```

2. 涉及多个文件时，需要确保所有编译后的代码都被加载了

   - 把所有的输入文件编译为一个输出文件
   - 编译每个文件，每个ts对应一个js，但在html中引入时要注意顺序

### 使用其它的JavaScript库

1. 由于大部分程序库只提供少数的顶级对象，命名空间是用来表示它们的一个好办法。

2. js库可以直接声明为一个命名空间，例如d3

   ```typescript
   declare namespace D3 {
       export interface Selectors {
           select: {
               (selector: string): Selection;
               (element: EventTarget): Selection;
           };
       }
   }
   declare var d3: D3.Base;
   ```

### 与模块的区别

1. 命名空间就像其它的全局命名空间污染一样，它很难去识别组件之间的依赖关系，尤其是在大型的应用中
2. 不应该对模块使用命名空间