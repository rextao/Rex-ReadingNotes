# 基础

## 动态路由匹配

### 概述

1. 即多种模式匹配到一个组件上，如

	```javascript
	const router = new VueRouter({
	  routes: [
	    // 动态路径参数 以冒号开头
	    { path: '/user/:username/post/:id', component: User }
	  ]
	})
	```

2. 参数会保存在对象`this.$route.params`中

3. 如路径为：`/user/evan/post/123`，在`$route.params={username:evan,id:123}`

4. 使用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 作为路径匹配引擎，可以查看文档，支持很多高级匹配模式

### 响应路由参数变化

1. 注意：

	- 路由配置为：`/user/:id`,如从 `/user/foo` 导航到 `/user/bar`，**原来的组件实例会被复用**。因此生命周期钩子不会被调用
	- 是想对路由参数变化做出响应

2. 可以利用watch监测$route对象变化

	```javascript
	const User = {
	    template: '...',
	    watch: {
	        '$route' (to, from) {
	            // 对路由变化作出响应...
	        }
	    }
	}
	```

3. 或使用导航守卫

### 捕获所有路由

1. 使用`*`通配符，主要路由顺序是正确的

2. `$route.params` 内会自动添加一个名为 `pathMatch` 参数。

	```javascript
	// 给出一个路由 { path: '/user-*' }
	this.$router.push('/user-admin')
	this.$route.params.pathMatch // 'admin'
	// 给出一个路由 { path: '*' }
	this.$router.push('/non-existing')
	this.$route.params.pathMatch // '/non-existing'
	```

### 匹配优先级

1. 谁先定义，谁优先级最高

## 嵌套路由

1. 注意，以 / 开头的嵌套路径会被当作根路径。

2. 主要是使用children属性

	```javascript
	const router = new VueRouter({
	  routes: [
	    {
	      path: '/user/:id', component: User,
	      children: [
	        { path: '', component: UserHome },
	        { path: 'profile', component: UserProfile },
	        { path: 'posts', component: UserPosts }
	      ]
	    }
	  ]
	})
	```

	- `/user`会访问UserHome
	- `/user/rex`会访问User
	- `/user/rex/profile`会访问UserProfile

3. 子路由还可以通过chilren进行嵌套

## 编程式导航

1. 除了`<router-link>` ，js的路由转跳方式
2. Vue Router 的导航方法 (`push`、 `replace`、 `go`) 在各类路由模式 (`history`、 `hash` 和 `abstract`) 下表现一致

### router.push

1. 语法：`router.push(location, onComplete?, onAbort?)`
	-  `onComplete` 和 `onAbort`会在导航成功完成或终止的时候进行相应的调用
	- 如路由相同，只是param不同，此回调监听不到，参加《响应路由参数变化》
2. vue实例内部可以通过`$router`访问路由实例，故可调用`this.$router.push`
3. 当点击 `<router-link>` 时，内部调用了 `router.push(...)`。

### router.replace

1. 不会向 history 添加新记录，仅替换当前的history记录

### router.go(n)

1. 在history记录中向前或后退多少步

## 命名路由

1. 在执行转跳和链接一个路由时会非常方便，

2. 即如多个地方使用path，更改时很麻烦，无法集中管理path

3. 设置方式

	```javascript
	const router = new VueRouter({
	    routes: [
	        {
	            path: '/user/:userId',
	            name: 'user',
	            component: User
	        }
	    ]
	})
	```

4. 使用方式`<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>`

## 命名视图

### 概述

1. 为router-view增加-name属性

2. 可以当路径不同时，为不同的router-view指向不同的component组件

	```javascript
	const router = new VueRouter({
	    routes: [
	        {
	            path: '/',
	            components: {
	                default: Foo,
	                a: Bar,
	                b: Baz
	            }
	        }
	    ]
	})
	```

3. 页面中可以通过$route.name访问到此路由名字

### 嵌套

## 重定向与别名

### 重定向

1. 

### 别名

1. /a 的别名是 /b，意味着访问/b其实是访问/a

	```javascript
	const router = new VueRouter({
	  routes: [
	    { path: '/a', component: A, alias: '/b' }
	  ]
	})
	```

	

## HTML5 History 模式

1. 默认是hash模式，使用`mode:'history'`可以使用html5 新的api
2. 但需要后台配置支持，否则会404