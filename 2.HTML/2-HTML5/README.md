# History API

## 概述

1. 提供利用js操作浏览器历史的标准方式
2. 主要包括对之前api的标准化
3. 新增往浏览器历史添加内容、显式改变地址栏但不触发页面刷新、用户点后退按钮删除浏览历史

## 设计目标

1. 点击链接跳转新页面这种方式已经持续了20年，history API并不是要颠覆这种方式
2. 主要为了确保URL在脚本密集的Web应用程序中继续有用
3. URL是标识唯一资源的，任何人拿到这个url都会获取相同的资源
4. 但当URL改变后，浏览器会发起新的请求下载资源，新的页面可能与当前页面基本一致，下载页面的一半即可
5. 此api就是做这件事的



# MutationObserver

## 概述

1. 提供了监视对DOM树所做更改的能力

## new MutationObserver()

1. 构造函数，创建并返回一个新的观察者
2. 不会立即启动，必须调用observer()方法确定监听哪一部分的dom改变
3. `var observer = new MutationObserver(funciton callback(record,observer));`
   - record：所有dom改动的数组
   - observer：观察者对象本身

## observer()

1. 配置MutationObserver何种情况下进行监听

2. `mutationObserver.observe(target[, options])`

   ```javascript
   target：要观察的dom（Node或element）
   options:{
       // 需要检测的任何元素的username与status 的attributes变化，或默认设置attributes:true
       attributeFilter: [ "username ", "status"],
       // 如为true可以记录改动属性上一个值
       attributeOldValue: true,
       // 检测属性值变化
       attributes:true,
       // 字符数据变化
       characterData：true,
       // 字符先前值
       characterDataOldValue：true,
       // 监视节点添加或删除新子节点,如subtree是true，则包含子孙节点
       childList:true,
       // 目标节点下面的整个子树
       subtree:true                
   }
   ```

   - `childList`，`attributes`或者`characterData`中至少有一个必须为`true`，否则将抛出`TypeError`异常

## disconnect()

1. 如果被观察的元素被从DOM中移除，然后被浏览器的垃圾回收机制释放，此`MutationObserver`将同样被删除。
2. 告诉观察者停止观察变动



## 举例

```javascript
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        console.log(mutation.addedNodes)// 返回被添加的节点,或者为null.
    })
})
observer.observe(document,{
    subtree: true,
    childList: true
})
```

