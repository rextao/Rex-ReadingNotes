企业级开发框架

1. 主要是基于Node额外提供了架构能力，比如 egg、midway、nest 等

# Egg

## 设计原则

1. 专注于提供 Web 开发的核心功能和一套灵活可扩展的插件机制
2. **约定优于配置**
3. Egg 的插件机制有很高的可扩展性，**一个插件只做一件事**，不直接提供功能，只是集成各种功能插件

## 与社区框架的差异

1. express
   - 优势在于约定大于配置，方便团队协作
2. koa
   - koa对于企业级应用还较为基础，在koa的模型上进行了增强



# nest

1. 是在 express 之上封装的一层，提供了很多架构的能力
   - **IOC**：自己实现了模块机制，可以导入导出 provider，实现自动依赖注入，简化了对象的创建
   - **AOP**：抽象了 Guard、Interceptor、Pipe、Exception Filter 这 4 种切面，可以通过切面抽离一些通用逻辑，然后动态添加到某个流程中
   - **任意切换底层平台**：nest 基于 ts 的 interface 实现了不和任何底层平台耦合，http 可以切换 express 和 fastify，websocket 可以切换 socket.io 和 ws。而且 4 种切面也实现了可以跨 http、websocket、微服务来复用。
2. 提供了对各种方案的集成，比如 mq、redis 的集成、比如 graphql 和 websocket、比如 jwt 等。

# Express与Koa两者区别

| 英雄    | 说明    | 对应 | 经典                            |
| ------- | ------- | ---- | ------------------------------- |
| express | web框架 | es5  | 回调嵌套                        |
| koa     | web框架 | es6  | Generator函数+yield语句+Promise |
| koa2    | web框架 | es7  | async/await+Promise             |

1. express主要基于Connect中间件，并且自身封装了路由、视图处理等功能
2. Koa基于Co中间件，本身不包括任何中间件，需要借助第三方
3. 如错误处理与异步流程控制，则是es6与es5回调的区别

## Express

1. 严格来说 express 并不是一个框架，它只是提供了基于中间件的请求响应处理流程

## Koa

1. koa 是由 Express 原班人马打造的
2. 使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率
3. koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库
4. Koa 的核心设计思路是为中间件层提供高级语法糖封装，以增强其互用性和健壮性，并使得编写中间件变得相当有趣

## 如何选择

1. 如果你想简单点，找一个框架啥都有，那么先express
2. 如果你喜欢diy，很潮，可以考虑koa，它有足够的扩展和中间件，而且自己写很简单

