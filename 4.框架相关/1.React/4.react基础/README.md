V16.7.0

# 概述

## 特点

1. 声明式：在数据改变时 React 也可以高效地更新渲染界面。
2. 组件化：无需再用模版代码，通过使用JavaScript编写的组件你可以更好地传递数据，将应用状态和DOM拆分开来。
3. 灵活：可以用在react native中

## 背景

1. 复杂或频繁的DOM操作通常是性能瓶颈产生的原因，如何进行高性能的复杂DOM操作通常是衡量一个前端开发人员技能的重要指标
2. React，利用虚拟DOM技术，只将每次更新的差异更新到浏览器上，不需要考虑两次数据之间的UI变化
3. 组件化的思考方式则是带来了UI功能模块之间的分离，mvc是从技术角度对ui实现解耦合，组件化是从功能角度

# JSX

## 概述

1. JSX就是Javascript和XML结合的一种格式，一种 JavaScript 的语法扩展

2. 在编译之后呢，JSX 其实会被转化为普通的 JavaScript 对象。

3. JSX 乍看起来可能比较像是模版语言，但事实上它完全是在 JavaScript 内部实现的。

	```jsx
	const element = <h1>hello</h1>;
	ReactDOM.render(
	    element,
	    document.getElementById("root")
	);
	```

## 使用表达式

1. 在 JSX 当中的表达式要包含在大括号里

2. 如注释、对象、数组、函数，如要在jsx中使用，都需要利用大括号

	```jsx
	const arr= [1,2,3,4,5];
	const user = {
	    name : 'rextao',
	    hello(){
	        return this.name;
	    }
	}
	const element = (
	    <div>
	        <h1>Hello,RexTao!</h1>
	        {/*这是注释*/}
	        {arr} {/*数组*/}
	        {user.hello}{/*对象方法*/}
	        {isShow ? "RexTao" : "EveryOne"}{/*三目运算符*/}
	        {user}{/*ERROR: Objects are not valid as a React child*/}
	    </div>
	);
	```

3. 对象本身不可作为花括号内容，会报错

4. if与for循环并不是js表达式，故不能用于大括号中

## JSX属性

1. 用引号定义字符串为值的属性

	```jsx
	const element = <div tabIndex="0"></div>;
	```

2. 用大括号定义js表达式为值的属性

	```jsx
	const element = <img src={user.avatarUrl} />;
	```

3. 注意：

	- 用了大括号就不要外加引号，否则jsx会把引号内容当做字符串
	- jsx更接近js而不是html，故使用驼峰标记法命名属性名称

## 防注入攻击

1. React DOM 在渲染之前默认会过滤所有传入的值。
2. 可以确保你的应用不会被注入攻击。
3. 所有的内容在渲染之前都被转换成了字符串

## jsx代表objects

1. Babel 转译器会把 JSX 转换成一个名为 `React.createElement()` 的方法调用。

2. 本质上来讲，JSX 只是为 `React.createElement(component, props, ...children)` 方法提供的语法糖

3. 下面两种代码是完全相同的

	```jsx
	// 方式1
	const element = (
	  <h1 className="greeting">
	    Hello, world!
	  </h1>
	);
	// 方式2
	const element = React.createElement(
	  'h1',
	  {className: 'greeting'},
	  'Hello, world!'
	);
	```

4. `React.createElement()` 这个方法首先会进行一些避免bug的检查，之后会返回一个类似下面例子的对象：

	```jsx
	// 注意: 以下示例是简化过的（不代表在 React 源码中是这样）
	const element = {
	  type: 'h1',
	  props: {
	    className: 'greeting',
	    children: 'Hello, world'
	  }
	};
	```

## React必须在作用域中

1. 解释为何每个模块开头需要引用`import React from 'react';`
2. 由于 JSX 编译成`React.createElement`方法的调用，所以在你的 JSX 代码中，`React`库必须也始终在作用域中。

##

# 组件

## 概述

1. 组件把UI分割成独立的、可重用的碎片，并对每一块进行孤立的思考。

2. 从概念上讲，组件类似JavaScript函数。他们接受任意输入，并返回React元素显示在屏幕上

