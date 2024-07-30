<template>
    <div class="batch-id-search-content">
        <element-input v-model="state.textarea" :rows="3" type="textarea" :placeholder="$k18n(placeholder)" v-bind="$attrs" @blur="onBlur" />
        <span class="uids-cnt">{{ state.inputCnt }}/{{ limit }}</span>
    </div>
</template>
<script setup lang="ts">
import { ref, toRefs, reactive, computed, defineEmits, getCurrentInstance, PropType, watch, inject } from 'vue';
import { getK18n } from '@/components/proUtils/get';

interface stateReactive {
    textarea: string;
    inputCnt: number;
    visible: false;
}
const $k18n = getK18n();
const emits = defineEmits(['update:modelValue']);

let userIdsStr: string[] = [];
const props = defineProps({
    modelValue: {
        type: [String, Array],
        default: '',
    },
    limit: {
        type: Number,
        default: 400,
    },
    // 输入类型，默认类型为default，可选类型为number,
    inputType: {
        type: String,
        default: 'default',
    },
    reg: {
        type: Object as PropType<RegExp>,
        default: /[\s|,|\n|]/g,
    },
    placeholder: {
        type: String,
        default: '批量输入ID，以英文逗号或空格或换行符隔开',
    },
    // format: {
    //     type: String,
    //     default: 'string',
    // },
    transform: {
        type: String,
        default: 'default',
    },
});

const state: stateReactive = reactive({
    textarea: '',
    inputCnt: 0,
    visible: false,
});
const { modelValue } = toRefs(props);

const regMap = { number: /\D/g };

watch(
    () => modelValue.value,
    curr => {
        if (Array.isArray(curr)) {
            state.textarea = curr.join(',');
        } else {
            state.textarea = curr;
        }
    },
    { immediate: true }
);
watch(
    () => state.textarea,
    (curr: string) => {
        let list;
        if (Array.isArray(curr)) {
            list = curr;
        } else {
            list = (curr || '').split(regMap[props.inputType] || props.reg).filter(v => v);
        }
        if (state.inputCnt > props.limit) {
            list = list.slice(0, props.limit);
            state.textarea = list.join(',');
        }

        state.inputCnt = list.length;
        userIdsStr = list;
    },
    { immediate: true }
);
const onBlur = () => {
    emits('update:modelValue', props.transform === 'array' ? userIdsStr : userIdsStr.join(','));
};
</script>
<style lang="scss" scoped>
:deep(.element-textarea) {
    .element-textarea__inner {
        padding: 12px;
        line-height: 24px;
        resize: none;
        border: transparent;
        min-height: 120px;
        &:focus {
            border: transparent;
            box-shadow: none;
        }
        &:hover {
            border: transparent;
            box-shadow: none;
        }
    }
}
.batch-id-search {
    &-content {
        border: 1px solid #d5d6d9;
        background: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        position: relative;
        &:focus {
            border: 1px solid #005cff;
            box-shadow: none;
        }
        &:hover {
            border: 1px solid #005cff;
            box-shadow: none;
        }
        .uids-cnt {
            position: absolute;
            text-align: right;
            right: 12px;
            bottom: 8px;
            font-size: 14px;
            color: #999999;
            line-height: 20px;
            z-index: 9;
        }
    }

    &-btn {
        text-align: right;
        margin-top: 24px;
    }
}
</style>
