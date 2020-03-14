# 注意
1. bin下需要创建一个config.js,并在index.js中引入`const config = require('./config');`
# node操作git
1. simple-git使用：支持promise，简化git的某些操作
1. git 获取远程已合并分支

# 其他
1. 用自调用函数直接运行init函数
# 如何搞一个简单命令行
1. npm init 生成package.json 
1. 添加bin
    ```json
    {
      "bin": {
        "cli-demo": "bin/index.js"
      }
    }
    ```
1. 用 npm link 命令将这个简易脚本注册成系统命令行工具

# 美化输入输出控制
1. ora主要是等待标
1. prompts，例子丰富,使用方便
1. enquirer，比prompts功能更强大，可扩展、可增加插件
1. chalk，美化输出