# BFC

## 概述

1. 块级格式化上下文（Block Fromatting Context）是按照块级盒子布局的，它是指一个独立的块级渲染区域
2. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然
3. 一个html元素要创建BFC，则要满足下面任意一个或多个条件
  - float的值不是none
  - position的值不是static或者relative
  - display的值是inline-block、table-cell、flex、table-caption或者inline-flex
  - overflow的值不是visible

## 避免外边距折叠

1. 默认情况下，垂直排列的盒子外边距会进行重叠
2. 两个相邻元素要处于同一个BFC中，元素会发生折叠；
3. 若两个相邻元素在不同的BFC中，就能避免外边距折叠。

## 消除浮动

1. 浮动元素会脱离文档流，并会造成外围容器高度塌陷
2. 通常利用`::after`来解决这个问题，BFC包含浮动也能解决这个问题（即经常使用overflow:hidden）
    ![1546582718394](README.assets/1546582718394.png)

## 多栏布局

1. 与浮动元素相邻的已生成BFC的元素不能与浮动元素相互覆盖

2. ```html
   <!DOCTYPE html>
   <html>  
   <head> 
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
     <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
   
     <style> 
       html, body { height: 100%; width: 100%; margin: 0; padding: 0; }
       .left{
         background:pink;
         float: left;
         width:180px;
       }
       .center{
         background:lightyellow;
         overflow:hidden;      
       }
       .right{
         background: lightblue;
         width:180px;
         float:right;
       }
     </style>  
   </head>
   <body class="claro"> 
     <div class="container">
       <div class="left">aaaaaaa</div>
       <div class="right">bbbbbbbb</div>
       <div class="center">cccccc</div>
     </div>
   </html>
   ```

3. 



# 

# 元素隐藏

## display:none

1. 浏览器不会生成属性为display: none;的元素
2. 不占据空间，动态改变此属性时会引起重排（改变页面布局），可以理解成在页面中把该元素删除掉一样 
3. 不会被子孙继承，但是其子孙是不会显示的，毕竟都一起被隐藏了。  
4. 搜索引擎可能认为被隐藏的文字属于垃圾信息而被忽略
5. 屏幕阅读器（是为视觉上有障碍的人设计的读取屏幕内容的程序）会忽略被隐藏的文字。

## visibility:hidden

1. 占据空间
2. 会被子孙继承，子孙也可以通过显示的设置visibility: visible;来反隐藏。  
3. 动态修改此属性会引起重绘。  
4. 不会触发该元素已经绑定的事件。 

## opacity=0

1. 透明度为100%，占据空间
2. 会被子孙继承，子元素并 不能通过opacity=1，进行反隐藏。
3. 依然能触发已经绑定的事件 

# CSS三大特性

1. 层叠性：浏览器解析CSS是从上至下，当CSS冲突时以最后定义的CSS为准。
2. 继承性：继承就是子标签继承了上级标签的CSS样式的属性
3. 优先级：
	- !important > 
	- 内联样式>
	- ID选择器 > 
	- 类选择器(.class) > 
	- 标签 （div）> 
	- 通配符 > 
	- 属性选择器（[type="text"]）>
	- 伪类（:hover）>
	- 伪元素（：first-line）>
	- 继承 >
	-  浏览器默认属性

# 伪类与伪元素

## 定义

1. 伪元素：DOM树没有定义的虚拟元素
2. 伪类：用于选择DOM树之外的信息（如匹配某种状态，比如`:visited`，`:active`），或是不能用简单选择器进行表示的信息（如满足一定逻辑条件的DOM树中的元素足一定逻辑条件的DOM树中的元素，比如`:first-child`，`:first-of-type`）

## 语法

1. 在CSS3中，伪类与伪元素在语法上也有所区别
2. 伪元素修改为以`::`开头。但因为历史原因，浏览器对以`:`开头的伪元素也继续支持，但建议规范书写为`::`开头。

## 伪元素

|    Selector    | Meaning                        | CSS  |
| :------------: | :----------------------------- | :--: |
| ::first-letter | 选择指定元素的第一个单词       |  1   |
|  ::first-line  | 选择指定元素的第一行           |  1   |
|    ::after     | 在指定元素的内容前面插入内容   |  2   |
|    ::before    | 在指定元素的内容后面插入内容   |  2   |
|  ::selection   | 选择指定元素中被用户选中的内容 |  3   |