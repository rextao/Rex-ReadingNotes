<template>
    <ks-tooltip
        ref="coTooltipRef"
        v-bind="$attrs"
        :disabled="setDisabled()"
    >
        <div slot="content" :style="contentStyle">
            <slot name="content">
                <div>
                    {{content}}
                </div>
            </slot>
        </div>
        <span
            v-if="lineClamp"
            :class="['line_clamp_default__wrapper',lineClampClass]"
            :style="lineClampStyle"
        >
            <slot>
                <!-- lineClamp省略模式，默认 弹窗与现实文案是一样的-->
                {{content}}
            </slot>
        </span>
        <slot v-else>
            <slot>
                <span :class="['iconfont', iconfont]"></span>
            </slot>
        </slot>
    </ks-tooltip>
</template>

<script lang="ts">
import { Tooltip }  from 'element-ui';
import {computed, defineComponent,  ref, } from '@vue/composition-api';


interface IProps {
    lineClamp: any;
    lineClampClass: string;
    content: string;
    contentWidth: string;
    len: number;
    autoCal: boolean;
}
interface Ioptions {
    font?: string;
    targetDom?: HTMLElement;
    text?: string;
};
// 利用canvas计算文本长度
function textMeasure(text: string, options: Ioptions = {}): number {
    // 以下两项应该放在外层 避免每次使用都不必要的创建
    const defaultOptions: Ioptions = {
        font: '12px sans-serif',
        targetDom: undefined,
    };

    const canvas: HTMLCanvasElement = document.createElement('canvas');

    const cfg: Ioptions = Object.assign({}, defaultOptions, options);
    if (cfg.targetDom) {
        const domStyle: CSSStyleDeclaration = getComputedStyle(cfg.targetDom);
        cfg.font = domStyle.font;
    }
    const context2d = canvas.getContext('2d') as CanvasRenderingContext2D;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context2d.font = cfg.font!;
    const textMetrics: TextMetrics = context2d.measureText(text);
    return textMetrics.width;
}

export default defineComponent<IProps>({
    name: 'co-tooltip',
    components: {
        KsTooltip: Tooltip,
    },
    props: {
        // 设置字数省略模式
        lineClamp: {
            type: [Number, String],
            default: undefined,
        },
        // 设置样式， 想通过简洁方式，直接复用 line-clamp 样式，不行的话直接使用slot
        lineClampClass: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
        // 弹窗宽度，需px单位
        contentWidth: {
            type: String,
            default: '',
        },
        // 只支持iconfont，其他可以直接slot
        iconfont: {
            type: String,
            default: 'el-icon-warning-outline',
        },
        // 当文字长度小于等于len（粗略计算），会禁用tooltip
        len: {
            type: Number,
            default: 0,
        },
        // true， 且 coTooltipRef.value.$el存在，
        // 文字长度通过canvas自动计算,较为精确
        autoCal: {
            type: Boolean,
            default: true,
        }
    },
    setup(props) {
        const coTooltipRef = ref<any>({});
        const contentStyle = computed(() => {
            return {
                'max-width': `${props.contentWidth}` || 'auto',
            };
        });

        const lineClampStyle = computed(() => {
            return {
                '-webkit-line-clamp': props.lineClamp,
            };
        });
        function setDisabled() {
            const targetDom  = coTooltipRef.value && coTooltipRef.value.$el;
            const { len, content, lineClamp, autoCal } = props;
            // 无文本，则不显示 tooltip
            if (!content) {
                return true;
            }
            // 文本clamp形式
            // 默认会利用canvas自动计算
            if (autoCal && targetDom && lineClamp) {
                // 实际tooltip文本框宽度；
                const domWidth = targetDom.clientWidth;
                const measureWidth =  textMeasure(props.content,{
                    targetDom: coTooltipRef.value.$el,
                });
                if (lineClamp === 1) {
                    return domWidth > measureWidth;
                }
                // 多行文本，目前，多行文本实际计算由于特殊字符等，直接* lineClamp 还是会出现问题
                return domWidth * lineClamp> measureWidth;
            }
            // 如autoCal = false，或targetDom不存在
            if (len > 0) {
                return content.length <= len;
            }
            return false;
        }
        return {
            contentStyle,
            lineClampStyle,
            coTooltipRef,
            setDisabled,
        };
    },
});
</script>
<style lang="less" scoped>
    .line_clamp_default__wrapper {
        /*由于clamp模式，必须是此，否则无法实现，外部可能会覆盖此display*/
        display: -webkit-box !important;
        cursor: pointer;
        overflow: hidden;
        -webkit-box-orient: vertical;
        word-break: break-all; // 处理英文
    }
</style>
