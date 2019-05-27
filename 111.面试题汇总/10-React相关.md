# React

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

1. 虽然`setState`并非使用了`setTimeout`或promise的那种进入到事件回圈(Event loop)的异步执行，但它的执行行为在React库中时，的确是异步的，也就是有延时执行的行为。
2. 官方文件中较精确的说法 - "**它不是保证同步的**"。
3. 是在React库控制时，异步；否则同步。

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

# Redux

1. 多个组件之间如何拆分各自的state
	- 一个全局的 reducer , 页面级别的 reducer , 然后redux 里有个 combineReducers 把所有的 reducer 合在一起
2. Redux数据流的流程
	- view => action/dispatch => store(reducer) => view
3. redux请求如何处理并发
	-  promise.all

## 适用情况

1. 多交互、多数据源。
2. 不同身份的用户有不同的使用方式（比如普通用户和管理员）
3. 从组件层面
	- 某个状态需要在任何地方都可以拿到
	- 某个组件的状态，需要共享
	- 一个组件需要改变全局状态