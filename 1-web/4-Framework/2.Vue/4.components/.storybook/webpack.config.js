const path = require('path')
const resolve = val => path.resolve(__dirname, `../${val}`);

module.exports = async ({ config }) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        '@src': resolve('src'),
    }
    config.module.rules.push({
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: path.resolve(__dirname, '../')
    })
    return config
}
