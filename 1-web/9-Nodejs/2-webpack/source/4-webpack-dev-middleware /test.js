const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
// 传入 compiler
app.use(webpackDevMiddleware(compiler, {
}));

app.listen(8080, function () {
    console.log('listening on port 8080')
})
