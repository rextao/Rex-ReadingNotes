# Ref

# 概述

1. 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素
2. props是父组件与子组件交换的唯一方式
3. 有时你需要修改react组件实例或一个DOM元素，需要使用refs

# 何时使用

1. 管理焦点，文本选择或媒体播放；
2. 触发强制动画；
3. 集成第三方 DOM 库；

# 创建Ref对象

1. 方式一：通过 `createRef` 去创建一个 Ref 对象，其会被保存在类组件实例上

   ```react
   class MyComponent extends React.Component {
     constructor(props) {
       this.myRef = React.createRef();
     }
   }
   ```

   - 实现：`packages/react/src/ReactCreateRef.js`，

     ```javascript
     export function createRef(): RefObject {
       const refObject = {
         current: null,
       }
     
       return refObject
     }
     ```

2. 方式二：`useRef`解决createRef无法再函数组件使用

   - 每次执行 `createRef` 得到的都是一个新的对象，无法保留其原来的引用
   - React 会将 useRef 和函数组件对应的 fiber 对象关联，将 `useRef` 创建的 ref 对象挂载到对应的 fiber 对象上

# 标签中是ref属性的处理

## 

1. 回调Ref：创建一个回调函数，获取DOM元素或组件实例

  ```jsx
  class RefDemo2 extends React.Component {
    logger = createLoggerWithScope('RefDemo2')
  
    refDemo2DOM: = null
    refDemo2Component= null
  
    render(){
      return (
        <>
        <div ref={(el) => (this.refDemo2DOM = el)}>
          ref 属性传递函数获取 DOM 元素
        </div>
  
        <Child ref={(child) => (this.refDemo2Component = child)}>
          ref 属性传递函数获取类组件实例
        </Child>
        </>
      )
    }
  }
  ```

2. 对象Ref：使用 `createRef` 或者 `useRef` 创建 Ref 对象

   ```react
   class RefDemo3 extends React.Component {
     refDemo3DOM = React.createRef()
     refDemo3Component = React.createRef()
   
     render(){
       return (
         <div ref={this.refDemo3DOM}>ref 属性传递对象获取 DOM 元素</div>
   
         <Child ref={this.refDemo3Component}>
           ref 属性传递对象获取类组件实例
         </Child>
         </>
       )
     }
   }
   ```

   



## 访问refs

1. 通过current属性，获取对节点的引用：`const node = this.myRef.current`
2. 当ref用于html属性时，如`<div ref={this.myRef} />`，current获取的是底层DOM元素
3. 当ref用于class组件时，如`<Header ref={this.textInput} />`,current获取的是组件挂载实例

## 





Ref底层原理

1.  ref 的处理逻辑就在 commit 阶段进行的









这是一段初看让人很困惑的代码：

```
function App() {
  const [dom, setDOM] = useState(null);
 
  return <div ref={setDOM}></div>;
}
```

让我们来分析下它的作用。

首先，`ref`有两种形式（曾经有3种）：

1. 形如`{current: T}`的数据结构
2. 回调函数形式，会在`ref`更新、销毁时触发

例子中的`setDOM`是`useState`的`dispatch`方法，也有两种调用形式：

1. 直接传递更新后的值，比如`setDOM(xxx)`
2. 传递更新状态的方法，比如`setDOM(oldDOM => return /* 一些处理逻辑 */)`

在例子中，虽然反常，但`ref`的第二种形式和`dispatch`的第二种形式确实是契合的。

也就是说，在例子中传递给`ref`的`setDOM`方法，会在**「div对应DOM」**更新、销毁时执行，那么`dom`状态中保存的就是**「div对应DOM」**的最新值。

这么做一定程度上实现了**「感知DOM的实时变化」**，这是单纯使用`ref`无法具有的能力











