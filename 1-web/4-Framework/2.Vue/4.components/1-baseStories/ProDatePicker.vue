<template>
    <span class="co_date_picker">
        <ProTooltip :disabled="!pickTimeNum" effect="light" :content="toolTipContent" placement="bottom" is-k18n>
            <element-date-picker
                v-model="model"
                v-bind="bindProps"
                :disabled-date="disabledDate"
                popper-class="co_date_picker_popper"
                :shortcuts="getShortcuts()"
                @rangePick="onRangePick" />
        </ProTooltip>
    </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { DatePicker, Tooltip } from 'element';
import { getK18n, TODAY_START, ONE_DAY, TODAY_END } from '@components/proUtils';
import { ProTooltipV2 as ProTooltip } from '@/components/base/index';

export default defineComponent({
    name: 'ProDatePicker',
    components: {
        ElementTooltip: Tooltip,
        ElementDatePicker: DatePicker,
        ProTooltip,
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
        // 最多选择xxx天，文案，自定义
        // 如，半年，3个月等
        pickTimeText: {
            type: String,
            default: '',
        },
        // Array<string | object> => 可配置字符串key有 [1,3,7]
        // 也可数组传入 shotcuts的一个对象
        // true,则把默认配置全透出
        // false， 不使用shotcuts
        shortcuts: {
            type: [Array, Boolean],
            default: false,
        },
        // 是否shortcuts使用整天计算
        // true：如昨天，时间取昨日0点到昨日24点
        // false: 如昨日，从当前时刻往前推24小时
        shortcutsAllDay: {
            type: Boolean,
            default: true,
        },
        bindStartValue: {
            type: String,
            default: undefined,
        },
        bindEndValue: {
            type: String,
            default: undefined,
        },
        modelValue: {
            type: [Array, Number, Object, String],
            default: () => [],
        },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, ctx) {
        let choiceDate: string | number = 0;
        const $k18n = getK18n();
        const defaultConfig = {
            type: 'datetimerange',
            'range-separator': 'to',
            'start-placeholder': $k18n('开始时间'),
            placeholder: '-',
            'end-placeholder': $k18n('结束时间'),
            'value-format': 'timestamp',
            format: 'YYYY/MM/DD HH:mm:ss',
            'text-align': 'center',
            'popper-class': 'co_date_picker_popper',
        };
        const NOW = Date.now();

        const datePickShortCut = (props: any) => {
            const { shortcutsAllDay } = props;
            const dayArray = [1, 3, 7, 30, 90, 180];
            const dayArrayText = ['昨天', '近3天', '近7天', '近1个月', '近3个月', '近半年'];
            const result = {};
            dayArray.forEach((key, index) => {
                result[key] = {
                    text: $k18n(dayArrayText[index]),
                    value: (() => {
                        if (shortcutsAllDay) {
                            return [TODAY_START - key * ONE_DAY, TODAY_END - ONE_DAY];
                        }
                        return [NOW - key * ONE_DAY, NOW];
                    })(),
                };
            });
            return result;
        };
        function onRangePick({ maxDate, minDate }) {
            choiceDate = minDate.getTime();
            if (maxDate) {
                choiceDate = '';
            }
        }
        function disabledDate(time) {
            // 1、 pickStartTime存在，则打开时间窗时，默认小于此时间的都禁选
            // 2、 pickEndTime存在，则打开时间窗时，默认大于此时间的都禁选
            // 3、 pickTimeNum存在，则可以选择pickTimeNum天（开始点击的前后各pickTimeNum天可以选）
            let pickStartTime = props.pickStartTime;
            const pickEndTime = props.pickEndTime;
            let choiceMinTime = 0;
            let choiceMaxTime = 0;
            let step = 0;
            if (pickStartTime && typeof pickStartTime === 'boolean') {
                pickStartTime = new Date().getTime() - ONE_DAY;
            }
            if (props.pickTimeNum) {
                step = (props.pickTimeNum - 1) * ONE_DAY;
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
                    maxTime = pickEndTime || choiceMaxTime;
                }
                return time.getTime() < minTime || (maxTime && time.getTime() > maxTime);
            }
            // 如果传入限制开始时间或结束时间
            if (pickStartTime || pickEndTime) {
                // 打开picker时，小于pickStartTime或大于pickEndTime时间都不能被选中
                return time.getTime() < pickStartTime || (pickEndTime && time.getTime() > pickEndTime);
            }
            return false;
        }
        // 认为需要将时间同步到 modelValue[bindStartValue]与value[bindEndValue]字段
        const isObjectValue = computed(() => {
            const { bindStartValue, bindEndValue, modelValue } = props;
            const valueToString = Object.prototype.toString.call(modelValue);
            return bindStartValue && bindEndValue && valueToString === '[object Object]';
        });
        const toolTipContent = computed(() => {
            if (props.pickTimeNum === 31 || props.pickTimeNum === 30) {
                return '最多选择1个月';
            }
            if (props.pickTimeNum !== 0 && props.pickTimeNum % 7 === 0) {
                return `最多选择${props.pickTimeNum / 7}周`;
            }
            return `最多选择${props.pickTimeNum}天`;
        });

        const model = computed({
            get() {
                const { bindStartValue, bindEndValue, modelValue } = props;
                if (isObjectValue.value) {
                    const startTime = props.modelValue[bindStartValue];
                    const endTime = props.modelValue[bindEndValue];
                    return startTime && endTime ? [startTime, endTime] : [];
                }
                return modelValue;
            },
            set(value) {
                const { bindStartValue, bindEndValue } = props;
                if (isObjectValue.value) {
                    props.modelValue[bindStartValue] = value && value[0];
                    props.modelValue[bindEndValue] = value && value[1];
                } else {
                    ctx.emit('update:modelValue', value);
                }
                ctx.emit('change', value);
            },
        });
        const bindProps = computed(() => {
            return {
                ...defaultConfig,
                ...ctx.attrs,
            };
        });
        function getShortcuts() {
            const { shortcuts } = props;
            // false
            if (!shortcuts) {
                return [];
            }
            const defaultShortcutsConfig = datePickShortCut(props);
            if (Array.isArray(shortcuts)) {
                const result: any = [];
                shortcuts.forEach(item => {
                    if (typeof item === 'number' && defaultShortcutsConfig[item]) {
                        result.push(defaultShortcutsConfig[item]);
                    } else {
                        result.push(item);
                    }
                });
                return result;
            }
            // true
            return Object.values(defaultShortcutsConfig);
        }
        return {
            model,
            bindProps,
            toolTipContent,
            disabledDate,
            onRangePick,
            getShortcuts,
        };
    },
});
</script>
<style scoped lang="scss">
.co_date_picker {
    display: inline-block;
}
</style>
