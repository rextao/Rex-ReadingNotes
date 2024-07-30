<template>
    <div class="tree-com">
        <element-select
            ref="selectRef"
            v-model="selectModel"
            :style="computedStyle"
            :collapse-tags="collapseTags"
            :disabled="disabled"
            multiple
            clearable
            :size="size"
            :placeholder="k18n({ desc: k18nDesc, text: placeholder || '请输入' })"
            @change="onModelChange">
            <template #empty>
                <div class="tree">
                    <element-tree
                        :key="treekey"
                        ref="treeRef"
                        :data="enumerate"
                        :show-checkbox="true"
                        size="mini"
                        :node-key="treeProps.value"
                        highlight-current
                        :props="treeProps"
                        @check="onCheckClick" />
                </div>
            </template>
        </element-select>
    </div>
</template>
<script setup lang="ts">
import { defineProps, ref, toRefs, toRaw, nextTick, computed, watch } from 'vue';
import { uniq } from 'lodash';
import { getK18n } from '@/components/proUtils/get';

const props = defineProps({
    isK18n: {
        type: Boolean,
        default: false,
    },
    k18nDesc: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    enumerate: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: Array,
        default: () => {
            return [];
        },
    },
    collapseTags: {
        type: Boolean,
        default: false,
    },
    treeProps: {
        type: Object,
        default: () => {
            return {
                label: 'desc',
                children: 'children',
                value: 'value',
            };
        },
    },
    style: {
        type: Object,
        default: () => {
            return {};
        },
    },
    size: {
        type: String,
        default: 'medium',
    },
    onChange: {
        type: Function,
        default: () => null,
    },
    format: {
        type: Function,
        default: () => null,
    },
    disabled: {
        type: Boolean,
        default: () => false,
    },
});

const emits = defineEmits(['update:modelValue']);
const k18n = getK18n();

const selectRef = ref<any>(null);
const treeRef = ref<any>(null);

const { style, onChange, format } = toRaw(props);

const { enumerate, modelValue, treeProps } = toRefs(props);

const computedStyle = computed(() => {
    return { ...style };
});

const selectModel = ref([]);

const treeData = ref([]);
const treekey = ref(1);
// map tree data
// flatTreeData(enumerate.value);
// 重构时再测试处理回显方法
watch(
    () => modelValue,
    newval => {
        // 仅在点击清空选项时生效
        init();
    },
    { deep: true }
);
watch(
    () => enumerate.value,
    val => {
        treeData.value = [];
        flatTreeData(val);
        init();
    },
    { deep: true, immediate: true }
);
const onModelChange = (val:any) => {
    const curModel = uniq(getKeys(val));
    if (val.length) {
        treeRef.value?.setCheckedNodes(curModel);
    } else {
        treekey.value++;
    }
    const formatValue = (format && format(curModel)) || curModel;
    onChange && onChange(formatValue);
    emits('update:modelValue', formatValue);
};
const onCheckClick = (node?: any) => {
    const resultKeys = treeRef.value.getCheckedNodes().map(item => {
        return item[treeProps.value.value];
    });
    const curModel = uniq(resultKeys);
    selectModel.value = treeRef.value.getCheckedNodes().map(item => {
        return item[treeProps.value.label];
    });
    const formatValue = format(curModel) || curModel;
    onChange && onChange(formatValue);
    emits('update:modelValue', formatValue);
};

function flatTreeData(enumerate: any) {
    enumerate?.map((item: any) => {
        treeData.value.push({
            desc: item[treeProps.value.label],
            value: item[treeProps.value.value],
        });
        if (item[treeProps.value.children] && item[treeProps.value.children].length) {
            flatTreeData(item[treeProps.value.children]);
        }
    });
}

function getKeys(model: any, type?: string) {
    const result = [];
    model.map((item: any) => {
        treeData.value.map((tItem: any) => {
            if (type === 'label') {
                if (tItem.value === item) {
                    result.push(tItem.desc);
                }
            } else if (tItem.desc === item) {
                result.push(tItem.value);
            }
        });
    });

    return result;
}

function init() {
    if (modelValue.value?.length) {
        selectModel.value = uniq(getKeys(modelValue.value, 'label'));
        treeRef.value?.setCheckedKeys(modelValue.value);
    } else {
        selectModel.value = modelValue.value as any;
        treekey.value++;
    }
}
</script>

<style lang="scss" scoped>
.tree {
    height: 232px;
    overflow-y: auto;
}

.tree-com {
    :deep(.element-select) {
        width:280px;
        .element-tag.element-tag--danger {
            background-color: #f5f7fa;
            border-color: #d5d6d9;
            span {
                color: #606266;
            }
            i {
                color: #bbbdbf;
            }
        }
    }
}
</style>
