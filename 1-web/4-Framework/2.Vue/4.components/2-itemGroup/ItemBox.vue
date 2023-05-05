<template>
    <div ref="itemBoxRef" class="item_box">
        <div v-if="label" ref="labelRef" class="label">
            <ProTooltip :line-clamp="1" :content="getK18n(label)" :max-width="maxLabelWidth" />
        </div>
        <ProTooltip :line-clamp="1" class="value" placement="top" :max-width="state.maxWidth" :content="createFunc('hoverTooltip')">
            <slot v-if="item.slot"></slot>
            <span v-else-if="item.type === 'time'">
                {{ formatDateTime() }}
            </span>
            <span v-else-if="item.type === 'num'">
                {{ formatValue(getValue(item), item.toFixed) }}
            </span>
            <span v-else-if="item.type === 'img' && getValue(item) !== emptyValue">
                <elimage :src="getImgUrl(item)" :preview-src-list="[getImgUrl(item)]">
                    <template #error>
                        <div class="image_slot">
                            <i class="noah-icon-imageLoadError"></i>
                        </div>
                    </template>
                </elimage>
            </span>
            <template v-else-if="item.type === 'a'">
                <a v-if="isValidAType(item)" target="_blank" :href="getValue(item)">
                    {{ createFunc('hrefText') }}
                </a>
                <span v-else>
                    {{ createFunc('hrefText') }}
                </span>
            </template>
            <span v-else>
                {{ getValue(item) }}
            </span>
            <copy-icon v-if="item.copy" class="copy_icon" :value="createFunc('copy')" />
            <ProTooltip v-if="item.tooltip" class="tooltip" :content-width="item.tooltip.contentWidth || '270px'">
                <template #content>
                    <div v-html="item.tooltip"></div>
                </template>
            </ProTooltip>
        </ProTooltip>
    </div>
</template>

<script setup lang="ts">
import { defineProps, getCurrentInstance, onMounted, PropType, reactive, ref } from 'vue';
import get from 'lodash/get';
import moment from 'moment';
import ProTooltip from './ProTooltip.vue'
import CopyIcon from './CopyIcon.vue'

function strip(num: number, toFixed = 1, replaceZero = false, precision = 12): string {
  // num 非number，会导致toPrecision 调用错误
  if (typeof num !== 'number') {
    return `${num}`;
  }
  const count = +parseFloat(num.toPrecision(precision));
  const value = count.toFixed(toFixed);
  return replaceZero ? value.replace(/(\.\d+?)0*$/, '$1') : value;
}
function formatValue(count: number | string, toFixed = 1) {
  let num = parseFloat(`${count}`);
  const sign = num >= 0 ? '' : '-';
  num = Math.abs(num);
  if (Number.isNaN(num) || num < 1e3) {
    return count;
  }
  if (num >= 1e3 && num < 1e6) {
    return `${sign}${strip(num / 1e3, toFixed)}K`;
  }
  if (num >= 1e6 && num < 1e9) {
    return `${sign}${strip(num / 1e6, toFixed)}M`;
  }
  return `${sign}${strip(num / 1e9, toFixed)}B`;
}

const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    data: {
        type: Object,
        default: () => ({}),
    },
    // 配置item
    item: {
        type: Object,
        default: () => ({} as PropType<IConfigItem>),
    },
    // 空值的展示，只转换空字符串,null undefined，不转false与0等其他false值
    emptyValue: {
        type: String,
        default: '',
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
const labelRef = ref<any>(null);
const itemBoxRef = ref<any>(null);
const state = reactive({
    maxWidth: '',
});

onMounted(() => {
    setValueBoxMaxWidth();
});

function setValueBoxMaxWidth() {
    const display = window.getComputedStyle(itemBoxRef.value).display;
    const labelWidth = labelRef?.value?.offsetWidth || 0;
    const { maxValueWidth } = props;
    if (display === 'block') {
        state.maxWidth = maxValueWidth || `${labelWidth}px`;
    } else {
        const itemBoxWidth = itemBoxRef?.value?.offsetWidth || 0;
        const labelMarginRight = getComputedStyle(labelRef?.value).getPropertyValue('margin-right');
        const valueWidth = itemBoxWidth - labelWidth - parseFloat(labelMarginRight);
        // 主要针对inline形式
        state.maxWidth = valueWidth > 0 ? `${valueWidth}px` : '';
    }
}
// 是有效的a标签，文案与链接不是空文本
function isValidAType(item) {
    const { emptyValue } = props;
    return createFunc('hrefText') !== emptyValue && getValue(item) !== emptyValue;
}
function getEmptyValue(value) {
    if (value === '' || value === undefined || value === null) {
        return props.emptyValue;
    }
    return value;
}
function getValue(item: any) {
    const { key, transform } = item;
    const value = get(props.data, key);
    if (transform) {
        return transform(value, props.data, item);
    }
    return getEmptyValue(value);
}
function formatDateTime() {
    const value = getValue(props.item);
    // 对于时间 0 算无效值
    if (value === 0) {
        return props.emptyValue;
    }
    const { format = 'YYYY-MM-DD HH:mm:ss' } = props.item;
    if (value) {
        return moment(value).format(format);
    }
    return props.emptyValue;
}

// 将某个配置项转为 可以是函数判断的
function createFunc(name: string) {
    const item = props.item;
    // 会被transform包裹
    const value = getValue(item);
    const itemName = item[name];
    // 如果配置为true，直接返回data[item.key]值
    if (itemName === true) {
        return value;
    }
    // 返回item[name]，如配置为hoverTooltip,则返回data[item[name]]
    if (typeof itemName === 'string') {
        return getEmptyValue(get(props.data, itemName));
    }
    if (typeof itemName === 'function') {
        return itemName(get(props.data, item.key), value, props.data, item);
    }
    // 如果未配置，则返回默认的value值
    return itemName || value;
}

function getK18n(value) {
    const { k18n } = props.item;
    const { $k18n }: any = (getCurrentInstance() as any)?.appContext?.config?.globalProperties;
    // 配置k18n = false
    if (typeof k18n === 'boolean' && !k18n) {
        return value;
    }
    // 如对外使用，避免$k18n方法不存在
    if ($k18n) {
        return $k18n(value);
    }
    return value;
}
function getImgUrl(item) {
    return `${item?.url || ''}${getValue(item)}`;
}
</script>

<style scoped lang="scss">
.item_box {
    display: flex;
    align-items: center;
    font-size: 14px;
    .label {
        color: #999999;
        flex-shrink: 0;
        display: block;
        :deep(.single_text) {
            display: block;
        }
    }
    .value {
        color: #000000;
        cursor: default;
        :deep(.single_text) {
            display: block;
        }
    }
    a {
        color: #327dff;
    }
    .copy_icon {
        margin-left: 5px;
    }
    .elimage {
        display: flex;
        background: #f9f9f9;
        justify-content: center;
        align-items: center;
        width: 148px;
        height: 148px;
        border-radius: 4px;
        .image-slot {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
