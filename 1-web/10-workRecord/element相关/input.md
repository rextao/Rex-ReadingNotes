# input

## 知识点

### 回车搜索

```
@keyup.enter.native="handleSearch"
```

### 替换input框选中文本

```
handleTagClick(item) {
    const { content } = this.searchForm;
    if (this.selectPos[0]) {
        const [ selectionStart, selectionEnd ] = this.selectPos;
        const start = content.substring(0, selectionStart);
        const end = content.substring(selectionEnd);
        this.searchForm.content = `${start}{$${item}}${end}`;
    }
},
handleInputBlur() {
    this.selectWord = '';
    const textarea = this.$refs.input.$refs.textarea;
    const { selectionStart, selectionEnd } = textarea;
    this.selectPos = [selectionStart, selectionEnd];
},
```



#封装

```vue
<template>
    <ks-el-input
        v-model="input"
        v-bind="props"
        @change="handleChange"
    ></ks-el-input>
</template>

<script>
import {
    Input,
} from '@ks/ks-element-ui';
export default {
    name: 'input-api',
    components: {
        KsElInput: Input,
    },
    props: {
        props: {
            type: Object,
            default: () => ({}),
        },
        // 是否对数据进行转换
        transform: {
            type: String,
            default: 'array',
        },
        // 同步v-model值
        value: {
            type: [String, Array],
            default: ''
        }
    },
    data() {
        return {
            input: '',
        };
    },
    methods: {
        handleChange(val) {
            this.$emit('input', this.transformInput(val));
            this.$emit('change', val);
        },
        transformInput(val) {
            // 将以逗号分隔的文本。直接转为数组，便于提交
            // 同步给外面值是数组
            if (this.transform === 'array') {
                if (!val) {
                    return [];
                }
                return val.split(/,|，/);
            }
            return val;
        },
        transformFromProps(val) {
            if (this.transform === 'array') {
                // 数组转为','形式
                if (Array.isArray(val)) {
                    const str = val.join();
                    if (this.input === str) {
                        return;
                    }
                    this.input = str;
                } else {
                    this.input = val;
                }
            }

        },
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.transformFromProps(val);
            }
        }
    },
};
</script>

```

