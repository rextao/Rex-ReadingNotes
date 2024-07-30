# 可视化编辑

## 概述

1. 大多数可视化编辑平台的目的是为了解决普通人的编程问题，而不再是开发者的编程效率问题。
2. 微前端、前端微服务到底要解决什么问题：利用服务化、微服务的概念，有效的拆分应用，实现敏捷开发和部署，解决大型项目的管理问题。
3. 工程化是一种思想，主要目的是为了提效，即提高开发效率，减少不必要的重复工作。工程化常见的方向有模块化、组件化、规范化、自动化4个方面。

## 声明式 & 命令式

1. 「声明式」直接描述**最终效果**，不关心如何实现。
2. 「命令式」关注如何实现，明确怎么一步步达到这个效果
3. 从可视化编辑器的角度看，它们的最大区别是：
   - 「声明式」可以直接从展现结果反向推导回源码
   - 「命令式」无法做到反向推导
4. 如设置背景色由红色到绿色，是无法反推哪一步将颜色进行改变，因此「命令式」代码无法实现可视化编辑
5. 低代码平台只能建立在声明式上，并内置了「DSL」，因此低代码优缺点也是声明式带来的

## DSL

### 概念

1. DSL 即「Domain Specific Language」，中文一般译为「领域特定语言」，一种为特定领域设计的，具有受限表达性的编程语言
2. 高级语言层面，抽象带来的效率提升似乎有了天花板。无论是从 C 到 Java，抑或是各种编程范式下衍生的抽象度更高的编程语言，解决的都是通用编程问题，它们都有充分的过程抽象和数据抽象，导致大量的概念产生，进而影响了编程效率
3. 在一些专有领域的任务处理上其实不需要那么多语言特性，DSL 就是在这种矛盾中产生的破局方案，它是为了解决特定任务的语言工具，比如文档编写有 markdown，字符串匹配有 RegExp等。
4. 本质其实，通过限定问题域边界，从而锁定复杂度，提高编程效率。

### 外部DSL

1. 独立的编程语言，需要从解析器开始实现自己的编译工具
2. 如vue的模板字符串

### 内部DSL

1. 对特定任务的特殊接口封装风格，比如 jQuery 就可以认为是针对 DOM 操作的一种内部 DSL。

### 风格指南

1. 链式调用
   - 以jQuery为思考，如级联方法调用不再设计特定返回值，而是直接返回下一个上下文（通常是自身）
   - 特殊应用是类似于gulp的级联管道
2. 嵌套函数
   - 以纯粹命令式使用 DOM API 来构建DOM树为思考
   - 本质上是将在链式调用中需要处理的上下文切换隐含在了函数嵌套操作中，所以它在层级抽象场景是非常适用的
   - 比如 pug

## 前端代码实现原理

1. 基本核心原理是：JSON转Vue组件
2. 为何一般都使用JSON
   - JavaScript 可以方便操作 JSON。
   - 支持双向编辑，它的读取和写入是一一对应的
3. 交互实现
   - 使用图形化编程，无法处理复杂逻辑（即使能处理，图像化也相当复杂，难以维护）
   - 固化交互行为，图形化编程的内置行为
   - 使用 JavaScript，支持复杂逻辑，但并不是低代码了

# 低代码引擎

1. [低代码引擎技术白皮书](https://developer.aliyun.com/ebook/7507)

概述

1. 每条业务线的使用对象、使用场景的差异较大难以统一

2. 现低代码平台不可避免存在多样性
   
   - 多样化的目标用户：专业研发用户或其他人
   
   - 多样化的业务领域：是ToB还是中后台场景
   
   - 多样化的物料体系：Vue物料，antd
   
   - 多样化的产物类型：PC还是小程序、流程、逻辑

建设理念

1. 协议先行，最小内核，最强生态
2. 架构：协议=>低代码引擎=>引擎生态（物料，插件，工具链）=> 低代码平台
3. 低代码引擎
   - 入料：自动扫描、解析源码组件，产出一份符合规范的JSON Schema





物料

1. 如何将已有物料快速导入项目中？
   - 低代码组件与普通物料最大的区别是，具有配置信息
   -  配置信息与物料分离，会实现最大的复用
   -  物料配置协议，规定物料的配置应该如何进行描述
   -  组件进行静态解析生产物料配置




















