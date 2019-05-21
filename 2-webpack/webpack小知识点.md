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

# Plugin

## 概述

1.  在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件



# Loader

## 概述

1. 用于对模块的源代码进行转换，在 `import` 或"加载"模块时预处理文件
2. 如可以将文件从不同的语言（如 TypeScript）转换为JavaScript，或将内联图像转换为 data URL