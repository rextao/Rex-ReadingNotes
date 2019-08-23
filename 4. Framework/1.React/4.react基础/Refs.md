# Refs

## 概述

1. 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素
2. props是父组件与子组件交换的唯一方式
3. 有时你需要修改react组件实例或一个DOM元素，需要使用refs

## 何时使用

1. 管理焦点，文本选择或媒体播放；
2. 触发强制动画；
3. 集成第三方 DOM 库；

## 创建Refs

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

## 回调Refs

1. 创建refs的另一种方式

2. 主要是创建一个回调，将dom存储在react上，例如需要存储input这个dom元素

	- 通过ref的回调将element存储在this.textInput上
	- 然后可以通过this.textInput获取当前dom引用

	```jsx
	import React from 'react'
	export default class TextInput extends React.Component {
	  constructor(props) {
	    super(props);
	    this.textInput = null;
	    this.ref = element => {
	      this.textInput = element;
	    };
	    this.show = () => {
	      console.log(this.textInput)
	    };
	  }
	
	  render() {
	    return (
	      <div>
	        <input
	          type="text"
	          ref={this.ref}
	        />
	        <input
	          type="button"
	          value="Focus the text input"
	          onClick={this.show}
	        />
	      </div>
	    );
	  }
	}
	```

	



## 访问refs

1. 通过current属性，获取对节点的引用：`const node = this.myRef.current`
2. 当ref用于html属性时，如`<div ref={this.myRef} />`，current获取的是底层DOM元素
3. 当ref用于class组件时，如`<Header ref={this.textInput} />`,current获取的是组件挂载实例

## 

