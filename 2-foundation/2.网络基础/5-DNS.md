# 

# DNS

## 概述

1. DNS( Domain Name System)是“域名系统”的英文缩写
2. 用来将主机名和域名转换为IP地址，DNS是应用层协议
3.  域名到IP地址的解析是由分布在因特网上的许多域名服务器程序共同完成的。域名服务器程序在专设的结点上运行，而人们也常把运行域名服务器程序的机器称为域名服务器。

## 域名结构

1. 每一个域名都是有标号(label)序列组成，而各标号之间用点(小数点)隔开
2. ![img](5-DNS.assets/20140506151600093.png)
3. 级别最低的域名写在最左边，而级别最高的字符写在最右边
4. DNS既不规定一个域名需要包含多少个下级域名，也不规定每一级域名代表什么意思
5. 各级域名由其上一级的域名管理机构管理，而最高的顶级域名则由ICANN进行管理

## 域名服务器

1. 根据结构可以得到如下的域名空间

	![1557976532976](5-DNS.assets/1557976532976.png)

2. 每一个节点都采用一个域名服务器，这样会使得域名服务器的数量太多，使域名服务器系统的运行效率降低

3. 域名服务器按区进行服务器管理，即每个域名服务器只对体系中的一部分进行管理

	![1557977448512](5-DNS.assets/1557977448512.png)

4. 根域名服务器有13个不同ip，并不是13台服务器，根域名服务器分布在全国各地

5. 权限域名服务器下面还有一个本地域名服务器，网络服务者ISP或一个大学甚至一个系里，都可以拥有本地域名服务器；如windows默认的DNS获取地址就是这个本地域名服务器，是主机距离最近的域名服务器

## 域名解析过程

注意：查询过程是先查询缓存未发现地址之后进行

### 递归查询

1. 主机向本地域名服务器查询一般是递归查询
2. 如主机请求本地域名服务器某一网站的ip地址未查询到，则本地域名服务器会以DNS客户身份直接向根域名服务器请求，而不是等待主机发送下一步查询

### 迭代查询

1. 本地域名服务器向根域名服务器的查询通常是迭代查询
2. 即根域名查询到下一级域名服务器地址后，会告诉本地域名服务器，让本地域名服务器进行后续操作，而不是自动向下一级进行请求

### 图示

![img](5-DNS.assets/28216282_1370437354L19Z.jpg)

## 缓存分类

1. 浏览器DNS缓存（内存中): 浏览器会按照一定频率缓存DNS记录
2. 本地DNS缓存(内存中): 操作系统缓存。
3. 本地HOSTS文件
4. 路由器DNS
5. ISP的DNS服务器:  ISP(互联网服务提供商、联通电信移动)，ISP有专门的DNS服务器应对DNS查询请求
6. 根服务器: ISP的DNS服务器还找不到的话，它就会向根服务器发出请求，进行递归查询
7. DNS查找顺序也是从1到6

### 清除浏览器的dns缓存

1. 如开发时需要某个域名绑定hosts，用于本地开发测试，绑定后发现没反应，可能是有浏览器的dns缓存
2. chrome 浏览器chrome://net-internals/#dns
3. ![1557910055723](5-DNS.assets/1557910055723.png)



## 域名发散与收敛

![319ec85e-2bea-42b8-9dc9-02a523aa6bd8](5-DNS.assets/46642944-5a9f4180-cbac-11e8-838b-b2cb5c0bb99a.png)

### 域名发散

1. 在PC上，为了突破浏览器的单域名多线程并发限制，大家会采用域名发散：http 静态资源采用多个子域名，以提供最大并行度，让客户端加载静态资源更为迅速
2. 为何浏览器会对并发做限制
	- 以前服务器负载能力差，容易崩溃
	- 服务器容易受到DoS攻击，攻击者占用过多服务器资源，其他用户无法访问

### 域名收敛

1. 尽量将静态资源只放在一个域名下面
2. 主要是考虑手机端利用无线网络开销比较大，进行每次的DNS都会浪费资源

### 