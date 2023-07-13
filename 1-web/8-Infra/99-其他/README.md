分片并发下载

1. 如何下载文件：服务端设置 Content-Disposition 为 attachment 就可

2. 断点续传：使用http的Range相关header

   - 如：`Range: bytes=200-1000`：下载 200-1000 字节的内容
   - 因此，可以通过Range的配置，分片获取数据
   - Range请求相关状态码
     - 如果服务器不支持，就会返回 200 加全部内容
     - 如果服务器支持 Range，会返回 206 的状态码和 Content-Range 的 header，表示这段内容的范围和全部内容的总长度
     - 如果 Range 超出了，会返回 416 的 状态码（Range不合法）

3. 如何将多段数据拼接起来

   - 一般使用ArrayBuffer、Uint8Array等

4. 分片下载功能代码：

   ```javascript
   async function concurrencyDownload(path, size, chunkSize) {
     let chunkNum = Math.ceil(size / chunkSize);
   
     const downloadTask = [];
     for(let i = 1; i <= chunkNum; i++) {
       const rangeStart = chunkSize * (i - 1);
       const rangeEnd = chunkSize * i - 1;
   
       downloadTask.push(axios.get(path, {
         headers: {
           Range: `bytes=${rangeStart}-${rangeEnd}`,
         },
         responseType: 'arraybuffer'
       }))
     }
     const arrayBuffers = await Promise.all(downloadTask.map(task => {
       return task.then(res => res.data)
     }))
     return mergeArrayBuffer(arrayBuffers);
   }
   // 数据组装
   function  mergeArrayBuffer(arrays) {
     let totalLen = 0;
     for (let arr of arrays) {
       totalLen += arr.byteLength;
     }
     let res = new Uint8Array(totalLen)
     let offset = 0
     for (let arr of arrays) {
       let uint8Arr = new Uint8Array(arr)
       res.set(uint8Arr, offset)
       offset += arr.byteLength
     }
     return res.buffer
   }
   function getImageURL(res) {
     const blob = new Blob([res]);
     const url = URL.createObjectURL(blob);
     return url;
   }
   (async function() {
     const { data: len } = await axios.get('http://localhost:3000/length');
     const res = await concurrencyDownload('http://localhost:3000', len, 300000);
     img.src = getImageURL(res);
   })();
   ```

   

PDF预览与下载

预览

1. iframe
   - embed标签不建议用，iframe针对不可阅览pdf的浏览器，会回退一个可下载的链接
2. pdf.js
   - 可能因为字体缺少等问题，有些内容无法显示
3. 服务端pdf转图片

下载

1. 主要通过a标签download属性，这个属性只适用于同源
   - 同源 URL 会进行 下载 操作
   - 非同源 URL 会进行 导航 操作
   - 非同源的资源 仍需要进行下载，那么可以将其转换为blob：URL 形式
2. 通过content-diposition响应头
   - `attachment`: 设置为此值意味着消息体应该被下载到本地，大多数浏览器会呈现一个 "保存为" 的对话框，并将 `filename` 的值预填为下载后的文件名
