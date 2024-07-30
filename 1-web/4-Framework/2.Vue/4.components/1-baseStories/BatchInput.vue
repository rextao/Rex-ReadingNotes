<template>
    <element-popover v-model:visible="visible" placement="bottom" :width="310" trigger="click" :show-arrow="false" class="batch-id-search">
        <BatchIdText
            :input-val="inputValue"
            :limit="limit"
            :reg="reg"
            :format="format"
            :input-type="inputType"
            :placeholder="$k18n(placeholder)"
            clearable
            @confirm="onConfirm"
            @cancel="onCancel" />
        <template #reference>
            <element-input v-model="inputModel" :placeholder="$k18n(inputPlaceholder)" class="input-with-select">
                <template v-if="enumerate && Object.keys(enumerate).length" #prepend>
                    <Select v-model="selectModel" :label="optionLabel" :val="optionVal" :options="enumerate" clearable @clear="clearSelect" />
                </template>
            </element-input>
        </template>
    </element-popover>
</template>
<script setup lang="ts">
import { reactive, defineProps, PropType, defineEmits, toRefs, getCurrentInstance, watch, inject, defineExpose, computed, ref, onMounted } from 'vue';
import BatchIdText from '@/components/base/BatchIdText.vue';
import Select from '@/components/base/ProSelect.vue';
import { getK18n } from '@/components/proUtils/get';

type TFormat = 'string' | 'array' | 'arrayNumber';
const $k18n = getK18n();
const emits = defineEmits(['update:inputValue', 'update:selectValue', 'change']);
const props = defineProps({
    inputValue: {
        type: String,
        default: '',
    },
    selectValue: {
        type: String,
        default: '',
    },
    limit: {
        type: Number,
        default: 400,
    },
    reg: {
        type: Object as PropType<RegExp>,
        default: () => /[\s|,|\n|]/g,
    },
    inputType: {
        type: String,
        default: 'default',
    },
    placeholder: {
        type: String,
        default: '批量输入ID，以英文逗号或空格或换行符隔开',
    },
    inputPlaceholder: {
        type: String,
        default: '请输入内容',
    },
    enumerate: {
        type: Object,
    },
    optionLabel: {
        type: String,
        default: 'label',
    },
    optionVal: {
        type: String,
        default: 'value',
    },
    format: {
        type: String as PropType<TFormat>,
        default: 'string', // 'string' || 'array' || 'arrayNumber'
    },
});
const inputModel = computed({
    get() {
        return Array.isArray(props.inputValue) ? props.inputValue.join(',') : props.inputValue;
    },
    set(val) {
        let arrValue: Array<any> = [];
        let strValue = '';
        if (Array.isArray(val)) {
            arrValue = val;
            strValue = val.join(',');
        } else {
            arrValue = val.split(',');
            strValue = val;
        }
        let value;
        switch (props.format) {
            case 'array':
                value = arrValue;
                break;
            case 'arrayNumber':
                value = arrValue.map(item => +item);
                break;
            case 'string':
            default:
                value = strValue;
                break;
        }

        emits('update:inputValue', value);
        emits('change', value);
    },
});
const selectModel = computed({
    get() {
        return props.selectValue;
    },
    set(val) {
        // 组件未被mounted的时候就会有一次val=''的赋值。会导致外层因获取不到数据报错。所以加了判断,但会导致清空时失效
        if (val !== '') {
            emits('update:selectValue', val);
            emits('change', val);
        }
    },
});
function clearSelect() {
    // 处理select清空时失效的问题
    emits('update:selectValue', '');
}
// 批量id搜索
const visible = ref(false);

const onConfirm = val => {
    emits('update:inputValue', val);
    emits('change', val);
    visible.value = false;
};
const onCancel = () => {
    visible.value = false;
};
const onChange = val => {
    emits('update:selectValue', val);
    emits('change', val);
};
</script>

<style lang="scss" scoped>
.element-input {
    width: 336px;
}
</style>
