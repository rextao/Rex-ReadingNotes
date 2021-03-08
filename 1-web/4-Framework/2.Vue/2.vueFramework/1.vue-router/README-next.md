# 学习

1. 顺序执行promise数组

   ```javascript
   runGuardQueue(guards)
   function runGuardQueue(guards: Lazy<any>[]): Promise<void> {
     return guards.reduce(
       (promise, guard) => promise.then(() => guard()),
       Promise.resolve()
     )
   }
   ```

2. 内部控制守卫导航的函数navigate，使用promise，比vue-router使用回调，逻辑清晰了非常多，每个then，代表一个守卫步骤

3. 通过 `app.inject/provide`方式，为每个组件注入类似 `useRoute/useRouter`的 Composition api

4. 测试

   - 单元测试： 使用jest，文件夹`__tests__`(通过`jest.config.js`配置，默认在此)，配置具体说明参见官网：https://doc.ebichu.cc/jest/docs/zh-Hans/configuration.html#content
   - e2e测试：Nightwatch.js，可以做不同浏览器的e2e测试

5. API Extractor

   - API Extractor is a TypeScript analysis tool that produces three different output types， 汇总全部d.ts到一起，生成api docs，以及api report

#差异

```javascript
import VueRouter from 'vue-router'
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
Vue.use(VueRouter)
const app = new Vue({
  router
}).$mount('#app')

```

```javascript
import VueRouter from 'vue-router'
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ], 
})

const app = Vue.createApp({})
app.use(router)
app.mount('#app')
```

​    



# 路由组件传参

1. 主要是可以将如下代码进行简化，通过props.xxxxx直接获取 router.params 值

   ```javascript
   // 旧用法
   const User = {
     template: '<div>User {{ $route.params.id }}</div>'
   }
   const routes = [{ path: '/user/:id', component: User }]
   ```

   ```javascript
   // 新用法
   const User = {
     props: ['id'],
     template: '<div>User {{ id }}</div>'
   }
   const routes = [{ path: '/user/:id', component: User, props: true }]
   ```

## 问题

1. 如何将`router.params`，作为props传入组件的？？

   - 由于vue-router，都会在最外层使用router-view

   - 当切换路由，router-view会获取新路由（由于定义了watch）下的组件，将配置的props传入组件即可

     ```javascript
     const component = h(
       ViewComponent,
       assign({}, routeProps, attrs, {
         onVnodeUnmounted,
         ref: viewRef,
       })
     )
     ```

     



# router-link

1. 由于router3，支持通过slot，自定义router-link，故不再提供渲染为a还是其他tag的props等

   ```typescript
   setup(props, { slots, attrs }) {
     const link = reactive(useLink(props))
     const { options } = inject(routerKey)!
     // 获取样式
     const elClass = computed(() => ({})
   
     return () => {
       // 将 参数，传给 slot
       const children = slots.default && slots.default(link)
       // custom 为false， slots.default 会包在 a 标签内
       return props.custom
         ? children
         : h(
           'a',
           assign(
             {
               'aria-current': link.isExactActive
               ? props.ariaCurrentValue
               : null,
               onClick: link.navigate,
               href: link.href,
             },
             attrs,
             {
               class: elClass.value,
             }
           ),
           children
         )
     }
   },
   ```

   - link组件非常简单，定义了custom，直接返回children，否则包在 a标签内
   - 通过`useLink(props)`， 获取传入给slot的参数
   - 默认情况，点击 router-link ，实际会执行`link.navigate`，即执行 `router.push`

   

## 小结

1. 通过`provide/inject`，机制利用`aap.proveide(xxxxx)`，后，在子组件利用`inject`获取需要的值

2. 由于`unref`对 ref或普通值取值进行了包装，故直接调用`unref(xxxxx)`更方便一些
3. `useLink` 定义与使用方法，即提供使用userLink，开发一个类似于router-link的组件的方式

  ```typescript
  export function useLink(props: UseLinkOptions) {
    const router = inject(routerKey)!
    const isActive = computed<boolean>(
      () =>
      activeRecordIndex.value > -1 &&
      includesParams(currentRoute.params, route.value.params)
    )
  
    function navigate(
    e: MouseEvent = {} as MouseEvent
    ): Promise<void | NavigationFailure> {
        if (guardEvent(e))
        	return router[unref(props.replace) ? 'replace' : 'push'](unref(props.to))
      return Promise.resolve()
    }
  
    return {
      isActive,
      navigate
    }
  }
  // 调用
  const link = reactive(useLink(props))
  ```



# 完整的导航解析流程

1. 根据vue-router的解析流程，理解整个源码会容易很多
2. 主要是 navigate 函数



## 导航被触发

1. 主要是手动调用push，或点击router-link，如点击router-link，会执行`link.navigate`，即执行`router.push`

   ```javascript
   function push(to: RouteLocationRaw | RouteLocation) {
     return pushWithRedirect(to)
   }
   ```

