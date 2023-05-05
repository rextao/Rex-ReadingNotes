> 

## Function Reactive Programming（FRP）

主要思想：Everything is a stream

主要库：RxJs（基于可观测数据流在异步编程应用中的库） / Bacon.js

主要目标： 开发事件驱动软件



what

1. 响应式编程是用异步数据流编程
2. Event bus和点击事件是典型的异步事件流
3. 依托这个概念，你可以创建任意内容（变量、用户输入、缓存、数据结构等）的数据流，监听数据流响应一些事情
4. 使用函数式的工具函数组合、过滤、创建数据流

why

1. 可以更多的关注业务逻辑之上相互依赖的事件
2. 主要是为了解决现代app，各种各样的实时事件以及用户高度的互动体验（如team文档类似的项目）







# RxJS 



1. **复杂的数据来源，异步多的**情况下才能更好凸显 RxJS 作用
   - 需要处理多个异步计算（通常可能需要用状态机解决）
   - 每个异步计算都要处理success与failure时
   - 使用正常的控制流理解很复杂很难维护时
2. RxJS Marbles（https://rxmarbles.com/#from）方便理解RxJS操作
3. 将promise，callback，DOM输入，web workers， web Sockets都统一到Observable上

























问题

1. 为何用，解决的什么问题？？？
