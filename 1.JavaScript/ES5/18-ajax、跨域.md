# Ajax
## 概述
1. 是Asynchronous JavaScript+XML简写
1. 核心是XMLHTTPRequest对象（简称XHR）

## XMLHTTPRequest对象
### 创建XHR对象
1. ```var xhr = new XMLHttpRequest()```
1. IE7之前不同，如要兼容需注意

### XHR用法
1. xhr.open()
    - 首先调用
        - 参数：请求类型
        - 参数：请求URL
        - 参数：请求是异步还是同步
    - 并不是真正发送请求，而是启动一个请求以备发送
    - 只能向同一域相同端口和协议的URL发送请求，如有差别，则会引发安全错误
1. xhr.send()
    - 参数
        - 请求主体发送的数据
        - 如不需要，必须传入null
        - 这个参数是浏览器必须的
1. 收到响应后
    - 数据自动填写到XHR对象的属性上
    - 第一步
        - 检查status属性，以确定响应成功
        - HTTP:200表示成功
        - HTTP:304表示请求资源未修改，可从缓存中获得
1. 发送异步请求时
    - 检测XHR.readyState属性
        - 表示请求/响应过程的当前活动阶段
        - 值改变就会触发readystatechange事件
        - 必须在调用open()之前指定onreadystatechange事件处理程序才能保证跨浏览器兼容性
        - 之所以使用onreadystatechange(DOM0级)，是因为并不是所有浏览器都支持DOM2级
    - xhr.abort()
        - 取消异步请求
        - 会停止触发事件，也不允许访问任何与相应有关的对象属性
1. 由于内存原因，不建议重用XHR对象


### HTTP头信息
1. setRequestHeader(头部字段名称，头部字段值)
    - 设置自定义头信息
    - 必须在open和send之间调用
    - 不要使用浏览器正常发送的字段名称，可能会影响浏览器响应
        - 有的浏览器不允许改
1. getResponseHeader(头部字段名称)
    - 可以取得响应的头部信息
1. getAllResponseHeader()
    - 包含所有头部信息的长字符串


### get请求
1. 可以将查询字符串参数添加到URL尾部
1. 位于open方法的URL的查询字符串必须经过正确编码才行
1. 查询字符串中每个参数的名称和值都必须使用encodeURIComponent()进行编码


### post请求
1. 将数据作为请求主体提交
1. 消耗资源比get多，以相同数据计算，get请求速度最多可达post请求的2倍
## XMLHttpRequest2级
1. FormData类型
    - 为序列化表单和创建与表单格式相同的数据提供便利
    - ```var data = new FormData()```
    - data.append()方法
        - 参数：表单的键值
    - 方便之处是：不用设置请求头，XHR对象可识别传入FormData的实例，并适配头部信息
1. 超时设定
    - XHR.timeout属性
        - XHR对象的属性
        - 请求多少毫秒之后终止
        - 规定时间没收到响应，会触发timeout事件，调用ontimeout事件处理程序
1. overrideMimeType()方法
    - 重写XHR响应的MIME类型
    - 返回响应的MIME类型决定了XHR对象如何处理它

## 进度事件
1. 概述
    - 定义了客户端服务器通信有关的事件
    - 主要是针对XHR操作的
1. load事件
    - 用来代替onreadystatechange事件
    - 会接受一个event对象，target属性指向XHR对象实例
1. progress事件
    - 事件会在浏览器接受新数据期间周期性触发
    - 接受event对象，target属性是XHR对象
    - lengthComputable属性
        - 进度信息是否可用布尔值
    - position属性
        - 接受字节数
    - totalSize属性
        - 根据Content-Length响应头确定的预期字节数
    - 必须在open之前添加事件处理程序
    - 通过这个可以为用户创建一个进度指示器

## 跨资源共享
1. 概述
    - 通过XHR实现Ajax通信的主要限制，来源于跨安全策略
    - CORS（cross-origin Resource Sharing）
    - CORS跨源资源共享，背后思想：使用自定义HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是否成功
    - 如get或post请求
        - 没有自定义头，主体内容是text/plain
        - 发送请求时，额外附加Origin头部，包含请求页面的源信息（协议、域名、端口）
        - 如服务器接收请求，会返回Accss-Control-Allow-Origin回发相同源信息
