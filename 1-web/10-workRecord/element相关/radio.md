# 封装

```vue
<template>
    <ks-el-radio-group
        class="radio-wrapper"
        v-model="select"
        @change="handleChange"
        v-bind="props"
    >
        <ks-el-radio
            class="radio"
            v-for="(item, v) in options"
            :label="transform(item[val])"
            :key="transform(item[val]) || v"
        >
            {{item[label]}}
        </ks-el-radio>
    </ks-el-radio-group>
</template>

<script>
import {
    RadioGroup,
    Radio,
} from '@ks/ks-element-ui';
export default {
    name: 'radio-api',
    components: {
        KsElRadioGroup: RadioGroup,
        KsElRadio: Radio,
    },
    props: {
        options: {
            type: Array,
            default: () => []
        },
        // 透传参数
        props: {
            type: Object,
            default: () => ({}),
        },
        label: {
            type: String,
            default: 'label'
        },
        // 下拉选项的value
        val: {
            type: String,
            default: 'value'
        },
        // 同步v-model值
        value: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            select: '',
        };
    },
    methods: {
        handleChange(val) {
            this.$emit('input', val);
            this.$emit('change', val);
        },
        // 主要是避免v-model是字符串，但option是数值，不能显示对应label
        transform(val) {
            if (typeof val === 'string') {
                // 不转换空字符串
                if (val === '') {
                    return '';
                }
                return +val || val;
            }
            return val;
        }
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
.radio-wrapper {
    .radio {
        margin: 5px;
    }
}
</style>
```