3. 最重要的两个属性是state和props，通过这个两个属性对component进行控制，然后更新UI

	![1557381303238](README.assets/1557381303238.png)

## 函数组件（ES5方式）

1. 该函数是一个有效的React组件，它接收一个单一的“props”对象并返回了一个React元素。

	```jsx
	function hello(props) {
	    return <h1>Hello!!props.name</h1>
	}
	```

	

## 类组件（ES6方式）

### 利用es6语法

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 组件外部可用

```jsx
// welcome.js
export default class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
// main.js
import Welcome from "./componet/welcome";
class Index extends React.Component{
    render(){
        return(
            <Welcome/>
        )
    }
}
```



## 注意

1. 组件名称必须以大写字母开头。

	- React 会将小写开头的标签名认为是 HTML 原生标签

2. 组件的返回值只能有一个根元素。

	```jsx
	// 此方式是不可以的
	function Hello(props) {
	    return (
	            <h1>Hello,{props.name}!!</h1>
	            <h1>Hello,{props.name}!!</h1>
	    )
	}
	// 需要如下形式：
	function Hello(props) {
	    return (
	            <div>
	                <h1>Hello,{props.name}!!</h1>
	                <h1>Hello,{props.name}!!</h1>
	            </div>
	    )
	}
	
	```

## 条件渲染

### 根据props（函数方式）

```jsx
// 组件1
function A() {
  return <h1>hello~aaaaaaa!</h1>;
}
// 组件2
function B() {
  return <h1>hello~bbbb.</h1>;
}
// 条件渲染
function Hello(props){
    if(props.name === 'a'){
        return <A></A>
    }else{
        return <B></B>
    }
}
ReactDOM.render(
    <Hello name = 'a'></Hello>,
    document.getElementById("root")
);
```

### 根据state(ES6方式)

```jsx
// 其他与es5方式一样
class Hello extends React.Component {
    constructor(props) {    
        super(props)
        this.state = {name: 'b'};
    }
    render(){
        if(this.state.name === 'a'){
            return <A></A>
        }else{
            return <B></B>
        }
    }
}
```

### &&运算符

```jsx
const arr = [1,2];
function A() {
    return <h1>hello~aaaaaaa!</h1>;
}

ReactDOM.render(
    <div>
        {arr.length > 1 && <A/>}
    </div> 
    ,document.getElementById("root")
);
```

### 三目运算符

```jsx
ReactDOM.render(
  <div>
    {arr.length > 1 ? <A/> : <h1>oh~my god</h1>}
  </div> 
  ,document.getElementById("root")
)
```

### 综述

1. 通过props、state、&&、三目运算符都可以实现react的条件渲染

## 阻止组件渲染

1. 某些条件，可能不需要渲染，则直接return null即可；

	```jsx
	function A(props) {
	    if(!props.name){
	        return null;
	    }
	    return <h1>hello~aaaaaaa!</h1>;
	}
	```


## 受控组件

1. 表单有个input标签，通过onChange事件触发改变state中的值，然后利用state值更新input，形成一个闭环

2. react大多数时候推荐使用受控组件方式处理表单数据

   ```jsx
   class NameForm extends React.Component {
     constructor(props) {
       super(props);
       this.state = {value: ''};
   
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
     }
   
     handleChange(event) {
       this.setState({value: event.target.value});
     }
   
     handleSubmit(event) {
       alert('提交的名字: ' + this.state.value);
       event.preventDefault();
     }
   
     render() {
       return (
         <form onSubmit={this.handleSubmit}>
           <label>
             名字:
             <input type="text" value={this.state.value} onChange={this.handleChange} />
           </label>
           <input type="submit" value="提交" />
         </form>
       );
     }
   }
   ```

3. 提交数据时，直接使用this.state.value就可以获取input框中的内容

## 非受控组件

1. 使用ref从dom中获取表单数据，而不是为每个状态编写数据处理函数

   ```jsx
   class NameForm extends React.Component {
     constructor(props) {
       super(props);
       this.handleSubmit = this.handleSubmit.bind(this);
       this.input = React.createRef();
     }
   
     handleSubmit(event) {
       alert('A name was submitted: ' + this.input.current.value);
       event.preventDefault();
     }
   
     render() {
       return (
         <form onSubmit={this.handleSubmit}>
           <label>
             Name:
             <input type="text" ref={this.input} />
           </label>
           <input type="submit" value="Submit" />
         </form>
       );
     }
   }
   ```

