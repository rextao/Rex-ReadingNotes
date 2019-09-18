# 概述

1. [Page Visibility Level 2 ](https://www.w3.org/TR/page-visibility/#dom-document-visibilitystate)，Document.onvisibilychange添加，废弃visibility.unloaded，不推荐使用document.hidden
2. Document.visibilityState是Document的只读属性，返回字符串表示页面当前的可见状态
	- visible：部分可见，只要页面露出一个角，返回的都是visible
	- hidden：页面用户不可见（浏览器最小化、页面切换、浏览器将要卸载（unload）页面 、操作系统触发锁屏）
	- prerender：在支持"预渲染"的浏览器上才会出现，比如 Chrome 浏览器就有预渲染功能，可以在用户不可见的状态下，预先把页面渲染出来，等到用户要浏览的时候，直接展示渲染好的网页
3. document.visibilityState属性只针对顶层窗口，内嵌的<iframe>页面的document.visibilityState属性由顶层窗口决定。使用 CSS 属性隐藏<iframe>页面（比如display: none;），并不会影响内嵌页面的可见性。
4. 此属性值变化都会触发visibilitychange事件给document

# visibilitychange 事件

1. demo

	```javascript
	document.addEventListener('visibilitychange', function () {
	  // 用户离开了当前页面
	  if (document.visibilityState === 'hidden') {
	    document.title = '页面不可见';
	  }
	
	  // 用户打开或回到页面
	  if (document.visibilityState === 'visible') {
	    document.title = '页面可见';
	  }
	});
	```



# 页面卸载

1. 页面卸载可以分3种情况
	- 页面可见时，用户关闭 Tab 页或浏览器窗口。
	- 页面可见时，用户在当前窗口前往另一个页面。
	- 页面不可见时，用户或系统关闭浏览器窗口。
2. 用户正在离开页面，常用的监听（顺序如下）
	- beforeload
	- pagehide
	- unload
3. 但是，这些事件在手机上可能不会触发，页面就直接关闭了。因为手机系统可以将一个进程直接转入后台，然后杀死。 
4. visibilitychange事件比pagehide、beforeunload、unload事件更可靠，所有情况下都会触发（从visible变为hidden）
5. 甚至可以这样说，unload事件在任何情况下都不必监听，beforeunload事件只有一种适用场景，就是用户修改了表单，没有提交就离开当前页面。