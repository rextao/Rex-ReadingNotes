<template>
    <span
        class="co_date_picker"
    >
        <ks-tooltip
            :disabled="!pickTimeNum"
            effect="dark"
            :content="toolTipContent"
            placement="bottom"
        >
            <ks-date-picker
                v-model="model"
                v-bind="bindProps"
                popper-class="co_date_picker_popper"
                :picker-options="pickerOptions"
            ></ks-date-picker>
        </ks-tooltip>
    </span>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { DatePicker, Tooltip } from 'element-ui';
// 一天的毫秒数
export const ONE_DAY = 24 * 3600 * 1000;
// 当前时间的前一天
export const YESTERDAY = new Date().getTime() - ONE_DAY;

const defaultConfig = {
    type: 'datetimerange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    placeholder: '选择日期',
    'end-placeholder': '结束日期',
    'value-format': 'timestamp',
    format: 'yyyy-MM-dd HH:mm:ss',
};
interface IProps  {
    pickStartTime: boolean|number;
    pickEndTime: number;
    pickTimeNum: number;
    bindStartValue: string;
    bindEndValue: string;
    value?: any;
}

export default defineComponent<IProps>({
    name: 'co-date-picker',
    components: {
        KsTooltip: Tooltip,
        KsDatePicker: DatePicker,
    },
    props: {
        /**
             * 只能从哪天开始选，如传入10月1日，则只能从10月1日开始往后选择
             * 存在，则打开时间窗时，默认小于此时间的都禁选
             * number: 时间戳
             * boolean: 如为true，则直接获取当前时间now，作为start，可以选取今天之后
             * default 为0，只传入pickEndTime，不会触发禁用时间
             */
        pickStartTime: {
            type: [Number, Boolean],
            default: 1,
        },
        /**
         * 存在，则打开时间窗时，默认大于此时间的都禁选
         */
        pickEndTime: {
            type: Number,
            default: 0,
        },
        // 可选时间天数，如果未传入，则默认不使用限制选择范围功能
        pickTimeNum: {
            type: Number,
            default: 0,
        },
        bindStartValue: {
            type: String,
            default: undefined,
        },
        bindEndValue: {
            type: String,
            default: undefined,
        },
        value: {
            type: [Array, Number, Object, String],
            default: () => [],
        },
    },
    setup(props, { attrs, emit }) {
        let choiceDate = 0;
        const options = {
            onPick: ({ maxDate, minDate }: { maxDate: any; minDate: any}) => {
                choiceDate = minDate.getTime();
                if (maxDate) {
                    choiceDate = 0;
                }
            },
            disabledDate: (time: any) => {
                // 1、 pickStartTime存在，则打开时间窗时，默认小于此时间的都禁选
                // 2、 pickEndTime存在，则打开时间窗时，默认大于此时间的都禁选
                // 3、 pickTimeNum存在，则可以选择pickTimeNum天（开始点击的前后各pickTimeNum天可以选）
                let pickStartTime = props.pickStartTime;
                const pickEndTime = props.pickEndTime;
                let choiceMinTime = 0;
                let choiceMaxTime = 0;
                let step = 0;
                if (pickStartTime && typeof pickStartTime === 'boolean') {
                    pickStartTime = YESTERDAY;
                }
                if (props.pickTimeNum) {
                    step = (props.pickTimeNum - 1) * 24 * 3600 * 1000;
                    choiceMinTime = choiceDate - step;
                    choiceMaxTime = choiceDate + step;
                }
                if (choiceDate) {
                    const minTime = choiceMinTime < pickStartTime ? pickStartTime : choiceMinTime;
                    let maxTime;
                    // 如果 choiceMaxTime 和 pickEndTime 同时存在取最小的，否则取不为0的值
                    if (choiceMaxTime && pickEndTime) {
                        maxTime = choiceMaxTime > pickEndTime ? pickEndTime : choiceMaxTime;
                    } else {
                        maxTime = pickEndTime ? pickEndTime : choiceMaxTime;
                    }
                    return time.getTime() < minTime || maxTime && time.getTime() > maxTime;
                }
                // 如果传入限制开始时间或结束时间
                if (props.pickStartTime || props.pickEndTime) {
                    // 打开picker时，小于pickStartTime或大于pickEndTime时间都不能被选中
                    return time.getTime() < pickStartTime || pickEndTime && time.getTime() > pickEndTime;
                }
                return false;
            },
        };

        // 认为需要将时间同步到 value[bindStartValue]与value[bindEndValue]字段
        const isObjectValue = computed(() => {
            const { bindStartValue, bindEndValue, value } = props;
            const valueToString = Object.prototype.toString.call(value);
            return bindStartValue && bindEndValue && valueToString === '[object Object]';
        });
        const toolTipContent = computed(() => {
            if (props.pickTimeNum === 31 || props.pickTimeNum === 30) {
                return '最多选择1个月';
            }
            if (props.pickTimeNum !== 0 && props.pickTimeNum % 7 === 0 ) {
                return `最多选择${props.pickTimeNum / 7}周`;
            }
            return `最多选择${props.pickTimeNum}天`;
        });

        const pickerOptions = computed(() => {
            return props.pickTimeNum || props.pickStartTime ? options : {};
        });
        const model = computed({
            get() {
                const { bindStartValue, bindEndValue, value } = props;
                if (isObjectValue.value) {
                    const startTime = props.value[bindStartValue];
                    const endTime = props.value[bindEndValue];
                    return startTime && endTime ? [startTime, endTime] : [];
                }
                return value;
            },
            set(value: any) {
                const { bindStartValue, bindEndValue } = props;
                if (isObjectValue.value) {
                    props.value[bindStartValue] = value && value[0];
                    props.value[bindEndValue] = value && value[1];
                } else {
                    emit('input', value);
                }
                emit('change', value);
            },
        });
        const bindProps = computed(() => {
            return {
                ...defaultConfig,
                ...attrs,
            };
        });
        return {
            model,
            bindProps,
            toolTipContent,
            pickerOptions,
        };
    },
});
</script>
<style scoped lang="less">
.co_date_picker {
    display: inline-block;
}
</style>
