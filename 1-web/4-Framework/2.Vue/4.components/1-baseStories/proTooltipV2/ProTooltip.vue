<template>
    <element-tooltip v-if="state.showTooltipComp" :style="{ maxWidth }" v-bind="bindProps" :disabled="state.disabled">
        <template #content>
            <div v-if="state.contentSlotVisible" :style="contentStyle">
                <slot name="content">
                    <div>
                        {{ getK18nValue(content, $props) }}
                    </div>
                </slot>
            </div>
        </template>
        <TooltipContent v-bind="$props">
            <template v-if="$slots.default" #default>
                <slot></slot>
            </template>
        </TooltipContent>
    </element-tooltip>
    <TooltipContent v-else v-bind="$props" :style="{ maxWidth }" @mouseenter="handleEvent" @click="handleEvent">
        <slot></slot>
    </TooltipContent>
</template>

<script lang="ts" setup>
// ProTooltip使用地方太多，避免引起问题
// hack方式，如果element-tooltip解决了(预计9月有新的beta版本)，则不需要这个
// 主要解决
// tooltip created时会渲染content问题
// state.contentSlotVisible解决在某些情况下content插槽里面的组件不卸载
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useAttrs, useSlots, watch } from 'vue';

import { getK18nValue } from '@components/proUtils/get';
import { tooltipProps } from '@components/base/proTooltipV2/tooltip';
import { Tooltip as ElementTooltip } from 'element';
import TooltipContent from './TooltipContent.vue';

const slots = useSlots();
const attrs = useAttrs();
const props = defineProps({
    ...tooltipProps,
});
const state = reactive({
    disabled: true,
    showTooltipComp: false,
    contentSlotVisible: true, // 插槽默认状态
});
const defaultWrapperRef = ref<any>(null);
const contentStyle = computed(() => {
    return {
        'max-width': `${props.contentWidth}` || 'auto',
    };
});
const isSingleText = computed(() => {
    return props.lineClamp === 1;
});
const bindProps = computed(() => {
    return {
        ...attrs,
        size: props.tooltipSize,
    };
});
onMounted(() => {
    setDisabled();
    watch(
        () => props.content,
        () => {
            if (state.showTooltipComp) {
                setDisabled();
            }
        }
    );
});
onBeforeUnmount(() => {
    // 隐藏content插槽，让插槽组件卸载
    state.contentSlotVisible = false;
});
function setDisabled() {
    const { len, content, lineClamp, disabled } = props;
    if (typeof disabled === 'boolean') {
        state.disabled = disabled;
        return;
    }
    // 未配置lineClamp，表示使用icon模式
    if (!lineClamp) {
        state.disabled = false;
        return;
    }
    // 无文本，则不显示 tooltip
    if ((!content && !slots.default) || disabled) {
        state.disabled = true;
        return;
    }
    // 文本clamp形式
    if (len > 0) {
        // 避免content为数字
        state.disabled = `${content}`.length <= len;
        return;
    }
    if (isSingleText.value) {
        nextTick(() => {
            // 表示文本超出，多行文本无法计算。
            if (!defaultWrapperRef?.value) {
                return true;
            }
            const refValue = defaultWrapperRef?.value || {};
            state.disabled = refValue.scrollWidth <= parseFloat(props.maxWidth);
        });
        return;
    }
    state.disabled = true;
}
function handleEvent() {
    if (state.disabled) {
        return;
    }
    state.showTooltipComp = true;
    setDisabled();
}
</script>
