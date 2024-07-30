export const trans = props => {
    const { label, val, options } = props;
    // [1,2,4,5] =>[{label:1,value:1},{label:2,value:2},{label:3,value:3},...]；
    if (options && Array.isArray(options) && options[0] && !options[0][label]) {
        return options.map(opItem => {
            return {
                [label]: opItem,
                [val]: isNaN(Number(opItem)) ? opItem : Number(opItem),
            };
        });
    }
    // {ara: '阿拉伯桶',arg: '阿根廷桶',aus: '澳大利亚桶',bgd: '孟加拉国',br: '巴西桶'} =>[{label:'阿拉伯桶',value:'ara'},{label:'阿根廷桶',value:'arg'}]
    if (Object.prototype.toString.call(options) === '[object Object]') {
        interface optionsArr {
            label: string;
            value: any;
        }
        const optionsArr: optionsArr[] = [];
        for (const key in options) {
            optionsArr.push({
                label: options[key],
                value: isNaN(Number(key)) ? key : Number(key),
            });
        }

        return optionsArr;
    }
    return options;
};
