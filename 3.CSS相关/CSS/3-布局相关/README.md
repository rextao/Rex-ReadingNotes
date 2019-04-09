# 三栏自适应布局

## 概述

1. 两边宽度固定，中间自适应

## 普通玩法

1. 绝对定位法

	```html
	<style>
	#left,#right{
	    width: 200px;
	    height: 200px; 
	    background-color: #ffe6b8;
	    position: absolute;}
	#left{left:0px;}
	#right{right: 0px;}
	#center{
	    margin:2px 210px ;
	    background-color: #eee;
	    height: 200px; }
	</style>
	<div id="box">
	    <h3>实现三列宽度自适应布局</h3>
	    <div id = "left">我是左边</div>
	    <div id = "right">我是右边</div>
	    <div id = "center">我是中间</div>
	</div>
	```

	- 优点：三个div顺序可以任意改变

2. 浮动大法

	```css
	#left,#right{
	    width: 200px;
	    height: 200px; 
	    background-color: #ffe6b8;}
	#left{float: left;}
	#right{float: right;}
	#center{
	    margin:2px 210px ;
	    background-color: #eee;
	    height: 200px; }
	```

	- center元素必须放在最后，如放第一个会独占一行
	- 后面的元素会在下一行分别左右浮动

3. flex大法

	```html
	<style>
	    #box{display: flex;}
	    #left,#right{
	        width: 200px;
	        height: 200px;
	        background-color: #ffe6b8;
	    }
	    #center{flex: 1;background-color: lightgreen;}
	</style>
	<div id="box">
	    <div id = "left">我是左边</div>
	    <div id = "center">我是中间</div>
	    <div id = "right">我是右边</div>
	</div>
	```


### 进阶玩法（main先显示）

1. 即html结构需要是，main在最前面，实现三列布局

  ```html
  <div id="box">
      <div id = "center">我是中间</div>
      <div id = "left">我是左边</div>    
      <div id = "right">我是右边</div>
  </div>
  ```

2. 绝对定位，可以随意安排div顺序

3. flex布局

  ```css
  #left{
      order:-1;
  }
  ```

  - 利用flex的order将调整显示顺序

4. 浮动大法（圣杯布局）

  ```css
  #box{
      padding: 0 200px;
  }
  #left,#right,#center{
      position: relative;
      float: left;
  }
  #left,#right{
      width: 200px;
      height: 200px;
      background-color: #ffe6b8;
  }
  #right{
      margin-right: -100%;
  }
  #left{
      left:-200px;
      margin-left: -100%;
  }
  #center{
      width: 100%;
      background-color: lightgreen;}
  ```

  - 外围container利用padding，将center两边空出left与right大小
  - left与right利用负100%margin换行到第一行
  - 利用relative定位，将left左移200px，避免挡住center内容
  - 当缩小到一定程度，会导致3个元素混乱



# 垂直居中的方法

## margin:auto法

1. 利用absolute与`margin:auto`

   ```html
   <style>
       .outer{
           width: 400px;
           height: 400px;
           position: relative;
           border: 1px solid #000;
       }
       .inner{
           position: absolute;
           left: 0;
           top: 0;
           right: 0;
           bottom: 0;
           margin: auto;
           background-color: #000;
           width: 30px;
           height: 30px;
       }
   </style>
   <div class="outer">
       <div class="inner"></div>
   </div>
   ```

## 负margin

```html
<style>
    .outer{
        width: 400px;
        height: 400px;
        position: relative;
        border: 1px solid #000;
    }
    .inner{
        position: absolute;        
        background-color: #000;
        width: 30px;
        height: 30px;
        left: 50%;
        top: 50%;
        margin-left: -15px;
        margin-top: -15px;
    }
</style>
```

## transform方法

1. 利用`transform：translateX(-50%)和transform：translateY(-50%) `

## table-cell（未脱离文档流的）

1. 设置父元素的display:table-cell,并且vertical-align:middle，这样子元素可以实现垂直居中。 

## flex

1. 将父元素设置为display:flex，并且设置`align-items:center;justify-content:center;`
