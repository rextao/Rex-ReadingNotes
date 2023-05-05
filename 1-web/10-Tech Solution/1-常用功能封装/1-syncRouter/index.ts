import { isObject, isPlainObject, omit, pick } from 'lodash';
import { useRouter, useRoute } from 'vue-router';
import { onMounted, unref, isRef, Ref } from 'vue';
import { isArray, isEmpty } from '@/lib/syncRouter/utils';
import { arrayToPah, flattenObj } from '@/lib/syncRouter/stringify';
import { DECODE_MAP } from './parse';

import { $weblog } from '@/plugins/weblog';
import { IUseSyncRouterBaseData, IUseSyncRouterData } from '@/lib/syncRouter/type';

type IConfig = {
    type?: {
        [key: string]: keyof typeof DECODE_MAP;
    };
    // 忽略某些key的同步
    omitKey?: string[];
    // 只使用哪些key，优先级高于omitKey
    // 如果两个都配置：先omit，然后再从接口pick
    pickKey?: string[];
    afterDataUpdate?: () => void;
};
const DEFAULT_CONFIG = {
    pickKey: [],
    omitKey: [],
    type: {},
};
/**
 * syncAfterDataChange
 * type: { a: 'array' }
 * data 为对象，且config配置多余的key，会进行同步
 * data 不能为ref值，ref值无key
 */
export default function useSyncRouter(data?: IUseSyncRouterData, config?: IConfig) {
    // 配置类型
    const { type, afterDataUpdate, omitKey, pickKey }: any = {
        ...DEFAULT_CONFIG,
        ...config,
    };
    const router = useRouter();
    const route = useRoute();
    // 是否调用 afterDataUpdate 方法
    let callAfterData = false;

    onMounted(() => {
        syncFromRouter();
    });

    function syncObject(obj: IUseSyncRouterBaseData) {
        const { query } = route;
        let item = unref(obj);
        if (pickKey?.length > 0) {
            item = pick(item, pickKey || []);
        }
        // 拿到 config.type 配置的key与 传入obj的key
        const typeKeys = Object.keys(type);
        const itemKeys = Object.keys(item);
        const keys = Array.from(new Set([...typeKeys, ...itemKeys]));
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (omitKey && omitKey?.includes(key)) {
                continue;
            }
            if (query[key]) {
                // 是否针对某个key有类型配置
                const typeKey = type?.[key];
                // 传入数据每个key对应的初始值，可能传入数据是{ a: ref }
                const value = unref(item[key]);
                // 判断数据值是否为ref
                const refItem = isRef(item[key]);
                // 初始值类型 ,todo 解析对象
                const valueType = Array.isArray(value) ? 'array' : typeof value;
                // 如果配置了类型，则使用，否则判断传入数据对应key的类型
                const decodeFunc = DECODE_MAP[typeKey || valueType];
                if (decodeFunc) {
                    const decodeValue = decodeFunc(`${query[key]}`);
                    if (isRef(obj)) {
                        (obj as Ref).value[key] = decodeValue;
                    } else if (refItem) {
                        obj[key].value = decodeValue;
                    } else {
                        obj[key] = decodeValue;
                    }
                }
            }
        }
    }
    async function syncFromRouter() {
        // 只同步data有的key，或+ config配置的key
        // 因为要同步修改data，注意保持引用
        if (Array.isArray(data)) {
            ((data || []) as any)?.forEach((item: PlainMap) => {
                syncObject(item);
            });
        } else if (isObject(data)) {
            syncObject(data);
        }

        if (afterDataUpdate) {
            callAfterData = true;
            await afterDataUpdate();
            callAfterData = false;
        }
    }

    /**
     * 生成router参数
     * @param data
     * @param config
     */
    function generateRouterQuery(data: IUseSyncRouterData = {}, config?: IConfig) {
        const { query } = route;
        const result = getValidData(data, config);
        const routerQuery = {};
        const flattenData = {};
        flattenObj(result, flattenData);
        Object.keys(flattenData).forEach(key => {
            // 对value进行编码
            const value = flattenData[key];
            // 避免路由出现一堆无效key
            // 1、只同步路由有效值，或2、路由有值且data[key]为空值
            if (!isEmpty(value) || (isEmpty(value) && query[key])) {
                if (Array.isArray(value)) {
                    routerQuery[key] = arrayToPah(value);
                } else {
                    routerQuery[key] = value;
                }
            }
        });
        return routerQuery;
    }

    function syncToRouter(addData: IUseSyncRouterData = {}) {
        if (callAfterData) {
            return;
        }
        const routerQuery = generateRouterQuery(addData, config);
        const originQuery = generateRouterQuery(data, config);

        router.push({
            path: route.path,
            query: {
                ...route.query,
                ...originQuery,
                ...routerQuery,
            },
        });
        // chrome url 长度超长，用于统计是否有必要将请求参数提交给后端
        // fullPath 不是全部查询参数
        if (route.fullPath.length > 8000) {
            $weblog.sendClick({
                action: 'LOCATION_SEARCH_GENERAL',
                params: {
                    pathname: window.location.pathname,
                },
                type: 'USER_OPERATION',
            });
        }
    }
    return {
        syncToRouter,
        syncFromRouter,
    };
}

/**
 * 判断传入的需要同步router的data数据是否符合要求
 * @param data
 * @param config
 */
function getValidData(data, config?: IConfig) {
    const result = {};
    let temp: any = [];
    const unrefData = unref(data);
    if (isPlainObject(unrefData)) {
        temp = [unrefData];
    } else if (isArray(data)) {
        temp = data;
    } else {
        console.error(TypeError('[sync-router Error]：传入的的data参数，只能为数组或对象'));
    }
    for (let i = 0; i < temp.length; i++) {
        const unrefItem = unref(temp[i]);
        if (isPlainObject(unrefItem)) {
            // pick优先级高
            Object.assign(result, unrefItem);
        } else {
            console.error(`传入data[${i}] = ${data[i]} 为非对象，将不被处理`);
        }
    }
    const omitItem = omit(result, config?.omitKey || []);
    if (config?.pickKey?.length) {
        return pick(omitItem, config?.pickKey || []);
    }
    return omitItem;
}