2. 提交时，使用this.ref.current.value获取ref引用的input框内容

# props与State

## props

### 概述

1. 当React遇到的元素是用户自定义的组件，它会将JSX属性作为单个对象传递给该组件，这个对象称之为“props”。

2. 所有的React组件必须像纯函数那样使用它们的props。

3. 如果你没给 prop 赋值，它的默认值是 `true`，不建议这样写

	```jsx
	{/*两者等价*/}
	<MyTextBox autocomplete />
	<MyTextBox autocomplete={true} />
	```

	

## Context

### 概述

1. 提供了一个无需通过组件树逐层传递 props的方式
2. 主要应用场景在于很多不同层级的组件需要访问同样一些的数据
3. 需要慎重选择，会使组件的复用性变差

### 使用方式

```jsx
// 创建context，默认值是'light'，返回一个ThemeContext的Provider组件
const ThemeContext = React.createContext('light');
// 注意：value是Provider的一个属性
class App extends React.Component {
  render() {    
    // 无论多深，任何组件都能读取这个值value值。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

//<Toolbar/>组件下的某个深层组件<Too/>
class Too extends React.Component {
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  // 任何生命周期都可以使用this.context这个值
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```



# 生命周期

![1557129692581](README.assets/1557129692581.png)

## 调用次序

### 创建阶段

1. constructor()
2. static getDerivedStateFromProps()
3. render()
4. componentDidMount()

1. 

### 更新

1. static getDerivedStateFromProps()
2. shouldComponentUpdate()
3. render()
4. getSnapshotBeforeUpdate()
5. componentDidUpdate()

### 卸载

1. componentWillUnmount()
   - 主要是清除组件中使用的定时器，手动创建的DOM元素等，以避免引起内存泄漏

## 函数详解

### render

1. render是纯函数，不能在里面执行this.setState，会有改变组件状态的副作用
2. render返回React元素，但不负责实际渲染工作

### shouldComponentUpdate

1. 此方法仅作为**性能优化的方式**而存在，官方不推荐依靠此方法阻塞渲染，对于简单的应该使用pureComponent
2. 不建议进行深层比较或使用 `JSON.stringify()`，非常影响性能

#### 父组件重新render

1. 父组件重新render，但传给子组件的props值并未发生变化，子组件也会重新render

2. 可以使用shouldComponentUpdate进行优化

   ```javascript
   shouldComponentUpdate(nextProps, nextState, nextContext) {
       if(this.props.age === nextProps.age) {
           return false;
       }
       return true;
   }
   ```

   - 注意：对比的是具体某个属性值

#### 组件本身调用setState

1. 组件本身调用setState，但是无论state是否变化，都会调用render方法
2. 可以使用shouldComponentUpdate进行优化



### componentDidMount

1. 最适合获取组件数据的地方
2. 组件挂载到DOM后调用，且只会被调用一次
3. 此处获取数据直接操作DOM节点是绝对安全的

### getDerivedStateFromProps

1. `static getDerivedStateFromProps(nextProps, prevState)`
2. 不管原因是什么，都会在每次渲染前触发此方法
3. 返回一个对象来更新 state，如果返回 null 则不更新任何内容
4. 能做的操作局限在根据props和state决定新的state

### getSnapshotBeforeUpdate

1.  `componentDidUpdate(prevProps, prevState, snapshot)`
2. 在最近一次渲染输出（提交到 DOM 节点）之前调用
3. 此生命周期的任何返回值将作为参数传递componentDidUpdate()。

### 删除render之前的钩子函数原因

1. 过时的生命周期函数
	- 挂载时：componentWillMount()
	- 更新时：componentWillUpdate()，componentWillReceiveProps()
2. 因为如果要开启async rendering，在render前执行的生命周期方法做AJAX请求的话，那AJAX将被无谓地多次调用
3. 如果在componentWillMount发起ajax，无论多快也赶不上首次render

