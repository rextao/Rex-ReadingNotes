<template>
    <div v-if="showPagination" class="pro_pagination" :class="{ hide_last: hideLastBtn }">
        <span v-if="hasTotalConfig" class="total">Total {{ pageInfo?.total?.toLocaleString() }}</span>
        <element-pagination
            :current-page="pageInfo.current"
            :page-size="pageInfo.pageSize"
            :total="pageInfo.total"
            v-bind="paginationAttrsComputed"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const PAGINATION_CONFIG = {
    background: true,
    'page-sizes': [10, 20, 50, 100],
    layout: 'total, prev, pager, next, sizes',
};
const props = defineProps({
    pageInfo: {
        type: Object,
        default: () => ({ current: 0, pageSize: 0, total: 0 }),
        validator: (value: any) => ['current', 'pageSize'].every(v => typeof value[v] === 'number'),
    },
    // 传递给pagination的属性
    paginationAttrs: {
        type: Object,
        default: () => ({}),
    },
    // 是否禁用最后页点击跳转
    hideLastBtn: {
        type: Boolean,
        default: true,
    },
    // 主要给ProTable使用
    showPagination: {
        type: Boolean,
        default: true,
    },
});
const emit = defineEmits(['current-change', 'size-change']);
const paginationAttrsComputed = computed(() => {
    return {
        ...PAGINATION_CONFIG,
        ...props.paginationAttrs,
    };
});
const hasTotalConfig = computed(() => {
    return paginationAttrsComputed.value?.layout?.includes('total');
});
function handleCurrentChange(current: number) {
    if (current) {
        props.pageInfo.current = current;
        emit('current-change', current);
    }
}

function handleSizeChange(size: number) {
    if (size) {
        props.pageInfo.pageSize = size;
        props.pageInfo.current = 1;
        emit('size-change', size);
    }
}
</script>

<style scoped lang="scss">
.pro_pagination {
    align-items: center;
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    .total {
        margin-right: 10px;
    }
    // 不使用组件内的总数
    :deep(.element-pagination__total) {
        display: none;
    }
    &.hide_last {
        :deep(.element-pager) {
            .btn-quicknext + li {
                display: none;
            }
        }
    }
}
</style>
