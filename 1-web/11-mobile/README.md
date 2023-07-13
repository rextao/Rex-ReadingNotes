# H5开发

## 术语

### 物理像素

1. 一个物理像素是显示器(手机屏幕)上最小的物理显示单元

### 设备独立像素

1. 计算机坐标系统中得一个点，如css的一像素

### 设备像素比(device pixel ratio)：

1. 物理像素/设备独立像素
2. js可以使用`window.devicePixelRatio`获取设备dpr
3. 如iphone6设备宽高为375×667，可以理解为设备独立像素(或css像素)
	- 物理像素就应该×2，为750×1334
	- 如同样尺寸的普通屏幕与retina屏幕（设备宽高都是375*667），1px的css，在普通屏用一个物理像素点表示，而在retina用4个

### 位图像素

1. 理论上，1个位图像素对应于1个物理像素，图片才能得到完美清晰的展示
2. 但在retina上，位图像素不够用，导致图片会变大模糊
3. 因此对于dpr=2的屏幕，一个`200*300px`的img标签，需要提供一个`400*600`的图片，即@2x图







适配方案

1. @media，主要缺点

   - 页面上所有的元素都得在不同的 `@media` 中定义一遍不同的尺寸，代价有点高。
   - 如果再多一种屏幕尺寸，就得多写一个 `@media` 查询块。

2. rem 适配方案：根据不同分辨率修改根元素的font-size

   - `flexible` 方案：阿里早期的一个移动端适配解决方案
   - postcss-pxtorem 插件：通过插件实现px到rem的转换

3. viewport 适配方案：建议使用

   - `viewport` 方案使用 vw/vh 作为样式单位。vw/vh 将 `viewport` 分成了一百等份，`1vw` 等于视口 `1%` 的宽度，当我们的设计稿宽度是 750px 时，`1vw` 就等于 `7.5px`。

   - 设置 meta 标签

     ```html
     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
     ```

   - 使用postcss-px-to-viewport：将px转为vw，可以通过配置标注不需要转换的属性

   - 缺点：`px` 转换成 `vw` 不一定能完全整除，因此有一定的像素差；宽度不可控，如pad横屏会很大









跨端技术

主流跨端方案

1. web渲染：webview
   - 本质上是依托原生应用的内嵌浏览器控件 `WebView` 去渲染 H5 页面
   - 利用JSBridge能力，访问部分原生能力
   - h5容器技术解决方案：提供丰富的内置 JSAPI，增强版的 WebView 控件以及插件机制等能力，对原始版本的web方案做了进一步功能高内聚和模块低耦合
2. 原生渲染：React Native` 和 `Weex
   - 基本思路是在 UI 层采用前端框架，然后通过 JavaScript 引擎解析 JS 代码，JS 代码通过 Bridge 层调用原生组件和能力
   - 不同于一般 `react` 应用，它需要借助原生的能力来进行渲染，组件最终都会被渲染为原生组件
3. 自渲染引擎渲染：flutter
   - 利用了更底层的渲染能力，直接从底层渲染上实现 UI 的绘制，类似于浏览器，只是不需要遵循w3c标准
4. 小程序另类跨端
   - 一般也是采用webview作为渲染引擎，最大创新之处在于将渲染层和逻辑层进行了分离，提供一个干净纯粹的 JavaScript 运行时，多 WebView 的架构使得用户体验进一步逼近原生体验





# webview

1. 概述
   - 可以理解为嵌套了一个浏览器内核（比如 webkit）的移动端组件。
2. APP webview页面和手机浏览器打开的页面
   - 不管是ios还是安卓，自带浏览器底层都是基于webkit的，然后各自系统中均带有webview控件，也是基于webkit引擎，因此两者打开的效果是一致的
   - Android 的 Webview 在低版本和高版本采用了不同的 webkit 版本内核，4.4后直接使用了Chrome
3. 如何与App native的交互？
   - JSBridge
   - schema
4. 为什么webview会很慢？
   - 需要花时间初始化webview后再加载html等
5. webview如何性能优化？
   - 全局WebView：在客户端刚启动时，就初始化一个全局的WebView待用，并隐藏
   - 客户端代理数据请求：在客户端初始化WebView的同时，直接由native开始网络请求数据； 当页面初始化完成后，向native获取其代理请求的数据。
   - DNS和链接慢：想办法复用客户端使用的域名和链接
   - 离线包优化方案
   - 对于 WebView 初始化所带来的性能开销，对webview内核进行定制






## JSBridge

### 概述

1.  JSBridge：可以理解为我们需要一套跨语言通讯方案，来完成 Native(IOS/Android) 与 JS 的通讯。是Native端与H5端之间的**双向通讯层**
2.  任何一个移动操作系统中都包含可运行 JavaScript 的容器，因此使用js作为bridge的语言，不像其他语言一样，需要额外的运行环境













