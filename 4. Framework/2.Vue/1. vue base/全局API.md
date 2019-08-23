

# Flow

## 概述

1. Flow是一个由Facebook出品的JavaScript静态类型检查工具
2. 它与Typescript不同的是，它可以部分引入，不需要完全重构整个项目，所以对于一个已有一定规模的项目来说，迁移成本更小，也更加可行。
3. 除此之外，Flow可以提供实时增量的反馈，通过运行Flow server不需要在每次更改项目的时候完全从头运行类型检查，提高运行效率。

## vue使用flow

1. vue对ts做了支持，但依赖的库不一定支持ts，全局迁移成本大
2. 使用Flow可以在不需要重构整个Vue项目（如UI组件迁移成本）、不需要引入大量的工具链（eslint+babel）、不需要第三方库一定支持的情况下引入静态类型检查

# Vue.nextTick

## 概述

1. 在下次 DOM 更新循环结束之后执行延迟回调

2.  `$nextTick()` 返回一个 `Promise` 对象

   ```javascript
   // 修改数据
   vm.msg = 'Hello'
   // DOM 还没有更新
   Vue.nextTick(function () {
     // DOM 更新了
   })
   ```

   

## 异步更新队列

1. Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更
2. 当你设置 `vm.someData = 'new value'`，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环“tick”中更新
3. 在 Vue.js 里是数据驱动视图变化，由于 JS 执行是单线程的，在一个 tick 的过程中，它可能会多次修改数据，但 Vue.js 并不会傻到每修改一次数据就去驱动一次视图变化，它会把这些数据的修改全部 push 到一个队列里，然后内部调用 一次 nextTick 去更新视图，所以数据到 DOM 视图的变化是需要在下一个 tick 才能完成。

2.4.2 mirco实现的问题

1. 对于如下代码：

   ```html
   <div class="header" v-if="expand"> // block 1
     <i @click="expand = false, countA++">Expand is True</i> // element 1
   </div>
   <div class="expand" v-if="!expand" @click="expand = true, countB++"> // block 2
     <i>Expand is False</i> // element 2
   </div>
   ```

   - 点击The inner click event on `<i>` fires, triggering a 1st update on nextTick (microtask)
   - **The microtask is processed before the event bubbles to the outer div**. During the update, a click listener is added to the outer div.
   - Because the DOM structure is the same, both the outer div and the inner element are reused.
   - The event finally reaches outer div, triggers the listener added by the 1st update, in turn triggering a 2nd update.



