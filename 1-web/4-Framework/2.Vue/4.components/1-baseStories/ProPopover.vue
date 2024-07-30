<template>
    <element-popover v-if="state.showTooltipComp" v-bind="$attrs">
        <template #reference>
            <slot name="reference"></slot>
        </template>
        <template v-if="state.contentSlotVisible" #default>
            <slot></slot>
        </template>
    </element-popover>
    <span v-else v-bind="$attrs" @mouseenter="handleMouseEnter" @click="handleClick">
        <slot name="reference"></slot>
    </span>
</template>

<script setup lang="ts">
// 作用参见：proTooltipV2注释
import { onBeforeUnmount, reactive } from 'vue';

const state = reactive({
    showTooltipComp: false,
    contentSlotVisible: true, // 插槽默认状态
});

function handleMouseEnter() {
    state.showTooltipComp = true;
}
function handleClick() {
    state.showTooltipComp = true;
}
onBeforeUnmount(() => {
    // 隐藏content插槽，让插槽组件卸载
    state.contentSlotVisible = false;
});
</script>

<style scoped lang="scss"></style>
