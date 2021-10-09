<template>
  <ks-cascader
      class="co_cascader"
      ref="cascaderRef"
      v-model="model"
      :options="transformOptions"
      v-bind="bindProps"
  >
    <template #default="{ node, data }">
      <co-tooltip
          v-if="hideRadio"
          :line-clamp="1"
          :len="8"
          @click.native="handleClickItemLabel(node,data)"
          :content="data.label ? data.label : data.name"
      >
      </co-tooltip>
      <slot
          v-else
          :node="node"
          :data="data"
      ></slot>
    </template>
  </ks-cascader>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs, ref, onMounted, watch } from '@vue/composition-api';
import { Cascader } from 'element-ui';
import CoTooltip from './co-tooltip';

interface IState {
  coCascaderPopper: Element | null;
  transformOptions: Array<Record<string, any>>;
}
interface IProps   {
  hideRadio: boolean;
  value?: any;
}
export default defineComponent<IProps>({
    name: 'co-cascader',
    components: {
        KsCascader: Cascader,
        CoTooltip,
    },
    props: {
        value: {
            type: [String, Array, Number, Boolean],
            default: '',
        },
        /**
     * 是否隐藏单选时的radio按钮
     */
        hideRadio: {
            type: Boolean,
            default: false,
        },
        /**
     * 是否选中选项之后自动收起下拉菜单
     */
        hideSelectMenu: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Array,
            default: () => [],
        },
        /**
     * 由于经常后端options是递归，末尾children: []。会显示无数据
     */
        setNull: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, ctx) {
        const cascaderRef = ref(null);
        const state = reactive<IState>({
            coCascaderPopper: null,
            transformOptions: [],
        });
        const model = computed({
            get() {
                return props.value;
            },
            set(val) {
                ctx.emit('input', val);
                // 点击清除按钮
                if (val && val.length === 0) {
                    ctx.emit('change', val);
                }
            },
        });
        const bindProps = computed(() => {
            return {
                'collapse-tags': true,
                'popper-class': 'co_cascader_popper',
                ...ctx.attrs,
            };
        });
        function handleClickItemLabel(node) {
            if (props.hideSelectMenu) {
                cascaderRef.value.dropDownVisible = false;
            }
            ctx.emit('input', node.path);
            ctx.emit('change', node.path);
        }
        onMounted(() => {
            const coCascaderPopper = document.querySelectorAll(`.${bindProps.value['popper-class']} .el-cascader-panel`);
            if (props.hideRadio && coCascaderPopper.length) {
                coCascaderPopper.forEach(element => {
                    element.classList.add('co_cascader_popper_hide_radio');
                });
            }
        });
        function transformOptions(list) {
            const result = [];
            if (list.length === 0) {
                return null;
            }
            for (let i = 0; i < list.length; i++ ) {
                const item = list[i];
                const { label, value, children } = item;
                result.push({
                    label,
                    value,
                    children: children ? transformOptions(children) : null,
                });
            }
            return result;
        }

        watch(
            () => props.options,
            val => {
                if (props.setNull) {
                    state.transformOptions = transformOptions(val) || [];
                } else {
                    state.transformOptions = val;
                }
            },
            { immediate: true, deep: true },
        );
        return {
            ...toRefs(state),
            cascaderRef,
            bindProps,
            model,
            handleClickItemLabel,
        };
    },
});
</script>
<style lang="less">
.co_cascader_popper_hide_radio {
  li {
    .el-radio {
      display: none;
    }
  }
}
.data_category__cascader {
  .el-cascader-node__label {
    white-space: normal;
  }
}
</style>
