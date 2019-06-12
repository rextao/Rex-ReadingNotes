1. 常用的loader
	- 
	- file-loader url-loader：css中font、img地址，小于某个大小图片可以转为base64
	- html-withimg-loader：html的img地址
2. 常用的plugin
  - 
  - extract-text-webpack-plugin：分离css，可以用link引入
  - clean-webpack-plugin：清除dist
  - babel-plugin-import：按需加载
  - SplitChunksPlugin替换之前commonsChunkPlugin：防止打包重复