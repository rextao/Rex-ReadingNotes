# 实例

## 创建一个 Vue 实例

1. 每个应用都是通过vue函数创建的实例

   ```javascript
   var vm = new Vue({
     // 选项
   })
   ```

2. 用vue-cli创建的项目，vue实例在main.js中

## 数据与方法

1. vue创建时，会将data对象的全部属性增加到vue的响应系统中

2. 因此，通过`vm.a = 'hi'`这种方式添加的属性并不是响应式的

3. 利用`Object.freeze()`可以阻止修改对象属性，故也无法被vue响应系统追踪，即

   ```javascript
   var obj = {
     foo: 'bar'
   }
   Object.freeze(obj)
   new Vue({
     el: '#app',
     data: obj//无法追踪
   })
   ```

4. vue实例属性和方法都以$为前缀，为了和用户定义的区分开



# 生命周期



# 模板语法

1. 设计初衷是用于简单运算的

## 插值

### 文本

1. ：`<span>Message: {{ msg }}</span>`

### 原始html

1. `<span v-html="rawHtml"></span>`
2. 会在span标签内嵌入rawHtml的内容
3. 容易受到xss攻击，绝不要对用户提供的内容使用插值

### 特性

1. 需要使用v-bind
2. `<div v-bind:id="dynamicId"></div>`
3. 注意：对于boolean的特殊处理
4. `<button v-bind:disabled="isButtonDisabled">Button</button>`
   - 只要`isButtonDisabled`有值，则认为是true，如`v-bind:disabled = 'false'`也会认为是true
   - 只有值为null、undefined、false时（注意不是字符串），disabled属性才不会被渲染在页面上

### 表达式

1. 模板支持js表达式
2. 不应该试图在模板表达式中访问用户定义的全局变量，但可以访问如Math，Date等



# 指令

## 概述

1. 带有v的特殊属性，除了v-for，预期值是一个js表达式
2. 职责是，当表达式值改变后，连带的影响DOM

## 参数

#### 概述

1. 某些指令可以接受一个参数，用冒号表示，如`v-bind:href`
2. 表示将href属性与后面的表达式进行绑定，根据后面表达式值响应式的更新href属性

#### 动态参数(2.6新增)

1. `<a v-bind:[attributeName]="url"> ... </a>`
2. 即`atttributeName`会作为表达式动态求值，求值的结果会作为最终参数来使用
3. 动态参数的约束：某些字符，如空格或引号是无效的，还需要回避大写的键名
4. 复杂的动态参数可以使用计算属性来代替

## 修饰符

1. 用`.`后缀，用于指出一个指令应该以特殊方式绑定，可以串联使用



## v-bind

### 缩写

`v-bind:href`缩写为`:href`

## v-once

1. 节点只渲染一次
2. 随后的重新渲染，元素/组件及其所有子节点都视为静态资源跳过

## v-if

1. 条件性的渲染一块，如表达式返回truthy值（并不只有true）时被渲染
2. `<h1 v-if="awesome">Vue is awesome!</h1>`
3. 支持template
4. v-if是一个指令，故只能用在一个元素上，如想切换多个元素，可以使用template
	- 此元素当做一个不可见的包裹元素，最终也不会被渲染
	- 在多个元素外增加一个空div或者p并不合适
5. `v-else`
	- 必须紧跟v-if或v-else-if，否则不被识别
6. `v-else-if(2.1+)`
	- v-else-if 也必须紧跟在带 v-if 或者 v-else-if 的元素之后。

## v-show

1. 根据条件是否显示，相当于改变css的display
2. **不支持template**

### 与 v-if不同

1. v-if是真正的条件渲染，惰性的，如开始条件为假，是不进行渲染的，html并没有这个元素，每次切换都会销毁和重建
2. 但v-show，无论是真是假，都会被渲染，只是开始条件为假，是隐藏的

## v-for

### 概述

1. `v-for` 指令需要使用 `item in items` 或 `(item, index) in items` 形式的特殊语法

2. 支持template

3. `items` 是数组，则 `item` 是被迭代的数组元素，index为数组序号

