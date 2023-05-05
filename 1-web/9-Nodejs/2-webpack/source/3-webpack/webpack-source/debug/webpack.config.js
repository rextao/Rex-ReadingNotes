// const path = require('path')
// module.exports = {
// 	context: __dirname,
// 	mode: 'development',
// 	entry: './src/index.js',
// 	output: {
// 		path: path.join(__dirname, './dist'),
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.css$/,
// 				use: [
// 					'style-loader',
// 					'css-loader',
// 					'less-loader',
// 				]
// 			},
// 			{
// 				test: /\.vue$/,
// 				use: [
// 					'vue-loader',
// 				]
// 			}
// 		]
// 	},
// }
module.exports = {
	entry: {
		app: './src/a.js'
	},
	output: {
		filename: 'abcdef[name].[chunkhash].js',
		chunkFilename: 'abcdef[name].bundle.[chunkhash:8].js',
		publicPath: '/'
	},
	//默认值是 false：每个入口 chunk 中直接嵌入 runtime。
	// 把运行时的`__webpack_require__.m`,`__webpack_require__.n`等函数单独放在一个文件里
	// optimization: {
	// 	runtimeChunk: {
	// 		name: 'bundle'
	// 	}
	// },
	mode: 'development'
}
