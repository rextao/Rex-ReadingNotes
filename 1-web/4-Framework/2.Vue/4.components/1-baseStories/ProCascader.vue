<template>
    <element-cascader
        ref="cascaderRef"
        v-model="model"
        class="co_cascader"
        :options="transformOptions"
        v-bind="bindProps"
        @change="handleChange"
        @expand-change="handleExpandChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @visible-change="handleVisibleChange">
        <template #default="{ node, data }">
            <span v-if="hideRadio" class="label" @click="handleClickItemLabel(node, data)">
                {{ data[bindProps.props.label] ? data[bindProps.props.label] : data.name }}
            </span>
            <slot v-else :node="node" :data="data" @click="handleClickItemLabel(node, data)">{{ data[$attrs.props.label || 'label'] }}</slot>
        </template>
    </element-cascader>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs, ref, onMounted, watch } from 'vue';
import { Cascader } from 'element';

interface IState {
    coCascaderPopper: Element | null;
    transformOptions: Array<Record<string, any>>;
}

/**
 * 处理 [Bug Report] Cascader 级联选择器连续多次点击浏览器卡死
 * https://github.com/ElemeFE/element/issues/22060
 */
function fixCascaderBug() {
    const $el = document.querySelectorAll('.element-cascader-panel .element-cascader-node[aria-owns]');
    Array.from($el).forEach(item => item.removeAttribute('aria-owns'));
}

export default defineComponent({
    name: 'ProCascader',
    components: {
        ElementCascader: Cascader,
    },
    props: {
        modelValue: {
            type: [String, Array, Number, Boolean],
            default: '',
        },
        // 是否隐藏单选时的radio按钮
        hideRadio: {
            type: Boolean,
            default: false,
        },
        // 是否选中选项之后自动收起下拉菜单
        hideSelectMenu: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Array,
            default: () => [],
        },
        // 由于经常后端options是递归，末尾children: []。会显示无数据
        setNull: {
            type: Boolean,
            default: false,
        },
        // 向外同步选中的label
        emitLabel: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change', 'visible-change', 'expand-change', 'focus', 'blur', 'visible-change'],
    setup(props, ctx) {
        const cascaderRef = ref<any>(null);
        // 存储 value：label 映射关系
        const valToLabelMap = reactive({});
        // 存储  label： value 映射关系
        const LabelToValueMap = reactive({});
        const state = reactive<IState>({
            coCascaderPopper: null,
            transformOptions: [],
        });
        const model = computed({
            get() {
                if (props.emitLabel) {
                    if (Array.isArray(props.modelValue)) {
                        return props.modelValue.map((key: any) => LabelToValueMap[key]);
                    }
                    return LabelToValueMap[props.modelValue];
                }
                return props.modelValue;
            },
            set(val: any) {
                let resultValue = val;
                if (props.emitLabel) {
                    if (Array.isArray(val)) {
                        resultValue = val.map(key => valToLabelMap[key]);
                    } else {
                        resultValue = valToLabelMap[val];
                    }
                }
                ctx.emit('update:modelValue', resultValue);
                // 点击清除按钮
                if (resultValue && resultValue.length === 0) {
                    ctx.emit('change', resultValue);
                }
            },
        });
        // 这块有问题， 当hideRadio为false时候，co_cascader_popper也会加上，导致不出现圈
        const bindProps = computed(() => {
            const result = { label: 'label', value: 'value', children: 'children', ...(ctx.attrs.props || {}) };
            return {
                'collapse-tags': true,
                'popper-class': 'co_cascader_popper',
                ...ctx.attrs,
                props: result,
            };
        });
        function handleClickItemLabel(node: any, data: any) {
            // TODO new待详细测试。
            const { props: componentProps } = ctx.attrs;
            if (componentProps.multiple) return;
            const { emitPath, value = 'value', checkStrictly } = componentProps as any;

            if (!checkStrictly && !node.isLeaf) {
                return;
            }

            if (props.hideSelectMenu) {
                cascaderRef.value.popperVisible = false;
            }

            let emitValue = node.pathValues;
            // 若设置 false，则只返回该节点的值
            if (!emitPath) {
                emitValue = data[value];
            }
            ctx.emit('update:modelValue', emitValue);
            ctx.emit('change', emitValue);
            ctx.emit('visible-change', false);
        }
        onMounted(() => {
            const coCascaderPopper = document.querySelectorAll(`.${bindProps.value['popper-class']} .element-cascader-panel`);
            if (props.hideRadio && coCascaderPopper.length) {
                coCascaderPopper.forEach(element => {
                    element.classList.add('co_cascader_popper_hide_radio');
                });
            }
        });
        function transformOptions(list: any[]): any[] | null {
            const result: any = [];
            if (list.length === 0) {
                return null;
            }
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const { props: componentProps }: any = bindProps.value;
                const labelKey = componentProps.label;
                const valueKey = componentProps.value;
                const childKey = componentProps.children;
                valToLabelMap[item[valueKey]] = item[labelKey];
                LabelToValueMap[item[labelKey]] = item[valueKey];
                result.push({
                    [labelKey]: item[labelKey],
                    [valueKey]: item[valueKey],
                    [childKey]: item[childKey] ? transformOptions(item[childKey]) : null,
                });
            }
            return result;
        }
        function handleChange() {
            fixCascaderBug();
            ctx.emit('change');
        }
        function handleExpandChange() {
            fixCascaderBug();
            ctx.emit('expand-change');
        }
        function handleFocus() {
            fixCascaderBug();
            ctx.emit('focus');
        }
        function handleBlur() {
            fixCascaderBug();
            ctx.emit('blur');
        }
        function handleVisibleChange() {
            fixCascaderBug();
            ctx.emit('visible-change');
        }
        watch(
            () => props.options,
            (val: any[]) => {
                if (props.setNull) {
                    state.transformOptions = transformOptions(val) || [];
                } else {
                    state.transformOptions = val;
                }
            },
            { immediate: true, deep: true }
        );
        return {
            ...toRefs(state),
            cascaderRef,
            bindProps,
            model,
            handleClickItemLabel,
            handleChange,
            handleExpandChange,
            handleFocus,
            handleBlur,
            handleVisibleChange,
        };
    },
});
</script>
<style lang="scss">
.co_cascader_popper_hide_radio {
    .element-cascader-node {
        padding: 0 12px 0 12px;
    }
    .label {
        display: inline-block;
        padding-right: 26px; // 目前组件，默认element-cascader-node paddingRight 为38px，为保证尽可能一致效果
        box-sizing: border-box;
        width: 100%;
    }
    li {
        .element-radio {
            display: none;
        }
    }
}
.data_category__cascader {
    .element-cascader-node__label {
        white-space: normal;
    }
}
.co_cascader {
    .element-tag {
        color: #005cff;
        background-color: #f5f8ff;
    }
}
</style>
