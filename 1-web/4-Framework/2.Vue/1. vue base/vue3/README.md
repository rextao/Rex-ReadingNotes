# 学习

1. 如何快速体验vue3

   - clone vue-next仓库后，利用build编译后的文件，直接在html中引入即可

   - 或者在网上找一个编译后的版本

     ```html
     <!DOCTYPE html>
     <html lang="en">
     ```
<head>
         <meta charset="UTF-8">
         <title>Title</title>
         <script src="https://s1.zhuanstatic.com/common/js/vue-next-3.0.0-alpha.0.js"></script>
     </head>
     <body>
     <div id='app'></div>
     </body>
     <script>
         const { createApp, ref } = Vue;
         const RootComponent = {
             template: `
             <div>
                 <button @click="increment">
                 add
                 </button>
                 <p>{{count}}</p>
             </div>`,
             setup() {
                 const count = ref(0);
                 const increment = () => { count.value++ }
                 return {
                     count,
                     increment,
                 }
             }
         }
         createApp().mount(RootComponent, '#app')
     </script>
     </html>
     ```

   

2. vue是强制将数据层分离

   - 主要是html代码需要写在template字段或利用render函数，而不像react，直接return一个jsx



# 设计目标

## 更快

### 使用Proxy代替Object.defineProperty

1. defineProperty会对对象不停的改变，会更影响js引擎的优化 

### 编译优化

1. slot默认编译为函数，父子组件避免强耦合
2. vnode参数一致化，并未children带上类型，可以使runtime更快

### virtual dom的性能瓶颈

1. 核心价值是一个抽象层，用于描述当前ui的样式

2. 一个组件内，还是需要循环遍历比较，如果组件内节点很多，也不一定在16ms内就能完成更新

3. react的jsx和手写render function是完全动态的，过渡的灵活性导致运行时用于优化的信息不足

   ```javascript
   function render() {
     const children = [];
     for(let i = 0; i < 5; i++) {
   		children.push(h('p', {
         class: 'text'
       }, i === 2 ? this.message : 'rex'))
     }
     return h('div', { id: 'content'}, children)
   }
   ```

   - 运行时是无法推测出`i === 2` 时，显示`this.message`
   - react的解决办法是时间分片，react承认无法将一段更新足够快，利用时间分片的方式，将更新分在不同的cpu片段

4. 但对于vue模板是一眼可以看出哪个数据是变化的

   - 因此传统dom的性能跟模板大小正相关，与动态节点数量无关
   - 如果组件模板只有少量动态节点，遍历都是性能浪费（默认的dom diff，会遍历组件内部所有dom）

5. 业界解决方案

   - svelte 没有virtual dom，走极致的编译路线，如

     ```javascript
     <h1>hell, {name}</h1>
     // 极致的编译结果
     p(changed, ctx) {
       if(changed.name) {
         set_data(t1, ctx.name)
       }
     }
     ```

   - 限制是，你只能用模板，不能使用模板更底层的东西，放弃了virtual dom和js的灵活性与表达力

   - 换来的是极致的更新性能

6. 为何不能抛弃virtual dom

   - 某些库使用render函数会灵活的多
   - 兼容2.x
   - 目标是：兼容手写render function，又能最大化利用模板静态信息的算法

7. 新的virtual dom方案

   - 主要是对模板进行切分，可以切分为内部一些静态的块，减少无畏的遍历
   - 将vdom更新性能由于模板大小相关提升为与动态内容的数量相关

## 支持Typescript

### 废弃class api，使用composition api

1. Vue2为了支持ts，一般会使用`vue-class-component`这个库（基于装饰器的）
2. 目标只是为了更好的支持ts，class api是需要基于装饰器的，但装饰器还处于stage2阶段，非常不稳定
3. 除了类型支持外，Class API并不带有任何新的优势，即写ui时很少会用到继承



# [Composition API](https://vue-composition-api-rfc.netlify.com/)

## 概述

1. Vue3 将采取的新的接口使用方式： `Composition API` （组合式 API）
   - 不再是使用经典的 `Options API`，即分别传入method，data等
   - 提供了一个全新的逻辑复用方案
   - 主要优点是：返回值可以被任意命名（解决命名空间问题），没有额外消耗，暴露给模版的属性来源清晰（从函数返回）

## 优势

### 更好的ts类型推导支持

1. ts对函数的类型支持是非常好的，但ts并不是根据对象设计类型推到的，故之前的option api对类型推导并不友好

### tree-shaking优化

1. tree-shaking是基于import的，故实际可以设计很多vue api，如果不import也不会被打包到最终文件中

### 代码更容易压缩

1. 对象的key，默认情况下是不会被压缩的
2. 但函数内部的遍历，会被压缩为单字符

### 逻辑复用

#### 概述

1. Vue2.x常见的逻辑复用模式

   - Mixins

     - 数据来源不清晰：模版中的数据来源不清晰。举例来说，当一个组件中使用了多个 mixin 的时候，光看模版会很难分清一个属性到底是来自哪一个 mixin。
     - 命名空间冲突：命名空间冲突。由不同开发者开发的 mixin 无法保证不会正好用到一样的属性或是方法名。

   - 高阶组件 (Higher-order Components, aka HOCs)

     - 数据来源不清晰
     - 命名空间冲突
     - 额外性能消耗：嵌套的组件越多，组件实例就越多，无畏的性能消耗

   - Renderless Components (基于 scoped slots / 作用域插槽封装逻辑的组件）是一个很好的抽象方式

     - 主要是额外的性能消耗

       ```javascript
       <mouse v-slot="{x, y}">
         // x,y
       </mouse>
       ```

#### 优势

1. 代码组织更优
   - 可以将option api 分离的代码片段，整合在一起，即通过一个函数可以组合data，computed，watch等，把逻辑整合在一个函数
   - setup函数可以作为一个描述组件要做什么的集合函数，option api并不能清晰的看出组件要干嘛
2. 复用代码更方便
   - 因为只需import vue的相关hook函数即可，不会导致上面所说的数据来源不明，命名冲突，额外性能销毁等问题

## 问题

1. ref的使用
   - 会造成心里负担，需要考虑对象和普通值
   - 对ref值还需要调用`.value`进行赋值，有些冗长
2. ref与reactive使用的区别
3. setup返回值会冗长，解决办法有
   - ide有插件可以直接从变量生成返回值

## api 详情

### setup

1. component的新option，作为Composition API 入口

2. 调用时机

   - beforeCreate之前，props解决后

3. 返回值

   - 对象：对象的值会绑定到context，即可以直接在模板中使用
   - render函数

4. 传入参数

   ```javascript
   const MyComponent = {
     setup(props, { attrs }) {
       function onClick() {
         console.log(attrs.foo) // guaranteed to be the latest reference
       }
     }
   }
   ```

   - 参数props
     - props是响应式的
     - 不要使用结构获取props的属性，会变为非响应式
   - 参数context
     - 可以利用解构的方式获取context上的slots与attrs
   - 为何第一个参数为props
     - 实际context中也可以获取到props，为何还要将props作为独立参数呢？
     - props参数在组件中用的频率更高
     - 为了更好的支持ts

5. this

   - 函数内不允许调用this
   - 因为，setup函数会在2.x options之前完成，会导致setup与其他2.x options的this不一致，产生混淆



### watchEffect

1. 处理边界效应

   ```javascript
   import { reactive, watchEffect } from 'vue'
   
   const state = reactive({
     count: 0
   })
   
   watchEffect(() => {
     document.body.innerHTML = `count is ${state.count}`
   })
   ```

   - 与watch类似，但无需分离数据源与副作用回调
   - vue3也提供了一个watch方法，与原来一模一样

2. 但实际对于vue，可以无需innerHTML

   ```javascript
   import { reactive, watchEffect } from 'vue'
   
   const state = reactive({
     count: 0
   })
   
   function increment() {
     state.count++
   }
   
   const renderContext = {
     state,
     increment
   }
   
   watchEffect(() => {
     // hypothetical internal code, NOT actual API
     renderTemplate(
       `<button @click="increment">{{ state.count }}</button>`,
       renderContext
     )
   })
   ```

### reactive

1. 设置响应式

   ```javascript
   import { reactive } from 'vue'
   // reactive state
   const state = reactive({
     count: 0
   })
   ```

   - 与`Vue.observable()` API in 2.x 是一样的
   - 重命名主要是避免与RxJs observables产生混淆

2. 创建一个没有包装的响应式对象

### ref

#### 概述

1. `ref()` 返回的是一个 **value reference （包装对象）**。一个包装对象只有一个属性：`.value`

2. 如果在一个函数中返回一个字符串变量，接收到这个字符串的代码只会获得一个值，是无法追踪原始变量后续的变化的。

3. 包装对象的意义就在于提供一个让我们能够在**函数**之间以引用的方式传递任意类型值的容器

4. 包装数组或对象并非无意义
   - 让我们可以对整个对象的值进行替换，引用不变
   
     ```javascript
     const numbers = ref([1, 2, 3])
     // 替代原数组，但引用不变
     numbers.value = numbers.value.filter(n => n > 1)
     ```
   
5. 当包装对象被暴露给模版渲染上下文，或是被嵌套在另一个响应式对象中的时候，它会被自动展开 (unwrap) 为内部的值，即无需调用`count.value`

#### 源码描述

```javascript
export function ref(raw?: unknown) {
  if (isRef(raw)) {
    return raw
  }
  const value = reactive({ [RefKey]: raw })
  return Object.seal({
    get: () => value[RefKey] as any,
    set: (v) => ((value[RefKey] as any) = v),
  })
}
```

1. 注意
   - `ref`内部先调用的是 `reactive`，又将返回的对象 seal下
   - 返回的对象，只有value属性，不可以删除，或添加其他属性

### toRef

1. 将一个 reactive 对象的属性创建一个 ref

   ```javascript
   export function toRef<T extends object, K extends keyof T>(
     object: T,
     key: K
   ): Ref<T[K]> {
     const v = object[key]
     if (isRef<T[K]>(v)) return v
     return Object.seal({
       get: () => object[key],
       set: (v) => (object[key] = v),
     })
   }
   ```

2. 注意

   - 处理的是`object[key]`值

### toRefs

1. 调用方式： `toRefs(obj)`

2. 注意：

   - obj不是Reactive的，会提示warn
   - return的是普通对象，对象的每个值都被`toRef`

3. 主要解决，`reactive`返回值不能被解构或展开，保留响应式

   ```javascript
   export function toRefs<T extends Data = Data>(obj: T): ToRefs<T> {
     if (!isPlainObject(obj)) return obj as any
   
     if (__DEV__ && !isReactive(obj)) {
       warn(`toRefs() expects a reactive object but received a plain one.`)
     }
   
     const ret: any = {}
     for (const key in obj) {
       ret[key] = toRef(obj, key)
     }
   
     return ret
   }
   ```

   



### computed

1. `computed()` 返回的是一个只读的包装对象，默认情况下，如果用户试图去修改一个只读包装对象，会触发警告

2. 如果需要设置值，可以使用setter

   ```javascript
   const count = ref(0)
   const writableComputed = computed(
     // read
     () => count.value + 1,
     // write
     val => {
       count.value = val - 1
     }
   )
   ```



### watch

#### 概述

1. 提供了基于观察状态的变化来执行副作用的能力

2. 使用方式

   ```javascript
   watch(
     // getter
     () => count.value + 1,
     // callback
     (value, oldValue) => {
       console.log('count + 1 is: ', value)
     }
   )
   ```

   - 第1个参数：一个返回任意值的函数，一个包装对象，一个数组
   - 第2个参数：回调函数，只有当数据源发生变动时才会被触发

3. `watch()` 的回调会在创建时就执行一次，类似2.x的 `immediate: true` 

4. 默认情况下 `watch()` 的回调总是会在当前的 renderer flush 之后才被调用，即回调总是在dom更新过的状态下（可以定制）

#### 观察 props

```javascript
const MyComponent = {
  props: {
    id: Number
  },
  setup(props) {
    const data = ref(null)
    watch(() => props.id, async (id) => {
      data.value = await fetchData(id)
    })
    return {
      data
    }
  }
}
```



#### 观察包装对象

```js
// double 是一个计算包装对象
const double = computed(() => count.value * 2)

