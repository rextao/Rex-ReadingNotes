const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    output:{
        path:path.resolve(__dirname,'./../dist'),
        filename:'build.js',
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude:[/node_modules/,/assets/]
            },
            {
                test:/\.vue$/,
                use:['vue-loader']
            }
        ]
    },
    resolve: {
        alias:{
            '@':path.resolve(__dirname,'../')
        },
        extensions:['.js','.vue','.json']
    },
    plugins:[
        new VueLoaderPlugin()
    ]
}
