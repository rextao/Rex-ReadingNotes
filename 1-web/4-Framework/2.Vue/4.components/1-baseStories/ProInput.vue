<template>
    <element-input
        id="proinput"
        ref="inputRef"
        v-model="model"
        v-bind="bindProps"
        :class="inputClass"
        @paste="getPasteValue"
        @blur="handleBlur"
        @clear="$emit('clear')"
        @focus="handleFocus">
        <template v-if="$slots.prepend" #prepend>
            <slot name="prepend"></slot>
        </template>
        <template #suffix>
            <slot name="suffix">
                <i v-if="suffixType && suffixType.search" class="element-icon-search search-icon" @click="handleClickSuffix"></i>
            </slot>
        </template>
        <template v-if="$slots.append" #append>
            <slot name="append"></slot>
        </template>
    </element-input>
</template>
<script lang="ts" setup>
import { ref, computed, useAttrs, reactive, PropType } from 'vue';
import { stringToRightNumber, handleThousandSeparator } from '@/components/proUtils/util';
import { NumberShowModeEnum } from './const';

enum ITransform {
    array = 'array',
    number = 'number',
    comma = 'comma',
    lineBreak = 'lineBreak', // /\r+\n*|\n+/g 转为逗号分隔，主要应对从doc/excel/等复制
    trim = 'trim',
    default = 'default',
    thousandSeparator = 'thousandSeparator',
    float = 'float', // 处理浮点数
}
type ITypeMethods = {
    [key in ITransform]: any;
};
const attrs = useAttrs();
const TYPE_TRANSFORM_METHODS: Omit<ITypeMethods, 'default'> = {
    // 与input-number区别，某些情况下，需要输入数值，但用户希望输入框默认为空而非0
    // 暂不支持负数
    number: {
        get(value: string) {
            return value;
        },
        output(value: string) {
            const trimValue = value.trim();
            // 首位为0，则直接返回0
            if (trimValue.indexOf('0') === 0) {
                return 0;
            }
            // 将非数字匹配为空，即禁止输入非数字
            return trimValue.replace(/\D/g, '');
        },
    },
    float: {
        get(value: string | number) {
            return value.toString().trim(); // 有时回显时是number，所以需要一次强转
        },
        output(value: string | number) {
            const { numberMode } = props;
            return stringToRightNumber(value, numberMode); // 将一个字符串改为允许为小数和负数的数字
        },
    },
    // 输入中英文，可能需要
    comma: {
        get(value: string) {
            return value;
        },
        output(value: string) {
            return value.trim().replace(/，/g, ',');
        },
    },
    // 提交数据为数组，需将逗号（中或英文）split
    array: {
        get(value: any) {
            if (Array.isArray(value)) {
                return value.join();
            }
            return value;
        },
        output(value: string) {
            // 数组类型，将以逗号（兼容中文逗号）分隔的文本数组形式输出
            if (!value) {
                return [];
            }
            return value.trim().split(/,|，/);
        },
    },
    lineBreak: {
        get(value: any) {
            return value;
        },
        // input 输入框（textarea）会保留换行符，粘贴进来的换行符会被转为空格，空格还会被保留
        // 现在此输入框可以支持多种组合筛选，uid，，username，
        // 如果直接将空格转为逗号，会把username中的空格转换
        // 下面转换方式有点hack，为了保留当前input样式
        output(value: string) {
            const pasteValue = state.uidPasteValue.replace(/\r+\n*|\n+/g, ' ').replace(/(^\s*)|(\s*$)/g, '');
            const commaValue = state.uidPasteValue.replace(/\r+\n*|\n+/g, ',');
            return value.replace(pasteValue, commaValue).replace(/\s*,\s*/g, ',');
        },
    },
    trim: {
        get(value: string) {
            return value;
        },
        output(value: string) {
            return value.trim();
        },
    },
    thousandSeparator: {
        // 处理需要千分位分隔符的数字输入,仅处理整数部分，同时会限制输入为数字与. - +。
        // 不用toLocaleString()是因为输入可能比较长，转为number后会出现精度或超限问题
        get(value: string | number) {
            // 展示的参数千分位分隔
            const { numberMode } = props;
            return handleThousandSeparator(value, numberMode);
        },
        output(value: string | number) {
            const { numberMode } = props;
            return stringToRightNumber(value, numberMode); // 将一个字符串改为允许为小数和负数的数字
        },
    },
};
const props = defineProps({
    modelValue: {
        type: [String, Array, Number],
        default: '',
    },
    /**
     * 数据转换
     * array: 会将逗号分隔的字符串split为数组
     * comma： 将中文逗号转为英文
     * lineBreak: 将换行符转为逗号，这个地方比较特殊
     * trim: 去掉空格
     * thousandSeparator: 处理需要千分位分隔的数字输入,仅处理整数部分，同时会限制输入为数字与. -
     */
    transform: {
        type: String as PropType<ITransform>,
        default: 'default',
    },
    /**
     * suffix类型
     * search: 搜索，有一定的交互，以及 目前search与clear联合使用样式会有问题
     */
    suffixType: {
        type: String,
        default: '',
    },
    // 背景色，只限于 suffixType = search
    background: {
        type: Boolean,
        default: true,
    },
    // 数字格式类型配置,英文模式是,为分隔符，.表示小数点，另外一种模式二者相反
    numberMode: {
        type: Number,
        default: NumberShowModeEnum.ENGLISH,
    },
});
const emits = defineEmits(['update:modelValue', 'change', 'focus', 'suffix-click', 'blur', 'clear']);

