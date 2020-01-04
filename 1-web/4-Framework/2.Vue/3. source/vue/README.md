# 学习

## 如何分析源码

1. 没必要像jQuery一样，进行深度遍历的看，这样是比较累的，并且不容易整体把握
2. 可以先跳过一些部分，如响应式原理，等看到响应式原理时，再看这部分代码

# 准备工作

## 认识Flow

### 概述

1. 静态类型检查，之所以选择Flow是定位Babel和EsLint都有对应的Flow插件以支持语法
2. 可以完全沿用现在的构建配置，非常小的改动就可以让项目拥有静态类型检查的能力

### 常见类型检查方式

1. 类型推断
   - 通过变量的使用上下文推断变量类型，根据这些推断检查类型
2. 类型注释
   - 事先注释好我们期待的类型，Flow会基于这些注释来判断

### vue的使用方式

1. flow提出了libdef的概念，可以识别第三方库或者自定义类型，vue利用了这些特性
2. vue主目录下的`.flowconfig`文件是flow的配置文件
3. 在flow文件夹下，定义了一些自定义类型

## 目录结构

1. compiler：编译相关代码
2. core：核心代码
3. server：服务器相关
4. sfc：可以将单vue文件编译为一个js对象
5. shared：辅助的方法，可以被所有目录共享的辅助方法
6. **思考**：可以将模块拆分非常清楚，在独立的目录下进行维护，方便代码复用，维护性增强，然后使用打包工具将代码合并为一个文件

# 源码阅读

##  代码构建过程

### 概述

1. 基于rollup构建，更适合js库的编译，只负责js，其他如图片等是不管的，更轻量
1. 由于vue也是发布在npm上，故有一个package.json对文件进行描述
1. 运行这个`npm build`时，会调用scripts的build.js函数
1. 由此作为开始，分析构建流程

### 思考

1. 如何将fs.write封装为promise
  
   - 在`scripts/build.js`的write函数
   
