---
typora-root-url: images
typora-copy-images-to: images
---



# webpack打包原理





### 如何调试webpack程序

1. 不知如何调试整个webapck的项目，可以调试某个具体文件
2. node --inspect-brk build/utils.js，控制台会输出![1531904382795](/1531904382795.png)
3. 在浏览器地址栏输入，chrome://inspect/#devices，并点击Open dedicated DevTools for Node，打开node调试的控制台
4. 在Node控制台输入要监听的地址![1531904417346](/1531904417346.png)
5. 在sources中可以查看需要调试的代码![1531904449773](/1531904449773.png)

# Resolve

1. 设置模块如何被解析

# Plugin

## 概述

1.  在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件
2.  插件都是一个类，最好是使用大写字母命名

## 模块热替换

1. 它允许在运行时更新各种模块，而无需进行完全刷新
2. webpack-dev-server的hot功能是重新加载整个页面

## 配置Html模板

1. 文件打包好（js、css文件生成了），但不能每次我们使用时候都去dist目录新建一个html文件，然后引用js吧
2. 故利用html-webpack-plugin插件

## extract-text-webpack-plugin

1. 通常情况下，使用style-load与css-loader，css文件是以行内样式style的标签写进打包后的html页面中
2. 如果想将css拆分出来，用link方式引入的话可以使用此插件
3. 但webpack4应该使用mini-css-extract-plugin（插件还有一些bug）

## 打包前先清空dist下文件

1. 每次build都需要手动清除dist文件夹，比较麻烦
2. `yarn add --dev clean-webpack-plugin`
3. 利用此插件可以在清除dist下文件

# Loader

## 概述

1. 用于对模块的源代码进行转换，在 `import` 或"加载"模块时预处理文件
2. 如可以将文件从不同的语言（如 TypeScript）转换为JavaScript，或将内联图像转换为 data URL

## 处理图片

### css文件引用图片

1. 在css文件里引入的如背景图之类的图片，就需要指定一下相对路径
2. `yarn add --dev file-loader url-loader`
3. file-loader
   - webpack打包后，css中引用的路径是项目开发时的相对路径，导致引入图片失败
   - 此loader，解析项目中的url引入（不仅限于css），根据配置，将图片拷贝到相应的路径，并修改打包后文件引用路径，使之指向正确的文件
4. url-loader：
   - 如果项目中引用很多小图，会发很多http请求，降低性能
   - 此loader，将引入的图片编码，生成dataURl
   - url-loader封装了file-loader，可以只引入url-loader

### 页面img引用图片

1. html中常需要使用img标签引用图片地址
2. `yarn add --dev html-withimg-loader`

### 引用字体图片和svg图片

1. 字体图标和svg图片都可以通过file-loader来解析

## 处理css

### 添加css3前缀

1. 为了兼容性，CSS3有些属性需要增加前缀
2. `yarn add --dev postcss-loader autoprefixer`
3. 

# Mode

1. 可以设置`development`, `production` or `none`参数，webpack会根据不同环境进行优化

2. 默认是production

   ```javascript
   module.exports = {
     mode: 'production'
   };
   ```

   