# monorepo

## 新工具

1. changesets:https://github.com/changesets/changesets
2. rushstack:https://github.com/microsoft/rushstack


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



# 包版本方案

## Lerna

1. 用于管理包含多个软件包（package）的 JavaScript 项目。
2. 优化使用 git 和 npm 管理多包存储库的工作流程。Lerna 主流应用在处理版本、构建工作流以及发布包等方面都比较优秀，既兼顾版本管理，还支持全量发布和单独发布等功能。
3. 缺点：
   - 至今还是不支持 pnpm 的 workspaces（pnpm 下有 workspace:protocol，lerna 并没有支持），与 yarn 强绑定
4. 推荐导读
   - lerna：https://www.lernajs.cn/
   - lerna-lite：https://github.com/ghiscoding/lerna-lite  star太少了

## Changesets

1. Changesets 是一个用于 Monorepo 项目下版本以及 Changelog 文件管理的工具。



# 包构建方案

## Turborepo

1. 解决 Monorepo 慢的问题。
2. https://turbo.build/

##  Nx

1. 是现在几个 Monorepo 工具里比较接近完整的解决方案和框架的。
2. https://nx.dev/



## 其它生态工具

1. [Bolt](https://github.com/boltpkg/bolt)：和 lerna 类似，更像是一个  Task Runner，用于执行 workspaces 下的各种 script，
2. [Preconstruct](https://github.com/preconstruct/preconstruct)：Monorepo 下统一的 Dev/Build 工具。亮点是 dev 模式使用了执行时的 require hook，直接引用源文件在运行时执行转译（babel），不需要在开发时 watch 产物实时构建，调试很方便。用法上比较像 parcel、microbundle 那样 zero-config bundler，使用统一的 package.json 字段来指定输出产物，缺点是比较死板，整个项目的配置都得按照这种配置方式，支持的选项目前还不多，不够灵活
3. [Rushstack](https://rushstack.io/zh-cn/)：pnpm推荐使用rush，rushstack是一系列工具集合，提供一个可复用的解决方案
4. [Lage](https://microsoft.github.io/lage/)：Microsoft 出的一个 `Task Runner in JS Monorepos` ，亮点是 pipeline 的任务模式，构建产物缓存，远程缓存等。



###  

