type ICommon = {
    key: String;
    label?: String;
    k18n?: Boolean; // 是否使用k18n方法进行转换label值，目前默认为value不需要多语言转换
    transform?: (value: any, data: any, item: IConfigItem) => any;
    hoverTooltip?: boolean | string;
};
type ITime = {
    type: 'time';
    format: string;
};
type INum = {
    type: 'num';
    toFixed?: number;
};
// a标签
type IA = {
    type: 'a';
};

type IConfigItem = INum & ITime & IA & ICommon;
