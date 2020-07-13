# 知识总结

## 循环生成表单并增加校验规则

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

## 子form校验

```javascript
// 子组件
async validate() {
  try {
    return await this.$refs.form.validate();
  } catch (e) {
    this.$message.error('需求方信息填写不完整！    ');
    return false;
  }
},
// 父组件
const { infoForm, form, clientTab } = this.$refs;
const res = await infoForm.validate();
if (!res) {
  return;
}
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



# 总结

1. 通过rules的改变，可以改变不同按钮点击后校验不同输入框

   ```javascript
   this.rules = RULES.FILL;
   await form.clearValidate();
   form.validate(async valid => {
     if (valid) {
       return true;
     }
     return false;
   });
   ```

   - 注意需要在validate中调用`form.clearValidate()`

