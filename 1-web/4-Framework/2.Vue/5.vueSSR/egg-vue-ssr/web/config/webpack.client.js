const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const path = require('path')

module.exports = merge(baseConfig, {
    entry: path.resolve(__dirname,'../entry/entry-client.js'),
    output:{
        publicPath: 'http://127.0.0.1:8080'
    },
    optimization:{
        runtimeChunk:true
    },
    devServer: {
        headers: {'Access-Control-Allow-Origin': '*'},
        contentBase: path.resolve(__dirname,'./../dist'),
    },
    plugins: [
        new VueSSRClientPlugin()
    ]
})
