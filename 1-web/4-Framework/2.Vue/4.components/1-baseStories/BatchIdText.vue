<template>
    <div class="batch-id-search-content">
        <textarea v-model="state.textarea" type="textarea" :placeholder="$k18n(placeholder)"></textarea>
        <div class="batch-id-search-btn">
            <element-button @click="onCancel"><k18n>取消</k18n></element-button>
            <element-button type="primary" @click="onConfirm">
                <k18n>确认</k18n>
            </element-button>
        </div>
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

type TFormat = 'string' | 'array' | 'arrayNumber';
const $k18n = getK18n();
const emit = defineEmits(['confirm', 'cancel']);
let userIdsStr: string[] = [];
const props = defineProps({
    inputVal: {
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
    format: {
        type: String as PropType<TFormat>,
        default: 'string',
    },
});
const state: stateReactive = reactive({
    textarea: '',
    inputCnt: 0,
    visible: false,
});
const { inputVal } = toRefs(props);

const regMap = {
    number: /\D/g,
};

watch(
    () => inputVal.value,
    curr => {
        if (Array.isArray(curr)) {
            state.textarea = curr.join('\n');
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
            list = (curr || '')
                .toString()
                .split(regMap[props.inputType] || props.reg)
                .filter(v => v);
        }
        if (state.inputCnt > props.limit) {
            list = list.slice(0, props.limit);
            state.textarea = props.format === 'array' ? list.join('\n') : list.join(',');
        }

        state.inputCnt = list.length;
        userIdsStr = list;
    },
    { immediate: true }
);

const onCancel = () => {
    state.textarea = inputVal.value;
    emit('cancel');
};
const onConfirm = () => {
    let value;
    switch (props.format) {
        case 'array':
            value = userIdsStr;
            break;

        case 'arrayNumber':
            value = userIdsStr.map(item => +item);
            break;
        case 'string':
        default:
            value = userIdsStr.join(',');
            break;
    }
    emit('confirm', value);
};
</script>
<style lang="scss" scoped>
textarea::-webkit-input-placeholder {
    color: #bbbdbf;
}
textarea:-moz-placeholder {
    color: #bbbdbf;
}
textarea::-moz-placeholder {
    color: #bbbdbf;
}
textarea::-ms-input-placeholder {
    color: #bbbdbf;
}

.w-long {
    width: 336px;
}

.batch-id-search {
    &-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 292px;
        box-sizing: border-box;
        padding: 8px 4px 6px 4px;
        position: relative;
        textarea {
            flex: 1;
            border: 1px solid #d5d6d9;
            background: #fff;
            border-radius: 5px;
            line-height: 36px;
            padding: 4px 12px;
            &:focus {
                outline: none;
            }
        }
        .uids-cnt {
            position: absolute;
            width: 100%;
            text-align: right;
            right: 18px;
            bottom: 75px;
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
