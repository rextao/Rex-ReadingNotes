# 概述

1. 高阶组件(`HOC`)是 `React` 生态系统的常用词汇，`React` 中代码复用的主要方式就是使用高阶组件。而 `Vue` 中复用代码的主要方式是使用 `mixins`
2. `Vue` 中很少提到高阶组件的概念，原因在于 `React` 和 `Vue` 的设计思想不同， `Vue` 中使用高阶组件所带来的收益相对于 `mixins` 并没有质的变化。

# React的高阶组件

1. 起初 `React` 也是使用 `mixins` 来完成代码复用的，如：

   ```
   const PureRenderMixin = require('react-addons-pure-render-mixin')
   const MyComponent = React.createClass({
     mixins: [PureRenderMixin]
   })
   ```

2. 后来 `React` 抛弃了这种方式，进而使用 `shallowCompare`：

   ```
   const shallowCompare = require('react-addons-shallow-compare')
   const Button = React.createClass({
     shouldComponentUpdate: function(nextProps, nextState) {
       return shallowCompare(this, nextProps, nextState);
     }
   })
   ```

   - 需要在组件中实现 `shouldComponentUpdate` 方法，只不过这个方法具体的工作由 `shallowCompare` 帮你完成，即浅比较。

3. 再后来 `React` 为了避免开发者在组件中总是要写这样一段同样的代码，进而推荐使用 `React.PureComponent`

4. 总之 `React` 在一步步的脱离 `mixins`，他们认为 `mixins` 在 `React` 生态系统中并不是一种好的模式，主要因为：

   - `mixins` 带来了隐式依赖
   - mixins` 与 `mixins` 之间，`mixins` 与组件之间容易导致命名冲突` 
   - mixins` 是侵入式的，它改变了原组件，所以修改 `mixins` 等于修改原组件，随着需求的增长 `mixins` 将变得复杂，导致滚雪球的复杂性。

5. 实现

   ```javascript
   function WithConsole (WrappedComponent) {
     return class extends React.Component {
       componentDidMount () {
         console.log('with console: componentDidMount')
       }
       render () {
         return <WrappedComponent {...this.props}/>
       }
     }
   }
   ```

6. 高阶函数主要特点

   - 高阶组件(`HOC`)应该是无副作用的纯函数，且不应该修改原组件
   - 高阶组件(`HOC`)不关心你传递的数据(`props`)是什么，并且被包装组件(`WrappedComponent`)不关心数据来源
   - 高阶组件(`HOC`)接收到的 `props` 应该透传给被包装组件(`WrappedComponent`)

# vue高阶函数

1. 举例：我们需要将base-component，增加一个每次挂载完成的时候都打印一句话的功能

   ```javascript
   // base-component.vue
   <template>
     <div>
       <span @click="handleClick">props: {{test}}</span>
     </div>
   </template>
   
   <script>
   export default {
     name: 'BaseComponent',
     props: {
       test: Number
     },
     methods: {
       handleClick () {
         this.$emit('customize-click')
       }
     }
   }
   </script>
   ```

2. 最常规的做法是使用mixin的方式

3. 利用高阶函数的方式

   ```javascript
   function WithConsole (WrappedComponent) {
     return {
       mounted () {
         console.log('I have already mounted')
       },
       props: WrappedComponent.props,
       render (h) {
         const slots = Object.keys(this.$slots)
           .reduce((arr, key) => arr.concat(this.$slots[key]), [])
           .map(vnode => {
             vnode.context = this._self
             return vnode
           })
   
         return h(WrappedComponent, {
           on: this.$listeners,
           props: this.$props,
           // 透传 scopedSlots
           scopedSlots: this.$scopedSlots,
           attrs: this.$attrs
         }, slots)
       }
     }
   }
   ```

   - 主要需要考虑的问题slot、prop、事件参数传递问题



# 为何vue实现高阶函数更复杂

1. react组件即函数，vue更像是高度封装的函数，高度的封装相对的就是损失一定的灵活，你需要按照一定规则才能使系统更好的运行。