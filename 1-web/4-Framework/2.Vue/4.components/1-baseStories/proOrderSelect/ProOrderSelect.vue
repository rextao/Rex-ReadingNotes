<template>
    <span class="sort_select__wrapper">
        <span class="icon_wrapper" @click="handleOrderTypeChange">
            <IconColourAscendActive v-if="props.modelValue?.order === OrderEnum.ASC" :size="18" />
            <IconColourDescendActive v-else :size="18" />
        </span>
        <ProPopover placement="bottom-end" trigger="hover" width="auto" popper-class="pro_sort_select__popover">
            <template #reference>
                <span class="label_select">{{ $k18n(activeLabel) }}</span>
            </template>
            <template #default>
                <SelectDropdown v-model="selectModelValue" :options="options" :label="label" :val="val" @change="handleSortChange" />
            </template>
        </ProPopover>
    </span>
</template>

<script setup lang="ts">
import { ref, PropType, watch, reactive } from 'vue';
import { IconColourAscendActive, IconColourDescendActive } from '@element/pro-icons';
import { getK18n } from '@components/proUtils';
import SelectDropdown from './SelectDropdown.vue';
import { ProPopover } from '@/components/base/index';
import { OrderEnum } from '@/type';

const $k18n = getK18n();
type IOrderConfig = {
    prop: string;
    order: OrderEnum.DESC | OrderEnum.ASC;
};
const props = defineProps({
    defaultSort: {
        type: Object as PropType<IOrderConfig>,
        default: () => ({}),
    },
    modelValue: {
        type: Object as PropType<IOrderConfig>,
        default: () => ({}),
    },
    options: {
        type: Array,
        default: () => [],
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
});
const emit = defineEmits(['sort']);

const activeLabel = ref('');
const selectModelValue = ref<any>('');

function handleSortChange(val, item) {
    const { label } = props;
    activeLabel.value = item[label] || '';
    selectModelValue.value = val;
    props.modelValue.prop = val;
    emit('sort', props.modelValue);
}
function handleOrderTypeChange() {
    props.modelValue.order = props.modelValue.order === OrderEnum.ASC ? OrderEnum.DESC : OrderEnum.ASC;
    emit('sort', props.modelValue);
}
watch(
    () => props.modelValue,
    () => {
        const { options, val, label } = props;
        const { prop } = props.modelValue;
        // 找到默认options item
        const findItem = options?.find((item: any) => item[val] === prop) || {};
        activeLabel.value = findItem[label] || '';
        selectModelValue.value = prop;
    },
    { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
.sort_select__wrapper {
    display: inline-flex;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid transparent;
    :deep(svg) {
        position: relative;
        top: 3px;
    }
    &:hover {
        border: 1px solid #ebecf0;
        border-radius: 4px;
        .label_select {
            border-left: 1px solid #ebecf0;
        }
    }
    .icon_wrapper {
        box-sizing: border-box;
        padding: 6px;
        &:hover {
            background-color: #f3f3f3;
        }
        .on {
            transform: rotate(180deg);
        }
    }
    .label_select {
        box-sizing: border-box;
        padding: 6px 8px;
        display: inline-block;
        border-left: 1px solid transparent;
        &:hover {
            background-color: #f3f3f3;
        }
    }
}
</style>
<style lang="scss">
.element-popover.element-popper.pro_sort_select__popover {
    padding: 4px 8px;
}
</style>