1. IE对CORS的实现
    - IE8引入XDR类型，与XHR类型类似，实现安全可靠的跨域通信
    - 部分实现W3C规范
    - 与XHR类型的不同
        - cookie不随请求发送，不随响应返回
        - 只能设置请求头的Content-type字段
        - 不能访问响应头
        - 只支持post和get请求
        - 这些变化使CSRF跨站点请求伪造，XSS跨站点脚本问题得到缓解
        - CSRF:对于未授权系统有权访问某个资源的情况
    - 使用方式与XHR类似
        - 只能是异步请求，无同步请求
        - 接受响应后
            - 只能访问响应的原始文本，不能访问响应状态码
            - 成功触发load事件，失败触发error事件
            -  因为请求失败因素很多，最好写上error事件处理程序，捕获错误
        - 支持post请求，提供了contentType属性
            - 用于发送数据的格式
1. 其他浏览器对CORS的实现
    - 通过XMLHttpRequest实现对CORS的原生支持
    - 要请求位于另一个域的资源，在open方法传入绝对URL即可
    - 可以访问status属性和statusText属性，支持同步请求
    - 与普通XHR对象的区别
        - 不能设置自定义头
        - 不能发送和接收cookie
        - 调用getAllResponseHeaders总返回空
1. Preflighted Requests
    - 它的透明服务器验证机制支持开发人员使用自定义头，get或post之外的方法
1. 带凭据的请求
    -  默认情况下，跨域请求不提供凭据（cookie，Http认证及客户端SSL证明等）
    - withCredentials属性为true
        - 可以指定某个请求发送凭据
    - 服务器接收带凭据的请求，HTTP响应头会有：Accecc-Control-Allow-Credentials：true
    - 如服务器的响应没有上述头信息，浏览器不会把响应交给js

## 其他跨域技术
### 图像ping
1. 一个网页可以从任何网页加载图像，而无需担心跨域问题
1. 概念
    - 图像ping是与服务器进行简单、单向的跨域通信的一种方式
    - 通过图像ping，浏览器得不到任何具体数据，但通过load和error事件，可以知道响应是什么时候接受的
1. 请求数据
    - 通过查询字符串形式发送
1. 响应
    - 可以是任意内容，通常是像素图或204响应
1. 主要作用
    - 跟踪用户点击页面或动态广告曝光次数
1. 缺点
    - 只能发get请求
    - 只能单向通信
    - 无法访问服务器的响应文本


### JSONP
1. JSON with padding缩写（填充式JSON或参数式JSON）
1. 由回调函数和数据组成
    - 回调函数：响应到来时应该在页面调用的函数，一般在请求中指明
    - 数据：传入回调函数中的JSON数据
1. 缺点
    - JSONP从其他域中加载代码执行，无法保证代码安全
    - 确定JSONP请求是否失败并不容易，H5在script元素增加了onerror事件，可以查看

### Comet
1. 更高级的Ajax技术（服务器推送），服务器向页面推送数据的技术
1. 方式
    - 长查询
        - 浏览器定时向服务器发送请求，看数据有没有更新
        - 所有浏览器都支持，XHR对象和setTimeout()就能实现
    - Http流
        - 在页面整个生命周期只使用一个HTTP连接
        - 浏览器发送一个请求，服务器保持连接，然后周期性向浏览器发送数据
        - 过监听readystatechange事件以及检测readyState值是否为3实现
1. 服务器发送事件
    - SSE（server-sent Events）
    - SSE API：创建到服务器的单向连接，服务器通过这个连接可以发送任意数据
    - SSE支持轮询和HTTP流，而且能在断开连接时自定确定何时重新连接，方便实现Comet


### web Sockets
1. 目标：在一个单独的持久连接上提供全双工、双向通信
1. js创建了web Socket之后，会有一个Http请求发送到浏览器以发起连接，取得服务器响应，会使用HTTP升级，将协议转换为Web socket协议
1. Web socket协议是自定义协议
    - 优点：客户端和服务端之间发送非常少的数据
    - 缺点：制定协议时间长，总有安全问题
1. 只能通过连接发送纯文本数据，对于复杂的数据结构，必须进行序列化
