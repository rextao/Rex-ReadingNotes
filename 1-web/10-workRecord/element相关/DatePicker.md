# 知识总结

## 限制选择日期范围(如只能选一周)

```javascript
data(){
  return {
    choiceDate: '',
    pickOptions: {
      onPick: ({ maxDate, minDate }) => {
        this.choiceDate = minDate.getTime();
        if (maxDate) {
          this.choiceDate = '';
        }
      },
      disabledDate: time => {
        if (this.choiceDate) {
          const one = 14 * 24 * 3600 * 1000;
          const minTime = this.choiceDate - one;
          const maxTime = this.choiceDate + one;
          return time.getTime() < minTime || time.getTime() > maxTime;
        }
        return false;
      }
    },
  }
}
```



## 通过Conputed属性转换数组

1. datePick绑定v-model返回是数组，但有时提交时需要用startTIme和endTime提交

   ```vue
   <ks-el-date-picker
                      type="datetimerange"
                      v-model="dispatchTime"
                      >
   </ks-el-date-picker>
   <script>
       computed: {
           dispatchTime: {
               get() {
                   const { beginTime, endTime } = this.searchForm;
                   return beginTime && endTime ? [beginTime, endTime] : [];
               },
               set(value) {
                   this.searchForm.beginTime = value && value[0] && new Date(value[0]).getTime();
                   this.searchForm.endTime = value && value[1] && new Date(value[1]).getTime();
               }
           },
       },
   </script>
   ```

2. 实际是，在设置值时，会调用set方法，val分别设置在beginTime与endTime中；当修改时，获取的数据data中包含beginTime与endTime，在通过get方法转换为数组

# 封装
```vue
<template>
    <ks-el-tooltip
        :disabled="!pickTimeNum"
        effect="dark"
        :content="toolTipContent"
        placement="bottom"
    >
        <ks-el-date-picker
            v-model="time"
            :type="pickType"
            :disabled="disabled"
            :range-separator="rangeSeparator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            value-format="timestamp"
            @change="handleDatePickerChange"
            :picker-options="pickerOptions"
            :format="format"
            clearable
        ></ks-el-date-picker>
    </ks-el-tooltip>
</template>

<script>
import {
    DatePicker,
    Tooltip,
} from '@ks/ks-element-ui';

export default {
    name: 'date-picker-limit',
    components: {
        KsElDatePicker: DatePicker,
        KsElTooltip: Tooltip,
    },
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
        format: {
            type: String,
            default: 'yyyy-MM-dd HH:mm:ss'
        },
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            time: [],
            list: [],
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
            this.$emit('change', val);
        }
    },
    watch: {
        value: {
            immediate: true,
            handler() {
                this.time = this.value;
            }
        }
    }
};
</script>
```



