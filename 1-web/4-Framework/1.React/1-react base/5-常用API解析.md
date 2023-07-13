useMemo

1. 帮助我们 “记录” 每次渲染之间的计算值，解决需要进行大量计算，避免其他状态的渲染引起重复计算

   ```javascript
     const visibleTodos = useMemo(
       () => filterTodos(todos, tab),
       [todos, tab]
     );
   ```

   - 数组中的每个变量是否在两次渲染间值是否改变了 ，使用浅比较（===）来比较前一个值和当前值
   - 如果发生了改变，就重新执行计算的逻辑去获取一个新的值

2. 另一种解决方法

   - 可以将整个计算逻辑写在一个纯组件中，然后`export React.memo(xxxxxxComponent)`
   - 告诉 React 这个组件在给定相同输入的情况下总是会产生相同的输出 ，并且我们可以跳过没有 props 和状态改变的重渲染

3. 纯组件也会重新渲染！！！！

   ```javascript
   function App() {
     const [name, setName] = React.useState('');
     // ...创建一个全新的数组...
     const boxes = [
       { flex: boxWidth, background: 'hsl(345deg 100% 50%)' },
       { flex: 3, background: 'hsl(260deg 100% 40%)' },
       { flex: 1, background: 'hsl(50deg 100% 60%)' },
     ];
     // ...然后将数组作为 prop 传入组件!
     // Boxes 是一个React.memo组件
     return (
       <Boxes boxes={boxes} /> 
   		// name改变！！！
     );
   }
   ```

   - Boxes是React.memo包裹的组件，理论上props改变才会重新渲染，但当name改变时（boxWidth未改变），Boxes也重新渲染了。
   - 因为，name改变后，App 组件将重新渲染，会执行全部代码，并构建一个全新的boxes数组，与之前的boxes引用不同，所以Boxes组件的props传入引用不同，会导致重新渲染

4. 如果想通过**「缓存props」**的方式达到子组件性能优化的目的，需要

   - 所有传给子组件的`props`的引用都不变（比如通过`useMemo`）
   - 子组件使用`React.memo`

`useCallback`

1. 为了让我们在缓存回调函数的时候可以方便点。相当于一个语法糖



使用场景

1. 因为 React 内部是高度优化的，并且重新渲染通常并不像我们通常认为的那样慢或昂贵！如果你注意到你的 app 变得有些迟钝，你可以使用 React Profiler 来寻找慢速渲染，然后使用上述两个函数加快渲染
2. 通用自定义 hook：如return的函数可以使用useCallBack进行缓存，如果使用的较多，会提高我们app的性能
3. 内部 context providers：通常会传递一个大的对象作为 `value` 属性，可以使用useMemo，避免父组件渲染时，使用了context组件被迫重新渲染
