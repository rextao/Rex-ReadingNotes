<template>
    <span v-if="checkValue ? !!value : true" class="sys-icon-copy" @click.stop="copyData('', `${value}`, $k18n)"></span>
</template>

<script setup lang="ts">
import { getK18n } from '@components/proUtils';
import { copyData } from '@/components/proUtils/util';

const $k18n = getK18n();
defineProps({
    value: {
        type: [String, Number],
        default: '',
    },
    checkValue: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped lang="scss">
.sys-icon-copy {
    cursor: pointer;
    font-size: 14px;
    &:hover {
        color: #005cff;
    }
}
</style>
