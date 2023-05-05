如果避免子组件Remount

1. 由于 React 的特点，组件改变所在父级后会产生 Remount
2. 可以使用createPortal，将 React 实例渲染到任意指定 DOM 上，可以将组件树的组件打平，但通过 createPortal 生成到嵌套的 DOM 树上
   - 潜在问题：会引入新增 dom 结构的问题
