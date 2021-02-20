

# 问题描述

1. webpack使用同一入口绑定context，运行的非常完美
2. 当作者需要，将独立的服务（非常非常多）独立build，但在客户端可以是视为一个整体时，如下的解决方式会有些问题
   - npm 安装各个微前端的packages，但react会在一个微前端进入另一个微前端时，页面reload
   - 可以通过引入外部依赖来解决，如`dllplugin`插件，将项目中不长改变的库，分离出来，避免每次都重新打包，影响打包速度
3. 但作者希望：想webpack内置类似的功能
   - dll方式需要在各个build直接传递context，或者说多个微应用是无法共用dll的，如果共用了，各个微应用就不是独立的
4. 通过外部文件或DLL 插件共享代码，迫使依赖集中，各个应用程序不是真正独立的
5. 术语：
   - Remote，被 Host 消费的 Webpack 构建；
   - Host，消费其他 Remote 的 Webpack 构建；





特点

1. 希望可以在运行时共用独立的bunles，类似DLL插件，但是在浏览器运行时处理，不在编译时
2. 抹平独立应用reload，并能兼容巨石项目的独立部署
3. 希望的特性
   - 希望可以直接加载从其他webpack的打包文件中加载modules或chunks
   - 不希望管理外部并担心系统间同步问题
   - 单点故障不容易出现
     - 如果出现网络故障，app可以加载与其交错的app，并加载丢失的依赖，这也解决了新旧代码部署时，有段时间页面不可用的问题
   - 希望可以像动态引入或`code-splitting`
   - 编译时有多个build，但运行时在客户端像一个文件
   - 可以独立部署，webpack可以在运行时编排他们
   - 不希望用低集成度/面向架构的如single SPA解决方案，希望是webpack可以作为提升容器，不需要加载其他app的入口，但可以加载其他app的chunks或modules
   - 理想状况下，多个build文件，多个multi的仓库可以是一个spa

### 这个特性增加的动机

1. 出于两点考虑
   - app越来越大，代码分隔如使用微前端技术并不高效，并且市面上的解决方案并不合格
   - 运行时的应用程序交错为工程提供了许多新途径

### 实现思路

1. 需要添加一个require 扩展，来支持联邦，暂时用`requireEnsure`
   - 与webpack chunk和module加载缓存配合的很好
2. output是一个unhashed js 文件，这样可以嵌入到其他app
   - 这个文件包含一个`chunk.id`与无效file 名的映射关系
3. hash 模块 ids，其中包含内容+package.json 版本+ 用于支持tree-shakencode的usedExports
   - hash可以高效的分享代码，并避免覆盖存在的模块





sokra解决思路

## remote build

1. 插件：

   ```javascript
   new ContainerPlugin({
     expose: { // 暴露给host的
       "Dashboard": "./src/DashboardComponent.js", 
       "themes/dark": "./src/DarkTheme.css"
     },
     overridable: { // 可被host覆盖的模块
       "react": "react"
     },
     name: "remoteBuildABC", // 入口名
   })
   ```

2. 可覆盖模块

   - 加载模块需要异步，因为要么加载覆盖功能提供的模块，要么加载单独捆绑包的模块
   - 可覆盖模块会在一个新类型(` voerideable module`)模块内部，即，如果a是可覆盖模块，在构建chunk graph时， 会构建一个 a-wrapper 模块， a 会作为这个模块的依赖

host build

1. 插件

   ```javascript
   new ContainerReferencePlugin({
     remotesType: "var", // 类型，不同类型的引入方式不同，如var 则是url用`script`方式引入
     remotes: ["remoteBuildABC", "remoteBuildDEF"], // remote build
     override: { // 要被远程模块覆盖的
       "react": "react"
     }
   })
   ```

   





问题

1. 不会出现跨域？？？
   - 可能是通过script，远程的module或chunk作为一个文件被引入到当前app
2. 