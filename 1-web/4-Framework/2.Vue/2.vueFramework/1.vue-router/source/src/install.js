import View from './components/view'
import Link from './components/link'

export let _Vue
// 1、保证install只调用一次，设置install.installed = true，可以避免未使用Vue.use就去实例化vue-router
// 2、为Vue混入beforeCreate与destroyed
// 3、为Vue.prototype 绑定$router与$route，便于利用vm访问
// 4、注册View与link组件
// 5、自定义选项合并策略
export function install (Vue) {
  // 保证install只调用一次
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }
  // 每个组件都会有这两个逻辑
  Vue.mixin({
    // 初始化路由
    beforeCreate () {
      // 判断组件是否存在 router 对象，该对象一般只在根组件上有
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        // src/install.js，传入的_router是vm实例
        this._router.init(this)
        // 为 _route 属性实现双向绑定，这个是为何页面切换组件会重新渲染的关键
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 用于 router-view 层级判断
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      // 实际就是执行组件定义的registerRouteInstance函数
      // 这个函数在router-view中定义，实际就是将this保存在 matched.instances[name]中
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
  // 自定义合并策略的选项
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  // 这几个钩子函数会使用created的合并策略
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
