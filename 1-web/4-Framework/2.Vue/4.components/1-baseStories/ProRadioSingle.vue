<template>
    <element-radio v-for="(item, v) in options" v-bind="attrs" :key="v" v-model="model" :disabled="item.disabled" :label="item[val]">
        <slot name="prepend" :item="item"></slot>
        {{ isK18n ? $k18n(item[label]) : item[label] }}
        <ProTooltip v-if="tooltips[v] || item.tooltip" :content="$k18n(tooltips[v] || item.tooltip)" />
        <slot name="append" :item="item"></slot>
    </element-radio>
</template>

<script lang="ts" setup>
import { useAttrs, computed, ref, watch } from 'vue';
import { ProTooltip } from '@components/base/index';
import { trans } from './util';
import { getK18n } from '@/components/proUtils/get';

const props = defineProps({
    isK18n: {
        type: Boolean,
        default: false,
    },
    k18nDesc: {
        type: String,
        default: '',
    },

    options: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: [String, Boolean, Number],
        default: '',
    },
    label: {
        type: String,
        default: 'label',
    },
    // 下拉选项的value
    val: {
        type: String,
        default: 'value',
    },
    tooltips: {
        type: Array,
        default: () => [],
    },
    transform: {
        type: String,
        default: '',
    },
});
const emits = defineEmits(['update:modelValue', 'change']);
const attrs = useAttrs();

const $k18n = getK18n();
const model = computed({
    get() {
        if (typeof props.modelValue === 'string') {
            return props.modelValue;
        }
        if (typeof props.modelValue === 'boolean') {
            return +props.modelValue;
        }
        return props.modelValue;
    },
    set(val) {
        let result = val;
        if (props.transform === 'string' && typeof val !== 'string') {
            result = val.toString();
        }
        if (props.transform === 'boolean' && typeof val !== 'boolean') {
            result = !!Number(val);
        }
        emits('update:modelValue', result);
        emits('change', result);
    },
});

const transOptions = ref(trans(props));
watch(
    () => props.options,
    newVal => {
        transOptions.value = trans(props);
    }
);
</script>
<style lang="scss" scoped>

</style>
