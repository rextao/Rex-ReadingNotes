<template>
    <element-tooltip :style="{ maxWidth }" v-bind="bindProps" :disabled="state.disabled">
        <template #content>
            <div :style="contentStyle">
                <slot name="content">
                    <div>
                        {{ getK18nValue(content, $props) }}
                    </div>
                </slot>
            </div>
        </template>
        <span
            v-if="lineClamp"
            ref="defaultWrapperRef"
            class="line_clamp_default__wrapper"
            :class="lineClampClass"
            :style="lineClampStyle"
            @click="handleClickContent">
            <slot>
                <!-- lineClamp省略模式，默认 弹窗与现实文案是一样的-->
                {{ getK18nValue(content, $props) }}
            </slot>
        </span>
        <span v-else>
            <slot>
                <component :is="iconMap[icon] || allIcons[icon]" :size="size" :color="color" />
            </slot>
        </span>
    </element-tooltip>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, useSlots, watch, useAttrs } from 'vue';
import { IconGeneralQuestion, IconGeneralWarningCircle } from '@element/pro-icons';
import * as allIcons from '@element/pro-icons';
import { tooltipProps } from '@components/base/proTooltipV2/tooltip';
import { Tooltip as ElementTooltip } from 'element';
import { copyData } from '@/components/proUtils/util';
import { getK18nValue } from '@/components/proUtils/get';

const iconMap = {
    warning: IconGeneralWarningCircle,
    default: IconGeneralQuestion,
};
const slots = useSlots();
const attrs = useAttrs();
const props = defineProps({
    ...tooltipProps,
});
const state = reactive({
    disabled: true,
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
            setDisabled();
        }
    );
});

const lineClampStyle = computed(() => {
    const styleObj = {
        '-webkit-line-clamp': props.lineClamp,
    };
    if (props.clickCopyContent) {
        styleObj.cursor = 'pointer';
    }
    return styleObj;
});
const lineClampClass = computed(() => {
    // 单行文本使用普通的 text-overflow: ellipsis;
    // 可以通过计算自动判断是否需要
    return isSingleText.value ? 'single_text' : 'multiline_text';
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
function handleClickContent() {
    if (props.clickCopyContent) {
        copyData('', `${props.content}`);
    }
}
</script>
<style lang="scss" scoped>
.line_clamp_default__wrapper {
    &.single_text {
        cursor: default;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    // 多行文本
    &.multiline_text {
        display: -webkit-box;
        cursor: pointer;
        overflow: hidden;
        -webkit-box-orient: vertical;
        word-break: break-all; // 处理英文
    }
}
</style>
<style lang="scss">
.element-popper {
    hyphens: auto;
    word-break: break-word;
}
</style>
