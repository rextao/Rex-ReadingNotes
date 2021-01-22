const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
    entry: './entry/entry-client.js',
    optimization:{
        runtimeChunk:true
    },
    plugins: [
        new VueSSRClientPlugin()
    ]
})
