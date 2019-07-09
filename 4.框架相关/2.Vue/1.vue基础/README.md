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

1. `v-bind:href`缩写为`:href`
2. 注意：如`v-bind="post"`这种形式，不能再将v-bind进行简写

## v-once

1. 节点只渲染一次
2. 随后的重新渲染，元素/组件及其所有子节点都视为静态资源跳过
3. 可以创建低开销的静态组件，除非渲染性能变慢很明显，不然完全没必要使用，它会造成，另一个开发者漏看v-once，会花几个小时查询为何模板无法自动更新

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

### 概述

1. 在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定
2. 本质是一个语法糖
3. 会忽略value，checked，selected初始值，总是以vue实例数据作为数据源
4. 对于输入法（中文等）可能v-model的不会在输入法组合文字过程中得到更新，使用input

### 用法

#### text与textarea

1. 内部实际是将value属性与input事件进行了绑定
2. 在文本区域插值 (`<textarea>{{text}}</textarea>`) 并不会生效，应用 `v-model` 来代替（编译器会提示）

#### checkbox与radio

1. 内部实际是将checked属性与chang事件进行了绑定

2. 多个复选框绑定到数组上

   ```html
   <input type="checkbox" id="check1" v-model="checkbox" value="a">
   <label for="check1">check1</label>
   <input type="checkbox" id="check2" v-model="checkbox" value="b">
   <label for="check2">check2</label>
   <script>
       data:function () {
           return {
               checkbox:[]
           }
       },
   </script>
   ```

   

#### select

1. 内部实际是value与change事件进行了绑定
2. 多选绑定数组：` <select v-model="selected" multiple></select>`

### 值绑定

1. 将value值绑定到vue实例上

2. 复选框：`<input type="checkbox"  v-model="toggle" true-value="yes" false-value="no">`

   - 选中时，`vm.toggle === 'yes'`，非选中时，`vm.toggle === 'no'`
   
3. 单选框：`<input type="radio" v-model="pick" :value="a">`

4. select

   ```html
   <select v-model="selected">
       <!-- 内联对象字面量 -->
     <option v-bind:value="{ number: 123 }">123</option>
   </select>
   ```

### 修饰符

#### .lazy

1. 将v-model每次由input事件触发改为以change事件触发

#### .number

1. 将输入值转为数值，但如果输入的不能被parseFloat解析，则会返回原始值

#### .trim

1. 过滤输入首位空格



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


# 组件

## 概述

1. 一个组件的 data 选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立拷贝
2. 如果组件不是函数，那么组件间相同的data.name会相互影响

## 组件注册

### 组件名

1. 可以使用`my-component-name`或`MyComponentName`
2. 组件调用时是： `<my-component-name>`或`<MyComponentName>` 

### 全局注册

1. 注意：**全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生**

2. 使用如下语法：

   ```javascript
   Vue.component('my-component-name', {
     // ... 选项 ...
   })
   ```

3. 全局注册的组件可以根实例的所有子组件中使用

4. 缺点是，可能有些组件不再使用了，webpack打包时还是给你打包进去了

### 局部注册

1. 在 `components` 选项中定义你想要使用的组件

   ```javascript
   new Vue({
       el: '#app',
       components: {
           'component-a': ComponentA,
           'component-b': ComponentB
       }
   })
   ```

2. 注意，这种方式ComponentA并不能在ComponentB中使用，需要如下方式才可以

   ```javascript
   import ComponentA from './ComponentA.vue'
   
   export default {
     components: {
       'component-a': ComponentA// 也可以利用es6简写为ComponentA，但组件名则为ComponentA而不是'component-a'
     },
   }
   ```

### 自动化全局注册

1. 主要是解决有很多非常非常基础的组件，被频繁使用，利用Vue.component一个个注册太繁琐
2. 利用`require.context()`这个函数

## Prop

### 传值

