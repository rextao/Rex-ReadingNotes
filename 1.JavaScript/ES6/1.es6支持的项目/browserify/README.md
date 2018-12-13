# 概述
1. babel7+browserify
1. babel7:https://babeljs.io/docs/en/
1. babelify:https://github.com/babel/babelify

# 注意
1. 由于使用了import语法，故需要引入@babel/plugin-syntax-dynamic-import
1. 这个插件是在vue里面看到的，开始引入，build项目还是会出错
1. 在全局安装了@babel/core，@babel/cli后不报错
1. 删除这两个插件后，也不报错-。-不知道出了什么问题