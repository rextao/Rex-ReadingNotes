# vue-router

##概述

1. 

## 概述

1. Vue.use，实际就是如`plugin.install`是函数，则调用，如`plugin`是函数，则调用，并将实例保存，避免多次调用
2. 由于`VueRouter.install = install` 故先执行install函数
3. 安装完，会调用new Router对vue-router进行实例化

## 实例化

1. createMatcher 创建路由对象



# 概述

## 路由注册
1. 使用webpack 3 会默认找package.json的module字段对应的值
1. src/install.js
1. 编写插件，需要提供一个install方法

## 路由初始化
1. install中会对每个组件混入beforeCreate，当组件具有this.$options.router时，会执行`this._router.init(this)`
1. 然后执行history.transitionTo做路由过渡

## matcher 36
1. 初始化`this.matcher = createMatcher(options.routes || [], this)`
1. src/create-matcher.js ,主要就是创建很多函数
1. createRouteMap

## match函数
1. 如何看辅助函数，在test，unit，辅助函数有单元测试

### 路径切换
1. 路由初始化时，会执行history.transitionTo，做一次路由切换；或push或replace方法调用