1. 静态传值：`<blog-post title="123"></blog-post>`
2. 动态传值：`<blog-post :title="post.title"></blog-post>`
3. 传入数字、boolean，数组，对象：`<blog-post :title="false"></blog-post>`
   - 注意要用v-bind指令，如不使用的话，会认为后面的是字符串，而不是表达式
   - 对于上面false，如不适用v-bind，在blog-post的v-if中会认为是字符串false，故认为是true
4. 传递一个对象全部属性：`<blog-post v-bind="post"></blog-post>`
   - 如post的数据结构为{a:1,b:2}
   - 上述等价为`<blog-post :a="post.a" :b="post.b"></blog-post>`

### prop类型

1. prop可以配置名称和类型

   ```javascript
   props: {
     title: String,
     likes: Number,
     isPublished: Boolean,
     commentIds: Array,
     author: Object,
     callback: Function,
     contactsPromise: Promise // or any other constructor
   }
   ```

### 单向数据流

1. 数据流从父组件向子组件流动，即不应该试图改变prop，如这样做，控制台会报错

2. 每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值

3. 子组件需要将prop作为本地prop使用，最好是

   ```javascript
   props: ['counter'],
   data: function () {
     return {
       counter: this.counter
     }
   }
   ```

   - 注意data中引用props是`this.counter`

4. 子组件需要对prop进行转换，最好使用计算属性

   ```javascript
   props: ['size'],
   computed: {
     normalizedSize: function () {
       return this.size.trim().toLowerCase()
     }
   }
   ```

5. 注意：父组件是数组与对象传递的是引用，改变会影响父组件

### Prop验证

1. 验证发生在组件实例创建之前，故实例的data、computed等是不可在验证中使用的

2. 主要提供：基础类型检测、多个类型检测（数组形式）、必填字段（required）、默认值（default）、自定义验证函数（validator）

	```javascript
	Vue.component('my-component', {
	  props: {
	    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
	    propA: Number,
	    // 多个可能的类型
	    propB: [String, Number],
	    // 必填的字符串
	    propC: {
	      type: String,
	      required: true
	    },
	    // 带有默认值的数字
	    propD: {
	      type: Number,
	      default: 100
	    },
	    // 带有默认值的对象
	    propE: {
	      type: Object,
	      // 对象或数组默认值必须从一个工厂函数获取
	      default: function () {
	        return { message: 'hello' }
	      }
	    },
	    // 自定义验证函数
	    propF: {
	      validator: function (value) {
	        // 这个值必须匹配下列字符串中的一个
	        return ['success', 'warning', 'danger'].indexOf(value) !== -1
	      }
	    }
	  }
	})
	```

3. type可以是原生构造函数（String、Boolean、Number等）也可以是自定义的构造函数，vue会通过instanceof检测

### 非Prop特性

1. 是指在组件上传入一个prop，但是组件内部并没有相应prop定义

2. 这种情况，会默认将特性添加到组件的根元素上

3. 如果出现组件传入class或style值，vue会合并他们的值

	```html
	<!-- data-input 组件-->
	<input type="date" class="form-control">
	<date-input
	  data-date-picker="activated"
	  class="dark"
	></date-input>
	```

	- vue并不会用dark覆盖form-control，而是合并为`form-control dark`

## 自定义事件

1. 子组件与父组件进行沟通，或传递值到父组件

	```html
	<!-- 子组件HelloWorld -->
	<!-- msg可以是data中的一个属性值 -->
	<h1 @click="$emit('my-event',msg)">click</h1>
	<!-- 父组件 -->
	<!-- hello的第一个参数则为msg的值 -->
	<HelloWorld @my-event="hello"></HelloWorld>
	<!-- 还可以用$event引用msg值 -->
	<HelloWorld @my-event="post += $event"></HelloWorld>
	```

### 事件名

1. 推荐使用my-event这样的kebab-case 的事件名
2. 因为，如子组件$emit('myEvent')，父组件是无法用@myEvent接收到的，html会将大写全部转为小写

### 自定义组件v-model(2.2+)

