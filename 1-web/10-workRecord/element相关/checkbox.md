# 封装

```javascript

```





# 问题

## 利用@change抛出值，导致校验结果相反

1. 问题代码，主要是用@change抛出改变值进行同步

   ```html
       <el-checkbox-group
               v-else
               v-model="select"
               @change="handleChange"
               v-bind="$attrs"
       >
           <el-checkbox
                   v-for="(item, v) in options"
                   :label="item[val]"
                   :key="item[val] || v"
                   :disabled="item.disabled"
           >
               {{item[label]}}
           </el-checkbox>
       </el-checkbox-group>
   ```

2. checkbox点击执行流程

   - 触发checkbox，v-model的set值，`this.dispatch('ElCheckboxGroup', 'input', [val]);`
   - 触发checkbox-group，value的watch，`this.dispatch('ElFormItem', 'el.form.change', [value]);`
   - 触发form-item的`el.form.change`事件，触发`onFieldChange`函数，这个是校验
     - 会去获取`form.model`绑定的数据，此时由于封装的组件还没触发change，导致外部无法同步最新数据
     - 导致校验失败
   - 本质问题在于，checkbox的change事件，在nextTick中。。所以晚于v-model的值改变而触发，即使无nextTick，`_checkboxGroup`在checkbox change时并未获得准确值，故抛出去的还是空数组


