1. 常用的loader
	- file-loader url-loader：css中font、img地址，小于某个大小图片可以转为base64
	- html-withimg-loader：html的img地址
	- postcss-loader autoprefixer：添加前缀
2. 常用的plugin
  - MiniCssExtractPlugin（替换之前extract-text-webpack-plugin）：分离css，可以用link引入
  - clean-webpack-plugin：清除dist
  - babel-plugin-import：按需加载
  - HtmlWebpackPlugin：简化了HTML文件的创建
  - SplitChunksPlugin替换之前commonsChunkPlugin：防止打包重复
    - 如使用默认配置，则optimization：{splitChunk：{chunks：'all'}}
3. 主要需要配置哪些内容
   - entry：入口文件
   - output：输出
   - module：{rules：[{test:}]}：loader
   - plugins：插件
   - mode：模式production，development
4. 文件hash值
   - hash：整个项目构建相关，构建一次生成一个hash
   - chunkhash：公共代码和自己的bundle分别生成hash，公共代码不变hash不变
   - contenthash：如js引用了css，js变，由于chunkhash两者是一致的，两者都会改变

