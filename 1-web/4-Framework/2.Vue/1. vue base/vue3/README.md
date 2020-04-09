# vue3

### 概述

1. Vue2.x常见的逻辑复用模式
   - Mixins
   - 
     高阶组件 (Higher-order Components, aka HOCs)
   - Renderless Components (基于 scoped slots / 作用域插槽封装逻辑的组件）
2. 以上模式主要问题是
   - 模版中的数据来源不清晰。举例来说，当一个组件中使用了多个 mixin 的时候，光看模版会很难分清一个属性到底是来自哪一个 mixin。HOC 也有类似的问题。
   - 命名空间冲突。由不同开发者开发的 mixin 无法保证不会正好用到一样的属性或是方法名。HOC 在注入的 props 中也存在类似问题。
   - 性能。HOC 和 Renderless Components 都需要额外的组件实例嵌套来封装逻辑，导致无谓的性能开销。
3. Vue3 将采取的新的接口使用方式： `Composition API` （组合式 API）
   - 不再是使用经典的 `Options API`，即分别传入method，data等
   - 提供了一个全新的逻辑复用方案
   - 主要优点是：返回值可以被任意命名（解决命名空间问题），没有额外消耗，暴露给模版的属性来源清晰（从函数返回）
4. vue3为了更好的支持ts
   - Vue2为了支持ts，一般会使用`vue-class-component`这个库（基于装饰器的）
   - Vue3开始也是打算利用内置的class api解决类型问题，但class api也是需要基于装饰器的，但装饰器还处于stage2阶段

## [Vue Composition API](https://vue-composition-api-rfc.netlify.com/)

### API介绍

#### setup

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

#### reactive

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

#### watchEffect

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



#### ref

1. `ref()` 返回的是一个 **value reference （包装对象）**。一个包装对象只有一个属性：`.value`
2. 如果在一个函数中返回一个字符串变量，接收到这个字符串的代码只会获得一个值，是无法追踪原始变量后续的变化的。
3. 包装对象的意义就在于提供一个让我们能够在函数之间以引用的方式传递任意类型值的容器
4. 包装数组或对象并非无意义
   - 让我们可以对整个对象的值进行替换
   - 

