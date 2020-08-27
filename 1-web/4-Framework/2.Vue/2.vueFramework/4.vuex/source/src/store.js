import applyMixin from './mixin'
import devtoolPlugin from './plugins/devtool'
import ModuleCollection from './module/module-collection'
import { forEachValue, isObject, isPromise, assert, partial } from './util'

// install时对Vue进行了赋值
let Vue // bind on install
// 1. new ModuleCollection构建modules树
export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      // 库是依赖于promise的
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `store must be called with the new operator.`)
    }

    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    // store实际是一个状态树，vuex为了避免store对象变得相当臃肿
    // 允许将store分割为多个module，每个module拥有自己的state，action等
    // store 本身可以理解为一个 root module
    // ModuleCollection来完成这棵树的构建
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()
    this._makeLocalGettersCache = Object.create(null)

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    this.strict = strict

    const state = this._modules.root.state

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    // 1. 为前面定义的变量进行赋值
    installModule(this, state, [] ,  )

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    // 1. 主要是getters与state建立一些依赖，变为响应式
    resetStoreVM(this, state)

    // apply plugins
    plugins.forEach(plugin => plugin(this))

    const useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools
    if (useDevtools) {
      devtoolPlugin(this)
    }
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `use store.replaceState() to explicit replace store state.`)
    }
  }
  // 提交一个mutation更改数据
  commit (_type, _payload, _options) {
    // check object-style commit
    // 1. 对传入参数进行调整
    const {
      type,
      payload,
      options
    } = unifyObjectStyle(_type, _payload, _options)
    // 1. 根据type获取`_mutations`对应的mutation
    const mutation = { type, payload }
    const entry = this._mutations[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown mutation type: ${type}`)
      }
      return
    }
    // this._withCommit 增加_committing标识，主要目的是当设置strict时，能判断出是内部改变state状态
    // 其实是设置  this._committing = true 然后fn调用
    // 1. 调用对应的fn函数
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })
    // 当调用subscribe函数，会往_subscribers中push函数
    // 即给插件使用的
    this._subscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .forEach(sub => sub(mutation, this.state))

    if (
      process.env.NODE_ENV !== 'production' &&
      options && options.silent
    ) {
      console.warn(
        `[vuex] mutation type: ${type}. Silent option has been removed. ` +
        'Use the filter functionality in the vue-devtools'
      )
    }
  }
  // 派发一个action
  dispatch (_type, _payload) {
    // check object-style dispatch
    // 1. 对传入参数进行调整
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload)
    // 1. 根据type获取`_actions`对应的actions
    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) { 
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }
    // subscribeAction 函数中会对 _actionSubscribers赋值
    try {
      this._actionSubscribers
        .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, this.state))
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[vuex] error in before action subscribers: `)
        console.error(e)
      }
    }
    // 此处的entry是registerAction 被wrappedActionHandler 包装的函数数组
    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return result.then(res => {
      try {
        this._actionSubscribers
          .filter(sub => sub.after)
          .forEach(sub => sub.after(action, this.state))
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[vuex] error in after action subscribers: `)
          console.error(e)
        }
      }
      return res
    })
  }
  // 订阅 store 的 mutation。handler 会在每个 mutation 完成后调用
  subscribe (fn) {
    return genericSubscribe(fn, this._subscribers)
  }

  subscribeAction (fn) {
    const subs = typeof fn === 'function' ? { before: fn } : fn
    return genericSubscribe(subs, this._actionSubscribers)
  }

  watch (getter, cb, options) {
    if (process.env.NODE_ENV !== 'production') {
      assert(typeof getter === 'function', `store.watch only accepts a function.`)
    }
    return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
  }

  replaceState (state) {
    this._withCommit(() => {
      this._vm._data.$$state = state
    })
  }
  // 动态注册module
  registerModule (path, rawModule, options = {}) {
    // patch必须是个array，且不能是0，即不能注册根module，只能扩展module
    if (typeof path === 'string') path = [path]

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
      assert(path.length > 0, 'cannot register the root module by using registerModule.')
    }
    // 动态注册module
    this._modules.register(path, rawModule)
    installModule(this, this.state, path, this._modules.get(path), options.preserveState)
    // reset store to update getters...
    resetStoreVM(this, this.state)
  }
  // 注销模块
  unregisterModule (path) {
    if (typeof path === 'string') path = [path]

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
    }
    // module-collection.js
    this._modules.unregister(path)
    this._withCommit(() => {
      const parentState = getNestedState(this.state, path.slice(0, -1))
      Vue.delete(parentState, path[path.length - 1])
    })
    // 重新注册根模块
    resetStore(this)
  }

  hotUpdate (newOptions) {
    this._modules.update(newOptions)
    resetStore(this, true)
  }

  _withCommit (fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }
}

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return () => {
    const i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  store._modulesNamespaceMap = Object.create(null)
  const state = store.state
  // init all modules
  installModule(store, state, [], store._modules.root, true)
  // reset vm
  resetStoreVM(store, state, hot)
}

function resetStoreVM (store, state, hot) {
  // 最开始，store._vm实例不存在
  const oldVm = store._vm
  // 由于是resetStore，故设置为默认值
  // bind store public getters
  // 暴露给外面使用，一般不会访问_的属性
  store.getters = {}
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null)
  // 在installModule中会对store._wrappedGetters赋值
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  // wrappedGetters,类似于vue的计算属性，派生出一些状态，便于多个组件共享
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
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

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  // 取消 Vue 所有的日志与警告。
  Vue.config.silent = true
  // 这样store._vm.$$state.state 是响应式的
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  // strict: true, 默认为false， 严格模式下，任何 mutation 处理函数以外修改 Vuex state 都会抛出错误。
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
// 1. 利用makeLocalContext构造一个本地上下文环境
// 2. 分别循环遍历mutation、action、getter绑定到`store._mutations[type]=[]`上，这个数组是fn数组
// 对于 modules: { a: moduleA, b: moduleB }
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  // 实际就是根据modules拼接，形式'a/b/c'作为key
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    // 此属性保存了module， 即 'a/': moduleA , 'b/': moduleB
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  // 非根的配置，子模块时会进入
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      if (process.env.NODE_ENV !== 'production') {
        if (moduleName in parentState) {
          console.warn(
            `[vuex] state field "${moduleName}" was overridden by a module with the same name at "${path.join('.')}"`
          )
        }
      }
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
  // 实际就是遍历 传入的mutations 调用() => {} 此函数，mutation为obj的值，然后添加到store._mutations中
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })
  // 递归安装子模块
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 * 本质就是重新定义dispatch等方法，如果具有namespace，则对传入的type进行拼接
 * 例如：dispatch('add'), 拼接后实际调用的是dispatch('a/add')
 */
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
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      // 为何是lazy，取值时，才会获取store.state 触发store的get，触发vue的watcher，去获取值
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}

function makeLocalGetters (store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    const gettersProxy = {}
    const splitPos = namespace.length
    Object.keys(store.getters).forEach(type => {
      // skip if the target getter is not match this namespace
      if (type.slice(0, splitPos) !== namespace) return

      // extract local getter type
      const localType = type.slice(splitPos)

      // Add a port to the getters proxy.
      // Define as getter property because
      // we do not want to evaluate the getters in this time.
      Object.defineProperty(gettersProxy, localType, {
        get: () => store.getters[type],
        enumerable: true
      })
    })
    store._makeLocalGettersCache[namespace] = gettersProxy
  }

  return store._makeLocalGettersCache[namespace]
}

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    // 注意：此处会对local.state进行求值
    // 会触发makeLocalContext中的 Object.defineProperties(local, { state: get})的getter
    // 即会调用 getNestedState 函数，getNestedState(store.state, path)，
    // 但先会调用store.state，触发Store的get
    // 即 path.reduce((state, key) => state[key], state)
    handler.call(store, local.state, payload)
  })
}

function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      // 注意，makeLocalContext中对getters与state进行了劫持
      getters: local.getters,
      // 而local.state 的get: () => getNestedState(store.state, path)
      // 会获取store.state，会调用store实例的get 或获取this._vm._data.$$state
      // 因此这个值是响应式的，故会进行依赖收集
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload)
    // 由于dispatch action。执行action要求返回一个promise
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
// 因为是递归watch有性能消耗，故一般不会再生产环境开启strict模式
function enableStrictMode (store) {
  // $watch( expOrFn, callback, [options] ) ,如第一个参数有return值有变化，会执行第二个参数的cb
  store._vm.$watch(function () { return this._data.$$state }, () => {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
    }
  }, { deep: true, sync: true })
}

function getNestedState (state, path) {
  return path.reduce((state, key) => state[key], state)
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)
  }

  return { type, payload, options }
}

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
