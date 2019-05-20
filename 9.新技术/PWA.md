# PWA

## 什么是

1. Progressive Web App, 简称 PWA，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验
2. PWA 本质上是 Web App，借助一些新技术也具备了 Native App 的一些特性，兼具 Web App 和 Native App 的优点。
3. 主要特点：
	- 可靠，即使在不稳定的网络环境下，通过service worker也能瞬间加载并展现
	- 体验：快速体验
	- 粘性：可以像原生应用一样添加到桌面

## 什么是渐进式

1. 主要是渐进式改善站点体验

	- 降低站点改造的代价，逐步支持各项新技术
	- 新技术标准的支持度还不完全

	

# Service Worker

## 概述

1. HTML5 API，主要用来做持久的离线缓存。
2. js运行在单线程上，由于web复杂度越来越高，性能逐渐凸显出来，Web Worker的API被创造出来，主要目的是解放主进程
	- 可以将耗时的任务给web worker，干完活通过posetMessage通知给主线程
	- 主线程通过 onMessage 方法得到 Web Worker 的结果反馈。
	- 但新的问题是，每次做的结果不能被保存，因此提出service workder
3. 功能和特性
	- 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。
	- 一旦被 install，就永远存在，除非被手动 unregister
	- 用到的时候可以直接唤醒，不用的时候自动睡眠
	- 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
	- 离线内容开发者可控
	- 能向客户端推送消息
	- 不能直接操作 DOM
	- 必须在 HTTPS 环境下才能工作
	- 异步实现，内部大都是通过 Promise 实现