# 实例

## 创建一个 Vue 实例

1. 每个应用都是通过vue函数创建的实例

   ```javascript
   var vm = new Vue({
     // 选项
   })
   ```

2. 用vue-cli创建的项目，vue实例在main.js中

## 数据与方法

1. vue创建时，会将data对象的全部属性增加到vue的响应系统中

2. 因此，通过`vm.a = 'hi'`这种方式添加的属性并不是响应式的

3. 利用`Object.freeze()`可以阻止修改对象属性，故也无法被vue响应系统追踪，即

   ```javascript
   var obj = {
     foo: 'bar'
   }
   Object.freeze(obj)
   new Vue({
     el: '#app',
     data: obj//无法追踪
   })
   ```

4. vue实例属性和方法都以$为前缀，为了和用户定义的区分开

# 生命周期



# 模板语法

1. 设计初衷是用于简单运算的

## 插值

### 文本

1. ：`<span>Message: {{ msg }}</span>`

### 原始html

1. `<span v-html="rawHtml"></span>`
2. 会在span标签内嵌入rawHtml的内容
3. 容易受到xss攻击，绝不要对用户提供的内容使用插值

### 特性

1. 需要使用v-bind
2. `<div v-bind:id="dynamicId"></div>`
3. 注意：对于boolean的特殊处理
4. `<button v-bind:disabled="isButtonDisabled">Button</button>`
   - 只要`isButtonDisabled`有值，则认为是true，如`v-bind:disabled = 'false'`也会认为是true
   - 只有值为null、undefined、false时（注意不是字符串），disabled属性才不会被渲染在页面上

### 表达式

1. 模板支持js表达式
2. 不应该试图在模板表达式中访问用户定义的全局变量，但可以访问如Math，Date等



## 指令

### 概述

1. 带有v的特殊属性，除了v-for，预期值是一个js表达式
2. 职责是，当表达式值改变后，连带的影响DOM

### 参数

1. 某些指令可以接受一个参数，用冒号表示，如`v-bind:href`
2. 表示将href属性与后面的表达式进行绑定，根据后面表达式值响应式的更新href属性

### 动态参数(2.6新增)

1. `<a v-bind:[attributeName]="url"> ... </a>`
2. 即`atttributeName`会作为表达式动态求值，求值的结果会作为最终参数来使用
3. 动态参数的约束：某些字符，如空格或引号是无效的，还需要回避大写的键名
4. 复杂的动态参数可以使用计算属性来代替

### 修饰符

1. 用`.`后缀，用于指出一个指令应该以特殊方式绑定
2. `<form v-on:submit.prevent="onSubmit">...</form>`
   - 绑定submit时，触发`event.preventDefault()`

### 缩写

1. `v-bind:href`缩写为`:href`
2. `v-on:click`缩写为`@click`

### 常用指令

#### v-once

1. 节点只渲染一次
2. 随后的重新渲染，元素/组件及其所有子节点都视为静态资源跳过