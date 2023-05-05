<template>
    <el-tooltip :style="{ maxWidth }" v-bind="$attrs" :disabled="state.disabled">
        <template #content>
            <div :style="contentStyle">
                <slot name="content">
                    <div>
                        {{ content }}
                    </div>
                </slot>
            </div>
        </template>
        <span
            v-if="lineClamp"
            ref="defaultWrapperRef"
            class="line_clamp_default__wrapper"
            :class="lineClampClass"
            :style="lineClampStyle"
            @click="handleClickContent">
            <slot>
                <!-- lineClamp省略模式，默认 弹窗与现实文案是一样的-->
                {{ content }}
            </slot>
        </span>
        <span v-else>
            <slot>
                <span :class="['iconfont', iconfont]"></span>
            </slot>
        </span>
    </el-tooltip>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { Message } from 'element';

export const copyData = function copyData(label: string, value: string) {
  const transfer = document.createElement('input');
  document.body.appendChild(transfer);
  transfer.value = `${value}`;
  transfer.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  Message(`复制${label}成功`);
  document.body.removeChild(transfer);
};

export default defineComponent({
    name: 'ProTooltip',
    props: {
        // 设置字数省略模式
        lineClamp: {
            type: [Number, String],
            default: undefined,
        },
        content: {
            type: [Number, String],
            default: '',
        },
        /**
         * lineClamp单行时使用，设置tooltip最大宽度，文案多于此宽，会自动省略+hover tooltip
         * 如果不设置，组件渲染时，会计算tooltip.disabled = true, el-tooltip不会渲染
         */
        maxWidth: {
            type: String,
            default: '155px',
        },
        // 弹窗宽度，需px单位
        contentWidth: {
            type: String,
            default: '250px',
        },
        // 只支持iconfont，其他可以直接slot
        iconfont: {
            type: String,
            default: 'sys-icon-question',
        },
        // 当文字长度小于等于len（粗略计算），会禁用tooltip
        // 通过mouseEnter计算 text.value.scrollWidth > text.value.offsetWidth;会精准，
        len: {
            type: Number,
            default: 0,
        },
        // 点击复制content内容
        clickCopyContent: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { attrs, slots }) {
        const state = reactive({
            disabled: true,
        });
        const defaultWrapperRef = ref<any>(null);
        const contentStyle = computed(() => {
            return {
                'max-width': `${props.contentWidth}` || 'auto',
            };
        });
        const isSingleText = computed(() => {
            return props.lineClamp === 1;
        });

        onMounted(() => {
            setDisabled();
            watch(
                () => props.content,
                () => {
                    setDisabled();
                }
            );
        });

        const lineClampStyle = computed(() => {
            return {
                '-webkit-line-clamp': props.lineClamp,
            };
        });
        const lineClampClass = computed(() => {
            // 单行文本使用普通的 text-overflow: ellipsis;
            // 可以通过计算自动判断是否需要
            return isSingleText.value ? 'single_text' : 'multiline_text';
        });
        function setDisabled() {
            const { len, content } = props;
            if (typeof attrs.disabled === 'boolean' && !attrs.disabled) {
                state.disabled = false;
                return;
            }
            // 无文本，则不显示 tooltip
            if ((!content && !slots.default) || attrs.disabled) {
                state.disabled = true;
                return;
            }
            // 文本clamp形式
            if (len > 0) {
                // 避免content为数字
                state.disabled = `${content}`.length <= len;
                return;
            }
            if (isSingleText.value) {
                nextTick(() => {
                    // 表示文本超出，多行文本无法计算。
                    if (!defaultWrapperRef?.value) {
                        return true;
                    }
                    const refValue = defaultWrapperRef?.value || {};
                    state.disabled = refValue.scrollWidth <= parseFloat(props.maxWidth);
                });
                return;
            }
            state.disabled = true;
        }
        function handleClickContent() {
            if (props.clickCopyContent) {
                copyData('', `${props.content}`);
            }
        }
        return {
            state,
            contentStyle,
            lineClampStyle,
            setDisabled,
            lineClampClass,
            defaultWrapperRef,
            isSingleText,
            handleClickContent,
        };
    },
});
</script>
<style lang="scss" scoped>
.line_clamp_default__wrapper {
    &.single_text {
        cursor: default;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    // 多行文本
    &.multiline_text {
        display: -webkit-box;
        cursor: pointer;
        overflow: hidden;
        -webkit-box-orient: vertical;
        word-break: break-all; // 处理英文
    }
}
</style>
