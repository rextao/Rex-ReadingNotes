<template>
    <div class="item_group__wrapper" :class="mode">
        <item-box
            v-for="(item, index) in config"
            :key="index"
            :label="item.label"
            :item="item"
            :max-label-width="maxLabelWidth"
            :max-value-width="maxValueWidth"
            :data="data"
            :class="{
                border: border,
            }"
            :empty-value="emptyValue">
            <slot v-if="item.slot" :name="item.slot" :item="item" :value="getValue(item)"></slot>
        </item-box>
    </div>
</template>

<script setup lang="ts">
import get from 'lodash/get';
import { PropType } from 'vue';
import ItemBox from './ItemBox.vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
    config: {
        type: Array,
        default: () => [],
    },
    /**
     * inline: label与value水平放
     * block: label 与 value block放
     * highlight： value 会高亮
     */
    mode: {
        type: String as PropType<'block' | 'inline' | 'highlight'>,
        default: 'block',
    },
    // 空值的展示，只转换空字符串,null undefined，不转false与0等其他false值
    emptyValue: {
        type: String,
        default: '',
    },
    border: {
        type: Boolean,
        default: false,
    },
    // label的宽度
    maxLabelWidth: {
        type: String,
        default: '155px',
    },
    // 比如itemGroup在popver里面，初始化时，计算不出labelWidth，需要手动配置
    // 需要带单位
    maxValueWidth: {
        type: String,
        default: '',
    },
});

function getValue(item: any) {
    const { key, transform } = item;
    const value = get(props.data, key);
    if (transform) {
        return transform(value, props.data, item);
    }
    if (value === '' || value === undefined || value === null) {
        return props.emptyValue;
    }
    return value;
}
</script>

<style scoped lang="scss">
.item_group__wrapper {
    display: flex;
    flex-wrap: wrap;
    &.highlight {
        :deep(.item_box) {
            display: block;
            margin-right: 12px;
            &.border {
                box-sizing: border-box;
                margin-right: 24px;
                border-right: 1px solid #ebecf0;
                &:last-child {
                    border-right: 0;
                    margin-right: 0;
                }
            }
            .label {
                margin-bottom: 4px;
            }
            .value {
                font-size: 20px;
                font-weight: 700;
                line-height: 28px;
            }
        }
    }
    &.block {
        :deep(.item_box) {
            display: block;
            margin-right: 32px;
            .label {
                margin-bottom: 4px;
            }
        }
    }
    &.inline {
        :deep(.item_box) {
            display: inline-flex;
            margin-bottom: 4px;
            .label {
                margin-right: 10px;
            }
        }
    }
}
</style>
