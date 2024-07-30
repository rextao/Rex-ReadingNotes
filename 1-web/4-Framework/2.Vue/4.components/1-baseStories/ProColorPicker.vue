<template>
    <element-row type="flex" :class="['atmosphereBgColor-wrapper', colorDisabled ? 'is-disabled' : '']">
        <element-color-picker v-model="model" v-bind="$attrs" />
        <span style="margin-left: 4px">{{ model }}</span>
    </element-row>
</template>

<script lang="ts" setup>
import { computed, inject, defineComponent, PropType, ref, watch, useAttrs } from 'vue';
import { elFormKey, ElFormContext } from 'element/lib/element-form';

const elForm = inject(elFormKey, {} as ElFormContext);
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: () => '',
    },
});
const attrs = useAttrs();
const colorDisabled = computed(() => {
    return attrs.disabled || elForm.disabled;
});
const emits = defineEmits(['update:modelValue', 'change']);
const model = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
        emits('change', val);
    },
});
</script>
<style lang="scss" scoped>
.atmosphereBgColor-wrapper {
    border: 1px solid #d5d6d9;
    background-color: #fff;
    border-radius: 4px;
    :deep(.element-color-picker__trigger) {
        border: none;
    }
    &.is-disabled {
        background-color: #fafafa;
    }
}
</style>
