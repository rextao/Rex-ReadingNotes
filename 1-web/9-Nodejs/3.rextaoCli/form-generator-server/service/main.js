const path = require('path');
const getAllFiles = require('./utils/getAllFiles.js');
const writeFileTree = require('./utils/writeFileTree.js');
const templateDir = path.resolve(__dirname, '../template');
const targetDir = path.resolve(__dirname, '../generator-result'); // 生成文件在 运行命令文件夹的components文件夹下
const generator = require('./generator')
main();
async function main() {
    const options = {}
    generator(options);
    const files = await getAllFiles(templateDir, options);
    changeFileName(files, options);

    writeFileTree(targetDir, files);
}
function changeFileName(files, options) {
    const fileName = 'table-list.vue';
    const tableListName = `table/components/${fileName}`;
    const newName = tableListName.replace(fileName, `${options.business.name}-${fileName}`)
    const tableList = files[tableListName];
    delete files[tableListName]
    files[newName] = tableList;
}
