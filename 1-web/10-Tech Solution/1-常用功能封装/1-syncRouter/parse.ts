export const DECODE_MAP = {
    boolean: (val: any) => {
        if (typeof val === 'boolean') {
            return val;
        }
        return val === 'true';
    },
    string: (val: any) => val,
    number: (val: any) => {
        if (typeof val === 'number') {
            return val;
        }
        // 数字太多会自动转化为科学计数法，这里有问题
        if (val === 'null' || val === '' || val === 'Infinity' || val === '-Infinity') {
            return undefined;
        }
        const number = Number(val);
        return Number.isNaN(number) ? undefined : number;
    },
    undefined: () => undefined,
    null: () => null,
    // 默认转为[1,2,3,4,5,6],空字符串会转为0
    array: (val: string) =>
        val.split(',').map(_ => {
            // 避免解析为NaN
            if (!_) {
                return 0;
            }
            return Number.parseFloat(_);
        }),
    arrayString: (val: string) => val.split(','),
};
