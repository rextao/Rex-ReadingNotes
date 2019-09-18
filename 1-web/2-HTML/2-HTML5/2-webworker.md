# web worker

## 概述

1. 是HTML5标准的一部分，它允许一段`JavaScript`程序运行在主线程之外的另外一个线程中
2. html5的Web worker，是浏览器功能，与js语言本身无关，js 当前并没有任何支持多线程执行的功能
3. 分为两种类型：
  - 专用线程`dedicated web worker`，只能被创建的页面访问，当前页面关闭则结束
  - 共享线程`shared web worker`，同域情况下的多页面共享

## 使用场景

1. 处理密集型数学计算
2. 大数据集排序
3. 数据处理（压缩、音频分析、图像处理等）
4. 高流量网络通信

## 快速上手

```javascript
// 创建
var worker = new Worker("task.js");
// 与webworker通信，webworker内部也是使用此方式
worker.postMessage(
    {
        id:1,
        msg:'Hello World'
    }
);
worker.onmessage=function(message){
   // ...
    worker.terminate();
};
// 错误机制
worker.onerror=function(error){    console.log(error.filename,error.lineno,error.message);
}
```

1. 主要是使用postMessage与onmessage进行消息传输，利用error事件监听webworkder的错误
2. 如何终止web worker
	- 主线程：`worker.terminater()`
	- work内部`self.close()`

## sharedworker

```javascript
// main.js
var myWorker = new SharedWorker("worker.js");
myWorker.port.start();
myWorker.port.postMessage("hello, I'm main");
myWorker.port.onmessage = function(e) {
    console.log('Message received from worker');
}
// worker.js
onconnect = function(e) {
    var port = e.ports[0];
    port.addEventListener('message', function(e) {
        var workerResult = 'Result: ' + (e.data[0]);
        port.postMessage(workerResult);
    });
    port.start();
}
```

