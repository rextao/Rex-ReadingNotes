

# 前端缓存综述

![1557756310618](2-web缓存.assets/1557756310618.png)

1. cookie参见《2.网络基础/HTTP》
2. webstorage、indexDB、service worker参见《2-html5/1-离线应用与存储》

# HTTP 缓存

## 什么是HTTP缓存

1. 当客户端向服务器请求资源时，会先抵达浏览器缓存，如果浏览器有“要请求资源”的副本，就可以直接从浏览器缓存中提取而不是从原始服务器中提取这个资源。
2. http缓存都是从第二次请求开始的。第一次请求资源时，服务器返回资源，并在respone header头中回传资源的缓存参数；第二次请求时，浏览器判断这些请求参数，命中强缓存就直接200，否则就把请求参数加到request header头中传给服务器，看是否命中协商缓存，命中则返回304，否则服务器会返回新的资源。

## 缓存分类

### 概述

![img](2-web缓存.assets/4845448-ab0e961921da5694.webp)

## 缓存请求流程

1. 第一次请求

	![img](2-web缓存.assets/632130-20170210142134291-1976923079.png)
	
	- 服务器响应时，会配置Cache-control或Expires、Etag、Last-Modified等是否缓存
	
2. 第二次请求

	![img](2-web缓存.assets/632130-20170210141453338-1263276228.png)

### 强缓存

1. 强制缓存优先级高于协商缓存，当执行强制缓存的规则时，如果缓存生效，直接使用缓存，不再执行对比缓存规则。

2. | header属性              | 可选值                                                       | 优先级 | 优缺点 |
   | ----------------------- | ------------------------------------------------------------ | ------ | ------ |
   | Pragma(HTTP/1.0)        | no-cache：不直接使用缓存，根据新鲜度来使用缓存               | 高     | 1、只支持请求头<br />2、为了兼容http1.0 |
   | Cache-Control(HTTP/1.0) | no-store、no-cache |       中 | 1、通用头，即请求头与响应头都支持这个属性 |
   | Expires(HTTP/1.0+)      | h，必须是 `GMT` 格式的时间，expires=Thu, 25 Feb 2016 04:18:00 GMT（表示这个时间之后cookie失效） | 低 | 1、服务器与客户端时间不一致会出问题<br />2、响应头<br />3、表示缓存何时过期，如值为0，则表示过去的时间，即缓存已过期 |

3. expires：在http/1.1中，已经由max-age代替

#### Cache-control

1. Cache-Control: no-store
	- 禁止进行缓存
2. Cache-Control: no-cache
	- 会询问服务器缓存是否过期，如未过期，则使用本地缓存
3. 私有缓存和公共缓存
	- Cache-Control: private
	- Cache-Control: public
	- 公共缓存表示响应可以被中间任何人（中间代理、CDN）缓存
4. Cache-Control: max-age=31536000
	- 资源被缓存的最大时间

#### Pragma头

1. 请求中包含pragma头与Cache-control:no-cache相同
2. 响应头不支持此属性，故不能完全替代cache-control

### 协商缓存

1. 当第一次请求时服务器返回的响应头中

   - 没有Cache-Control和Expires
   - Cache-Control和Expires过期
   - Cache-control属性设置为no-cache时
   - 即不走强缓存时，那么浏览器第二次请求时就会与服务器进行协商，与服务器端对比判断资源是否进行了修改更新。
   - 如果服务器端的资源没有修改，那么就会返回304状态码，使用缓存

#### Last-Modified/If-Modified-Since

1. Last-Modified
	- 服务器在响应请求时，代表资源的最后修改时间。
	- 弱校验器，需要精确到某一秒
2. If-Modified-Since：上次请求时，服务器返回的资源最后修改时间

#### Etag/If-None-Match

1. 优先级高于Last-Modified / If-Modified-Since
2. Etag：响应时，资源的唯一标识（生成规则由服务器决定）
3. If-None-Match：再次请求时，通知服务器客户端缓存数据的唯一标识

#### Etag与Last-Modified区别

1. 某些服务器不能精确得到资源的最后修改时间，这样就无法通过最后修改时间判断资源是否更新
2. Last-modified 只能精确到秒。
3. 一些资源的最后修改时间改变了，但是内容没改变，使用 Last-modified 看不出内容没有改变。
4. Etag 的精度比 Last-modified 高，属于强验证，要求资源字节级别的一致，优先级高。
5. 由于Etag要求资源字节一致，故会占用服务器计算资源；

