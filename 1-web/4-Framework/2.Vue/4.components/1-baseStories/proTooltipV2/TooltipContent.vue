<template>
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
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IconGeneralQuestion, IconGeneralWarningCircle } from '@element/pro-icons';
import { tooltipProps } from '@components/base/proTooltipV2/tooltip';
import * as allIcons from '@element/pro-icons';
import { copyData } from '@/components/proUtils/util';
import { getK18nValue } from '@/components/proUtils/get';

const iconMap = {
    warning: IconGeneralWarningCircle,
    default: IconGeneralQuestion,
};
const props = defineProps({
    ...tooltipProps,
});
const isSingleText = computed(() => {
    return props.lineClamp === 1;
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