1. 组件的v-model默认是用名为value的prop与input事件，如需更改，可以使用

	```javascript
	Vue.component('base-checkbox', {
	  model: {
	    prop: 'checked',
	    event: 'change'
	  }
	})
	```

### 将原生事件绑定到组件

1. 使用 `v-on` 的 `.native` 修饰符

2. 但对于如下结构

	```html
	<base v-on:focus.native="onFocus"></base-input>
	<label>
	  {{ label }}
	  <input
	    v-bind="$attrs"
	    v-on:input="$emit('input', $event.target.value)"
	  >
	</label>
	```

	- 实际父级的 `.native` 监听器将静默失败，不会产生错误
	- 因为在label上没有原生的focus事件

3. 为了解决这个问题，可以在子组件中使用$listeners获取父级所有监听器，相当于在input上重新绑定一下

	```javascript
	Vue.component('base-input', {
	  inheritAttrs: false,
	  props: ['label', 'value'],
	  computed: {
	    inputListeners: function () {
	      var vm = this
	      // `Object.assign` 将所有的对象合并为一个新对象
	      return Object.assign({},
	        // 我们从父级添加所有的监听器
	        this.$listeners,
	        // 然后我们添加自定义监听器，
	        // 或覆写一些监听器的行为
	        {
	          // 这里确保组件配合 `v-model` 的工作
	          input: function (event) {
	            vm.$emit('input', event.target.value)
	          }
	        }
	      )
	    }
	  },
	  template: `
	    <label>
	      {{ label }}
	      <input
	        v-bind="$attrs"
	        v-bind:value="value"
	        v-on="inputListeners"
	      >
	    </label>
	  `
	})
	```

	- 利用`this.$listeners`获取父级的全部监听器
	- 然后再添加自身的input事件的处理函数

## 插槽

### 插槽内容

1. 父组件间的内容，子组件可以通过`<slot>` 元素进行引用

2. 如子组件不包含`<slot>` 元素，父组件间的内容会被抛弃

3. 父组件间可以是任何模板代码，甚至是组件

	```html
	<!-- 子组件 -->
	<slot></slot>
	<!-- 父组件 -->
	<HelloWorld>hello this is slot</HelloWorld>
	```

### 编译作用域

1. 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的

2. 对于如下例子

	```html
	<navigation-link url="/profile">
	  Clicking here will send you to: {{ url }}
	  <!--
	  这里的 `url` 会是 undefined，因为 "/profile" 是
	  _传递给_ <navigation-link> 的而不是
	  在 <navigation-link> 组件*内部*定义的。
	  -->
	</navigation-link>
	```

	- 插槽内容是无法访问到url的
	- 因为 "/profile" 是传递给<navigation-link> 的而不是 <navigation-link> 组件内部的

### 后备内容

1. 相当于为插槽设置一个默认值，即`<slot>submit</slot>`
2. 如父组件之间无内容，则渲染为submit，如有内容，则会渲染父组件之间内容

### 具名插槽

1. 主要解决需要多个插槽的情况

	```html
	<!-- 子组件 -->
	<slot name="header"></slot>
	<slot></slot>
	<!-- 父组件 -->
	<HelloWorld>
	    <template v-slot:header>
	        <h1>hahahahah</h1>
	    </template>
	    <p>main</p>
	</HelloWorld>
	```

2. slot有个额外的特性：name，用来定义额外的插槽，默认值是default

3. 向具名插槽提供内容时，需要使用v-slot指令，此指令只能用于template和组件上

4. 任何没有被包裹在带有 `v-slot`的 `<template>` 中的内容都会被视为默认插槽的内容。

### 作用域插槽

1. 主要目的是让插槽可以访问子组件

	```html
	<!-- 子组件 -->
	<slot name="header" v-bind:user="user"></slot>
	<slot v-bind:age="age"></slot>
	<!-- 父组件 -->
	<HelloWorld>
	    <template v-slot:header="slotProps">
	        <h1>{{slotProps.user}}</h1>
	    </template>
	    <template v-slot:default="slotProps">
	        <p>{{slotProps.age}}</p>
	    </template>    
	</HelloWorld>
	```

	- `v-slot:default="slotProps"`可以简写为`v-slot="slotProps"`

