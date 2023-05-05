# why

## 使用新的JS原生特性

1. 使用Proxy代替Object.defineProperty
2. Vue2在组件初始化时去遍历递归一个对象，给其中的每一个属性用Object.defineProperty设置它的getter和setter，

## 解决设计和体系架构的缺陷

### 解耦内部包

1. vue如要编译为其他非dom平台支持，需要copy整个vue项目，Vue3重写时采用了**monorepo**的设置，把原来的各个模块拆分出来
2. 给予了用户将其中的一些包单独拿出去用的能力，比如你可以把**reactivity**这个包也就是响应式系统拿出去用于需要用到响应式的场景

### 支持Typescript

1. 废弃class api，使用composition api
2. Vue2为了支持ts，一般会使用`vue-class-component`这个库（基于装饰器的）
3. 目标只是为了更好的支持ts，class api是需要基于装饰器的，但装饰器还处于stage2阶段，非常不稳定
4. 除了类型支持外，Class API并不带有任何新的优势，即写ui时很少会用到继承

# 如何优化

1. 根据vue测试，使用proxy，确实要比Object.defineProperty快一倍

## 编译优化

1. slot默认编译为函数，父子组件避免强耦合

2. vnode参数一致化，并未children带上类型，可以使runtime更快

   

### 减少bundle尺寸

1. 有些功能用户并未用到，如transition，也会被下载
2. 如要加入新的特性，vue的体积会被无限扩大
3. 解决办法： 使用tree-shaking
   - 尽可能使用es module方式 export 实现
   - 编译时，只将用的特性import

## virtual dom的性能瓶颈

1. 核心价值是一个抽象层，用于描述当前ui的样式

2. 一个组件内，还是需要循环遍历比较，如果组件内节点很多，也不一定在16ms内就能完成更新

3. react的jsx和手写render function是完全动态的，过渡的灵活性导致运行时用于优化的信息不足

   ```javascript
   function render() {
     const children = [];
     for(let i = 0; i < 5; i++) {
   		children.push(h('p', {
         class: 'text'
       }, i === 2 ? this.message : 'rex'))
     }
     return h('div', { id: 'content'}, children)
   }
   ```

   - 运行时是无法推测出`i === 2` 时，显示`this.message`
   - react的解决办法是时间分片，react承认无法将一段更新足够快，利用时间分片的方式，将更新分在不同的cpu片段

4. 但对于vue模板是一眼可以看出哪个数据是变化的

   - 因此传统dom的性能跟模板大小正相关，与动态节点数量无关
   - 如果组件模板只有少量动态节点，遍历都是性能浪费（默认的dom diff，会遍历组件内部所有dom）

5. 业界解决方案

   - svelte 没有virtual dom，走极致的编译路线，如

     ```javascript
     <h1>hell, {name}</h1>
     // 极致的编译结果
     p(changed, ctx) {
       if(changed.name) {
         set_data(t1, ctx.name)
       }
     }
     ```

   - 限制是，你只能用模板，不能使用模板更底层的东西，放弃了virtual dom和js的灵活性与表达力

   - 换来的是极致的更新性能

6. 为何不能抛弃virtual dom

   - 某些库使用render函数会灵活的多
   - 兼容2.x
   - 目标是：兼容手写render function，又能最大化利用模板静态信息的算法

7. 新的virtual dom方案

   - 主要是对模板进行切分，可以切分为内部一些静态的块，减少无畏的遍历
   - 将vdom更新性能由模板大小相关提升为与动态内容的数量相关

1. 



Why remove time slicing from vue3

1. 尤大回答：https://github.com/vuejs/rfcs/issues/89#issueco1 mment-546988615
   - DOM刷新必须是同步的，以确保最终DOM状态的一致性
   - 大量dom更新， 不管时间分割与否，应用程序仍然会感觉“简陋”
   - 根据HCI研究，除了动画，100ms以上的交互才会被用户感知， 因此只有cpu 纯消耗100ms以上，使用时间分片才有意义 
   - 为何react需要用
     - 使用的fiber架构，虚拟dom本身就很慢
     - jsx render 函数比模板静态分析更麻烦，参见[virtual dom的性能瓶颈](# virtual dom的性能瓶颈 )中的3
     - useMemo 等不正确使用，导致消耗过多组件重复渲染，消耗过多的 CPU

