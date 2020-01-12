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

  Vue.mixin({
    // 初始化路由
    beforeCreate () {
      // 判断组件是否存在 router 对象，该对象只在根组件上有
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        // 为 _route 属性实现双向绑定
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 用于 router-view 层级判断
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
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
