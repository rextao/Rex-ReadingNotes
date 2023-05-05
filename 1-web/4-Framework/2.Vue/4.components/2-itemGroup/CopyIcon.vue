<template>
    <span
        class="sys-icon-copy"
        @click="copyData('', `${value}`)"></span>
</template>

<script setup lang="ts">
import { copyData } from '@/lib/utils';

defineProps({
    value: {
        type: [String, Number],
        default: '',
    },
});

</script>

<style scoped lang="scss">
.sys-icon-copy {
    cursor: pointer;
    font-size: 14px;
    &:hover {
        color: #005CFF;
    }
}
</style>
