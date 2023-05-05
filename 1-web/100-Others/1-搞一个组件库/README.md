# 快速生成组件（generator）

1. 主要是根据`@vue/vue-service`进行简化，得到一个模板生成的代码
2. 本质是：把模板根据一些参数复制到当前文件夹
   - 模板可能需要满足一些条件
   - 模板需要填充一些参数
3. vue-cli3可能稍微复杂些，删的东西也比较多，但可以之后向其靠拢
   - 利用vue-cli2的话可以利用`vue init`直接获取些命令行输入内容，简单



# 生成文档

## 概述

1. 主要是基于：vuese-> https://vuese.org/zh/#vuese-cli
2. 思路
   - 将 html 和 js 单独提取出来并单独分析
     - 使用 @vue/component-compiler-utils 模块解析 vue SFC 并分别得到 html(模板) 和 JavaScript(script块) 的源码
     - 对于 html 源码使用 vue-template-compiler 模块将其解析为模板对应的 AST，
     - 使用 babel7，通过 @babel/travers 模块，编写一些 helper 函数来辅助我们判断出哪些是要真正处理的内容
   - 然后构造一个parse模块，解析并组装出我们需要的内容
   - 如果parser 模块编写的更加完善，对一个 vue 组件的分析足够细致，这样我们就能拿到一个 vue 组件全部的信息
   - 然后可以通过这个json将vue组件转为为ts组件或者docute页面文档
3. 痛点：
   - vuese需要写大量注释，解决markdown文档更新或说重新生成文档时，不会把用户编写的内容覆盖
     - 简化注释内容

## vue-styleguidist

1. 使用vue-cli3创建的项目，可以使用`vue add styleguidist`，然后`yarn styleguide`
2. 快捷产生demo代码