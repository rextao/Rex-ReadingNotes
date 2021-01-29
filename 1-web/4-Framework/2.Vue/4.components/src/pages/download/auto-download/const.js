export const KEY_SUCCESS = 'success';
export const KEY_LOADING = 'loading'; // 正在下载
export const KEY_ERROR = 'error';
export const KEY_WAIT = 'wait'; // 未下载状态

const state = {};
state[KEY_SUCCESS] = {
    BTN_TEXT: '重新下载',
    BTN_TYPE: 'success',
    ICON_CLASS: 'el-icon-circle-check text-success',
};
state[KEY_LOADING] = {
    BTN_TEXT: '下载中...',
    BTN_TYPE: 'primary',
    ICON_CLASS: 'el-icon-loading',

};
state[KEY_ERROR] = {
    BTN_TEXT: '重试',
    BTN_TYPE: 'danger',
    ICON_CLASS: 'el-icon-circle-close text-danger',
};
state[KEY_WAIT] = {
    BTN_TEXT: '手动下载',
    BTN_TYPE: 'info',
    ICON_CLASS: 'el-icon-download',
};
export const STATE = state;
export const TABLE_CONFIG = [
    {
        prop: 'photoId',
        label: 'photoId',
    },
    {
        prop: 'userName',
        label: '用户名',
    },
];
