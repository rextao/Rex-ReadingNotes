多页签

基于微前端qiankun的多页签缓存方案实践

1. https://mp.weixin.qq.com/s/qW0oEQYzT7DN4MfTBDlwXw
2. 多页签，常见的方案有两种
   - 通过CSS样式display:none来控制页面的显示隐藏模块的内容；
   - 将模块序列化缓存，通过缓存的内容进行渲染（与vue的keep-alive原理类似，在单页面应用中应用广泛）。
3. 概述：文章参照keep-alive的方式，实现应用级别的缓存，缓存子应用vnode



onLine 系统设计

1. 墨刀： https://modao.cc/app/246cb34cf690bc232e49159889532e05f15e7904#screen=sktn1le9ejfwyec





iframe代替方案

1. https://juejin.cn/post/7185070739064619068#heading-17
   - 涉及iframe，URL同步更新，全局跳转拦截，loading处理，弹窗居中等问题