### 具名插槽缩写

1.  `v-slot:header` 可以被重写为 `#header`
2. 与其他指令一样，只有后面有`:`参数时，才可以用，故`#="user"`会报错，可以写为`#default="user"`

### 动态插槽(2.6+)

1. 动态指令可以使用在v-slot上

	```html
	<base-layout>
	  <template v-slot:[dynamicSlotName]>
	  </template>
	</base-layout>
	```



## 处理边界情况

1. 注意这些功能都是有劣势或危险的场景的

### 访问根实例

1. 根实例可以通过 `$root` 属性进行访问

### 访问父级组件

1. 通过`$parent`属性可以用来从一个子组件访问父组件的实例
2. 更推荐下面依赖注入的方式

### 访问子组件

1. 需要在 JavaScript 里直接访问一个子组件

2. 在要访问的子组件上，使用ref赋予ID

	`<base ref="user"></base>`

3. 然后可以通过`this.$ref.user`来访问

4. `$refs` 只会在组件渲染完成之后生效，并且它们不是响应式的。

5. 避免在模板或计算属性中访问 `$refs`

### 依赖注入

1. 父组件可以直接传递数据给孙组件

2. 父组件，利用provide选项

	```javascript
	provide: function () {
	  return {
	    getMap: this.getMap
	  }
	}
	```

3. 孙组件使用inject选项

	```javascript
	inject: ['getMap']
	```

4. 主要缺点：

	- 会使组件变得耦合在一起
	- 属性是非响应式的

5. 最好还是使用vuex

### 强制更新

1. 如果需要强制更新，99%是某个地方使用错误
2. 如没有留意数组或对象的变更检测注意事项，或者依赖了一个未被vue响应式系统追踪的状态
3. 通过`$forceUpdate`来完成这件事

# 动画

1. 使用transition组件进行包装

## 组件/单个元素过渡

### 概述

1. 可以给如下任何元素或组件添加进入/离开过渡
	- 条件渲染 (使用 `v-if`)
	- 条件展示 (使用 `v-show`)
	- 动态组件（使用component）
	- 组件根节点
2. 当插入或删除时，会做如下处理
	- 判断是否有css过渡或动画，如有在合适时机添加类名
	- 是否有js钩子函数，如有被调用
	- 如都没有，则DOM 操作 (插入/删除) 在下一帧中立即执行

### 过渡类名

1. `v-enter`：在元素被插入之前生效，在元素被插入之后的下一帧移除。

2. `v-enter-active`：动画进入的整个阶段，主要用于设置动画时间与曲线函数等。

3. `v-enter-to`: 在元素被插入之后下一帧生效，在过渡/动画完成之后移除。

4. 举例说明，p产生动画效果

	```css
	p{
	    width: 100px;
	    height: 100px;
	    background-color: red;
	    position: absolute;
	    left:0;
	}
	.fade-enter-active{
	    transition: all 3s;
	}
	.fade-enter{
	    left:500px
	}
	.fade-enter-to{
	    left: 300px
	}
	```

	- p默认在`left:0`这个位置，点击按钮，开始动画
	- p会先跳到`left:500px`位置，然后删除此样式，增加fade-enter-to这个类名
	- 故p会从500px到300px进行动画，然后当动画运行到300px后，动画结束
	- p会立即跳到原始的`left:0`这个位置

5. 对应离开的过度类名有：`v-leave`，`v-leave-active`,`v-leave-to`

6. 如使用 `<transition>`，则是默认的`v-`这些类名

7. 如使用`<transition name="fade">`，则类名是fade-leave，fade-enter等

### css动画

1. 主要区别是动画中 `v-enter` 类名在节点插入 DOM 后不会立即删除，而是在 `animationend` 事件触发时删除。

