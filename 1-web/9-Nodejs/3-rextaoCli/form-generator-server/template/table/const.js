export const PAGE_INFO = {
    current: 1,
    total: 10000,
    size: 15,
    pageCount: 5,
    layout: 'prev, pager, next'
};
function setCommonProps(config) {
    return config.map(item => {
        // 增加每列都有的common属性
        item.props = {
            ...item.props,
            align: 'center'
        };
        return item;
    });
}
const tableConfig = {{{_table.config}}};
export const TABLE_CONFIG = setCommonProps(tableConfig);
