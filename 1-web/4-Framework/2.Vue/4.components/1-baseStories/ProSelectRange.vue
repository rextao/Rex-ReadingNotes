<template>
    <span class="pro-selectrange-contain">
        <element-popover placement="top-start" trigger="click" popper-class="pro-select-range-popover" :append-to-body="false" :show-arrow="false">
            <div class="select-dropdown__wrapper">
                <div
                    v-for="(item, index) in options"
                    :key="index"
                    class="item"
                    :class="{
                        on: showOptionSelected(item),
                    }"
                    @click="handleClick(item)">
                    <span>{{ item[label] }}</span>
                    <i v-show="showOptionSelected(item)" class="sys-icon-close-circle" @click.stop="cancelSelect"></i>
                </div>
            </div>
            <template #reference>
                <div>
                    <ProInputRange
                        ref="inputRangeRef"
                        :model-value="modelValue"
                        :min="min"
                        :max="max"
                        class="range"
                        :split="split"
                        :unit="unit"
                        v-bind="$attrs"
                        @update:model-value="updateModelValue"
                        @update:min="updateMin"
                        @update:max="updateMax"
                        @change="handleInputRangeChange" />
                </div>
            </template>
        </element-popover>
    </span>
</template>
<script setup lang="ts">
import { getCurrentInstance, computed, ref, onMounted, watch } from 'vue';
import ProInputRange from './ProInputRange.vue';

const props = defineProps({
    options: {
        type: Array,
        default: () => [],
    },
    // options结构举例
    // [
    //     {
    //         label:'1-10',
    //         val:[1,10],
    //     },
    //     {
    //         label:'11-20',
    //         val:[11,20],
    //     },
    // ]
    unit: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: 'label',
    },
    val: {
        type: String,
        default: 'value',
    },
    modelValue: {
        type: Array,
        default: () => [],
    },
    min: {
        type: [String, Number],
        default: '',
    },
    max: {
        type: [String, Number],
        default: '',
    },
    split: {
        type: String,
        default: '-',
    },
});

const emits = defineEmits(['update:modelValue', 'update:min', 'update:max', 'change']);

function updateModelValue (val) {
    emits('update:modelValue', val);
}
function updateMin(val){
    emits('update:min', val);
}
function updateMax(val){
    emits('update:max', val);
}
function isEmpty(min, max) {
    return (min === '' || min === undefined) && (max === '' || max === undefined);
}
function updateParentProps(min = '', max = '') {
    if (isEmpty(min, max)){
        emits('update:modelValue', []);
    } else {
        emits('update:modelValue', [min, max]);
    }
    emits('update:min', min);
    emits('update:max', max);
}
const handleClick = item => {
    updateParentProps(item[props.val][0], item[props.val][1]);
};
const handleInputRangeChange = (event, type) => {
    const val = [...props.modelValue];
    emits('change', val );
};
const showOptionSelected = (item): boolean => {
    if (Number(props.modelValue[0]) === Number(item[props.val][0]) && Number(props.modelValue[1]) === Number(item[props.val][1])) {
        return true;
    }
    return false;
};

const cancelSelect = () => {
    updateParentProps();
};
</script>
<style scoped lang="scss">
.pro-selectrange-contain{
    width: 100%;
    position: relative;
    display: inline-block;
}
.select-dropdown__wrapper {
    // min-width: 250px;
    width: 100%;
    box-sizing: border-box;
    .item {
        padding: 7px 8px;
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
            color: #005cff;
            font-size: 16px;
        }
    }
    .element-button {
        margin-left: 12px;
    }
}
.sys-icon-close-circle {
    font-size: 18px;
    &:hover {
        color: #005cff;
    }
}
.range {
    width: 100%;
}
</style>
<style lang="scss">
.pro-select-range-popover {
    width: calc(100% - 24px) !important;
}
</style>
