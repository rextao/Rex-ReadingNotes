# 封装

## 基本模式

```vue
使用 transform  fixed数据问题
```





## 多选模式

1. 设置all-btn

   - 会多一个【全选】项，通过点击，可以选择全部options

   - 为了避免下拉框撑开影响布局，默认使用collapse-tags

     ```html
     <channel-select
     	multiple
     	all-btn
     ></channel-select>
     ```

     

2. 补充

   - 在封装element时，可能需要查看源码，直接调用$refs.xxxx方法，实现如调用setSelected()设置选中状态

```vue
<template>
    <ks-el-select
        ref="select"
        v-model="select"
        @change="handleChange"
        collapse-tags
        v-bind="props"
    >
        <div
            v-if="props.multiple && allBtn && hasOptions"
            class="all_btn"
            @click="handleAllBtnClick"
        >
            全部
        </div>
        <ks-el-option
            v-for="(item, v) in options"
            :label="item[label]"
            :value="transform(item[val])"
            :key="transform(item[val]) || v"
        ></ks-el-option>
    </ks-el-select>
</template>

<script>
import {
    Select,
    Option,
} from '@ks/ks-element-ui';
export default {
    name: 'select-api',
    components: {
        KsElSelect: Select,
        KsElOption: Option,
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        label: {
            type: String,
            default: 'label'
        },
        val: {
            type: String,
            default: 'value'
        },
        // 自定义参数
        // 多选，显示【全部】按钮，方便列表选择全选
        allBtn: {
            type: Boolean,
            default: false,
        },
        // 透传参数
        props: {
            type: Object,
            default: () => ({}),
        },
        // 同步v-model值
        value: {
            type: [String, Array],
            default: ''
        }
    },
    data() {
        return {
            select: '',
        };
    },
    computed: {
        hasOptions() {
            return this.options.length > 0;
        },
    },
    methods: {
        handleChange(val) {
            this.$emit('input', val);
            this.$emit('change', val);
        },
        handleAllBtnClick() {
            const selectRefs = this.$refs.select;
            this.select = this.options.map(op => this.transform(op[this.val]));
            // 设置面包选择状态，否则选择不会有选中效果
            selectRefs.setSelected();
            selectRefs.blur();
            this.$emit('input', this.select);
            this.$emit('change', this.select);
        },
        // 主要是避免v-model是字符串，但option是数值，不能显示对应label
        // 直接return +val || val; +[123] || [123] => 123 会导致多选模式报错
        transform(val) {
            if (typeof val === 'string') {
                // 不转换空字符串
                if (val === '') {
                    return '';
                }
                return +val || val;
            }
            return val;
        },
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.select = this.transform(val);
            }
        }
    },
};
</script>
<style lang="less" scoped>
    .all_btn {
        cursor: pointer;
        font-size: 14px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 34px;
        line-height: 34px;
        &:hover {
            background-color: #f5f7fa;
            color: #ff8000;
        }
    }
</style>
```