2. pushWithRedirect

   ```typescript
   function pushWithRedirect(
   to: RouteLocationRaw | RouteLocation,
    redirectedFrom?: RouteLocation
   ): Promise<NavigationFailure | void | undefined> {
     // target 可以是各种形式，通过resolve，解析为固定格式
     const targetLocation: RouteLocation = (pendingLocation = resolve(to))
     const from = currentRoute.value
     const data: HistoryState | undefined = (to as RouteLocationOptions).state
     // todo force 如何配置？？？？？
     const force: boolean | undefined = (to as RouteLocationOptions).force
     const replace = (to as RouteLocationOptions).replace === true
   
     const shouldRedirect = handleRedirectRecord(targetLocation)
   
     if (shouldRedirect) {
       // 暂略
     }
   
     const toLocation = targetLocation as RouteLocationNormalized
     // todo redirectedFrom??????
     toLocation.redirectedFrom = redirectedFrom
     let failure: NavigationFailure | void | undefined
     if (!force && isSameRouteLocation(stringifyQuery, from, targetLocation)) {
   
     }
   
     return (failure ? Promise.resolve(failure) : navigate(toLocation, from))
       .catch(e => { }).then();
   }
   ```

   - 使用`resolve`方法，解析target参数（可以使用多种方式进行跳转），主要是为了获取matched，fullPath等
   - 如果需要redirect，则 redirect
   - 如跳同一个路由，则报错，如未报错，进入navigate

## 在失活的组件里调用 `beforeRouteLeave` 守卫

1. 进入navigate后，首先从to，from，获取 leaving，updating与entering Records

   ```javascript
   const [
     leavingRecords,
     updatingRecords,
     enteringRecords,
   ] = extractChangingRecords(to, from)
   ```

2. 获取配置的`beforeRouteLeave`守卫

   ```javascript
   function navigate(){
     // 在components[beforeRouteLeave] 的支持
     guards = extractComponentsGuards(
       leavingRecords.reverse(),
       'beforeRouteLeave',
       to,
       from
     )
     // component api 配置onBeforeRouteLeave 支持
     for (const record of leavingRecords) {
       record.leaveGuards.forEach(guard => {
         guards.push(guardToPromiseFn(guard, to, from))
       })
     }
     // 目前 run  beforeRouteLeave（record.leaveGuards） => canceledNavigationCheck
     return (
       runGuardQueue(guards)
       .then()
     )
   }
   
   ```

   - runGuardQueue，顺序执行 promise
   - 值得注意的是，由于router内部是使用promise方式处理，故对于配置的守卫函数，需要使用guardToPromiseFn进行wrapper

3. 后面每个then，对应一个流程，如调用全局的 beforeEach 守卫、重用的组件里调用 beforeRouteUpdate等，处理方式也非常类似

   - 获取配置的守卫函数
   - 执行`runGuardQueue`，执行守卫函数

## 问题

1. 何时调用`history.push`改变路由
   - 在`navigate`执行守卫流程全部结束，即在`beforeResolve`后
   - 如整个过程没人任何错误，在流程第9步（导航被确认），会调用`finalizeNavigation`，执行`routerHistory.push`，进行路由跳转操作
   - 引申，项目遇到一个问题，即弱网或无网+ 异步加载组件，点击路由，地址栏并不会改变，因为，加载指定component会报错，导致vue-router实际不会再调用`routerHistory.push` 方法
2. `RouteLocationNormalized`中的matched是什么，即 `record.matched` 何用？
   - 当我们调用` router.push({name: 'abc'})`，在`pushWithRedirect`，会通过`resolve`函数，将参数转为RouteLocation
   - 由于，route的配置，可能是被children嵌套的，故通过参数，拿到匹配到的location，然后通过`matcher.resolve(matcherLocation, currentLocation)`， 拿到当前location的祖先
   - 因此，`matched`，实际是当前路由的全部祖先集合
3. 组件被复用时，会调用`updatingRecords`，那么什么情况是组件被复用？
   - 问题的关键在：updatingRecords
   - 在`extractChangingRecords` 函数中，会获取leave，enter和update的component列表
   - 如`to.matched.indexOf(from[matched[i]]) > 0`，则认为是可复用组件，即to与from的record实例相同
4. 所有的导航现在都是异步的？？？
   - 因为内部所有导航守卫都被 guardToPromiseFn 包裹，此函数是一个promise包装函数

# 问题

1. vue-router与vue-next 差异

   - vue-router使用flow做类型校验 + callback形式；调用next 是 ts + promise

2. 如何提供组件级别的`onBeforeRouteLeave`等函数，主要还是通过`inject`方式

   ```javascript
   export function onBeforeRouteUpdate(updateGuard: NavigationGuard) {
     const activeRecord: RouteRecordNormalized | undefined = inject(
       matchedRouteKey,
       {} as any
     ).value
     registerGuard(activeRecord, 'updateGuards', updateGuard)
   }
   ```

   ```javascript
   function registerGuard(
   record: RouteRecordNormalized,
    name: 'leaveGuards' | 'updateGuards',
    guard: NavigationGuard
   ) {
     const removeFromList = () => {
       record[name].delete(guard)
     }
   
     onUnmounted(removeFromList)
     onDeactivated(removeFromList)
   
     onActivated(() => {
       record[name].add(guard)
     })
     record[name].add(guard)
   }
   ```

   - 在router内部生成`record`时，会将守卫函数，绑定在`record.leaveGuards`
   
3. 路由alias是如何处理是，

   - 在`createRouterMatcher`的`addRoute`中，如配置了 alias，循环全部 alias  作为path添加到record中

     ```javascript
     for (const alias of aliases) {
       normalizedRecords.push(
         assign({}, mainNormalizedRecord, {
           components: originalRecord
           ? originalRecord.record.components
           : mainNormalizedRecord.components,
           path: alias,
           aliasOf: originalRecord
           ? originalRecord.record
           : mainNormalizedRecord,
         }) as typeof mainNormalizedRecord
       )
     }
     ```

4. redirect处理

   - 如果配置了redirect，则会调用`pushWithRedirect`，跳到 redirect 配置的地址










