const config = require('./../const');
const defaultComponents = require('./../generator/defaultComponents');
/**
 *  需要生成
 *  - index.vue
 *  - const.js
 *  - components
 *    - list-table.vue
 * data为数组，即json.info.cols 内容
 */
function generatorTable(info, options) {
    const importCom = new Set();
    const { cols, forms } = info;
    // tableList字段
    const config = [];
    const searchForm = {};
    const tableList = {
        config: [],
        slot: [], // table-list对应的table配置插槽
        forms: {
            template: '',// table中的search表单
            components: '', // components需要添加的内容
            imports: '', // 需要import的内容
            searchForm: {}
        },
        componentName: getComponentName(options)
    };
    cols.forEach(col => {
        const configItem = getConfigItem(col);
        config.push(configItem);
        if (configItem.slot) {
            tableList.slot.push(configItem.slot);
        }
    });
    const formLen = forms.length;
    const format = '\n\t\t\t';
    forms.forEach((form, index) => {
        const { component } = form;
        importCom.add(component);
        tableList.forms.template += defaultComponents[component].render(form);
        searchForm[form.output] = '';
        if (formLen - 1 !== index) {
            tableList.forms.template += format;
        }
    });
    const { components, imports } = getFormImports(importCom);
    tableList.forms.imports = imports;
    tableList.forms.components = components;
    tableList.forms.searchForm = JSON.stringify(searchForm, '', 8);
    tableList.config = JSON.stringify(config, '', 4);
    options._table = tableList;
}
function getFormImports(importCom) {
    const arrayCom = Array.from(importCom);
    // todo 默认有form，formItem
    arrayCom.push('form', 'formItem');
    let imports = '';
    let components = '';
    arrayCom.forEach(item => {
        const upperWord = getFirstWordUpper(item);
        imports += `${upperWord},\n\t`;
        components += `KsEl${upperWord}: ${upperWord},\n\t\t`
    });
    return {
        components,
        imports,
    }
}
function getComponentName(options) {
    return getFirstWordUpper(options.business.name);

}
function getConfigItem(col) {
    const { key, type, rowName } = col;
    const { TEXT, SLOT } = config.COMPONENTS_TYPE;
    const configItem = {
        label: rowName,
        key,
    };
    if (type !== TEXT) {
        configItem.type = type;
    }
    if (type === SLOT) {
        configItem.slot = key;
    }
    return configItem;
}

// tools
function getFirstWordUpper(data) {
    return data.replace(/^(\w)/, (all, letter) => letter.toUpperCase());
}

module.exports = generatorTable;
