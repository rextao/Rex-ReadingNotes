# jQuery
1. 经过不懈努力，jQuery源码总算看完；看完大概是2018年4月，2018年12月将github库进行了调整
2. 对于每个函数调用时参数主要含义，主要参考官方api：[https://api.jquery.com/](https://api.jquery.com/)与中文api：[http://jquery.cuishifeng.cn/](http://jquery.cuishifeng.cn/)因为前者是英文，但很详细，还能帮助理解源码；
3. 对于js的基本api参照MDN：[https://developer.mozilla.org/zh-CN/](https://developer.mozilla.org/zh-CN/)都写的很详细
4. 对于源码阅读，不懂的地方，只能一步步打断点来分析，也并没发现什么easy方式
2. 写在最后：开始看源码源于：[https://www.zhihu.com/question/20521802](https://www.zhihu.com/question/20521802)这个知乎；看完之后，可以清晰的认为，在前端行业依旧是个小白；并不是看懂了，就能会写，并不是能写出来，就能设计
3. 主要参考：
 - 艾伦 Aaron：[http://www.cnblogs.com/aaronjs/p/3279314.html](http://www.cnblogs.com/aaronjs/p/3279314.html)
 - nuysoft：[http://www.cnblogs.com/nuysoft/archive/2011/11/14/2248023.html](http://www.cnblogs.com/nuysoft/archive/2011/11/14/2248023.html)
 - chua1989：[http://www.cnblogs.com/chuaWeb/p/jQuery-1-9-1-catalog.html](http://www.cnblogs.com/chuaWeb/p/jQuery-1-9-1-catalog.html)
 - 源码阅读参考了众多网络资源，以及截取了各位大神的博客图，就不一一列举；



# 文件说明
1. markdown格式，是打算将word转为markdown，方便在线阅读（未完-。-）
2. 源码笔记整合版，这两个word是阅读源码时写的
3. jquery-3.2.1(rextao).js：是阅读源码注释后js
4. jquery-3.2.1(original).js:是最原始的官方3.2.1版本js
5. 笔记：是将每一章节分开