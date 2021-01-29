const path = require('path');
const resolve = filepath => path.resolve(__dirname, filepath);
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@src': resolve('src'),
            },
        },
    }
}
