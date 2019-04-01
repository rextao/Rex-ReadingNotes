# 内置类型

1. JS 中分为七种内置类型，七种内置类型又分为两大类型：基本类型和对象（Object）。
2. 基本类型有六种： `null`，`undefined`，`boolean`，`number`，`string`，`symbol`。
3. 其中 JS 的数字类型是浮点类型的，没有整型。
4. `NaN` 也属于 `number` 类型，并且 `NaN` 不等于自身。

# Typeof

1. `typeof` 对于基本类型，除了 `null` 都可以显示正确的类型
2. `typeof` 对于对象，除了函数都会显示 `object`
3. `null`会显示`object`
4. 通过 `Object.prototype.toString.call(xx)`正确获取，获得类似 `[object Type]` 的字符串。

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