4. `items` 是对象，则 `item` 是对象value，index为key

	- 在遍历对象时，会按 `Object.keys()` 的结果遍历，
	- 不能保证它的结果在不同的 JavaScript 引擎下都一致。

5. 还可以使用`item of items`

6. v-for可以接受整数`<span v-for="n in 10">{{ n }}</span>`

	

### 不要与v-if一起使用

1. 由于v-for的优先级高于v-if，因此`<span v-for="user in users" v-if="user.isActive"></span>`会经过如下运算

	```javascript
	this.users.map(function (user) {
	  if (user.isActive) {
	    return user.name
	  }
	})
	```

	- 因此，即使只需要渲染很小的一部分元素，也需要每次重渲染时候遍历整个ursers列表

2. 可以使用计算属性+filter进行过滤列表



## v-on(事件)

### 缩写

`v-on:click`缩写为`@click`

### 监听事件

`<button v-on:click="counter += 1">Add 1</button>`

### 事件处理方法

1. `<button v-on:click="greet">Greet</button>`

	```javascript
	methods: {
	    greet: function (event) {
	        // `event` 是原生 DOM 事件            
	    }
	}
	```

	- 默认会传传入event对象

2. `<button v-on:click="say('what',$event)">Say what</button>`

	```javascript
	methods: {
	  warn: function (message, event) {
	    // 现在我们可以访问原生事件对象
	    if (event) event.preventDefault()
	    alert(message)
	  }
	}
	```

	- 对于传入参数后，还想获取event对象，需要在html中使用特殊变量$event

### 修饰符

#### 事件修饰符

1. `.stop`：阻止单击事件继续传播(stopPropagation)
2. `.prevent`：阻止默认行为（preventDefault） 
3. `.capture`
	- 添加事件监听器时使用事件捕获模式
	- 元素自身触发的事件先在此处理，然后才交由内部元素进行处理
4. `.self`
	- 只当在 event.target 是当前元素自身时触发处理函数
	- 事件不是从内部元素触发的
5. `.once`(2.1.4+)
	- 2.1.4+,点击事件将只会触发一次 
	- 可以用到自定义组件事件上
6. `.passive`(2.3+)
	-  尤其能够提升移动端的性能。

#### 按键修饰符

1. 可以使用有效键名，如`<input v-on:keyup.page-down="onPageDown">`

#### 系统修饰符（2.1+）

1. `.ctrl`
2. `.alt`
3. `.shift`
4. `.meta`
5. `.exact`(2.5+)
	- 有且仅有ctrl按下时触发`<button @click.ctrl.exact="onCtrlClick">A</button>`
	- 没有任何系统修饰键时触发`<button @click.exact="onClick">A</button>`
6. 注意：只有在按住 `ctrl` 的情况下释放其它按键，才能触发 `keyup.ctrl`

#### 鼠标修饰符（2.2+）

1. `.left`
2. `.right`
3. `.middle`

## v-model





# 计算属性与监听器

## 计算属性

1. 模板放入太多逻辑会让模板难以维护，而且不方便多次引用，故使用计算属性



### vs方法

1. 计算属性是依赖于它们的**响应式依赖**进行缓存的，只有依赖改变后才会求值

2. 只要依赖不改变，多次访问计算属性会立即返回之前的计算结果，即不再执行函数

3. 注意：Data.now()每次取值是不同，但并不是响应式依赖，因此now并不是时时刻刻改变的

	```javascript
	computed: {
	    now: function () {
	        return Date.now()
	    }
	}
	```

### setter

1. 计算属性默认只有getter方法，即调用vm.now = 1；控制台会报错

2. 可以通过如下方式为计算属性添加setter

	```javascript
	computed: {
	    now: function () {
	        get:function(){
	            return Date.now();
	        }
	        set:function(value){
	            return value;
	        }
	    }
	}
	```

## 监听属性

1. 一种更通用的方式来观察和响应 Vue 实例上的数据变动的方式
2. 当需要数据变化时执行异步或开销较大的操作时，最有用

