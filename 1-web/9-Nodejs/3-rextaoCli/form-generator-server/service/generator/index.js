const json = require('./../../config');
// const quick = require('./../../quick');
// 快速生成config格式 Todo
// function getConfigContent() {
//
// }
// const json = getConfigContent();
const generatorTable = require('./generatorTable');
// const generatorForm = require('./generatorForm');
function parse(options) {
    // todo  判断类型, 判断要生成哪些文件
    const business = {
        name: 'test',
        path: 'xxxx-xxxx-test' // 之后 todo 要根据目录生成
    };
    options.business = business;
    const tableData = json.info; // info.cols表示table
    // const formData = json.info.form;
    generatorTable(tableData, options)

}
// 由于最终调用writeFillTree写文件，故generator就是生成files对象
function generator(options) {
    parse(options);
}

module.exports = generator;
