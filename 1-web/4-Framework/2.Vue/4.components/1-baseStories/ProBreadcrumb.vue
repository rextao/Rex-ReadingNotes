<template>
    <element-breadcrumb v-bind="$attrs">
        <element-breadcrumb-item v-for="(item, index) of config" :key="index" :to="{ path: item.path }" v-bind="$attrs">
            {{ $k18n(item.label) }}
        </element-breadcrumb-item>
    </element-breadcrumb>
</template>

<script setup lang="ts">
import { getK18n } from '@components/proUtils';

const $k18n = getK18n();
const props = defineProps({
    config: {
        type: Array,
        default: () => [],
    },
});
</script>
