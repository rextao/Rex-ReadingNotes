# BOM
## 1、window对象
### 全局作用域
1. BOM核心对象是window，表示浏览器的一个实例
1. 全局作用域声明的变量，函数都会变成window的属性和方法
1. 全局变量与直接在window对象上定义属性是有差别的：
	- 全局变量不能用delete删除，直接在window对象上定义的可以
1. 尝试访问未声明的变量会抛出错误，但通过查询window对象，如window.old，可以知道这个变量（old）是否存在

### 窗口关系及框架
1. 页面中有框架，则每个框架都拥有自己的window对象，并保存在frames集合中
1. top对象：
	- 始终指向最高（最外）层框架，即浏览器窗口
1. parent对象
	- 始终指向当前框架的直接上层框架
1. self对象：
	- 和window对象一样，可以相互使用
1. 每个框架有自己一套的构造函数，构造函数一一对应，但不相等

### 窗口位置
1. 用来确定和修改window对象位置的属性和方法有很多，但有兼容性问题
1. 因为兼容性问题，无法跨浏览器条件下取得窗口左边和上边的精确位置
1. 使用moveTo(),moveBy()方法，可以将窗口精确移动到一个新位置
1. 但上述方法可能被浏览器禁用（IE7以上默认禁用），并不适用于框架，只能用于最外层的window对象

### 窗口大小
1. 跨浏览器确定一个窗口大小不是一件容易的事
1. resizeTo(),resizeBy()可以调整浏览器窗口大小
1. 也可能别浏览器禁用

###导航和打开窗口
1. window.open();
	- 弹出窗口被屏蔽，window.open()会返回null或者报错
1. window.close();
	- 只能关闭window.open()打开的窗口，关闭后，窗口的引用还存在，可以检测closed属性，窗口引用没别的作用了
```javascript
var win = window.open("http://www.baidu.com");
win.close();  //关闭打开的百度窗口
console.log(win.closed);  //true,打开的窗口关闭了
```
1. opener属性
	- 保存着打开它的原始窗口对象；但原始窗口并不记录它们打开的弹出窗口，如有必要，需要手动实现跟踪

### 定时器
1. setTimeout()：
	- 参数1：不建议使用字符串（最好传递函数），由于传递字符串可能导致性能损失
	- 参数2：告诉js再过多长时间把当前任务添加到队列中
1. 使用一次性定时器模拟周期定时器是一种最佳模式
1. 周期定时器很少使用，因为后一个周期定时器可能在前一个周期定时器结束之前启动

### 系统对话框
1. 浏览器可以通过alert(),confirm(),prompt()调用系统对话框向用户显示信息
1. 外观由浏览器或操作系统设置决定，和css没关系
2. prompt对话框，可以根据用户输入内容转跳页面

## 2、location
1. 提供了与当前窗口中加载的文档有关的信息，还将url解析为独立的片段，并通过location.hash,location.host,location.hostname等属性进行访问
1. 既是window对象属性，又是document对象属性
1. location.search():
	- 返回从问号到URL结尾的所有内容，但无法逐个访问其中每个查询字符串参数（通过自定义函数可以访问）
1. 改变浏览器位置：
	- location.assign(""):打开新的URL，并产生历史记录
	- window.location = ""
	- location.href = ""
	- 上述三种方式效果完全一样
1. location.replace():
	- 不会产生历史记录，故用户不能返回到之前页面
1. location.reload():
	- 重新加载当前页，传入true参数，从服务器获取，否则先在缓存中获取
1. location.hostname
    返回主页名
1. location.pathname：返回当前页面路径
1. location.protocol：返回页面的协议
1. location.assign("http://www.baidu.com")：重定向到网页

## 3、navigator
1. 识别客户端浏览器，所有支持js的浏览器共有的对象
2. 主要问题是：Navigator信息可能会有问题；不同浏览器可以有相同名字，navigator数据可以被用户更改
1. navigator.cookieEnabled：判断浏览器cookie是否开启
1. navigator.appCodeName
    - navigator.appName
    - 两者一致，都返回浏览器名
1. navigator.product：返回浏览器引擎名
1. navigator.appVersion
    - navigator.userAgent
    - 浏览器版本
1. navigator.platform：浏览器所在的操作平台
1. 检测插件
	- 非ie可以使用navigator.plugins数组
	- 典型做法是针对每个插件创建检测函数，而不是通用检测

## 4、screen
1. 只用来表明客户端能力,如屏幕实际DPI，屏幕像素高度等
1. 屏幕宽高
    - screen.width
    - screen.height
1. 可用宽高
    - screen.availHeight
    - screen.availWidth
    - 屏幕高度去掉给永久占用的标题栏
1. 屏幕颜色深度
    - screen.colorDepth
    - 使用配色方案，26bit还是32bits
1. 像素深度
    - screen.pixelDepth
    - 现代浏览器与屏幕颜色深度是相等的

## 5、history
1. 保存用户上网的历史记录，从窗口被打开算起
1. go():
	- go("www.baidu.com")：跳到历史记录中包含该字符串的第一个位置
	- go(n):前进n页
	- go(-n)：后退n页
1. history.back()：后退,类似于go(-1)
1. history.forward()：前进，类似于go(1)
1. length属性:保存历史记录数量


# 客户端检测
## 1、概述
1. 是一种补救措施，更是一种行之有效的开发策略
1. 先设计最通用的方案，再使用浏览器检测技术对特定浏览器，将方案进行增强

## 2、能力检测
1. 主要是识别浏览器能力，而不是识别特定浏览器
1. 要先先检测达到目的最常用的特性
1. 对于检测某种特性是否按照适当方式形式非常有用
1. 检测某几个特性并不能确定浏览器

## 3、怪癖检测
1. 想知道浏览器有什么bug

## 4、用户代理检测
1. 用户代理字符串是作为响应首部发送的
1. 但由于历史问题，通过用户代理字符串检测特定浏览器不是一件容易的事

