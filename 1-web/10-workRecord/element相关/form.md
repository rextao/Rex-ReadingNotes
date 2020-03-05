# 知识总结

### 循环生成表单并增加校验规则

1. 可参照：packages/admin/src/pages/channel/link/video/index.vue

```html
<template>
  <ks-el-form
              :model="formData"
              >
    <div
         v-for="(item, i) in formData.subChannelList"
         >                  
      <ks-el-form-item
                       v-if="item.editable"
                       :key="item.subChannelId"
                       :prop="`subChannelList.${i}.email`"
                       :rules="rules.email"
                       >
        <ks-el-input
                     v-model="item.email"
                     ></ks-el-input>
      </ks-el-form-item>
    </div>
  </ks-el-form>
</template>

<script>

  export default {
    data() {
      return {
        formData: {
          subChannelList: [],
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
          ]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      async getData() {
        const { data } = await serviceMethod('videoLinkList', {
          ...this.extraParams,
        });
        // 实际data = { subChannelList: [{email: ''},{email: ''}] }
        this.formData = data;
      },
      async handleSearchSubmit() {
        try {
          this.$refs.form.validate();
        },
      }
    };
</script>
```





# 封装





# 通用样式

## form的inline模式input占满整行

1. 在`ks-el-form`增加类`form-flex`

```css
.form-flex {
  /deep/ .el-form-item {
    display: flex;
  }
  /deep/ .el-form-item__content {
    flex: 1;
  }
}
```





# 校验

```javascript

const validateBatchSizes = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请填写批量数字'));
    } else if (!/^[0-9]+[0-9,]*$/.test(value)) {
        callback(new Error('请输入数字或英文逗号!'));
    } else {
        callback();
    }
};
const validateNumber = msg => {
    return (rule, value, callback) => {
        if (value === '') {
            callback(new Error(msg));
        } else if (!/^[\d]*$/.test(value)) {
            callback(new Error('请输入正整数!'));
        } else {
            callback();
        }
    };
};
const validateGiftPrice = validateNumber('请填写价格');
const validateSlotDisplayDuration = validateNumber('请填写槽位时长');
export const RULES = {
    giftName: { required: true, message: '请填写礼物名称', trigger: 'blur' },
    batchSizes: { required: true, validator: validateBatchSizes, trigger: 'blur' },
    slotDisplayDuration: { required: true, validator: validateSlotDisplayDuration, trigger: 'blur' },
};

```