watch(double, value => {
  console.log('double the count is: ', value)
}) // -> double the count is: 0

count.value++ // -> double the count is: 2
```

#### 观察多个数据源

1. 可以观察一个包含多个数据源的数组

2. 任意一个数据源的变化都会触发回调，同时回调会接收到包含对应值的数组作为参数

   ```javascript
   watch(
     [refA, () => refB.value],
     ([a, b], [prevA, prevB]) => {
       console.log(`a is: ${a}`)
       console.log(`b is: ${b}`)
     }
   )
   ```

   

#### 停止观察

1. `watch()` 返回一个停止观察的函数

   ```javascript
   const stop = watch(...)
   // stop watching
   stop()
   ```

2. 如果 `watch()` 是在一个组件的 `setup()` 或是生命周期函数中被调用的，那么该 watcher 会在当前组件被销毁时也一同被自动停止：

   ```javascript
   export default {
     setup() {
       // 组件销毁时也会被自动停止
       watch(/* ... */)
     }
   }
   ```

#### 清理副作用

1. watch回调参数如下：

   ```javascript
   watch(idValue, (id, oldId, onCleanup) => {
     onCleanup(() => {
     })
   })
   ```

2. `onCleanup`对之前所执行的副作用进行清理，举例来说，一个异步操作在完成之前数据就产生了变化，我们可能要撤销还在等待的前一个操作

3. 之所以要用传入的注册函数来注册清理函数，而不是像 React 的 `useEffect` 那样直接返回一个清理函数，是因为 watcher 回调的返回值在异步场景下有特殊作用。我们经常需要在 watcher 的回调中用 async function 来执行异步操作：

   ```js
   const data = ref(null)
   watch(getId, async (id) => {
     data.value = await fetchData(id)
   })
   ```

   - async function 隐性地返回一个 Promise ，因此无法返回一个需要被立刻注册的清理函数的
   - 回调返回的 Promise 还会被 Vue 用于内部的异步错误处理。

#### watch选项

```typescript
interface WatchOptions {
  lazy?: boolean
  deep?: boolean
  flush?: 'pre' | 'post' | 'sync'
  onTrack?: (e: DebuggerEvent) => void
  onTrigger?: (e: DebuggerEvent) => void
}
```

1. `lazy`与 2.x 的 `immediate` 正好相反
2. flush
   - pre：fire right before renderer flush
   - post：default, fire after renderer flush
   - sync：fire synchronously

### 生命周期函数

1. 所有现有的生命周期钩子都会有对应的 `onXXX` 函数（只能在 `setup()` 中使用）



# 与react的差异

1. `setup` 仅执行一遍，而 React Function Component 每次渲染都会把所有hooks执行一次
2. Vue 的代码使用更符合 JS 直觉
   - JS 并非是针对 Immutable 设计的语言，所以 Mutable 写法非常自然，而 Immutable 的写法就比较别扭
   - 当 Hooks 要更新值时，Vue 只要用等于号赋值即可，而 React Hooks 需要调用赋值函数，复杂对象还要用第三方库
3. Vue对 Hooks 使用顺序无要求，而且可以放在条件语句里
   - 对 React Hooks 而言，调用必须放在最前面，而且不能被包含在条件语句里，这是因为 React Hooks 采用下标方式寻找状态，一旦位置不对或者 Hooks 放在了条件中，就无法正确找到对应位置的值。
   - vue hooks调用不会触发setup更新，故可以放在任何地方
4. react需要包裹`useCallback`避免子组件频繁渲染
   - 由于react完全依赖 Immutable 属性，在 Function Component 内部创建函数时，每次都会创建一个全新的对象，这个对象如果传给子组件，必然导致子组件无法做性能优化。 因此 React 采取了 `useCallback` 作为优化方案
   - vue的setup只执行一次，不存在多个实例的问题

