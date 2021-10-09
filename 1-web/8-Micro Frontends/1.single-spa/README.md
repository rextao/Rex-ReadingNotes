# Single-spa

## 使用

1. 对于root项目，基本就是调用`registerApplication`, `start `两个方法



由于single-spa并未处理样式与dom隔离等问题，实现的就是监听路由变化，加载子应用，对子应用进行生命周期管理



## registerApplication

```typescript
const apps = [];
export function registerApplication(
appNameOrConfig,
 appOrLoadApp,
 activeWhen,
 customProps
) {
  // 1、对参数进行调整与必要的校验
  const registration = sanitizeArguments(
    appNameOrConfig,
    appOrLoadApp,
    activeWhen,
    customProps
  );
  // 2、判断当前注册的app里面是否有
  if (getAppNames().indexOf(registration.name) !== -1)
    throw Error();

  apps.push(
    assign(
      {
        loadErrorTime: null,
        status: NOT_LOADED,
        parcels: {},
      },
      registration
    )
  );

  if (isInBrowser) {
    // 支持jQuery
    ensureJQuerySupport();
    reroute();
  }
}
```

1. 对参数进行调整与必要的校验，registerApplication支持对象传入以及多个参数，校验对象传的key是支持的等

2. 判断登记的app是否已被注册

3. 【reroute】执行

   

### reroute

1. 路由改变，需要改变app的状态，管理app状态，需要使用src/applications/app.helpers.js定义的key	

2. 主逻辑较为简单，但是核心函数

   ```javascript
   export function reroute(pendingPromises = [], eventArguments) {
     // 1、如果appChange过程，则将app暂存在peopleWaitingOnAppChange中
     if (appChangeUnderway) {
       return new Promise((resolve, reject) => {
         peopleWaitingOnAppChange.push({
           resolve,
           reject,
           eventArguments,
         });
       });
     }
   	// 2、获取app状态列表
     const {
       appsToUnload,
       appsToUnmount,
       appsToLoad,
       appsToMount,
     } = getAppChanges();
     let appsThatChanged,
       navigationIsCanceled = false,
       oldUrl = currentUrl,
       newUrl = (currentUrl = window.location.href);
     // isStarted()  =>  started ,默认false
     if (isStarted()) {
       appChangeUnderway = true;
       appsThatChanged = appsToUnload.concat(
         appsToLoad,
         appsToUnmount,
         appsToMount
       );
       return performAppChanges();
     } else {
       appsThatChanged = appsToLoad;
       return loadApps();
     }
   }
   ```

   - 如未调用start方法，则执行`loadApps`，否则执行`performAppChanges`

### loadApps

1. 调用`registerApplication`时，由于还未调用start，故会执行loadApps方法

   ```javascript
   function loadApps() {
     return Promise.resolve().then(() => {
       const loadPromises = appsToLoad.map(toLoadPromise);
       return (
         Promise.all(loadPromises)
         .then(callAllEventListeners)
         // there are no mounted apps, before start() is called, so we always return []
         .then(() => [])
         .catch((err) => {
           callAllEventListeners();
           throw err;
         })
       );
     });
   }
   ```