const inputRef = ref<any>();
const state = reactive({
    uidPasteValue: '',
});

const transformMethod = computed(() => {
    return TYPE_TRANSFORM_METHODS[props.transform];
});
const model = computed({
    get() {
        const { modelValue } = props;
        if (transformMethod.value) {
            return transformMethod.value.get(modelValue);
        }
        return modelValue;
    },
    set(val) {
        let result = val;
        if (transformMethod.value) {
            result = transformMethod.value.output(val);
        }
        emits('update:modelValue', result);
        emits('change', result);
    },
});
// 为避免对其他类型产生影响，以及日后扩展，增加一个class
const inputClass = computed(() => {
    const { suffixType, background } = props; // 是否有背景色
    const backgroundClass = background ? 'background' : '';
    if (props.suffixType) {
        // 目前只有 suffix_search
        return `suffix_${suffixType} ${backgroundClass}`;
    }
    return '';
});
const bindProps = computed(() => {
    return {
        clearable: true,
        ...attrs,
    };
});
const focus = () => {
    inputRef.value.focus();
};
const blur = () => {
    inputRef.value.blur();
};
const handleFocus = () => {
    emits('focus');
};
const handleClickSuffix = () => {
    emits('suffix-click');
};
const handleBlur = () => {
    emits('blur');
};
const getPasteValue = e => {
    if (ITransform.lineBreak) {
        const clipboardData = e.clipboardData;
        state.uidPasteValue = clipboardData.getData('text');
    }
};
defineExpose({
    focus,
    blur,
});
</script>
<style lang="scss" scoped>
$search_color: #005cff;
.suffix_search {
    &.background {
        :deep(.element-input__inner) {
            background-color: #f9f9f9;
            border: none;
        }
    }
    :deep(input) {
        &:focus {
            box-shadow: 0 0 0 1px $search_color;
        }
    }
    :deep(.search-icon) {
        cursor: pointer;
        margin-right: 5px;
        &:hover {
            color: $search_color;
        }
    }
    :deep(.element-input__inner) {
        padding-right: 55px;
        &:focus {
            & + .element-input__suffix {
                .search-icon {
                    color: $search_color;
                }
            }
        }
    }
    :deep(.element-input__clear) {
        order: -1;
        margin-right: 9px;
        font-size: 14px;
        color: #bbbdbf;
    }
    :deep(.element-textarea .element-textarea__inner) {
        padding: 8px 12px !important;
    }
    .element-textarea .element-textarea__inner {
        padding: 8px 12px !important;
    }
    .element-textarea__inner {
        padding: 8px 12px !important;
    }
    :deep(.element-textarea__inner) {
        padding: 8px 12px !important;
    }
}
</style>
