<template>
    <div class="select-dropdown__wrapper">
        <div
            v-for="(item, index) in options"
            :key="index"
            class="item"
            :class="{
                on: modelValue === item[val],
            }"
            @click="handleClick(item)">
            <span>{{ $k18n(item[label]) }}</span>
            <i class="sys-icon-check-line" :style="{ opacity: modelValue === item[val] ? 1 : 0 }"></i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getK18n } from '@components/proUtils';

const $k18n = getK18n();
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
    options: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: [String, Number, Array],
        default: '',
    },
    label: {
        type: String,
        default: 'name',
    },
    // 下拉选项的value
    val: {
        type: String,
        default: 'id',
    },
});

function handleClick(item) {
    emit('update:modelValue', item[props.val]);
    emit('change', item[props.val], item);
}
</script>

<style lang="scss" scoped>
.select-dropdown__wrapper {
    box-sizing: border-box;
    .item {
        padding: 7px 4px;
        display: flex;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
        cursor: pointer;
        justify-content: space-between;
        align-items: center;
        &.on {
            color: #005cff;
        }
        &:hover {
            background: #f9f9f9;
        }
        .sys-icon-check-line {
            margin-left: 8px;
            color: #005cff;
            font-size: 16px;
        }
    }
}
</style>
