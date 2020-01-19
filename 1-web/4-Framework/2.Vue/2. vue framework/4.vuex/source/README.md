# 概述
1. 主要解决多组件状态共享问题
1. 把组件的共享状态抽取出来，以一个全局单例模式管理.



# 注册

## 概述

1. 首先调用`Vue.use(Vuex)`进行注册

2. 会调用vuex的install方法，定义在：`src/store.js`

3. install还是3步，判断Vue是否存在，保存Vue，调用`applyMixin(Vue)`

4. 进入src/mixin.js，Vuex对vue 1.x进行兼容，对于2.x执行Vue.mixin 混入beforeCreate钩子

5. beforeCreate执行vuexInit函数（此时并不执行，在组件初始化时调用）

   ```javascript
   function vuexInit () {
     const options = this.$options
     if (options.store) {
       this.$store = typeof options.store === 'function'
           ? options.store()
           : options.store
     } else if (options.parent && options.parent.$store) {
       this.$store = options.parent.$store
     }
   }
   ```

6. 这个beforeCreate主要功能就是为每个vm实例添加$store

## 关键

1. beforeCreate为每个vm实例添加this.$store

# new Vuex.Store

1. 在调用根组件new Vue前，需要初始化vuex的store，调用此函数传入modules等
2. 进入src/store.js
3. 通过 `new ModuleCollection(options)` 构建整个modules树
4. 调用`installModule`安装modules
   - 利用makeLocalContext构造一个本地上下文环境：
     - 主要是定义个`local: { dispatch, commit}`
     - 对local.getters与local.state的取值操作进行劫持（但不是vue响应式的）
   - 分别循环遍历mutation、action、getter绑定到`store._mutations[type]=[]`上，这个数组是fn数组
   - 递归调用`installModule`处理child
5. 调用resetStoreVM初始化 store._vm
   - 重置store.getters与store._makeLocalGettersCache
   - 循环getters，为每个key创建，保存在computed[key]中，并劫持store.getters[key]
   - `store._vm = new Vue(data,computed)`，用新的Vue实例保存state
   - 如果设置store.strict，则利用`store._vm.$watch` 监听`this._data.$$state`保证只能通过mutation操作state
   - 如oldVm存在，销毁实例



# mapState

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

## 总结

1. 就是将state数据绑定到computed上

# mapActions

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

   

## 小结

1. 要触发state变更

   ```javascript
   methods: mapActions('cart', [
     'addProductToCart'
   ]),
   ```

2. ->local.dispatch() -> 参数处理 -> store.dispatch(type, payload) -> 处理`_actionSubscribers` -> 进入registerAction的包装函数 -> 构造getters,state参数等 -> 进入local.getters 与local.state 的get劫持 -> 对于state，会获取store.state -> 调用`this._vm._data.$$state` -> 触发vue的依赖收集 -> 然后进入自己定义的actions对应的函数

## commit

1. 调用commit函数，首先进入local.commit，对namespace与参数进行处理

2. 然后调用 store.commit

   - 根据type 在`this._mutations`中获取entry
   - 然后针对entry数组，循环调用entry，实际就是进入registerMutation的包装函数wrappedMutationHandler

3. 调用 handler.call(store, local.state, payload);

4. 还是先获取local.state的值，对依赖进行更新

5. 然后进入用户定义的mutations，对state进行赋值

   ```javascript
   const mutations = {
     setCheckoutStatus (state, status) {
       state.checkoutStatus = status
     }
   }
   ```

6. 由于实际参数state传入的是local.state，故会执行state的赋值操作，触发派发更新



## 总结

1. 定义好state，以及触发state变化的mutation: {aaaa: fnc}
2. 定义触发mutation变化是`action: { add: () => commit('aaaa')}`
3. 利用mapActions把action绑定到methods上，方便vue调用



# mapGetters

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

   

# 进入页面请求数据

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



# 问题

## 如何限制只能内部更改状态

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

## action执行时，第一个参数从哪获取的

1. 在store初始化阶段会执行installModule，对这几个函数进行包装

# 插件

1. 接收 store 作为唯一参数。作用通常是用来监听每次 mutation 的变化，来做一些事情。