# 概述
1. 工作中用于删除gitlab已merged到develop分支的命令行软件


# 学习
## node操作git
1. simple-git使用：支持promise，简化git的某些操作
2. git 获取远程已合并分支

## 如何搞一个简单命令行
1. npm init 生成package.json 
2. 添加bin
    ```json
    {
      "bin": {
        "cli-demo": "bin/index.js"
      }
    }
    ```
3. 用 npm link 命令将这个简易脚本注册成系统命令行工具

## 美化输入输出控制
1. ora主要是等待标
1. prompts，例子丰富,使用方便，支持promise
1. enquirer，比prompts功能更强大，可扩展、可增加插件
1. chalk，美化输出

## 其他
1. 用自调用函数直接运行init函数