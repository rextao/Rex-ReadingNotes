# 概述
## js实现
### 核心（ECMAScript）
1. 与浏览器没有依赖关系
2. web浏览器只是ECMAScript实现的宿主环境之一，其他环境：如Node，Flash
3. 主要是用来规定：语法、类型、语句、关键字、保留字、操作符、对象

### DOM
1. 是针对XML，经过扩展用于HTML的应用程序编程接口
2. DOM并不是只针对js，很多语言也实现了DOM，web浏览器中，基于ECMAscript实现DOM是js的重要组成部分
3. DOM级别划分
	- 	DOM 1级
                DOM 核心: 如何映射基于XML的文档结构，以便简化操作和访问
                DOM HTML: 添加针对HTML的对象和方法
	- 	DOM 2级
				引入一些新模板
	- 	DOM 3级
				进一步扩展
	- *注意：*DOM0级标准并不存在，只是历史坐标中的一个参照点而已

### BOM
1. H5致力于把BOM功能写入规范
2. 人们习惯把针对浏览器的js扩展都算作BOM

## 混合JavaScript环境
## ``` <script>```
1. 各个script标签（内联或外联）运行方式相互为独立js程序，一个报错，另外的继续运行
1. 全局作用域的提升机制，不能在不同script标签进行,如下方式会出错
```javascript
<script>foo()</script>
<script>function foo(){}</script>
```
1. 内联代码和外部文件区别
    - 内联代码不能出现</scirpt>，只要出现就被认为是代码块结束
    - 内联代码则使用其所在页面文件的字符集，外联可以charset属性指定
