1. 利用\x1b[1m\x1等字符，可以将console的颜色进行更改
  
   - 在`scripts/build.js`的blue，可以使用chalk对console文件进行颜色美化
   
1. 注意：

   - config.js中的config里面的各种不同编译版本，在vue官网：https://github.com/vuejs/vue/tree/2.6/dist，有各个构建版本含义的介绍

   

### 流程图

![vue构建过程](../源码流程图/1-vue构建过程.svg)

## new Vue阶段
1. 根据构建需要的配置入口文件`scripts/config.js`的builds中的entry，找到`web/entry-runtime.js`，可以逐步向上查找Vue的定义
2. 最终在`src/core/instance/index.js `找到`function Vue(){}`定义
3. 因此，实际调用new Vue，是会执行`Vue.prototype._init`，最终运行`vm.$mount(vm.$options.el)`方法
4. 在index函数中，会通过Mixin函数定义prototype上的各种方法，而在init中会分别调用initEvent等方法

### 思考

1. vue创建并没有使用class，而是利用es5的function，因为vue利用mixin的方式，将不同功能的prototype分散在不同的文件中
2. 根据`src/core/instance/init.js`可以看出，beforeCreate与create之间主要区别是，会初始化inject，state与provide

### 流程图

![2-new vue](../源码流程图/2-new vue.svg)

## vm挂载

1. 由于`Vue.prototype._init()`最后是调用vm.$mount方法；这个方法在`src/platforms/web/runtime/index.js`与`src/platforms/web/entry-runtime-with-compiler.js`中都有定义

2. 而编译版本js主要是对template进行处理，编译为render函数，然后进行后续操作

   

### 流程图

![3-vm挂载](../源码流程图/3-vm挂载.svg)

4. 根据流程图可以看出，最终会调用`vm._update(vm._render(),hydrating)`

##  vm._render()

### 概述

1. `vm._render`则是使用render函数，获取vnode 



### 虚拟Dom

1. 可以在控制台打印dom节点

   ```javascript
     const div = document.createElement('div');
     let str = ''
     for(var key in div){
         str += key;
     }
   ```

   - 可以看到实际的dom会包含很多内容

2. virtual DOM实际是用原生js对象去描述一个DOM节点，比创建一个DOM的代价小的多

   - 不需要包含操作dom的方法
   - 映射到真实DOM实际要经历VNode的create、diff、patch等过程

### 流程图

![4-vm._render](../源码流程图/4-vm._render.svg)

## vm._update()

### 概述

1. 根据流程图可以得知`vm._update`会绕一大圈去调用`src/core/vdom/patch.js`下面patch函数
2. `vm._update`调用`vm.__patch__`时，由于在 Web 和 Weex 环境，把虚拟 DOM 映射到 “平台 DOM” 的方法是不同的，并且对 “DOM” 包括的属性模块创建和更新也不尽相同。
3. 因此`vm.__patch__`会引用`src/platforms`目录下不同文件夹下的patch，而不同目录有各自的 `nodeOps` 和 `modules`。
4. 而不同平台的 `patch` 的主要逻辑部分是相同的，所以这部分公共的部分托管在 `core` 这个大目录下

### 思考

1. 针对不同平台生成patch函数，用到了一个函数柯里化的技巧，通过 `createPatchFunction` 把差异化参数提前固化，这样不用每次调用 `patch` 的时候都传递 `nodeOps` 和 `modules` 了
2. 如果不使用上述方式，则需要再creatPatchFunction中写很多if-else函数

### 流程图

![5-vm._update](../源码流程图/5-vm._update.svg)

## 组件

### createComponent创建Vnode

#### 概述

1. 实际函数主要是介绍如何生成组件Vnode

2. 上接vm._render()`流程图`_createElement`函数，里面在判断`typeof tag === 'string'`时，如果为false，会调用createComponent

3. 普通tag生成Vnode的主要代码是

   ```javascript
   vnode = new VNode(
     tag, data, children,
     undefined, undefined, context
   )
   ```

4. 对于组件则是

   ```javascript
   const vnode = new VNode(
     `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
     data, undefined, undefined, undefined, context,
     { Ctor, propsData, listeners, tag, children },
     asyncFactory
   )
   ```

5. 注意

   - 组件的命名是以vue-component-为开始的，当我们看到一个此类名，就知道是一个组件
   - 组件的子并不是利用children参数传入Vnode的，而是使用componentOptions这个参数传入的，即组件Vnode是空，componentOptions里面包含children、propsData，listeners等

6. 关键：

   - 子组件的构建器是继承Vue的，具有Vue的能力
   - 组件的data会有一些hook
   - 组件Vnode与普通Vnode有区别

#### 流程图

![6-组件createComponent](../源码流程图/6-组件createComponent.svg)

### update

#### 概述

1. 通过上面的createComponent会创建组件的Vnode，然后调用`vm._patch`函数，然后会调用`src/core/vdom/patch.js`的返回patch函数
2. 而这个patch函数会利用createEl使用Vnode创建真实dom节点

#### 流程图

![7-组件createEl-createComponent](../源码流程图/7-组件createEl-createComponent.svg)



#### 代码流程分析

```vue
// main.js
const main = new Vue({
    el: '#app',
    render(h) {
        return h(App)
    }
})
// App.vue
<div id="componentApp">
  {{msg}}
  <hello-world msg="helloWorld"></hello-world>
</div>
// helloWorld
<div class="hello">
  <h1>{{ msg }}</h1>
</div>
```

##### new Vue的init阶段

1. 在 `function Vue`处打断点，代码执行，进行此函数，执行_init方法，此时的options，即为传入的options，故`vm.$options.el`存在，且为#app；最终执行`vm.$mount(vm.$options.el);`
2. 由于render函数存在，则无需进行运行时编译，直接mountComponent方法，最终调用`vm._update(vm._render(), hydrating);`方法
3. vm._render函数调用，会调用createElement方法，第一个参数为vm实例，第二个参数(tag)实际是App，此App文件会被vue-load进行处理，即模板会变为render函数
4. 进入_createElement，由于tag是对象，会进入createComponent函数，使用此函数生成vnode
5. 进入createComponent函数后，Ctor即是之前的App对象，会将Ctor转换为继承了Vue的构造函数，调用installComponentHooks为data安装hooks，然后生成`tag: "vue-component-1-app"`的Vnode
6. vm._render函数执行完返回的Vnode，会传入update函数，进入patch函数，参数oldVnode实际是vm.$el这个真是dom节点，vnode则是"vue-component-1-app"，然后调用createElm函数
7. 传入createElm的vnode，则是上面的"vue-component-1-app"，insertedVnodeQueue为空数组，parentElm就是#app的父元素body，refElm是#app的nextSibling元素，即文本节点，首先会用相同的参数传入createComponent，由于组件具有hooks，会执行init函数
8. 进入hooks的init函数，会调用createComponentInstanceForVnode函数，而activeInstance是在**Vue.prototype._update**赋值的，实际就是new Vue返回的vue实例
9. 因此，此时对options的赋值，`_parentVnode`实际是"vue-component-1-app"，而parent是vm实例，最终会去调用`new vnode.componentOptions.Ctor(options)`，而Ctor实际就是继承自Vue的构造函数，会调用`_init方法`

##### 子组件init阶段

1. 此时，再进入init函数，options只有3个属性，`_parentVnode`是"vue-component-1-app"，parent是vm实例(main这个实例)，`_isComponent`为true，故先执行initInternalComponent，合并属性操作，实际是将obj.obj类似这样的属性，合并到opts上，即合并到子组件vm.$options上

2. 注意，此时运行进入initLifecycle，由于此时具有parent属性，即会将父级的vm实例放在parent.$children中

3. 此时，并不具有`vm.$options.el`，故init执行完，即回到createComponentInstanceForVnode函数，进而会手动调用`child.$mount(hydrating ? vnode.elm : undefined, hydrating);`进行子组件挂载，此时传入的第一个参数el为undefined，由于vue-load会将App模板转换为render函数，故不会执行运行期编译

4. 再次执行到mountComponent函数，此时的vm是"vue-component-1-app"实例记为app，

5. 又会进入vm._render函数调用，生成vnode，实际上App组件由vue-loader生成的render函数为

   ```javascript
   var render = function() {
     var _vm = this
     var _h = _vm.$createElement
     var _c = _vm._self._c || _h
     return _c(
       "div",
       { attrs: { id: "componentApp" } },
       [
         _vm._v("\n  " + _vm._s(_vm.msg) + "\n  "),
         _c("hello-world", { attrs: { msg: "helloWorld" } })
       ],
       1
     )
   }
   var staticRenderFns = []
   render._withStripped = true
   export { render, staticRenderFns }
   ```

   - _c实际是$createElement函数，只是最后一个参数不同，参数分别为 tag, data, children
   - 会先执行_c("hello-world", { attrs: { msg: "helloWorld" } })生成helloworld组件是Vnode，然后生成此App的Vnode
   - children实际是一个文本Vnode，一个helloWorld组件Vnode（tag: "vue-component-2-HelloWorld"）
   - 注意，此vnode的tag为div

6. 获取了Vnode后，进入update方法，此时的vnode参数，则为刚render生成的vnode

7. 进入patch函数，vm.$el依然是undefined，故先回进入createElm(vnode, insertedVnodeQueue);函数

8. 再次进入createComponent函数，注意，由于此vnode并不是组件，故不存在hooks函数，故此函数返回undefined

9. 继续运行，会调用createChildren函数处理上面的children，然后依次调用createElm，第一个子节点是文本节点，第二个子节点是又是组件节点HelloWorld，此时createComponent会具有hooks函数，然后执行HelloWorld的$mount方法

#### 总结

1. patch整体流程：createComponent->子组件初始化->子组件render->子组件patch
2. activeInstance为当前激活vm实例；vm.$vnode为组件占位符vnode；vm._vnode为组件渲染vnode
3. 嵌套组件的插入顺序是先子后父

### 组件挂载流程分析图

![7-组件createEl-createComponent](../源码流程图/7-1组件patch.svg)



## 合并配置

1. vue合并配置分为如下两种情况
   - 外部调用场景的配置合并
   - 组件场景的配置合并
2. 参见 2-new vue 流程图，可以得知在Vue.prototype._init()会进行配置合并，即合并options

### 举例说明

```javascript
import Vue from 'vue'
let child = {
    template: '<div>{{msg}}</div>',
    created() {
        console.log('child created')
    },
    mounted() {
        console.log('child mounted')
    },
    data() {
        return {
            msg: 'hello'
        }
    }
};
Vue.mixin({
    created() {
        console.log('parent created')
    }
});
new Vue({
    el: '#app',
    render: h => h(child)
});
```

1. 首先，会执行Vue.mixin函数，此函数定义在src/core/global-api/mixin.js中，实际就是利用mergeOptions，将options合并到Vue.options上
2. 调用Vue.mixin时，由于在Vue初始化时，会调用initGlobalAPI将components，directives，filters与_base定义在Vue.options，由于传入参数是created，故将此合并到Vue.options上
   - 注意：由于父（Vue.options）不存在created，子存在，故将created转换为数组返回
3. 然后执行new Vue函数，执行mergeOptions(resolveConstructorOptions(vm.constructor),options || {}, vm)，由于此时vm为Vue，故传入mergeOptions是Vue的opitons，第二个参数是外部new Vue传入的{el: '#app',render}，合并之后实际是将Vue的options与new Vue传入的options全部合并
4.  然后进行组件child的初始化，执行src/core/global-api/extend.js中的extend函数，会有一步通过mergeOptions将父级与当前的options进行合并，此时created是一个数组；由于此时的chid父就是Vue，故会将Vue的options全部合并进来
5. 然后调用initInternalComponent，注意此时的vm实例的proto.constructor挂在了刚刚child的options，而传入的options实际是src/core/vdom/create-component.js中在createComponentInstanceForVnode构建的options，实际此函数主要是将options的某些藏得比较深的属性挂在vm上

### 流程图

![8-合并配置](../源码流程图/8-合并配置.svg)

### 总结

1. 外部调用场景下的合并配置是通过mergeOptions，并遵循一定的合并策略，如对于某些options，如created，computed等不知如何合并的，可以通过查看mergeOptions的合并策略
2. 组件合并是通过initInternalComponent，它的合并更快

## 生命周期

### callHook

1. src/core/instance/lifecycle.js，主要通过这个函数对生命周期进行调用

### 流程图

![9-生命周期](../源码流程图/9-生命周期.svg)



## 组件注册

![10-组件注册](../源码流程图/10-组件注册.svg)

## 异步组件

### 流程图

![11-异步组件](../源码流程图/11-异步组件.svg)

### 总结

1. 异步组件一般是渲染2次以上，第一次是渲染注释节点，当组件加载成功后利用forceRender重新渲染
2. 高级异步组件设计非常巧妙，通过简单配置，实现error，loading，resolve，reject，4种状态

## 深入响应式原理

### 响应式对象

#### 学习

1. 如何将data与props中的属性转为响应式对象的
   - 主要是调用了observe与defineReactive函数
2. data与props属性，设置响应式时，会自动递归调用对象，故即使是嵌套层级的，依旧会被设为响应式
3. 关键的observe与defineReactive方法，学习如何将props与data数据转换为响应式的

#### 流程图

![12-1-响应式原理-响应式对象](../源码流程图/12-1-响应式原理-响应式对象.svg)



### 依赖收集与派发更新

1. 每个响应式的值都具有一个dep.id,并且dep.subs存储此值的watcher
2. 而每个watcher.deps存储了，哪些值监听了此watcher

#### 问题

1. src/core/observer/scheduler.js 中flushSchedulerQueue会有一个检测循环更新的warning

2. 根据代码逻辑，前面有`has[id]=null`，为何还会出现`has[id]!=null`的情况呢？

   ```html
   <template>
     <div>
       <div>{{msg}}</div>
       <button @click="change">change</button>
     </div>
   </template>
   
   <script>
   export default {
     name: 'hellow-world',
     data() {
       return {
         msg: '123',
       }
     },
     methods: {
       change() {
         this.msg = Math.random();
       }
     },
     watch: {
       msg() {
         this.msg = Math.random();
       }
     }
   }
   </script>
   
   ```

   - 可以在queueWatcher与flushSchedulerQueue增加断点

3. 开始运行，在queue添加的是user Watcher，可以看到此时的watcher.expression=msg，第二次进入时，增加的是vue内部创建的渲染watcher，`watcher.expression="function () {      vm._update(vm._render(), hydrating);    }"`

4. 执行完后，会进入flushSchedulerQueue，循环遍历queue，一个watcher是user watcher，执行watcher.run函数，由于是user watcher，故会执行`this.cb.call(this.vm, value, oldValue)`,`this.msg = Math.random()`，对msg进行赋值操作，故有会调用queueWatcher（加入user watcher与渲染watcher）；由于flushSchedulerQueue会将has[id] =null，flashing=true，故又会往queue插入一个新的user watcher，此时queue.length = 3；而渲染watcher的`has[id]!=null`，不会再加入渲染watcher

5. 由于新的user watcher会插入到queue中，故`if (process.env.NODE_ENV !== 'production' && has[id] != null) `，故`has[id]`不为null，circular[id]++

6. 当queue执行第二次循环时，执行的watcher还是user watcher，即上面插入的watcher，故又重复上面的过程，造成死循环，circular就是避免循环过多次，卡死浏览器

#### 流程图

![12-2-响应式原理-依赖收集](../源码流程图/12-2-响应式原理-依赖收集.svg)

### nextTick

#### 概述

1. 目前处理单独文件src/core/util/next-tick.js中
2. 对外暴露的
   - renderMixin中会将nextTick定义在Vue.prototype上
   - Global-api中也将next作为静态方法绑定在Vue上

#### 2.4版本

1. https://github.com/vuejs/vue/blob/v2.4.4/src/core/util/env.js
2. Promise -> MutationObserver -> setTimeout

#### 2.5.0 ~ 2.5.1 版本

1. setImmediate -> MessageChannel -> Promise -> setTimeout
2. vue有注释：在 Vue 2.4 之前的版本，nextTick 几乎都是基于 micro task 实现的，但由于 micro task 的执行优先级非常高，在某些场景下它甚至要比事件冒泡还要快，就会导致一些诡异的问题，如 issue [#4521](https://github.com/vuejs/vue/issues/4521)、[#6690](https://github.com/vuejs/vue/issues/6690)、[#6566](https://github.com/vuejs/vue/issues/6566)；但是如果全部都改成 macro task，对一些有重绘和动画的场景也会有性能影响，如 issue [#6813](https://github.com/vuejs/vue/issues/6813)。所以最终 nextTick 采取的策略是默认走 micro task，对于一些 DOM 交互事件，如 v-on 绑定的事件回调函数的处理，会强制走 macro task。
3. https://github.com/vuejs/vue/blob/v2.5.1/src/core/util/env.js

#### 2.5.2 ~ 2.5.final 版本

1. 搞了个microTimerFunc与macroTimerFunc
2. Promise->setImmediate -> MessageChannel > setTimeout
3. 暴露 withMacroTask API, 用于在一些特别场景下强制使用 macroTask
4. https://github.com/vuejs/vue/blob/v2.5.2/src/core/util/next-tick.js

#### 2.6版本

1. 此版本实现方式Promise->MutationObserver->setImmediate->setTimeout

#### 小结

1. 没有任何一种方案是银弹
2. 实际每种方案都有细微的bug
3. 需要进行一些取舍
4. 补充：如发现是由于nextTick引起的错误，可以利用类似`window.MessageChannel = noop`的方式进行回退，以避免vue使用MessageChannel

### Vue.set,Vue.delete数组

#### 概述

1. 实现的基本原理是，对于数组，对象添加属性等，无法自动触发对象的setter方法时，通过手动触发`ob.dep.notify()`来手动触发
2. Vue.delete的逻辑基本与Vue.set类似，最终都是通过`ob.dep.notify()`进行手动派发更新

#### 流程图

![12-3-Vue.set](../源码流程图/12-3-Vue.set.svg)

### 计算属性

#### 概述

1. 注意：此版本的计算属性，并不会在求值结果一致就不再进行render操作（之前尤大优化过这个问题，后由于bug又revert了）
2. 现在的计算属性是，只要计算属性依赖的值发生变化，会将计算属性的lazy设置为true，然后调用渲染watcher进行渲染，对计算属性重新求值
3. 计算属性就是一个watcher，只是在watcher阶段没有求值，在使用时才进行求值；并会根据lazy标识判断是否依赖有更新，再更新计算属性
4. 由于触发`watcer.evaluate`需要`watcher.dirty`为true，但每次`watcer.evaluate`完都会设置dirty为false，只要页面不重新渲染，每次调用计算属性就不会重新求值



#### 流程图

![12-4-computed](../源码流程图/12-4-computed.svg)



### watcher 监听器

#### 概述

1. 主要区别在于，new Watcher阶段

2. 对于watch的通常定义方式，new watcher传入的expOrFn实际是watch的key，即字符串

   ```
     watch: {
       useless(newVal) {
         console.log(newVal);
       },
       a.b.c(newVal) {    
         console.log(newVal);
       },
       nest: {
         deep: true,
         handler(newVal) {
           console.log(newVal);
         }
       }
     },
   ```

3. 故会执行`this.getter = parsePath(expOrFn)`  而parsePath实际返回的是一个函数，主要是处理a.b.c这样的watch，但要注意的是，即使创建一个这样的watcher：a.b.c，a与b的改变，同样会通知这个watcher，就是由于parsePath这个函数

   ```
   export function parsePath (path: string): any {
     if (bailRE.test(path)) {
       return
     }
     // 如user watch时调用，watch可能会添加a.b.c这样的key，将这样的key split
     // 然后从obj中获取，obj可能是vm实例
     const segments = path.split('.')
     return function (obj) {
       for (let i = 0; i < segments.length; i++) {
         if (!obj) return
         obj = obj[segments[i]]
       }
       return obj
     }
   }
   ```

4. watcher阶段的最后，会调用get方法，先将当前的user watcher推到Dep.target上，然后调用` value = this.getter.call(vm, vm);` 调用3中定义的返回函数，然后获取vm上的值，如对于useless，就是获取 vm.useless 

5. **特别注意：**由于进行了取值操作vm.useless，会触发useless的getter操作进行依赖收集，将user watcher加入到useless的dep中，这样useless发生变化，就会通知到此user getter

6. 因此，当有useless值发生改变时，会触发setter进行派发更改，故会通知到这个user watcher

#### 流程图

![12-5-watch](../源码流程图/12-5-watch.svg)



### 组件更新

#### 基本事例

```vue
<template>
  <div>
    <hello-world :flag="flag" ></hello-world>
    <button @click="change">change</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
export default {
  name: 'app',
  components: {
    HelloWorld,
  },
  data() {
    return {
      flag: true,
    }
  },
  methods: {
    change() {
      this.flag = !this.flag;
    },
  },
}
</script>
```

```vue
<template>
  <div>
    <hello-world :flag="flag" ></hello-world>
    <button @click="change">change</button>
  </div>
</template>
<script>
import HelloWorld from './components/HelloWorld'
export default {
  name: 'app',
  components: {
    HelloWorld,
  },
  data() {
    return {
      flag: true,
    }
  },
  methods: {
    change() {
      this.flag = !this.flag;
    },
  },
}
</script>
```

1. 组件更新，会进入src/core/vdom/patch.js里面的patch函数
2. 当点击change时，由于app组件的数据更新，故先会执行app组件的更新操作
3. oldVnode与vnode是sameVnode，故执行patchVnode方法，获取oldVnode与vnode的children，都是helloworld与btn，但由于两者并不相同（flag）有改变，会执行updateChildren方法
4. updateChildren之后详解（涉及了diff算法）
   - 此方法会递归调用patchVnode方法，然后一层层的比对children
5. 进入updateChildren方法后，由于第一个HelloWorld组件，又会进入patchVnode方法，此时HelloWorld是一个组件，故`isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch`为true，会执行prepatch方法
6. prepatch方法，最终执行updateChildComponent，此函数内会更新props操作，更新props会进行赋值操作，故会执行setter，进行派发更新，渲染子组件，又会执行updateComponent函数，进入patch函数
7. 此时会更改hellowold组件，oldvnode是div，vnode为ul，不是相同vnode，会创建新节点，

#### updateChildren详解(vue diff算法)

1. 开始情况，未改变数据时的vnode为oldVnode，点击change后，更新后为vnode

  | DOM      | 1           | 2    | 3    | 4    | 7    | 8    | 9    | 10        |
  | -------- | ----------- | ---- | ---- | ---- | ---- | ---- | ---- | --------- |
  |          | oldStartIdx |      |      |      |      |      |      | oldEndIdx |
  | oldVnode | 1           | 2    | 3    | 4    | 7    | 8    | 9    | 10        |
  | vnode    | 1           | 9    | 11   | 7    | 3    | 4    | 2    | 10        |
  |          | newStartIdx |      |      |      |      |      |      | newEndIdx |

1. 第一次循环，由于首首相同，尾尾相同，故只挪动号，dom不变化
	  | DOM      | 1    | 2           | 3    | 4    | 7    | 8    | 9         | 10   |
  | -------- | ---- | ----------- | ---- | ---- | ---- | ---- | --------- | ---- |
  |          |      | oldStartIdx |      |      |      |      | oldEndIdx |      |
  | oldVnode | 1    | 2           | 3    | 4    | 7    | 8    | 9         | 10   |
  | vnode    | 1    | 9           | 11   | 7    | 3    | 4    | 2         | 10   |
  |          |      | newStartIdx |      |      |      |      | newEndIdx |      |
  
1. 下一次循环，先比较`sameVnode(oldStartVnode, newEndVnode)`为true，故将新元素插入到OldEndVnode后面
	| DOM      | 1    | 3           | 4           | 7    | 8    | 9         | 2         | 10   |
  | -------- | ---- | ----------- | ----------- | ---- | ---- | --------- | --------- | ---- |
  |          |      |             | oldStartIdx |      |      |           | oldEndIdx |      |
  | oldVnode | 1    | 2           | 3           | 4    | 7    | 8         | 9         | 10   |
  | vnode    | 1    | 9           | 11          | 7    | 3    | 4         | 2         | 10   |
  |          |      | newStartIdx |             |      |      | newEndIdx |           |      |
  
1. 然后比较，`sameVnode(oldEndVnode, newStartVnode)`为true，故将新元素插入到OldStartVnode后面
		| DOM      | 1    | 9    | 3           | 4    | 7    | 8         | 2    | 10   |
  | -------- | ---- | ---- | ----------- | ---- | ---- | --------- | ---- | ---- |
  |          |      |      | oldStartIdx |      |      | oldEndIdx |      |      |
  | oldVnode | 1    | 2    | 3           | 4    | 7    | 8         | 9    | 10   |
  | vnode    | 1    | 9    | 11          | 7    | 3    | 4         | 2    | 10   |
  |          |      |      | newStartIdx |      |      | newEndIdx |      |      |
  
1. 下一次循环，发现所有比对都不是sameVnode，故newStartVnode会在old序列中查找，发现未找到，则表示11，是一个新节点，直接调用createElm在当前位置创建节点
			| DOM      | 1    | 9    | 11   | 3           | 4           | 7    | 8         | 2    | 10   |
  | -------- | ---- | ---- | ---- | ----------- | ----------- | ---- | --------- | ---- | ---- |
  |          |      |      |      | oldStartIdx |             |      | oldEndIdx |      |      |
  | oldVnode | 1    | 2    |      | 3           | 4           | 7    | 8         | 9    | 10   |
  | vnode    | 1    | 9    |      | 11          | 7           | 3    | 4         | 2    | 10   |
  |          |      |      |      |             | newStartIdx |      | newEndIdx |      |      |
  
1. 下一次循环，比对7，发现7在old序列中有值，实际是挪动位置，本质是将7插入此位置，oldVnode的7的位置设为undefined（但dom并没有被删除）
				| DOM      | 1    | 9    | 11->7 | 3           | 4    | 7           | 8         | 2    | 10   |
  | -------- | ---- | ---- | ----- | ----------- | ---- | ----------- | --------- | ---- | ---- |
  |          |      |      |       | oldStartIdx |      |             | oldEndIdx |      |      |
  | oldVnode | 1    | 2    |       | 3           | 4    | undefined   | 8         | 9    | 10   |
  | vnode    | 1    | 9    |       | 11          | 7    | 3           | 4         | 2    | 10   |
  |          |      |      |       |             |      | newStartIdx | newEndIdx |      |      |
	
1. 下次循环，发现头头相同，即3，4相同，不需要挪动dom得到
					| DOM      | 1    | 9    | 11->7 | 3    | 4    | 7           | 8         | 2           | 10   |
  | -------- | ---- | ---- | ----- | ---- | ---- | ----------- | --------- | ----------- | ---- |
  |          |      |      |       |      |      | oldStartIdx | oldEndIdx |             |      |
  | oldVnode | 1    | 2    |       | 3    | 4    | undefined   | 8         | 9           | 10   |
  | vnode    | 1    | 9    |       | 11   | 7    | 3           | 4         | 2           | 10   |
  |          |      |      |       |      |      |             | newEndIdx | newStartIdx |      |
  
1. 循环结束，发现newStartIdx>newEndIdx，故需要删除7，8这两个dom，得到最终结果：1>9>11>7>3>4>2>10

#### 流程图

![12-6-组件更新](../源码流程图/12-6-组件更新.svg)

## 编译

### 特别注意

1. 编译是先编译父级，然后再编译子，其实可以在generate打断点看出

### 编译入口

1. vue 使用createCompiler，根据不同的options可以构建不同的compier，处理不同环境问题
2. 将baseCompile编译函数传入，只处理核心编译步骤
3. 而createCompiler 是由createCompilerCreator生成的，用于处理编译相关问题，如对options进行判断显示warning
4. 而最终需要执行的函数是compileToFunctions，只用处理模板到render函数涉及的问题

#### 流程图

![13-编译-入口](../源码流程图/13-编译-入口.svg)



### parse

1. 主要是理解编译的基本逻辑，针对v-model，v-for等可以具体再看

#### 流程图

![14-编译-parse](../源码流程图/14-编译-parse.svg)

### optimize

1. 并不是所有数据都是响应式的，很多数据是首次渲染后就永远不会变化的，那么这部分数据生成的 DOM 也不会变化，可以在 patch 的过程跳过对他们的比对
2. optimize的过程可以分为两步
   - 利用markStatic函数，标记静态节点
   - 利用markStaticRoots函数，标记静态根

### generate

1. generate的过程，是通过ast树转换为字符串代码

2. 主要是通过一个例子，利用debugger方式走完一遍流程

   ```html
   <ul :class="bindCls" class="list" v-if="isShow">
       <li v-for="(item,index) in data" @click="clickItem(index)">{{item}}:{{index}}</li>
   </ul>
   ```

3. 这个例子，主要包含了v-if与v-for的代码生成



## event

1. 为了理解源码，最好要对着vue-event文档
2. 驼峰转-的正则：'/\B([A-Z])/g'
3. 注意：
   - 组件上使用原生事件，需要加 `.native` 修饰符，普通元素上使用 `.native` 修饰符无效
   - 组件添加的普通事件，回调函数会添加到子组件vm._events上
   - 分为编译阶段与运行阶段，运行阶段处理普通DOM与组件的自定义事件的逻辑是有差异的

### 流程图

1. 编译阶段

   ![15-1-event编译阶段](../源码流程图/15-1-event编译阶段.svg)

2. 运行阶段

![15-2-event运行阶段](../源码流程图/15-2-event运行阶段.svg)





## v-model

### 概述

1. parse阶段，在html-parser中，在处理end逻辑时，会调用closeElement，processElement，processAttrs

2. 走到最后一个else  ，addDirective，实际就是增加一个el.directives，将el，push到这个里面；el.plain = false

3. generate中调用genElement， genData，genDirectives

4. ```
   const gen: DirectiveFunction = state.directives[dir.name]
   ```

5. state.directives   state是CodegenState的一个实例，this.directives = extend(extend({}, baseDirectives), options.directives)   

6. options.directives  options是最开始传入的src/platforms/web/compiler/options.js

7. 实际，src/platforms/web/compiler/directives/model.js

8. 进入 genDefaultModel

9. 一种简单的方式(el.props || (el.props = [])).push(xxxx)

10. 然后返回src/compiler/codegen/index.js，继续执行genDirecitves

执行阶段

1. 还是会执行updateDOMListeners，并不是会处理data.directives

组件

1. 实际，src/platforms/web/compiler/directives/model.js

2. config.isReservedTag，在src/platforms/web/runtime/index.js中会Vue.config.isReservedTag = isReservedTag，这个函数在src/platforms/web/util/element.js

3. 注意，组件的v-model，会为添加el.model，注意genDirectives并无字符串返回

4. 之后，继续执行src/compiler/codegen/index.js的genData，执行el.model的if，会得到 {model:{value:(message),callback:function ($$v) {message=$$v},expression:"message"},  

5. 父组件最终生成的 `render` 代码

   ```
   (function anonymous() {
       with(this) {
           return _c('div', [_c('child', {
               model: {
                   value: (message),
                   callback: function ($$v) {
                       message = $$v
                   },
                   expression: "message"
               }
           }), _c('p', [_v("Message is: " + _s(message))])], 1)
       }
   })
   ```

6. createElement-》createComponent   isDef(data.model)   transformModel

7. 默认是添加了:value 与input，故需要在子组件使用value获取值，然后利用$emit



## slot

1.  parseHTML   end    closeElement  processElement 
2.  为el增加rawAttrsMap.scope或rawAttrsMap。slot-scope或el.slotTarget等
3.  genElement   genSlot



##  keep-alive

1. src/core/components/keep-alive.js。keep-alive定义
2. 首次渲染
3. c/core/vdom/patch.js     createComponent  vnode.componentInstance 为undefined，首次执行都是undefined

















# 问题汇总

1. src/core/vdom/create-element.js的_createElement何种情况会传入data和children

## 问题：为何mounted等可以访问data中定义的数据

1. 这个src/core/instance/init.js的57行，有个initState
2. 进入这个文件`src/core/instance/state.js`
3. initState，告诉我们，会依次初始化props，methods，data，computed，watch
4. 最后通过proxy，将data挂载在vm实例上

