<template>
    <element-input v-model="model" :class="['phonenum-input', isSimpleMode ? 'simple' : '']" @input="throwWholePhoneArray">
        <template #prepend>
            <element-select v-if="isGroupMode" v-model="areaCode" filterable @change="throwWholePhoneArray">
                <element-option-group v-for="group in areaCodeArray" :key="group.label" :label="group.label">
                    <element-option v-for="item in group.options" :key="item.value" :label="'+' + item.label" :value="item.value" />
                </element-option-group>
            </element-select>
            <element-select v-else v-model="areaCode" filterable @change="throwWholePhoneArray">
                <element-option v-for="(item, key) in areaCodeArray" :key="key" :label="'+' + item.label" :value="item.value" />
            </element-select>
        </template>
    </element-input>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { Input, Select, Option } from 'element';
import { cloneDeep } from 'lodash';
import { AREA_CODE } from './const';
import { getK18n } from '@/components/proUtils/get';

export default defineComponent({
    name: 'ProInputPhone',
    components: {
        ElementInput: Input,
        ElementSelect: Select,
        ElementOption: Option,
    },
    props: {
        modelValue: {
            type: [String, Number],
            default: '',
        },
        // 自定义区域选择项  不传默认返回所有分组选项
        customizeAreaCode: {
            type: Object,
            default: () => {},
        },
        // 自定义区域选择项时是否开启mixin模式, 开启则将自定义区域选择项与默认选择项混合,不开启则只使用自定义区域选择项，
        isMixinMode: {
            type: Boolean,
            default: true,
        },
        // 默认显示区域号
        defaultAreaCode: {
            type: String,
            default: '',
        },
        // 样式分组模式
        isGroupMode: {
            type: Boolean,
            default: true,
        },
        // 简约模式 无边框
        isSimpleMode: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'throwWholePhoneArray'],
    setup(props, ctx) {
        const areaCode = ref('');

        const $k18n = getK18n();

        const model: any = computed({
            get() {
                const { modelValue } = props;
                return modelValue.toString();
            },
            set(val) {
                ctx.emit('update:modelValue', val);
            },
        });

        const areaCodeArray = ref<any>([]);

        // 初始化地区选项数据
        const initPhoneAreaCodeData = () => {
            let baseAreaCode: any = [];
            const itemObj = {
                label: '',
                options: [],
            };
            if (!props.customizeAreaCode?.label) {
                // 默认使用全部地区选项
                baseAreaCode = cloneDeep(AREA_CODE.options);
            } else {
                const areaKeys = AREA_CODE.options.map(item => {
                    return item.label;
                });

                if (areaKeys.includes(props.customizeAreaCode.label)) {
                    if (props.customizeAreaCode.options.length > 0) {
                        itemObj.label = props.customizeAreaCode.label;
                        itemObj.options = props.customizeAreaCode.options.map(item => {
                            const option = {
                                value: item,
                                label: item?.toString(),
                            };
                            return option;
                        });
                        baseAreaCode.push(itemObj);
                    } else {
                        itemObj.label = props.customizeAreaCode.label;
                        itemObj.options = AREA_CODE.options.find(item => {
                            return item.label === props.customizeAreaCode.label;
                        })?.options;
                        baseAreaCode.push(itemObj);
                    }
                } else {
                    // 自定义label ，未使用areaKeys
                    itemObj.label = props.customizeAreaCode.label;
                    itemObj.options =
                        props.customizeAreaCode.options.map(item => {
                            const option = {
                                value: item,
                                label: item?.toString(),
                            };
                            return option;
                        }) || [];
                    if (!props.isMixinMode) {
                        baseAreaCode.push(itemObj);
                    } else {
                        // 使用mixin模式，将自定义label与baseAreaCode混
                        baseAreaCode = [itemObj, ...AREA_CODE.options];
                    }
                }
            }
            // 模式选择
            if (!props.isGroupMode) {
                // 不采用分组模式，concat数组
                let concatAreaArray = [];
                baseAreaCode.forEach(item => {
                    concatAreaArray = concatAreaArray.concat(item.options);
                });
                areaCodeArray.value = concatAreaArray;
            } else {
                areaCodeArray.value = baseAreaCode;
            }
            // 地区值初始化，无默认值选择传入第一个
            if (props.defaultAreaCode !== '') {
                areaCode.value = props.defaultAreaCode || areaCodeArray.value?.[0]?.value;
            } else if (props.isGroupMode) {
                areaCode.value = areaCodeArray.value?.[0]?.options?.[0].value;
            } else {
                areaCode.value = areaCodeArray.value?.[0]?.value;
            }
        };

        const throwWholePhoneArray = (value: any) => {
            // phonenumber输入框才需要校验, 只允许输入数字;
            console.log('value.length', value.length);
            if (typeof value === 'string') {
                model.value = value.replace(/[^0-9]|/g, '').substring(0, 16);
            }
            const outcome = [areaCode.value, model];
            ctx.emit('throwWholePhoneArray', outcome);
        };

        onMounted(() => {
            initPhoneAreaCodeData();
        });

        return {
            $k18n,
            ...props,
            areaCode,
            model,
            areaCodeArray,
            throwWholePhoneArray,
        };
    },
});
</script>
<style lang="scss" scoped>
.phonenum-input {
    width: 336px;
}
.simple {
    :deep(.element-input-group__prepend) {
        background-color: white;
        border: none;
        width: 80px;
    }
    :deep(.element-input-group__prepend .element-select .element-input__inner) {
        padding-bottom: 2px;
    }
}
</style>
