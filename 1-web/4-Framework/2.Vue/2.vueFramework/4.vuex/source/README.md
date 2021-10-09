# vuex

## 概述

1. 主要解决多组件状态共享问题
1. 把组件的共享状态或数据作为一个应用抽取出来，以一个全局单例模式管理
1. 那么我们也可以利用全局对象，vuex的优势
   - 数据是响应式的，如果用全局对象，数据改变，还需要手动调用方法
   - 定义了一套规则，不能直接store中的状态，方便跟踪状态

## 学习

1. store 内部`_action、_mutations`等通过namespace来保存，避免key相同
   - 利用reduce，将对象结构的数据拼接为'a/b/c'形式的key避免key相同
2. 利用`Object.defineProperties`，可以对lazy求值
3. 深拷贝函数deepCopy，利用cache函数避免拷贝过程中出现循环引用问题

## 注册

### 概述

1. 首先调用`Vue.use(Vuex)`进行注册

2. 会调用vuex的install方法，定义在：`src/store.js`

3. install还是3步，判断Vue是否存在，保存Vue，调用`applyMixin(Vue)`

   ```javascript
   export function install (_Vue) {
     if (Vue && _Vue === Vue) {
       if (process.env.NODE_ENV !== 'production') {
         console.error(
           '[vuex] already installed. Vue.use(Vuex) should be called only once.'
         )
       }
       return
     }
     Vue = _Vue
     applyMixin(Vue)
   }
   
   ```

4. 进入src/mixin.js，Vuex对vue 1.x进行兼容，对于2.x执行Vue.mixin 混入beforeCreate钩子

   ```javascript
   export default function (Vue) {
     const version = Number(Vue.version.split('.')[0])
     if (version >= 2) {
       Vue.mixin({ beforeCreate: vuexInit })
     } else {
       // 暂略，对vue1 的兼容
     }
     function vuexInit () {
       // 暂略。。
     }
   }
   
   ```

   

5. beforeCreate执行vuexInit函数（此时并不执行，在组件初始化时调用）

   ```javascript
   function vuexInit () {
     const options = this.$options
     if (options.store) {
       this.$store = typeof options.store === 'function'
           ? options.store()
           : options.store
     } else if (options.parent && options.parent.$store) {
       // 每一级只去获取父级的store，通过这种方式将new Vue传入的$store赋给每个组件vm.$store上
       this.$store = options.parent.$store
     }
   }
   ```

6. 这个beforeCreate主要功能就是为每个vm实例添加$store

### 关键

1. beforeCreate为每个vm实例添加this.$store

## new Vuex.Store

1. 在调用根组件new Vue前，需要初始化vuex的store，调用此函数传入modules等，调用方式为：

   ```javascript
   const store = new Vuex.Store({
     state,
     getters,
     actions,
     mutations
   })；
   new Vue({
     el: '#app',
     store,
     render: h => h(Counter)
   })
   ```

2. 进入src/store.js，`constructor`主要工作有

3. 通过 `new ModuleCollection(options)` 构建整个modules树

4. 调用`installModule`安装modules

5. 调用resetStoreVM初始化 store._vm

6. 遍历定义的plugins，安装插件

### new ModuleCollection

1. 构建modules树，modules的目的就是避免state仓库（书写时，全部写在一起）过于臃肿庞大

   ```javascript
   this._modules = new ModuleCollection(options)
   ```

2. `new ModuleCollection(options)`，`constructor`会调用`register`方法

   ```javascript
   constructor (rawRootModule) {
     this.register([], rawRootModule, false)
   }
   ```

