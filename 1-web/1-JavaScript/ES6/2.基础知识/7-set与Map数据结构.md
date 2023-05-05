# Set

## 基本用法

1. 它类似于数组，但是成员的值都是唯一的

2. Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

3. 向 Set 加入值的时候，不会发生类型转换，所以`5`和`"5"`是两个不同的值。它类似于精确相等运算符（`===`），主要的区别是`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。

4. 两个对象总是不相等的。

	```javascript
	let set = new Set();
	set.add({});
	set.size // 1
	set.add({});
	set.size // 2
	```

	- 由于两个空对象不相等，所以它们被视为两个值。

## 属性与方法

1. 属性
	- `Set.prototype.constructor`：构造函数，默认就是`Set`函数。
	- `Set.prototype.size`：返回`Set`实例的成员总数。
2. 方法
	- `add(value)`：添加某个值，返回 Set 结构本身。
	- `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
	- `has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
	- `clear()`：清除所有成员，没有返回值。

## WeakSet

1. WeakSet 的成员只能是对象，而不能是其他类型的值
2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用
3. 由于WeakSet对象会随时消失（取决于垃圾回收机制有没有运行）

# Map

## 概述

1. Map的键的范围不限于字符串，各种类型的值（包括对象）都可以当作键，普通对象key值只能是字符串
2. Object 结构提供了"字符串—值"的对应，Map 结构提供了"值—值"的对应，是一种更完善的 Hash 结构实现

## 构造函数

1. 需要传入具有Iterator接口的的数据结构，故传入普通对象会报错TypeError:object is not iterable

2. 如传入数组，则实际上执行的是下面的算法

   ```javascript
   const items = [
     ['name', '张三'],
     ['title', 'Author']
   ];
   const map = new Map();
   items.forEach(
     ([key, value]) => map.set(key, value)
   );
   ```

3. 如传入Set或Map对象，都会生成新对象

## 属性与方法

### get(key)

1. `get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined`。

### set(key ,val):

1. `set`方法设置键名`key`对应的键值为`value`，然后返回整个 Map 结构，由于返回的是map，故可以进行链式调用

2. 对同一个键重复赋值，后面的值会覆盖前面的

3. Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键，故只有对同一个对象的引用，Map 结构才将其视为同一个键

4. 同样的值的两个实例，在 Map 结构中被视为两个键

   ```javascript
   const map = new Map();
   const k1 = ['a'];
   const k2 = ['a'];
   map
   .set(k1, 111)
   .set(k2, 222);
   map.get(k1) // 111
   map.get(k2) // 222
   ```

5. 如Map的键是简单类型的值，则必须严格相等，即0与-0是不同的键

### size属性

1. `size`属性返回 Map 结构的成员总数。

### has(key)

1. 表示某个键是否在当前 Map 对象之中

### delete(key)

1. 删除某个键，返回`true`。如果删除失败，返回`false`

### clear()

1. 清除所有成员

## WeakMap

1. 只接受对象（除了null）作为key，不接收其他类型
2. `WeakMap`的键名所指向的对象，不计入垃圾回收机制
3. 主要作用是：防止内存泄露

### 典型用途

1. 如想在DOM元素添加某些数据，通常是

	```javascript
	const e1 = document.getElementById('foo');
	const e2 = document.getElementById('bar');
	const arr = [
	  [e1, 'foo 元素'],
	  [e2, 'bar 元素'],
	];
	```

	- 但如不需要arr这个对象时，必须手动删除`arr[0]=null;arr[1]=0`，解除arr对e1，e2引用
	- 否则垃圾回收器就不会释放`e1`和`e2`占用的内存

2. 使用WeakMap解决了这个问题

	```javascript
	const wm = new WeakMap();
	const element = document.getElementById('example');
	wm.set(element, 'some information');
	wm.get(element) // "some information"
	```

	- 这样wm对象中的element是弱引用
	- 当wm不需要时，会自动清除element

	### 