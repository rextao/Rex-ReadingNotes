<template>
    <el-tooltip
        :disabled="!pickTimeNum"
        class="item"
        effect="dark"
        :content="toolTipContent"
        placement="bottom"
    >
        <el-date-picker
            v-model="time"
            :type="pickType"
            :disabled="disabled"
            :range-separator="rangeSeparator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            value-format="timestamp"
            @change="handleDatePickerChange"
            :picker-options="pickerOptions"
            clearable
        ></el-date-picker>
    </el-tooltip>
</template>

<script>

export default {
    name: 'date-picker-limit',
    props: {
        // 只能从哪天开始选，如传入10月1日，则只能从10月1日开始往后选择
        pickStartTime: {
            type: Number,
            default: 0,
        },
        // 可选时间天数，如果未传入，则默认不使用限制选择范围功能
        pickTimeNum: {
            type: Number,
            default: 0,
        },
        // picker的类型，datetimerange与daterange
        pickType: {
            type: String,
            default: 'daterange'
        },
        // 是否禁用日期选择器
        disabled: {
            type: Boolean,
            default: false
        },
        //
        startPlaceholder: {
            type: String,
            default: '开始日期'
        },
        endPlaceholder: {
            type: String,
            default: '结束日期'
        },
        // 选择范围时的分隔符
        rangeSeparator: {
            type: String,
            default: '至'
        },
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            time: this.value,
            list: [],
            scheduleMsg: '',
            options: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime();
                    if (maxDate) {
                        this.choiceDate = '';
                    }
                },
                disabledDate: time => {
                    // 1、 pickStartTime存在，则打开时间窗时，默认小于此时间的都禁选
                    // 2、 pickTimeNum存在，则可以选择pickTimeNum天（开始点击的前后各pickTimeNum天可以选）
                    const pickStartTime = this.pickStartTime;
                    const choiceDate = this.choiceDate;
                    let choiceMinTime = 0;
                    let step = 0;
                    if (this.pickTimeNum) {
                        step = (this.pickTimeNum - 1) * 24 * 3600 * 1000;
                        choiceMinTime = choiceDate - step;
                    }
                    if (this.choiceDate) {
                        const minTime = choiceMinTime < pickStartTime ? pickStartTime : choiceMinTime;
                        const maxTime = this.choiceDate + step;
                        return time.getTime() < minTime || step && time.getTime() > maxTime;
                    }
                    // 如果传入限制开始时间
                    if (this.pickStartTime) {
                        // 打开picker时，小于pickStartTime时间都不能被选中
                        return time.getTime() < pickStartTime;
                    }
                    return false;
                }
            },
        };
    },
    computed: {
        toolTipContent() {
            if (this.pickTimeNum === 31 || this.pickTimeNum === 30) {
                return '最多选择1个月';
            }
            if (this.pickTimeNum !== 0 && this.pickTimeNum % 7 === 0 ) {
                return `最多选择${this.pickTimeNum / 7}周`;
            }
            return `最多选择${this.pickTimeNum}天`;
        },
        pickerOptions() {
            return this.pickTimeNum || this.pickStartTime ? this.options : {};
        }
    },
    methods: {
        handleDatePickerChange(val) {
            this.$emit('input', val);
        }
    },
    watch: {
        value: {
            handler() {
                this.time = this.value;
            }
        }
    }
};
</script>
