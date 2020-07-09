# monorepo

## 概述

1. monorepo 和 multirepo：都是管理组织代码的方式
2. multirepo 则是按模块分为多个仓库
3.  monorepo 
   - 把所有的相关项目都放在一个仓库（repo）中（比如 React, Angular, Babel, Google...）
   - 又称 multi-package 仓库
   - 主要缺点：单个 repo 体积较大
4. 解决方式
   - 最常见的 monorepo 解决方案是 [Lerna](https://github.com/lerna/lerna) 和 `yarn` 的 `workspaces` 特性
     - lerna方案的弊端：依赖提升到repo目录，需要版本号完全一致，semver约定不起作用
     - yarn workspace的优势：yarn 会以 semver 约定来分析 dependencies 的版本，安装依赖时更快、占用体积更小；但欠缺了「统一工作流」方面的实现
   - 对于核心需要读取权限的，可以将代码移动到git-submodule 或者 subrepository 里面

1. 

## Lerna

1. Lerna是一种工具，优化 multi-package 仓库的工作流程。
2. 缺点：
   - lerna，为每个子包调用yarn install，公共的第三方包是不被共用的
   - lerna是安装好依赖后，然后建立包的联系，这可能会破坏包的meta 结构（？？？？？？？？？）



## Workspaces

1. https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/