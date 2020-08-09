

# 问题描述

1. webpack使用同一入口绑定context，运行的非常完美
2. 当作者需要，将独立的服务（非常非常多）独立build，但在客户端可以是视为一个整体时，如下的解决方式会有些问题
   - npm 安装各个微前端的packages，但react会在一个微前端进入另一个微前端时，页面reload
   - 可以通过引入外部依赖来解决，如`dllplugin`插件，将项目中不长改变的库，分离出来，避免每次都重新打包，影响打包速度
3. 但作者希望：想webpack内置类似的功能
   - dll方式需要在各个build直接传递context，或者说多个微应用是无法共用dll的，如果共用了，各个微应用就不是独立的





```
模块联合允许JavaScript应用程序在客户端和服务器上动态运行来自另一个包/构建的代码。

我们最接近的是外部文件或DLLPlugin，这迫使对外部文件的集中式依赖。共享代码很麻烦，单独的应用程序并不是真正独立的，并且通常共享有限数量的依赖项。而且，在单独捆绑的应用程序之间共享实际的功能代码或组件是不可行的，无效的且无利可图的。


Federated code can always load its dependencies but will attempt to use the consumers’ dependencies before downloading more payload.

术语

A host: a Webpack build that is initialized first during a page load (when the onLoad event is triggered)
A remote: another Webpack build, where part of it is being consumed by a “host”
Bidirectional-hosts: when a bundle or Webpack build can work as a host or as a remote. Either consuming other applications or being consumed by others — at runtime


问题
布局系统，想每个服务是单独编译，单独部署，那么如何将很多微应用在客户端看起来像一个
```



