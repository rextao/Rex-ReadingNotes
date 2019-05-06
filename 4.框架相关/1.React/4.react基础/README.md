# 核心概念

1. 

# 生命周期

![1557129692581](README.assets/1557129692581.png)

## 调用次序

### 创建阶段

1. constructor()
2. static getDerivedStateFromProps()
3. render()
4. componentDidMount()

### 更新

1. static getDerivedStateFromProps()
2. shouldComponentUpdate()
3. render()
4. getSnapshotBeforeUpdate()
5. componentDidUpdate()

### 卸载

1. componentWillUnmount()

## getDerivedStateFromProps

1. `static getDerivedStateFromProps(nextProps, prevState)`
2. 不管原因是什么，都会在每次渲染前触发此方法
3. 返回一个对象来更新 state，如果返回 null 则不更新任何内容
4. 

## getSnapshotBeforeUpdate()

1.  `componentDidUpdate(prevProps, prevState, snapshot)`
2. 在最近一次渲染输出（提交到 DOM 节点）之前调用
3. 此生命周期的任何返回值将作为参数传递componentDidUpdate()。

## 删除render之前的钩子函数原因

1. 因为如果要开启async rendering，在render函数之前的所有函数，都有可能被执行多次。

	## 

# 事件

1. React的事件系统和浏览器事件系统相比，主要增加了两个特性：事件代理、和事件自动绑定。
2. react的onClick本身就是事件委托了，和原生JS的onclick不一样，所以你可以直接在li上面绑定

## 事件代理

1. 区别于浏览器事件处理方式，React并未将事件处理函数与对应的DOM节点直接关联，而是在顶层使用了一个全局事件监听器监听所有的事件；
2. React会在内部维护一个映射表记录事件与组件事件处理函数的对应关系；当某个事件触发时，React根据这个内部映射表将事件分派给指定的事件处理函数；当映射表中没有事件处理函数时，React不做任何操作；
3. 当一个组件安装或者卸载时，相应的事件处理函数会自动被添加到事件监听器的内部映射表中或从表中删除。



# React Fiber

## react的局限性

1. 当React决定要加载或者更新组件树时，会做很多事，比如调用各个组件的生命周期函数，计算和比对Virtual DOM，最后更新DOM树，这整个过程是同步进行的
2. 假如更新一个组件需要1毫秒，如果有200个组件要更新，就是200ms，这时更新占用着浏览器线程，用户在input输入时，会出现卡顿情况
3. 而React Fiber就是要改变现状

## Fiber的方式

1. 破解JavaScript中同步操作时间过长的方法其实很简单——分片
2. React Fiber把更新过程碎片化，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。
3. 维护每一个分片的数据结构，就是Fiber。

## 为什么叫Fiber呢？

1. 在进程（Process）和线程（Thread）的概念，还有一个概念叫做Fiber，英文含义就是“纤维”，意指比Thread更细的线，也就是比线程(Thread)控制得更精密的并发处理机制。

## Fiber对现有代码的影响

1. React Fiber一个更新过程被分为两个阶段(Phase)：第一个阶段Reconciliation Phase和第二阶段Commit Phase。
2. 在第一阶段Reconciliation Phase，React Fiber会找出需要更新哪些DOM，这个阶段是可以被打断的；但是到了第二阶段Commit Phase，那就一鼓作气把DOM更新完，绝不会被打断。