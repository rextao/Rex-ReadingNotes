import { isPlainObject } from 'lodash';

export function isArray(data: any[]) {
    return Array.isArray(data);
}
export function notEmptyObject(value: PlainMap) {
    return isPlainObject(value) && Object.keys(value).length;
}

export function isEmpty(value) {
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }
    if (isPlainObject(value) && Object.keys(value).length === 0) {
        return true;
    }
    return [null, undefined, '', NaN].includes(value);
}