### vs计算属性

1. 使用 `watch` 选项允许我们执行异步操作 (访问一个 API)，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。
2. 这些都是计算属性无法做到的。

# class与style

1. v-bind用于class和style，vue做了专门增强，表达式结果类型除了字符串，还可以是对象或数组

## 绑定class

### 绑定单个值

`<div v-bind:class="{ active: isActive }"></div>`

### 与普通class共存

```html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
```

1. 如data为`data:{isActive:true,hasError:false}`，结果是`'static active'`

### 绑定对象

`<div v-bind:class="classObject"></div>`

```javascript
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

### 绑定数组

1. 绑定对象，key必须是固定的，不能是变量，如果需要key是可变的，可以使用数组形式

2. 如代码如下：

	```html
	<div v-bind:class="[activeClass, errorClass]"></div>
	<script>
	    data: {
	        activeClass: 'active',
	        errorClass: 'text-danger'
	    } 
	</script>
	```

	- 解析的结果是：`<div class="active text-danger"></div>`

### 数组中使用对象

`<div v-bind:class="[{ active: isActive }, errorClass]"></div>`

## 绑定style

### 绑定对象

1. 注意要使用驼峰式或用-分隔符

2. 如html为`<div v-bind:style="styleObj"></div>`

3. styleObj可以是如下两种形式

	```json
	// 方式1：驼峰式
	styleObj: {
	    height: '100px',
	    width: '100px',
	    backgroundColor: 'green'
	}
	// 方式2：-分隔符
	styleObj: {
	    height: '100px',
	    width: '100px',
	    'background-color': 'green'
	}
	```

### 数组语法

1. 与class类似，可以使用数组语法
2. `<div v-bind:style="[baseStyles, overridingStyles]"></div>`

### 自动增加前缀

1. vue会自动侦测添加一些css属性的相应前缀

### 多重值（2.3+）

1. 可以为style绑定多个值，如下，只会渲染数组最后一个被浏览器支持的值
2. `<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>`

# 列表渲染

## 数组更新检测

1. 对于非纯函数（更改原数组值，push，pop，reverse，sort，shift，unshift，splice），vue进行了包裹，使它们具有响应特性
2. 对于纯函数，如filter，concat，slice，会返回新的数组，vue并不会丢弃现有DOM重新渲染列表
3. 如下方式处理数组不具响应式
	- 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
	- 当你修改数组的长度时，例如：`vm.items.length = newLength`
4. 解决办法是
	- 第一类问题：使用全局方法`Vue.set(vm.items, indexOfItem, newValue)`或者实例方法`vm.$set(vm.items, indexOfItem, newValue)`
	- 第二类问题，可以调用splice方法

## 对象更新检测

1. vue不能检测对象属性的添加与删除，即响应数据必须在创建实例的data时赋值

2. 可以使用`Vue.set(object, propertyName, value)`或`vm.$set`解决上述问题

3. 为已有对象赋更多新属性，要这样返回一个新对象

	```javascript
	vm.userProfile = Object.assign({}, vm.userProfile, {
	  age: 27,
	  favoriteColor: 'Vue Green'
	})
	```

	

# 特殊特性

## key

1. 如不适用key，vue会尽可能高效的渲染元素，即复用已有元素
2. 使用key，会基于key重新排列元素顺序，并移除不存在的元素
3. 常见用例1：与v-for进行结合，更高效的渲染列表
	- 如在123的23中间插入4，如不使用key，则除了1外，其他需要重新渲染，虽然利用了页面元素，但需要渲染234这3个元素
	- 如使用key，发现123元素没有变化，只是在23中间插入一个4即可
4. 常见用例2：强制不复用元素
5. 常见用例3：完整的触发组件生命周期函数
	- 由于使用key，新增加的元素会被创建，删除的元素会被销毁
6. 常见用例4：触发过渡动画

# 问题

1. 列表渲染时，vue说使用了机智的手段，在某些数组方法返回新数组时，更高效的复用dom，如果做到的
2. 修饰符.passive的含义，为何能提升移动端性能