3. register`方法内部

   ```javascript
   // 构建一颗状态module树
   // 第3个参数是用于，vuex提供了动态添加modules的api
   register (path, rawModule, runtime = true) {
     // 实例化module，主要是保留children，runtime等，并定义一些module的方法
     const newModule = new Module(rawModule, runtime)
     if (path.length === 0) {
       // 保留root，主要是可以通过root查到所有模块
       this.root = newModule
     } else {
       // 子模块进来后，path不再为0
       // 删除数组最后一个path.slice(0, -1)
       // parent 获得的实际是一个module
       const parent = this.get(path.slice(0, -1))
       parent.addChild(path[path.length - 1], newModule)
     }
   
     // register nested modules
     // 递归注册嵌套modules
     if (rawModule.modules) {
       forEachValue(rawModule.modules, (rawChildModule, key) => {
         this.register(path.concat(key), rawChildModule, runtime)
       })
     }
   }
   ```

4. 因此，最终返回的实例，具有root属性，可以通过`root._children[namespace].state`获取 定义的state

### installModule

1. 由于`this._modules.root`保存着全部的modules树，故安装模块时，只需传入`this._modules.root`就可以

   ```javascript
   const state = this._modules.root.state
   installModule(this, state, [], this._modules.root)
   ```

2. 如配置了`namespaced`，则保存在`store._modulesNamespaceMap`，方便通过 namespace 找到module

   ```javascript
   function installModule (store, rootState, path, module, hot) {
     const isRoot = !path.length
     // 实际就是根据modules拼接，形式'a/b/c'作为key
     const namespace = store._modules.getNamespace(path)
     if (module.namespaced) {
       // 此属性保存了module， 即 'a/': moduleA , 'b/': moduleB
       store._modulesNamespaceMap[namespace] = module
     }
     // 非根的配置，子模块时会进入
     if (!isRoot && !hot) {
       const parentState = getNestedState(rootState, path.slice(0, -1))
       // namespace的key
       const moduleName = path[path.length - 1]
       store._withCommit(() => {
         // 建立state的父子关系，使用Vue.set主要是新增加的属性，保证state是响应式的
         Vue.set(parentState, moduleName, module.state)
       })
     }
     // 构造了一个本地上下文环境
     // 主要作用：实际_actions存储的是'a/increment'类似这样的key，但实际书写代码时，
     // 在commit时，并不是书写commit('a/increment')，而是commit('increment')
     // 代码通过makeLocalContext来找到对应模块下的action
     // 实际就是重新定义了dispatch等方法
     const local = module.context = makeLocalContext(store, namespace, path)
     // 注册mutations，getters，actions以及子组件
     // 实际就是遍历 传入的mutations 调用() => {} 此函数，mutation为obj的值，然后添加到store._mutations, store._actions中
     module.forEachMutation((mutation, key) => { })
     module.forEachAction((action, key) => {})
     module.forEachGetter((getter, key) => {})
     // 递归安装子模块
     module.forEachChild((child, key) => {
       installModule(store, rootState, path.concat(key), child, hot)
     })
   }
   ```

3. `Vue.set(parentState, moduleName, module.state)`

   - 可以理解为，构建` this._modules.root.state`树
   - 构建好后，可以直接通过` this._modules.root.state[namespace].xxxx`获取对应的state数据
   - 根据vue4.0实现，以及state lazy取值，感觉此处根本无需数据响应式；本身数据就是挂在root上的对象

4. 利用makeLocalContext构造一个本地上下文环境：

   - 主要是定义个`local: { dispatch, commit}`

   - 对`local.getters`与`local.state`的取值操作进行劫持，state可能定义很多，像actions，生成map，会浪费很多性能，直接每次访问值时，再从`store.state`树中获取

   - 本质就是重新定义dispatch等方法，如果具有namespace，则对传入的type进行拼接。例如：dispatch('add'), 拼接后实际调用的是dispatch('a/add')

     ```javascript
     function  makeLocalContext (store, namespace, path) {
       const noNamespace = namespace === ''
       // 1. 重新定义dispatch与commit函数，用于兼容noNameSpace为false情况
       // 2. 都是对于noNamespace:false，
       //    - 先将输入参数通过unifyObjectStyle转为统一的obj形式
       //    - 判断type是否存在
       //    - 最后调用store的基本方法，store.dispatch 与store.commit
       const local = {
         // 如果存在namespace，则直接使用
         dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
           // 1. 规范参数，把参数转为对象形式
           const args = unifyObjectStyle(_type, _payload, _options)
           const { payload, options } = args
           let { type } = args
           // 1. 判断是否能找到action
           if (!options || !options.root) {
             type = namespace + type
             if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
               console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
               return
             }
           }
           return store.dispatch(type, payload)
         },
     
         commit: noNamespace ? store.commit : (_type, _payload, _options) => {
           // ....省略, 与dispatch类似
           store.commit(type, payload, options)
         }
       }
       Object.defineProperties(local, {
         getters: {
           get: noNamespace
             ? () => store.getters
             : () => makeLocalGetters(store, namespace)
         },
         state: {
           get: () => getNestedState(store.state, path)
         }
       })
       return local
     }
     ```

     - 具体为何需要`localContext`参见：[为何要localContext](#为何要localContext)

5. 分别循环遍历mutation、action、getter绑定到`store._mutations[type]=[]`上，这个数组是fn（fn为包装函数）数组

6. 递归调用`installModule`处理child module

7. vuex4.0 其实实现方式与此类似

### resetStoreVM

1. 上述过程，state树实际是挂载在`this._modules.root.state`中的

2. 主要工作
   - 利用vue的computed，构建vm，将数据绑定在`store._vm`上

     ```javascript
     store._vm = new Vue({
       data: {
         $$state: state
       },
       computed
     })
     ```

   - 

3. 主要流程
   - 重置store.getters与store._makeLocalGettersCache

   - 循环getters，为每个key创建，保存在computed[key]中，并劫持store.getters[key]

     ```javascript
     forEachValue(wrappedGetters, (fn, key) => {
       // partial (fn, arg) {
       //   return function () {
       //     return fn(arg)
       //   }
       // }
       computed[key] = partial(fn, store)
       // 对store.getters.key进行劫持，会访问store._vm[key]
       Object.defineProperty(store.getters, key, {
         get: () => store._vm[key],
         enumerable: true // for local getters
       })
     })
     ```

   - `store._vm = new Vue(data,computed)`，用新的Vue实例保存state

     ```javascript
     store._vm = new Vue({
       data: {
         $$state: state
       },
       computed
     })
     ```

   - 如果设置store.strict，则利用`store._vm.$watch` 监听`this._data.$$state`保证只能通过mutation操作state

   - 如oldVm存在，销毁实例

     ```javascript
     if (oldVm) {
       if (hot) {
         store._withCommit(() => {
           oldVm._data.$$state = null
         })
       }
       Vue.nextTick(() => oldVm.$destroy())
     }
     ```

## 数据访问方法

1. 由于store就是数据仓库，故可以通过store来访问数据
2. 类似
   - `store.state.count`
   - `store.state.a.count` ：a模块的count值
   - `store.getters['a/computedCount']`：a模块的getters

## 数据修改基本方法

### commit

1. 主要是方式是定义mutation，然后利用`store.commit('increment')`
2. 调用commit函数，首先进入local.commit，对namespace与参数进行处理
1. 然后调用 store.commit方法内部

   - 对传入参数进行调整
   - 根据type 在`this._mutations`中获取对应的mutation
   - 然后针对entry数组，循环调用entry，实际就是进入registerMutation的包装函数wrappedMutationHandler
2. 调用 handler.call(store, local.state, payload);
3. 还是先获取local.state的值，对依赖进行更新
4. 然后进入用户定义的mutations，对state进行赋值

   ```javascript
   const mutations = {
     setCheckoutStatus (state, status) {
       state.checkoutStatus = status
     }
   }
   ```

5. 由于实际参数state传入的是local.state，故会执行state的赋值操作，触发派发更新



### dispatch

1. 主要是派发actions，actions可以执行异步操作，但action本质函数要提交一个commit
2. 因此，修改数据的入口只有提交一个commit
3. dispatch方法内部
   - 对传入参数进行调整
   - 根据type获取`_actions`对应的actions
   - 处理`_actionSubscribers`
   - 构造返回的result结果，如果actions[type]长度大于1，则用promise.all等待结果，否则直接执行actions（会将非promise的值，转换为promise返回）

### 小结

1. vuex并不是必须依托组件，脱离组件也是可以运行的
2. 提供了一套数据仓库，数据存储的办法
3. 但vuex通过beforeCreate钩子函数，将`$store`添加到每个组件上，故可以通过`$Store`获取store对象

## 辅助函数（语法糖）

1. 相当于vuex又做了一层封装，将$store的调用抹平
2. 直接使用辅助函数，而无需调用$store
3. 同时帮我们处理了namespace情况

### mapState

1. 直接获取store存储的值

   ```javascript
   computed: {
     ...mapState({
         products: state => state.products.all
       }),
   },
   ```

2. mapState这个辅助函数，就是循环对象，对于每一个val进行函数包装（处理namespace），返回：

   ```javascript
   res[key] = typeof val === 'function'
   			? val.call(this, state, getters)
   			: state[val]
   ```

3. 实际当res的函数执行完，得到：

   ```javascript
   res[key] = state.products.all
   ```

4. 其实使用mapState，就等价于下面的简写

   ```javascript
   computed: {
     products() {
       return this.$store.state.products.all;
     }
   },
   ```

5. 就是将state数据绑定到computed上

6. 注意：对于具有namespace的会通过getModuleByNamespace找到对应的module，即获取module.context上的state和getters

### mapActions

1. 触发store数据变化

   ```javascript
   methods: mapActions('cart', [
     'addProductToCart'
   ]),
   ```

2. **注意：**此函数就是将组件的 methods 映射为 `store.dispatch` 调用，对于上面函数会转为

   ```javascript
   methods: {
     addProductToCart: mappedAction(...args){ 
       // xxxxx 对namespace进行处理
       return dispatch.apply()
     }
   },
   ```

3. 注意在store的constructor阶段，会调用installModule内部会makeLocalContext调用创建一个本地上下文，因此调用dispatch时，先进入此local对象的dispatch函数，然后进入store.dispatch函数

4. `Store.prototype.dispatch`执行逻辑

   - 找到对应的action的entry函数，由于installModule会调用registerAction，将一个包裹函数push到entry中，这个包装函数，会在第一个参数传入dispatch,commit,getters等，payload作为第二个参数

5. 因此，实际dispatch，就是类似这样的函数：

   ```javascript
   const actions = {
     addProductToCart ({ state, commit }, product) {
       commit('setCheckoutStatus', null)
     }
   }
   ```

   

#### 小结

1. 要触发state变更

   ```javascript
   methods: mapActions('cart', [
     'addProductToCart'
   ]),
   ```

2. ->local.dispatch() -> 参数处理 -> store.dispatch(type, payload) -> 处理`_actionSubscribers` -> 进入registerAction的包装函数 -> 构造getters,state参数等 -> 进入local.getters 与local.state 的get劫持 -> 对于state，会获取store.state -> 调用`this._vm._data.$$state` -> 触发vue的依赖收集 -> 然后进入自己定义的actions对应的函数


#### 总结

1. 定义好state，以及触发state变化的mutation: {aaaa: fnc}
2. 定义触发mutation变化是`action: { add: () => commit('aaaa')}`
3. 利用mapActions把action绑定到methods上，方便vue调用



### mapGetters

1. 可以理解为是需要共享的computed

2. 定义好一个getter

   ```javascript
   const getters = {
     productsGet(state) {
       return {
         len: state.all.length,
         test: '1h'
       };
     }
   }
   ```

3. 可以通过mapGetters，可绑定到任何组件的computed上

   ```javascript
   computed: {
       ...mapGetters('products', {
       	productsGet: 'productsGet',
    	 })
   },
   ```

   

## 动态注册module

1. 主要使用registerModule方法
   - 使用register登记新模块
   - 然后利用installModule重新安装module
   - 再调用resetStoreVM重新设置getters与store响应式

## 插件

1. 接收 store 作为唯一参数。作用通常是用来监听每次 mutation 的变化，来做一些事情。
2. 在new Store的constructor最后阶段，如果传入了plugins，会调用plugin函数
3. 根据createLogger插件原理，其实可以利用subscribeAction订阅dispatch

### createLogger插件

1. 拷贝state对象
2. `store.subscribe(() => {}) `一个函数

### subscribe

1. 内部会调用`genericSubscribe(fn, this._subscribers)`函数
2. 实际就是将fn添加到`this._subscribers`中
3. 而`this._subscribers`何时会被执行呢？
   - 在commit一个mutation时，会执行里面的函数
   - 此时调用`this._subscribers`会拿到新的state

## 使用小结

1. 在created阶段可以派发一个action获取数据，并保存在state中

   ```javascript
   created () {
     this.$store.dispatch('products/getAllProducts')
   }
   ```

2. products的action

   ```javascript
   const actions = {
     getAllProducts ({ commit }) {
       	// fetch请求服务器
       	fetch('/aaa', () => {
           // 有返回数据，则调用mutation
         	commit('setProducts', products)
         })
     }
   }
   ```

3. mutations实际是设置state状态

   ```javascript
   const mutations = {
     setProducts (state, products) {
       state.all = products
     },
   }
   ```





## 问题

### 如何限制只能内部更改状态

1. 当设置strict:true时，不允许通过`this.$store.state.count`更改状态

2. 主要是：vuex内部每次更改状态会利用`this._withCommit`进行包裹，先设置`_committing`值，然后才执行fn

3. 而每次更改state时，会调用enableStrictMode中定义的$watch，如果发现此时store._committing为false，则说明不是内部调用

4. 因此，在严格模式下，如下这么搞是可以赋值的（但不要这么搞）

   ```javascript
   add() {
     this.$store._committing = true;
     this.$store.state.count = this.$store.state.count+ 1;
   }
   ```

### action执行时，第一个参数从哪获取的

1. 在store初始化阶段会执行installModule，对这几个函数进行包装传入的








### 缺点

1. 内部使用new Vue保存getters与state建立依赖关系
2. 所有state，mutation等全部保存在state中，但并不是全部数据使用，造成性能浪费
3. 书写麻烦





# Vuex4.0

1. 适配对vue3，目前vuex4.0，并不像 vue-router next ，并没有用ts完全重构，还是用class模式，只是做了一些vue3的适配
2. 所以，大部分方法与逻辑与之前vuex很类似

与vuex的差异

1. vuex使用`new Vuex.store({})`，4.0使用函数方式`createStore`
   - vuex各个组件使用mixin的方式绑定state；4.0则使用`provide/inject`方式

学习

1. 使用vue3 app 的`inject/provide ` 方法，实现类型之前mixin的功能，为每个组件注入相同实例

2. 直接通过resolve配置，让example的`import xxxx from 'vuex'`，直接指向当前目录

   ```javascript
   resolve: {
     alias: {
       vuex: path.resolve(__dirname, '../src/index.js')
     }
   },
   ```

   - 注意启用sourcemap，否则断点代码会是webpack编译后的

3. 循环 obj 的 key，可以使用工具函数`forEachValue`

   ```javascript
   export function forEachValue (obj, fn) {
     Object.keys(obj).forEach(key => fn(obj[key], key))
   }
   ```

   

注册

1. 使用方式为：

   ```javascript
   const store = createStore({
     namespaced: true, // 是否有命名空间
     state,
     getters,
     actions,
     mutations
   })
   
   app.use(store)
   ```

2. 为了适配vue3的函数方式...简直顶呱呱。。

   ```javascript
   export function createStore (options) {
     return new Store(options)
   }
   ```

3. install 方式

   ```javascript
   install (app, injectKey) {
     app.provide(injectKey || storeKey, this)
     app.config.globalProperties.$store = this
   }
   ```

4. 使用方式，一般使用 vuex提供的useStore方法

   ```javascript
   import { useStore } from 'vuex'
   export default {
     setup () {
       const store = useStore()
       return {
         count: computed(() => {
           return store.state.test.count
         }),
       }
     }
   }
   ```

5. `useStore`实现方式

   ```javascript
   export function useStore (key = null) {
     return inject(key !== null ? key : storeKey)
   }
   ```





State 转换为树结构

```javascript
this._modules = new ModuleCollection(options)
```

1. vuex是使用逻辑是，多个`state + namespace ` 或称为 module => 组合为 modules
2. `ModuleCollection`用于处理多个module的关系以及namespace
3. `Module`用于存储每个state的具体信息

installModule

1. 树结构查找 module会非常耗时，最快的方式是map，因此递归生成`store._modulesNamespaceMap`

   ```javascript
   const namespace = store._modules.getNamespace(path)
   if (module.namespaced) {
     store._modulesNamespaceMap[namespace] = module
   }
   ```

2. 将mutation，actions，getter，注册到store上，如下mutation会转为：

   ```javascript
   const mutations = {
     increment (state) {},
     decrement (state) {}
   }
   store._mutations = {
     test/decrement: [f]
     test/increment: [f]
   }
   ```

3. 而state，则被组装改为 namespace.state，直接挂在到store上，当调用时`store.test`，再从树中查找









1. 找到 test下定义的action => 根据action 的commit找到对应的mutation => 改变定义的state

2. `store._actions` 可以key 可以找到。对应的action，如

   ```javascript
   const actions = {
     increment: ({ commit }) => commit('increment'),
   }
   ```

   - 因此，对于actions的commit函数，需要处理namespace

3. 那么通常做法是，我们的commit函数为：

   ```javascript
   const mutations = {
     increment (state) {
       state.count++
     },
   }
   // 
   function commit(key: string) {
     //.....根据key，拼接 namespace
     const mutation = state._mutations[key];// 获取mutation，如上
     // 执行mutation
     
   }
   ```

   

## 问题

### 为何要localContext

1. 首先，我们看下vuex 定义与调用方式

   ```javascript
   const mutations = {
     increment (state) {
       state.count++
     },
   }
   const actions = {
     increment: ({ commit }) => commit('increment'),
   }
   // 实际调用，假设有namespace
   store.dispatch('test/increment')
   ```

2. 根据上述介绍，`store._actions,store._mutations,store.state`分别存储了数据

3. vuex实际是定义了调用的一个顺序`dispatch =>  actions => mutations => state 改变`

4. dispatch `简单实现，actions， mutation的配置都是函数，肯定需要使用wrapper函数对齐保证，否则入参没法传入

   ```javascript
   function dispatch(key) {
     const mutations = {
       'test/increment': wrapperMutation(state => {
         state.count++;
       }),
     };
     const context = {
       state: '',
       commit: str => {
         const mutation = mutations[str];
       },
     };
     const wrapperMutation = fn => {
       return fn(context);
     };
     const wrapperAction = fn => {
       return fn(context);
     };
     const actions = {
       'test/increment': wrapperAction(({ commit }) => {
         commit('increment');
       }),
     };
     const action = actions[key];
     action();
   }
   ```

