### 概述

1. 二者都是html4标签，IE6+, Firefox 2+, Chrome 1+ 支持

### code标签

1. code标签的一个功能是暗示浏览器code标签所包围的文本是计算机源代码，浏览器可以做出自己的 样式处理 
2. code标签内容会用等宽、类似电传打字机样式的字体（Courier）显示出来；并不会换行，只是字体更适合程序代码

### pre标签

1. pre标签可以保留文本中的空格和换行符，保留文本中的空格和换行符是计算机源代码显示 所必须的样式 。

2. pre里面的空行都会被解析为空行，如下html，增加了样式后，效果为：

	```html
	<pre>
	    <code>
	    .image-slider >div:before{
	        content: '';
	        background-color: #fff;
	        position: absolute;
	    }
	    </code>
	</pre>
	```

	![1526625058785](F:\张---------学习\1-web前端\HTML\1-HTML4标签\assets\1526625058785.png)

	```HTML
	<pre><code>.image-slider >div:before{
	    content: '';
	    background-color: #fff;
	    position: absolute;
	}</code></pre>
	```

	![1526625168856](F:\张---------学习\1-web前端\HTML\1-HTML4标签\assets\1526625168856.png)