### 自定义过渡类名

1. 优先级高于普通类名，主要是方便与第三方库进行结合
2. `enter-class`
3. `enter-active-class`
4. `enter-to-class` (2.1.8+)
5. `leave-class`
6. `leave-active-class`
7. `leave-to-class` (2.1.8+)

### js钩子

1. 可以在属性中声明js钩子

	```html
	<transition
	  v-on:before-enter="beforeEnter"
	  v-on:enter="enter"
	  v-on:after-enter="afterEnter"
	  v-on:enter-cancelled="enterCancelled"
	  v-on:before-leave="beforeLeave"
	  v-on:leave="leave"
	  v-on:after-leave="afterLeave"
	  v-on:leave-cancelled="leaveCancelled"
	>
	</transition>
	```

2. 当只用 JavaScript 过渡的时候，**在 enter 和 leave 中必须使用 done 进行回调**。否则，它们将被同步调用，过渡会立即完成。

## 多个元素过渡

1. 注意：当有相同标签元素切换时，最好是设置key，否则vue会只替换相同标签内部内容

2. 比如，如下切换

	```html
	<transition>
	    <button v-if="isEditing" key="save">
	        Save
	    </button>
	    <button v-else key="edit">
	        Edit
	    </button>
	</transition>
	```

3. 完全可以写为是

	```html
	<transition>
	    <button v-bind:key="isEditing">
	        {{ isEditing ? 'Save' : 'Edit' }}
	    </button>
	</transition>
	```

## 多组件过渡

1. 直接使用动态组件

## 列表过渡

1. 使用`transition-group`组件

### v-move

1. 主要是应用在`transition-group`组件中，元素改变定位的过程中应用
2. 可以通过name属性自定义前缀，通过move-class自定义类名
3. Vue 使用了一个叫 [FLIP](https://aerotwist.com/blog/flip-your-animations/) 简单的动画队列将元素从之前的位置平滑过渡新的位置

## 动态过渡

1. 

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

## is

1. 用于动态组件

# 内置组件

## component

1. props

	- is
	- inline-template

2. 染一个“元组件”为动态组件。依 `is` 的值，来决定哪个组件被渲染。

3. 可以根据`is:current`的current值来渲染不同的组件

	```html
	<template>
	  <div id="app">
	    <button 
	            v-for="tab in tabs" 
	            v-bind:key="tab" @click="currentTab = tab"
	            >{{ tab }}
	    </button>
	    <component :is="currentTab"></component>
	  </div>
	</template>
	
	<script>
	import A from "./components/A";
	import B from "./components/B";
	export default {
	  data: function() {
	    return {
	      currentTab: "A",
	      tabs: ["A", "B", "C"]
	    };
	  },
	  components: {
	    A,B
	  }
	};
	</script>
	```

	- 点击button，currentTab会得到不同的值
	- component会根据不同的currentTab值渲染不同组件

## keep-alive

1. 可以保存组件状态，避免反复重渲染导致的性能问题，比如tab下的subtab，第一次切换subtab为2时，希望subtab切换回来时可以保存2这个状态

	```html
	<keep-alive>
	    <component v-bind:is="currentTabComponent"></component>
	</keep-alive>
	```



# 问题

1. 列表渲染时，vue说使用了机智的手段，在某些数组方法返回新数组时，更高效的复用dom，如果做到的
2. 修饰符.passive的含义，为何能提升移动端性能
3. select值绑定，为何要绑定内联对象字面量
4. 并不太理解[禁用特性继承](https://cn.vuejs.org/v2/guide/components-props.html#禁用特性继承)
5. 看基础组件checkbox源码，看组件v-model的使用有何意义
6. .sync 修饰符使用
7. 插槽的解构使用
8. 异步组件的应用
9. 程序化侦听器的应用
10. vue的 animationend怎么搞
11. 如何同时使用过渡和动画，以及transition的duration 属性等使用
12. 过渡模式
13. 列表的交错过渡