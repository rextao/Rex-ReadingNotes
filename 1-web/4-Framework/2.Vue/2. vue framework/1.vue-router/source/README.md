

#路由注册

## 注意

1. 一般开源项目的入口文件都是：`src/index.js`
2. 如何看辅助函数，在test，unit，辅助函数有单元测试，可以通过单元测试查看

## 概述

1. 使用webpack 3 会默认找package.json的module字段对应的值

1. 由于vue-router与vue使用相同的打包方式，在`build/configs.js`中的genConifg，知道入口文件为src/index.js

1. Vue-router的使用方式

   ```javascript
   import Vue from 'vue'
   import VueRouter from 'vue-router'
   Vue.use(VueRouter)
   ```

# vue.use介绍

1. 定义在`src/core/global-api/use.js`
2. Vue会将注册的全部插件保存在_installedPlugins数组中
3. Vue.use利用args.unshift将Vue传入插件，这样插件内部就无需import Vue，也可以使用vue
4. 插件plugin需要提供install方法，或plugin本身就是函数
5. 实际上，Vue.use 就会调用pluin.install方法
6. 基于回调导致函数调用会较为难理解

# install

1. src/install.js
2. 主要步骤是：
   - 保证install只调用一次，设置install.installed = true，可以避免未使用Vue.use就去实例化vue-router
   - 为Vue混入beforeCreate与destroyed
   - 为Vue.prototype 绑定$router与$route，便于利用vm访问
   - 注册View与link组件
   - 自定义选项合并策略



# new VueRouter

## 概述

## 流程图





# 路由初始化
1. 在install中会对每个组件混入beforeCreate，每个组件初始化时，会调用beforeCreate钩子函数

   ```javascript
   beforeCreate () {
     // 判断组件是否存在 router 对象，该对象一般只在根组件上有
     if (isDef(this.$options.router)) {
       this._routerRoot = this
       this._router = this.$options.router
       // src/install.js，传入的_router是vm实例
       this._router.init(this)
       // 为 _route 属性实现双向绑定
       Vue.util.defineReactive(this, '_route', this._router.history.current)
     } else {
       // 用于 router-view 层级判断
       this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
     }
     registerInstance(this, this)
   },
   ```

   

1. 对于根组件，我们会传入vue-router实例router

   ```html
   new Vue({
       el: '#app',
       router,
       template: '<router-view/>'
   })
   ```

1. 因此，在执行根组件，传入参数具有router，故会执行`this.router.init(this)`函数

1. init 函数定义在`src/index.js` 中

1. init最后就是调用`history.transitionTo(history.getCurrentLocation())`函数

对于hash history，进入基类transitionTo

首先进入match 匹配路由，然后进入this.matcher.match =》 normalizeLocation =》  matchRoute  todo =》

_createRoute  =》 createRoute 就是返回一个不可更改的route对象

然后返回transitionTo 继续执行confirmTransition

confirmTransition，最后调用runQueue













## matcher 36
1. 初始化`this.matcher = createMatcher(options.routes || [], this)`
1. src/create-matcher.js ,主要就是创建很多函数
1. createRouteMap

## match函数
1. 

### 路径切换
1. 路由初始化时，会执行history.transitionTo，做一次路由切换；或push或replace方法调用
