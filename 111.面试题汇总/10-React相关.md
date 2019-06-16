# React

## 生命周期

1. construtor，getDerivedStateFromProps，render，componentDidMount
2. getDerivedStateFromProps，shouldComponentUpdate，render，getSnapShotBeforeUpdate，componentDidUpdate
3. componentWillUnmoment

## shouldComponentUpdate优化

1. 还可以使用pureComponent
2. 父组件渲染，未向子组件更新props，会重新渲染子组件，可以利用shouldComponentUpdate(nextProps, nextState, nextContext) 
3. 组件本身调用setState，无论state有无变化，都会渲染

## 获取数据最佳地方

1. componentDidMount中
2. 组件挂载到DOM后调用，且只会被调用一次，此处访问dom是绝对安全的

## 删除的生命周期函数

1. 挂载时：componentWillMount()
2. 更新时：componentWillUpdate()，componentWillReceiveProps()
3. 因为，开启async rendering，在render之前的生命周期函数可能被多次调用

## react常见的通信方式

1. 父组件向子组件通信：使用props

2. 子组件向父组件通信

	- 父组件将一个函数作为 props 传递给子组件，子组件调用该回调函数，便可以向父组件通信

3. 非嵌套组件间通信

	- 利用公共父级的context，组件复杂不容找到，而且会增加耦合
	- 利用events包，用订阅发布模式

4. 跨级组件通信

	- 父组件向子组件的子组件通信，向更深层的子组件通信

	- 方式：层层传递props，层级过深，超过3层，需要慎重

	- 利用context

		```jsx
		const ThemeContext = React.createContext('light');
		class App extends React.Component {
		  render() {
		    return (
		      <ThemeContext.Provider value="dark">
		        <Toolbar />
		      </ThemeContext.Provider>
		    );
		  }
		}
		function Toolbar(props) {
		  return (
		    <div>
		      <ThemedButton />
		    </div>
		  );
		}
		
		class ThemedButton extends React.Component {
		  static contextType = ThemeContext;
		  render() {
		    return <Button theme={this.context} />;
		  }
		}
		```

		

## 为什么虚拟DOM比真实DOM性能好

1. 虚拟DOM有效降低大面积（真实DOM节点）的重绘与排版，因为最终与真实DOM比较差异，可以只渲染局部
2. 不同框架不一定需要虚拟DOM，关键看框架是否频繁会引发大面积的DOM操作

## React设计思想

1. 认为 UI 只是把数据通过映射关系变换成另一种形式的数据。同样的输入必会有同样的输出。这恰好就是纯函数。
2. 抽象，将复杂的UI抽象为多个隐藏内部细节，又可复用的函数。通过在函数中调用另一个函数来实现复杂的UI

## setState是同步还是异步

1. 官方文件中较精确的说法 - "**它不是保证同步的**"。
3. 是在React库控制时，异步；否则同步。
4. setState 只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。
5. 对于setState异步可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。

## 受控与非受控组件

1. 受控组件，如表单有input标签，通过onChange事件改变state值，然后利用state更新input的value
2. 非受控组件，利用ref，React.createRef()和this.ref.current来

## 对无状态组件的理解

1. 如果一个组件不需要管理 state 只是纯的展示，那么就可以定义成无状态组件
2. 直接利用函数写法，更简洁

## React.PureComponent

1. React.PureComponent 与 React.Component 很相似。两者的区别在于 React.Component 并未实现 shouldComponentUpdate()，而 React.PureComponent 中以浅层对比 prop 和 state 的方式来实现了该函数。
2. 注意：如果对象中包含复杂的数据结构，则有可能因为无法检查深层的差别，产生错误的比对结果
3. 仅当props和state较为简单时使用
4. 在深层数据结构发生变化时调用` forceUpdate()`来确保组件被正确地更新。

## 如何强制更新react

1. forceUpdate()强制让组件重新渲染

## react数据流

1. React是单向数据流，数据主要从父节点传递到子节点（通过props）。
2. 如果顶层（父级）的某个props改变了，React会重渲染所有的子节点。

## Diff算法

1. 从n^3转变为层级比较的On

## react Fiber

1. 如一个组件更新1毫秒，200个组件就是200ms，由于同步更新，会阻塞用户input
2. 更新分两个阶段，找出需要更新哪些DOM，这个阶段是可以被打断的；提交更新DOM，是一鼓作气完成的，不会被打断

## react key的作用

1. key的真实目的是为了标识在前后两次渲染中元素的对应关系，防止发生不必要的更新操作
2. 如果两个元素有不同的key，那么在前后两次渲染中就会被认为是不同的元素，会将旧的元素unmount，新的元素被mount

## 小问题

1. 何时使用class component而不是functional
	- 组件需要内部状态或生命周期时，用class
2. 为何提供React.children.map
	- props.children不一定是数组
3. 组件懒加载
   - React.lazy()
4. react事件
   - 利用的是事件代理的方式
   - 在顶层使用了一个全局事件监听器监听所有的事件
   - 会在内部维护一个映射表记录事件与组件事件处理函数的对应关系

# Redux

## 流程分析

1. 通过combineReducers组合多个reducer
2. 通过createStore(reducers)构建全局唯一是状态存储store
3. store通过dispatch(action)派发一个action
4. store会调用reducers更新状态（dispatch内部功能）

## 常用中间件

1. redux-thunk：action可以使用函数
2. redux-promise：action可以是promise对象

## React-Redux

1. 主要提供两个重要模块，Provider与connect
2. Provider主要是将store传递给react各个组件
3. `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`
4. bindActionCreators：不用手动调用dispatch