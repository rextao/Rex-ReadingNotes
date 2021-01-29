export const LOCAL_STORAGE_KEY = 'LOCAL_STORAGE_KEY_CATEGORY_CASCADER';
export const DATA_CATEGORY_OPTIONS = [
    { label: '全部', value: '全部' }, //
    { label: '短剧', value: '短剧' },
    { label: '教育', value: '教育' },
    { label: '人文艺术', value: '人文艺术', children: [
        { label: '手艺手工', value: '手艺手工' },
        { label: '书画  ', value: '书画' },
        { label: '戏曲曲艺', value: '戏曲曲艺' },
        { label: '人文艺术(无二级)', value: '人文艺术(无二级)' },
    ] },
    { label: '房产家居', value: '房产家居', children: [
        { label: '房产', value: '房产' },
        { label: '家居家装', value: '家居家装' },
        { label: '房产家居(无二级)', value: '房产家居(无二级)' },
    ] },
];
