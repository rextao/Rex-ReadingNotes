## props与v-model

### 描述

1. form表单的某些部分是被共用的，或者说需要再对upload或date-picker进行封装
2. 主要是如何绑定提交值

### 解决

#### 方案一：自定义v-model

```html
<date-schedule
    v-model="searchForm.time"
    :showSchedule="false"
></date-schedule>
```

```vue
<!--date-schedule组件内部-->
<template>
<ks-el-date-picker v-model="time" ></ks-el-date-picker>
</template>
<script>
  export default {
    props: {
      value: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        time: this.value,
      }
    },    
    methods: {
        handleDatePickerChange(val) {
            this.$emit('input', val);
        }
    }
  }
</script>
```

1. 子组件设 value 为props属性，并且不主动改变 value 值
2. 子组件通过 this.$emit('input', 'updateValue') 将 updateValue 值传给父组件
3. 父组件通过 v-model="localValue" 绑定一个本地变量
4. 即可实现子组件value值与父组件updateValue 值同步更新

#### 方案二：sync

```vue
<picuter-upload :imgUrl.sync="searchForm.bannerUrl" ></picuter-upload>
```

```vue
<!--picuter-upload组件内部-->
<script>
export default {
    props: {
        imgUrl: {
            type: String,
            default: ''
        }
    },
    methods: {
        handleUploadSuccess(res) {
            const { url } = res.data;
            this.$emit('update:imgUrl', url);
        },
    },
};
</script>
```

### 结论

1. 方案一，是子组件需要使用v-model

