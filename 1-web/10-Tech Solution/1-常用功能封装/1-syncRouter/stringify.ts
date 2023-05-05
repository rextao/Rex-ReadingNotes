import { isPlainObject } from 'lodash';
import { unref } from 'vue';

/**
 * 将arr转为字符串string，暂不考虑内嵌对象等复杂情况
 * @param arr
 */
export function arrayToPah(arr: any[]) {
    return arr?.join();
}

/**
 * 将递归obj转为a.b.c = xxx 形式
 * @param obj
 * @param result
 * @param originKey
 */
export function flattenObj(obj: PlainMap = {}, result?, originKey = '') {
    return Object.keys(obj).reduce((result, key) => {
        // 非`null`对象递归
        const resultKey = originKey ? `${originKey}.${key}` : key;
        const value = unref(obj[key]);
        if (isPlainObject(value)) {
            return flattenObj(value, result, resultKey);
        }
        result[resultKey] = value;
        return result;
    }, result || {});
}
