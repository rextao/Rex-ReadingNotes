# hash原理

## 概述

1. hash 满足这么一种特性：改变 url 的同时，不刷新页面
2. `window.location.hash ='123'`，页面url会增加#123，但不会刷新页面
3. 利用浏览器提供的onhashchange事件（HTML5）做hash控制

## 问题

1. url后面会有一个#号不美观
2. 搜索引擎对带有hash的页面不友好
3. 带有hash的页面内难以追踪用户行为

# history API

1. html5新增pushstate，replacestate，改变url但不会刷新页面
2. 但history改变并不会触发什么事件
3. 虽然无法监听history的事件，但可以通过拦截改变history的行为，一般改变history有如下3种方式
   - 点击浏览器的前进或者后退按钮；（html5的onpopstate事件）
   - 点击 a 标签（可以禁用默认点击，增加一段js）
   - 在 JS 代码中直接修改路由