2. toLoadPromise

   ```javascript
   export function toLoadPromise(app) {
     return Promise.resolve().then(() => {
       // 已加载内容会挂载在app.loadPromise上
       if (app.loadPromise) {
         return app.loadPromise;
       }
   
       if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
         return app;
       }
   
       app.status = LOADING_SOURCE_CODE;
   
       let appOpts, isUserErr;
   
       return (app.loadPromise = Promise.resolve()
         .then(() => {
           // getProps(app) 获取customProps，会包含singleSpa实例，作为参数，传给loadApp
           const loadPromise = app.loadApp(getProps(app));
           // 需要返回是支持promise
           if (!smellsLikeAPromise(loadPromise)) {
             // 省略。。。
           }
           return loadPromise.then((val) => {
             app.loadErrorTime = null;
   
             appOpts = val;
   
             let validationErrMessage, validationErrCode;
   					// 1、分别校验 val 是否为 object，并包含bootsrap，mount，unmount方法
   					// 省略。。。
   
             const type = objectType(appOpts);
   					
             // 处理存在的错误
             if (validationErrCode) { }
   
   					// 数据绑定在app对应的key上
             app.status = NOT_BOOTSTRAPPED;
             app.bootstrap = flattenFnArray(appOpts, "bootstrap");
             app.mount = flattenFnArray(appOpts, "mount");
             app.unmount = flattenFnArray(appOpts, "unmount");
             app.unload = flattenFnArray(appOpts, "unload");
             app.timeouts = ensureValidAppTimeouts(appOpts.timeouts);
   
             delete app.loadPromise;
   
             return app;
           });
         })
         .catch((err) => {
   				// 省略。。。
         	// 1. 处理错误，标记app错误状态
           return app;
         }));
     });
   }
   ```

   - 涉及到的状态标记
     - 初试将app状态标记为：LOADING_SOURCE_CODE
     - 如`registerApplication.app`，传入的function不支持promise，会标记为：SKIP_BECAUSE_BROKEN，否则其他错误为：LOAD_ERROR
     - 无任何错误，则将app标记为：NOT_BOOTSTRAPPED
   - 会判断子应用是否具有生命周期函数，如不符合会报错
   - 最后将处理好的生命周期函数，绑定在app上
   - 特别注意：只要执行此方法，如异步未加载远端js，则app.loadPromise不为null是一个promise；如果已经加载，则app.loadPromise=null，但status状态会发生改变
   
3. 至此需要register的准备工作做完了



## start

1. 使用方式

   ```javascript
   start({
     urlRerouteOnly: true, // call history.pushState() and history.replaceState() will not trigger a single-spa reroute 
   });
   ```

2. 源码

   ```javascript
   export function start(opts) {
     started = true;
     if (opts && opts.urlRerouteOnly) {
       // 实际是设置 urlRerouteOnly = opts.urlRerouteOnly;
       setUrlRerouteOnly(opts.urlRerouteOnly);
     }
     if (isInBrowser) {
       reroute();
     }
   }
   ```

   

### reroute

1. 根据之前的介绍，由于此时已经开始start，故执行`performAppChanges`
2. 当start开始后，每次路由改变，都需要判断需要挂载与卸载的app

### reroute挂载过程

```javascript
function performAppChanges() {
  return Promise.resolve().then(() => {
    // 1、首先发发一些event表明app状态改变
    window.dispatchEvent(
      new CustomEvent(
        appsThatChanged.length === 0
        ? "single-spa:before-no-app-change"
        : "single-spa:before-app-change",
        getCustomEventDetail(true)
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "single-spa:before-routing-event",
        getCustomEventDetail(true, { cancelNavigation })
      )
    );

    const loadThenMountPromises = appsToLoad.map((app) => {
      return toLoadPromise(app).then((app) =>
						tryToBootstrapAndMount(app, unmountAllPromise)
				);
    });

    const mountPromises = appsToMount
    .filter((appToMount) => appsToLoad.indexOf(appToMount) < 0)
    .map((appToMount) => {
      return tryToBootstrapAndMount(appToMount, unmountAllPromise);
    });
    return unmountAllPromise
      .catch((err) => {
      callAllEventListeners();
      throw err;
    })
      .then(() => {
      /* Now that the apps that needed to be unmounted are unmounted, their DOM navigation
           * events (like hashchange or popstate) should have been cleaned up. So it's safe
           * to let the remaining captured event listeners to handle about the DOM event.
           */
      callAllEventListeners();

      return Promise.all(loadThenMountPromises.concat(mountPromises))
        .catch((err) => {
        pendingPromises.forEach((promise) => promise.reject(err));
        throw err;
      })
        .then(finishUpAndReturn);
    });
  });
}
```





策略方面

1. 会先加载要挂载的app，但直到需要卸载的app卸载完毕，才会真正挂载新应用







问题 

1. 代码中会使用`__DEV__` ，是如何编译注入的？
2. registerApplication与start都会调用toLoadPromise，但为何只加载一次数据？？？
   - 饿。。。一直在思考是status。。实际是用app.loadPromise控制的



1. 测试简单single-spa例子
2. 加载vue2与vue3项目
   - vue3样式有问题。

