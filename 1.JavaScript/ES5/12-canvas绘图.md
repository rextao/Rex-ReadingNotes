# canvas绘图
## 基本用法
1. canvas默认高度是300*150，可以利用HTML属性自定义canvas宽高
1. `<canvas id="tutorial" width="150" height="150"></canvas>`

## 回退内容

1. 可以在canvas内部添加回退内容，如一张图片，或一段文字

2. 当浏览器不支持canvas时，会显示canvas内部的回退内容，如支持，则会忽略

3. ```html
   <canvas id="stockGraph" width="150" height="150">
     current stock price: $3.15 + 0.15
   </canvas>
   
   <canvas id="clock" width="150" height="150">
     <img src="images/clock.png" width="150" height="150" alt=""/>
   </canvas>
   ```

## 获得绘图上下文

1. html利用canvas内增加内容获得回退，js中需要判断canvas.getContext是否存在，判断是否可以使用canvas api

2. ```javascript
   var canvas = document.getElementById('tutorial');
   if (canvas.getContext) {
     var ctx = canvas.getContext('2d');
     // drawing code here
   } else {
     // canvas-unsupported code here
   }
   ```

3. 

4. getContext("2d")

1. 导出图像
    - toDataURL():canvas对象方法，不是context方法
    - 如果绘到画布上的图像来源不同的域，toDataURL()会抛出错误

## 2D上下文
1. 概述
    - 坐标原点是(0,0)，左上角
    - 所有坐标值都是根据原点计算
1. 填充
    - 指定样式填充图形
    - fillStyle属性
1. 描边
    - 设置图像边缘
    - strokeStyle属性
1. 绘制矩形
    - fillRect()
        - 绘制矩形会填充指定颜色
        - 颜色填充用fillStyle属性
    - strokeRect()
        - 绘制指定颜色边的矩形
        - 边颜色用strokeStyle属性指定
        - 线宽使用lineWidth属性，任意整数
    - clearRect()
        - 清除矩形区域
        - 本质是指定区域变透明
1. 绘制路径
    - 必须先调用beginPath()方法，然后在调用实际方法
    - 创建路径，arc(),lineTo()，moveTo()方法等
    - 创建路径之后
        - closePath()：绘制连接到起点的线条
        - fill()：使用fillStyle填充
        - stroke()：用strokeStyle描边
        - clip()：在路径上创建一个剪切区域
1. 绘制文本
    - fillText()：绘制文本
    - strokeText()：绘制描边文本
    - measureText()
        - 接收一个参数（要绘制的文本），返回TextMetrics对象
        - TextMetrics对象
            - width属性
1. 变换
    - rotate()：围绕原点旋转
    - scale()：缩放
    - translate()：将坐标原点移动到(x,y)
    - transform()：改变变换矩阵
    - 跟踪上下文状态变化
        - save()方法
            - 当时设置全部进入一个栈结构
            - 只保存对绘图上下文的设置和变换，不会保存绘图上下文的内容
        - restore()方法
            - 在保存栈结构中向前返回一级

1. 绘制图像
	- drawImage()
        - 传入一个HTML的`<img>`元素
        - 传入一个`<canvas>`元素

1. 阴影
    - 通过context对象修改
    - shadowColor属性
    - shadowOffsetX属性
    - shadowOffsetY属性
    - shadowBlur属性
    - 有浏览器差异问题
1. 渐变
    - 创建CanvasGraient实例
        - context.createLinearGradient();
        - context.createRadialGradient()
            - 6个参数
            - 渐变是可以理解为通过开始圆形移动到结束圆形
            - 通常是让起点圆和终点圆设置圆形相同，则为同心圆
    - addColorStop()指定色标
    - 然后将渐变颜色设置到filltStyle上
1. 模式
    - 就是重复的图像，可以用来填充或描边图形
    - 创建新模式：createPattern()
        - 参数：一个HTML的<img>元素
        - 参数：如何重复图片的字符串
1. 使用图像数据
    - 取得原始图像数据
        - getImageData()
        - 返回是ImageData对象
            - width属性
            - height属性
            - data属性：一个数组，保存着图像每个像素的数据
1. 合成
    - globalAlpha属性
        - 值在0-1之间，默认为0
        - 指定透明度，如后续都是基于相同的透明度，可以设置这个属性
    - globalCompositionOperation属性
        - 后绘制的图如何与先绘制的图结合
        - 要多测试浏览器，属性的实现存在较大差异

## WebGL
1. 概述
    - 是针对Canvas的3D上下文，不是W3C制定的
    - 浏览器使用的WebGL是基于OpenGL ES制定的
    - OpenGL等3D图形语言非常复杂
1. 只适合实验性学习，不适合真正开发和应用，使用3D引擎
