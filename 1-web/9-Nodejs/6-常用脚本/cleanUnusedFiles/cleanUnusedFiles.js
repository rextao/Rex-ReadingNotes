/**
 * 清理未被引用的代码
 * 使用方式：
 *  1、根目录下直接执行： node scripts/cleanUnusedFiles.js，生成unused-file.json文件
 *  2、配置下面变量deleteDir用于删除某个文件夹下的文件
 *  3、再执行 node scripts/cleanUnusedFiles.js, 删除指定目录下文件
 * 上述使用方式：主要为了避免问题，可以修改下代码，删除全部未被引用的模块
 */
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const UnusedFilesPlugin = require('./unused-files-plugin');
const webConfig = require('./../conf/webpack.web');
// 配置
const root = './src'; // 检索目录
const deleteDir = ''; // 要删除的目录。 只会删除 ${root}/${deleteDir}下的文件
const dir = path.join(__dirname, '../unused-files.json');
const deleteJsonDir = path.join(__dirname, '../delete-files.json');
if (!deleteDir) {
    console.log('最好配置deleteDir，如要清空root全部文件，请注释此段');
    return;
}
if (fs.existsSync(dir)) {
    const unUsedFiles = require(dir);
    const deleteFiles = [];
    const deletePath = path.join(__dirname, `../${root}/${deleteDir}`);
    unUsedFiles.forEach(item => {
        if (item.indexOf(deletePath) !== -1) {
            fs.rmSync(item, { recursive: true });
            deleteFiles.push(item);
        }
    });
    fs.writeFileSync(deleteJsonDir, JSON.stringify(deleteFiles, null, 4));
} else {
    const config = merge(webConfig, {
        plugins: [
            new UnusedFilesPlugin({
                root,
                ignore: [
                    '**/*.ts',
                    '**/*.json',
                    '**/*.html',
                    '**/*.md',
                    '*/**/typings/**',
                    '*/**/view/**',
                ],
            }),
        ],
    });
    webpack(config, (err, compilation) => {
        if (err || compilation && compilation.hasErrors()) {
            process.exit(1);
        }
    });
}