## 函数组件没有生命周期

1. es6构建组件需要继承React.Component，也就继承了react的基类，才能有render，生命周期等方法可以使用



# 事件处理

## 概述

1. React的事件系统和浏览器事件系统相比，主要增加了两个特性：事件代理、和事件自动绑定。

## 与普通DOM的区别

1. React事件绑定属性的命名采用驼峰式写法，而不是小写

2. 如果采用 JSX 的语法你需要传入一个函数作为事件处理函数，而不是一个字符串(DOM元素的写法)

	```jsx
	// 传统方式
	<button onclick="activateLasers()">
	  Activate Lasers
	</button>
	// react方式
	<button onClick={activateLasers}>
	  Activate Lasers
	</button>
	```

	

## 事件代理

1. 区别于浏览器事件处理方式，React并未将事件处理函数与对应的DOM节点直接关联，而是在顶层使用了一个全局事件监听器监听所有的事件；
2. React会在内部维护一个映射表记录事件与组件事件处理函数的对应关系；当某个事件触发时，React根据这个内部映射表将事件分派给指定的事件处理函数；当映射表中没有事件处理函数时，React不做任何操作；
3. 当一个组件安装或者卸载时，相应的事件处理函数会自动被添加到事件监听器的内部映射表中或从表中删除。

## 组件内事件

1. 组件内定义事件响应函数，控制当前组件的内容进行变化

### 代码

```jsx
class BodyIndex extends  React.Component{
    constructor(){
        super();
        this.state ={
            name : "这是content的：rextao"
        };
        this.changeUserInfo = this.changeUserInfo.bind(this);
    }
    changeUserInfo(){
        this.setState({name:"hello!rextao...hahahah"})
    }
    render(){
        return (
            <div>
                <h1>{this.state.name}</h1>
                <input type="button" value="点击" onClick={this.changeUserInfo}/>
            </div>
        )
    }
}

```



### 注意

1. jsx回调函数中是this，默认是不会绑定的，如果你忘记绑定 `this.handleClick` 并把它传入 `onClick`, 当你调用这个函数的时候 `this` 的值会是 `undefined`

2. 可以通过实验性的属性初始化语法解决，即直接使用箭头函数定义handleClick

	```jsx
	class LoggingButton extends React.Component {
	  handleClick = () => {
	    console.log('this is:', this);
	  }
	  render() {
	    return (
	      <button onClick={(e) => this.handleClick(e)}>
	        Click me
	      </button>
	    );
	  }
	}
	```

	- 此语法在Create React App 默认开启

3. 利用箭头函数，主要问题是每次渲染时，都会创建不同的回调函数，可能会造成子组件重新渲染，不推荐

	```jsx
	class LoggingButton extends React.Component {
	  handleClick() {
	    console.log('this is:', this);
	  }
	  render() {
	    return (
	      <button onClick={(e) => this.handleClick(e)}>
	        Click me
	      </button>
	    );
	  }
	}
	```


# this.props.children

1. 获取当前组件的所有子节点
2. 返回值：
	- 没有子节点：返回undefined
	- 有一个子节点：返回object
	- 多个子节点，返回array
3. 通过React.Children.map遍历子节点，不用担心this.props.children的数据类型



# 组件懒加载

1. React.lazy(), 它可以让代码分割(code splitting)更加容易



# render props

1. 是一种在不重复代码的情况下共享组件间功能的方法

2. 核心思想是，通过一个函数将class组件的state作为props传递给纯函数组件

3. 主要解决类似，如何分享一个组件状态或行为。比如一个组件获取鼠标位置，如何给另一个组件使用呢？

	```jsx
	import React from 'react';
	export default class MouseTracker extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleMouseMove = this.handleMouseMove.bind(this);
	    this.state = { x: 0, y: 0 };
	  }
	  handleMouseMove(event) {
	    this.setState({
	      x: event.clientX,
	      y: event.clientY
	    });
	  }
	  render() {
	    return (
	      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
	        <h1>移动鼠标!</h1>
	        <p>当前的鼠标位置是 ({this.state.x}, {this.state.y})</p>
	      </div>
	    );
	  }
	}
	```

	

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