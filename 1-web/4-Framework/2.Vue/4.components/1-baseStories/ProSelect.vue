<template>
    <element-select
        ref="selectRef"
        v-model="model"
        class="co_select"
        popper-class="co_select_popper"
        v-bind="bindProps"
        @clear="clearSelect"
        @change="changeSelect">
        <template v-if="selectAll" #menu-prefix>
            <!-- 头部插槽内容 -->
            <div class="all-select">
                <element-checkbox ref="checkbox" v-model="isSelectAll" @change="selectAllOption">{{ $k18n('全选') }}</element-checkbox>
            </div>
        </template>
        <element-option
            v-for="(item, v) in transOptions"
            :key="v"
            :label="
                getK18nValue(item[label], {
                    k18nDesc,
                    isK18n,
                })
            "
            :value="item[val]"
            :disabled="item.disabled">
            <slot name="custom-option" :item="item"></slot>
        </element-option>

        <slot name="after-option"></slot>

        <template v-for="(slotVal, slotName) in $slots" #[slotName]>
            <slot :name="slotName"></slot>
        </template>
    </element-select>
</template>

<script lang="ts">
import { Select, Option } from 'element';
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { get } from 'lodash';
import lodashDebounce from 'lodash/debounce';
import { trans } from './util';
import { getRequest, IParam } from '@/components/proUtils/util';
import { getK18n, getK18nValue } from '@/components/proUtils/get';

export interface IRequest extends IParam {
    mapkey?: string;
    queryKey?: string;
    debounceTime?: number;
}
export default defineComponent({
    name: 'ProSelect',
    components: {
        ElementSelect: Select,
        ElementOption: Option,
    },
    props: {
        isK18n: {
            type: Boolean,
            default: false,
        },
        k18nDesc: {
            type: String,
            default: '',
        },
        options: {
            type: [Array, Object],
            default: () => [],
        },
        modelValue: {
            type: [String, Number],
            default: () => '',
        },
        label: {
            type: String,
            default: 'label',
        },
        transform: {
            type: String,
            default: '',
        },
        val: {
            type: String,
            default: 'value',
        },
        request: {
            type: [Object, String] as PropType<IRequest | String>,
            default: '',
        },
        // 是否使用全选功能
        selectAll: {
            type: Boolean,
            default: false,
        },
        // 全选状态的对应值
        allMatchValue: {
            type: [Number, String],
            default: -1,
        },
        // 开始全选功能时，是否默认选中全选
        defaultAll: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change', 'clear'],
    setup(props, ctx) {
        const $k18n = getK18n();
        const selectRef = ref(null);
        const isSelectAll = ref(false);
        const optionsKeyLength = computed(() => {
            return transOptions.value.length;
        });
        const model = computed({
            get() {
                if (props.transform === 'array' && !ctx.attrs.multiple) {
                    return props.modelValue?.[0] || '';
                }

                if (props.selectAll && isSelectAll.value && props.modelValue?.[0] === props.allMatchValue) {
                    return transOptions.value?.map(item => item[props.val]);
                }
                return props.modelValue;
            },
            set(val) {
                let result = val;
                if (props.transform === 'array' && !Array.isArray(val)) {
                    if (val === '' || val === undefined) {
                        result = [];
                    } else {
                        result = [val];
                    }
                }
                if (props.selectAll) {
                    ctx.emit('update:modelValue', isSelectAll.value && val.length === optionsKeyLength.value ? [props.allMatchValue] : result);
                } else {
                    ctx.emit('update:modelValue', result);
                }
                ctx.emit('change', result);
            },
        });

        const transOptions = ref(trans(props));
        if (!props.request) {
            watch(
                () => props.options,
                newVal => {
                    transOptions.value = trans(props);
                }
            );
        }
        const checkDefaultAllValue = () => {
            if (props.selectAll && props.defaultAll) {
                model.value = transOptions.value?.map(item => item[props.val]);
            }
        };

        const remoteMethod = async (query?: string | boolean) => {
            if (!query) return;
            let url = props.request.url!;
            if (query) {
                const queryKey = props.request.queryKey || 'search';
                url = url.includes('?') ? `${url}&${queryKey}=${query}` : `${url}?${queryKey}=${query}`;
            }
            props.request.debounceTime ? debouncedQueryChange(url) : requestHandler(url);
        };
        const requestHandler = async url => {
            const res: any = await getRequest({ ...props.request, url });
            const { data } = res;
            transOptions.value = trans({
                label: props.label,
                val: props.val,
                options: props.request?.mapkey ? get(data, props.request.mapkey) : data,
            });
        };

        const debouncedQueryChange = lodashDebounce(url => {
            requestHandler(url);
        }, props.request.debounceTime);

        const bindProps = computed(() => {
            let defaultAttrs: { [key: string]: any } = {
                placeholder: $k18n('请选择'),
            };
            if (props.request) {
                // 如果直接传入的 remote,ctx.attrs.remote是'',所以这里用Reflect.has判断属性有没有
                if (Reflect.has(ctx.attrs, 'remote')) {
                    defaultAttrs = {
                        filterable: true,
                        remote: true,
                        'remote-method': remoteMethod,
                        'token-separators': '[",", "+"]',
                        placeholder: $k18n('请输入'),
                        'no-data-text': $k18n('无数据'),
                        'loading-text': $k18n('加载中'),
                    };
                } else {
                    remoteMethod(true);
                }
            }
            return {
                ...defaultAttrs,
                ...ctx.attrs,
            };
        });

        const selectAllOption = () => {
            if (isSelectAll.value) {
                model.value = transOptions.value?.map(item => item[props.val]);
            } else {
                model.value.length = 0;
            }
        };
        const clearSelect = val => {
            ctx.emit('clear');
        };

        const changeSelect = () => {
            if (props.selectAll) {
                const modelLength = computed(() => {
                    return model.value;
                });
                isSelectAll.value = modelLength.value === optionsKeyLength.value;
            }
        };

        watch(
            () => props.modelValue,
            newVal => {
                if (props.selectAll && newVal.length === optionsKeyLength.value) {
                    isSelectAll.value = true;
                    selectAllOption();
                }
            },
            { immediate: true, deep: true }
        );

        // 校验开启全选是否要默认选中
        checkDefaultAllValue();

        return {
            bindProps,
            model,
            optionsKeyLength,
            isSelectAll,
            transOptions,
            $k18n,
            getK18nValue,
            selectAllOption,
            changeSelect,
            clearSelect,
            checkDefaultAllValue,
            selectRef,
        };
    },
});
</script>

<style lang="scss">
.co_select {
    display: inline-block;
    .element-tag {
        color: #005cff;
        background-color: #f5f8ff;
        &.is-closable {
            max-width: 130px;
        }
    }
}
.all-select {
    text-align: left;
    margin-left: 8px;
    height: 30px;
    padding-right: 20px;
}
</style>
