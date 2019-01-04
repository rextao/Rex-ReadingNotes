# BFC

## 概述

1. 块级格式化上下文（Block Fromatting Context）是按照块级盒子布局的
2. 一个html元素要创建BFC，则要满足下面任意一个或多个条件
	- float的值不是none
	- position的值不是static或者relative
	- display的值是inline-block、table-cell、flex、table-caption或者inline-flex
	- overflow的值不是visible

## 利用BFC避免外边距折叠

1. 默认情况下，垂直排列的盒子外边距会进行重叠
2. 两个相邻元素要处于同一个BFC中，元素会发生折叠；
3. 若两个相邻元素在不同的BFC中，就能避免外边距折叠。

## BFC包含浮动

1. 浮动元素会脱离文档流，并会造成外围容器高度塌陷
2. 通常利用`::after`来解决这个问题，BFC包含浮动也能解决这个问题（即经常使用overflow:hidden）
	![1546582718394](README.assets/1546582718394.png)