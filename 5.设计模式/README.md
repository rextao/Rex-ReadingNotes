# 概述

## 书目

1. 2017年2月27日《JavaScript设计模式与开发实践》
	- 2019年4月9日，温习后上传github

# 单例模式

## 概述

1. 定义是： 保证一个类仅有一个实例，并提供一个访问它的全局访问点
2. 例如：点击登录按钮，弹出的登录框，应该是无论点击多少次，登录框只被创建一次

## 单例模式

1. 简单单例模式：无非是用一个变量来标志当前是否已经为某个类创建过对象。

	```javascript
	var Singleton = function(){
	    this.instance = null;
	};
	Singleton.getInstance = function(){
	    if ( !this.instance ){
	        this.instance = new Singleton();
	    }
	    return this.instance;
	};
	var a = Singleton.getInstance();
	var b = Singleton.getInstance();
	alert ( a === b ); // true
	```

2. 主要缺点：

	- 增加了不透明性，即调用者必须知道这是个单例类
	- 跟过往使用new的方式不同