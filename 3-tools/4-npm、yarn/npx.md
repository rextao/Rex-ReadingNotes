# npx

## 简化模块调用

1. 如在项目安装一个模块，如想在命令行使用需要`node-modules/.bin/mocha --version`

2. npx想要解决的就是这个问题，利用npx可以

	`npx mocha --version`

## 避免全局安装模块

1. `npx create-react-app my-react-app`运行create-react-app但不安装
2. 会下载使用后删除create-react-app，之后再次执行上述命令，会再次下载
3. `--no-install`参数会强制使用本地模块，如本地没有，会报错`npx --no-install http-server`
4. `--ignore-existing`参数强制使用远程模块