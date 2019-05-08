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