5. 实际，这个context对象是为了满足`mutations、actions等`调用方便

如何保证新的state，不被手动赋值

1. vuex采用watch方法来处理，只要新对象有改变，则直接抛出错误

   ```javascript
   store._state = reactive({
     data: state
   })
   
   // enable strict mode for new state
   if (store.strict) {
     enableStrictMode(store)
   }
   // enableStrictMode
   function enableStrictMode (store) {
     watch(() => store._state.data, () => {
       if (__DEV__) {
         assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
       }
     }, { deep: true, flush: 'sync' })
   }
   ```

如何实现计算属性功能的getters

1. getters通用定义是，重要是属性是

   ```javascript
   const getters = {
     evenOrOdd: state => {
       return state.count % 2 === 0 ? 'even' : 'odd'
     }
   }
   ```

2. 常用的调用方式为：

   ```javascript
   export default {
     setup () {
       const store = useStore()
       return {
         evenOrOdd: computed(() => store.getters['test/evenOrOdd']),
       }
     }
   }
   ```

   - 如果state不改变，多次调用evenOrOdd，应该返回缓存结果，state改变，会重新计算，`store.getters['test/evenOrOdd'])`会返回新结果

3. 思考方式，state改变是如何触发 getters重新计算的；那么换个角度，是否可以为，每次调用时，重新计算下

   ```javascript
   function resetStoreState (store, state, hot) {
     store.getters = {}
     store._makeLocalGettersCache = Object.create(null
     const wrappedGetters = store._wrappedGetters
     const computedObj = {}
     forEachValue(wrappedGetters, (fn, key) => {
       computedObj[key] = partial(fn, store)
       Object.defineProperty(store.getters, key, {
         get: () => computedObj[key](),
         enumerable: true // for local getters
       })
     })
   }
   ```

   - 目前实现方式是无法缓存数据的，因为vue3的computed，在组件destroy后，会销毁监听，无法多组件共用，需要等vue3 fixed

