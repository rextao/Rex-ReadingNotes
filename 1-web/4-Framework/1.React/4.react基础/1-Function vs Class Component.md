# 概述

##  Function Component

1. 以 Function 的形式创建的组件

   ```javascript
   function App() {
     return (
       <div>
         <p>App</p>
       </div>
     );
   }
   ```

   - 一个返回了 JSX 或 `createElement` 的 Function 就可以当作 React 组件

## 什么是Hooks

1. Hooks 是辅助 Function Component 的工具。比如 `useState` 就是一种 Hook，它可以用来管理状态

   ```javascript
   function Counter() {
     const [count, setCount] = useState(0);
     return (
       <div>
         <p>You clicked {count} times</p>
         <button onClick={() => setCount(count + 1)}>Click me</button>
       </div>
     );
   }
   ```


# Function vs class组件

## props的问题

1. 如下是一个简单的函数组件与class组件

   ```javascript
   // 函数式组件
   function ProfilePage(props) {
     const handleClick = () => {
       // 就算父组件 reRender，这里拿到的 props 也是初始的
       setTimeout(() => {
       	alert('Followed ' + props.user);
       }, 3000);
     };
   
     return (
       <button onClick={handleClick}>Follow</button>
     );
   }
   // class组件
   class ProfilePage extends React.Component {
     handleClick = () => {
         // 如果父组件 reRender，this.props 拿到的永远是最新的。
         // 并不是 props 变了，而是 this.props 指向了新的 props，旧的 props 找不到了
       setTimeout(() => {
       	alert('Followed ' + this.props.user);
       }, 3000);
     };
   
     render() {
       return <button onClick={this.handleClick}>Follow</button>;
     }
   }
   ```

   ![Demonstration of the steps](1-Function vs Class Component.assets/bug.gif)

   - 代码：点击后，快速切换下拉框（改变props.user），理论上弹窗应该还是原始值Dan，而不是新切换的Sophie
   - 点击function，切换下拉框，显示的还是Dan，这是正确的，但class组件则显示的有问题

2. 主要问题是：在 React 中 Props 是不可变(immutable)的，所以他们永远不会改变。**然而，`this`是，而且永远是，可变(mutable)的。**

   - 在click后，我们组件重新渲染，故`this.props`将会改变。`showMessage`方法从一个“过于新”的`props`中得到了`user`
   - 这个问题可以在任何一个将数据放入类似 `this` 这样的可变对象中的UI库中重现它。

3. 解决办法：利用闭包保存第一次props结果

   ```javascript
   class ProfilePage extends React.Component {
     render() {
       // 这样的代码很蹩脚
       const props = this.props;
       const showMessage = () => {
         alert('Followed ' + props.user);
       };
       const handleClick = () => {
         setTimeout(showMessage, 3000);
       };
       return <button onClick={handleClick}>Follow</button>;
     }
   }
   ```

   - 实际是第一次render时，利用闭包先保存当前props
   - 但如果在setTimeout使用this.props还是会出现问题
   - 这种方式，实际无需使用class，直接使用函数式组件即可，因为参数props是不会根据this发生变化的

4. 通过3的解决办法，也可间接的看出react为了解决this，是将每次渲染放在闭包中的，频繁渲染会给GC带来巨大压力

## useState与useRef

1. 一个输入框，输入内容后，点击发送

   ```javascript
   function MessageThread() {
     const [message, setMessage] = useState('');
     const showMessage = () => {
       alert('You said: ' + message);
     };
     const handleSendClick = () => {
       setTimeout(showMessage, 3000);
     };
     const handleMessageChange = (e) => {
       setMessage(e.target.value);
     };
     return (
       <>
         <input value={message} onChange={handleMessageChange} />
         <button onClick={handleSendClick}>Send</button>
       </>
     );
   }
   ```

2. 发送存在延迟，这时候更改了input框内容，上述代码是拿不到最新的input值的

3. 如果希望读取到最新的input框值，需要使用useRef

   ```javascript
   function MessageThread() {
     const [message, setMessage] = useState('');
     const latestMessage = useRef('');
     const showMessage = () => {
       alert('You said: ' + latestMessage.current);
     };
     const handleSendClick = () => {
       setTimeout(showMessage, 3000);
     };
     const handleMessageChange = (e) => {
       setMessage(e.target.value);
       latestMessage.current = e.target.value;
     };
     return (
       <>
         <input value={message} onChange={handleMessageChange} />
         <button onClick={handleSendClick}>Send</button>
       </>
     );
   }
   ```

4. 但手动更新refs太麻烦了

   ```javascript
   function MessageThread() {
     const [message, setMessage] = useState('');
     // 保持追踪最新的值。
     const latestMessage = useRef('');
     useEffect(() => {
       latestMessage.current = message;
     });
     const showMessage = () => {
       alert('You said: ' + latestMessage.current);
     };
   ```

   