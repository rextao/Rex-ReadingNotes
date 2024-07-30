<template>
    <div :class="$attrs.disabled ? 'input-range disabled' : 'input-range'">
        <span v-if="title" class="input-range-title">{{ title }}</span>
        <element-divider v-if="title" direction="vertical" class="input-range-title-split" />
        <ProInput v-model="minModel" v-bind="minAttrs" @blur="handleBlur" @change="handleChange('$event', 'min')">
            <template v-for="(slotVal, slotName) in $slots" #[slotName]>
                <slot :name="slotName"></slot>
            </template>
        </ProInput>
        <span class="joiner">{{ split }}</span>
        <ProInput v-model="maxModel" v-bind="maxAttrs" @blur="handleBlur" @change="handleChange('$event', 'max')">
            <template v-for="(slotVal, slotName) in $slots" #[slotName]>
                <slot :name="slotName"></slot>
            </template>
        </ProInput>
        <div v-if="unit" class="proinput-unit">
            <div class="proinput-unit-text">{{ unit }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, defineEmits, inject, useAttrs } from 'vue';
import { Message } from 'element';
import { elFormEvents, ElFormItemContext, elFormItemKey } from 'element/lib/element-form';
import ProInput from './ProInput.vue';
import { getK18n } from '@/components/proUtils/get';

const $k18n = getK18n();
const emits = defineEmits(['update:modelValue', 'update:min', 'update:max', 'blur', 'change']);
const elFormItem = inject(elFormItemKey, {} as ElFormItemContext);

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: '',
    },
    min: {
        type: [String, Number],
        default: '',
    },
    max: {
        type: [String, Number],
        default: '',
    },
    minProps: {
        type: Object,
        default: () => ({}),
    },
    maxProps: {
        type: Object,
        default: () => ({}),
    },
    split: {
        type: String,
        default: 'to',
    },
    validateEvent: {
        type: Boolean,
        default: true,
    },
    unit: {
        type: String,
        default: '',
    },
});
const attrs = useAttrs();
const minAttrs = computed(() => ({ placeholder: $k18n('最小值'), ...attrs, ...props.minProps }));
const maxAttrs = computed(() => ({ placeholder: $k18n('最大值'), ...attrs, ...props.maxProps }));
function isEmpty(min, max) {
    return (min === '' || min === undefined) && (max === '' || max === undefined);
}
const minModel = computed({
    get() {
        const { min, modelValue } = props;
        if (isEmpty(min, '') && isEmpty(modelValue?.[0], '')) {
            return '';
        }
        return min || modelValue?.[0] || 0;
    },
    set(val) {
        props.modelValue[0] = val;
        // 如果max ，min为空，则同步v-model = []，数组
        if (isEmpty(val, props.modelValue[1])) {
            emits('update:modelValue', []);
        } else {
            emits('update:modelValue', props.modelValue);
        }
        emits('update:min', val);
    },
});
const maxModel = computed({
    get() {
        const { max, modelValue } = props;
        if (isEmpty('', max) && isEmpty('', modelValue?.[1])) {
            return '';
        }
        return max || modelValue?.[1] || 0;
    },
    set(val) {
        props.modelValue[1] = val;
        if (isEmpty(props.modelValue[0], val)) {
            emits('update:modelValue', []);
        } else {
            emits('update:modelValue', props.modelValue);
        }
        emits('update:max', val);
    },
});
// const elFormEvents = {
//     addField: 'el.form.addField',
//     removeField: 'el.form.removeField',
//     formBlur: 'el.form.blur',
//     formChange: 'el.form.change',
// } as const;
const handleBlur = (event, type) => {
    emits('blur', event, type);
    if (props.validateEvent) {
        elFormItem.formItemMitt?.emit(elFormEvents.formBlur, [event]);
    }
};
const handleChange = (event, type) => {
    emits('change', event, type);
    if (props.validateEvent) {
        elFormItem.formItemMitt?.emit(elFormEvents.formChange, [event]);
    }
};
defineExpose({
    validate,
    validateEmpty,
});
function validateEmpty() {
    const { min, max } = props;
    if ((!min && parseInt(`${min}`) !== 0) || !max) {
        Message.error($k18n('请输入内容'));
        return false;
    }
    return true;
}
function validate() {
    const min = Number(props.min);
    const max = Number(props.max);
    // 允许 前或后值不填
    if (min && max) {
        if (min > max) {
            Message.error($k18n('请从小到大输入数字'));
            return false;
        }
    }
    return true;
}
</script>
<style lang="scss" scoped>
.input-range {
    display: flex;
    flex-direction: row;
    border: 1px solid #d5d6d9;
    height: 34px;
    border-radius: 4px;
    background: #fff;
    &.disabled {
        background: #f3f3f3;
    }
    &:hover {
        border: 1px solid #5990ff;
    }
    &-title {
        margin-left: 12px;
        margin-right: 8px;
    }
    &-title-split {
        height: 20px;
        margin-top: 8px;
        width: 2px;
        margin-right: 0;
        margin-left: 0;
    }
    .joiner {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 5px;
        margin: 0;
        text-align: center;
        font-size: 12px;
        color: #999999;
        white-space: nowrap;
    }
    :deep(.element-input__inner) {
        border: 0px;
        padding-left: 12px;
        padding-right: 0px;
        text-align: left;
    }

    :deep(.element-input__inner:focus) {
        box-shadow: none !important;
        position: relative;
        border: 0px;
    }
    :deep(.element-input-group__append, .element-input-group__prepend) {
        background-color: #fff;
        border: none;
    }
    .proinput-unit {
        display: flex;
        align-items: center;
        &::before {
            content: ' ';
            background: #ebedf0;
            height: 20px;
            line-height: 36px;
            width: 2px;
        }
    }
    .proinput-unit-text {
        margin-left: 12px;
        margin-right: 12px;
    }
}
</style>
