



# 知识总结

## tab

### slot无法强制更新

1. `this.$refs.tabs.$children[0].$forceUpdate();` 强制更新

2. 为tab设置key

   ```html
   <ks-el-tabs v-model="activeTab" type="card" tab-position="left">
     <ks-el-tab-pane name="tag" :key="'tag' + model.tagKey">
       <span slot="label">话题标签<i class="el-icon-success" v-show="model.tagRelatedConfig.hasRelatedConfig"></i> </span>
       <tag-form></tag-form>
     </ks-el-tab-pane>
     <ks-el-tab-pane name="icon" :key="'icon' + model.iconKey">
       <span slot="label">入口透出<i class="el-icon-success" v-show="model.iconConfig.hasActivityIconConfig"></i> </span>
       <icon-form></icon-form>
     </ks-el-tab-pane>
   </ks-el-tabs>
   ```

   - 这个主要问题是，组件内部hasRelatedConfig发生了变化，不能实时同步到tab上



# 常用

```html
<ks-el-tabs
            v-model="activeTab"
            type="card"
            tab-position="left"
            @tab-click="handleTabClick"
            >
  <template
            v-for="item in TAB_CONFIG"
            >
    <ks-el-tab-pane
                    :key="item.component"
                    :label="item.label"
                    :name="item.component"
                    >
      <component
                 ref="forms"
                 :is="item.component"
                 :model="model"
                 :row-data="rowData"
                 :condition="condition"
                 :selections="selections"
                 @submit="submit"
                 ></component>
    </ks-el-tab-pane>
  </template>
</ks-el-tabs>

```



```javascript
export const TAB_CONFIG = [
    { component: 'BaseForm', label: '基本信息' },
    { component: 'SortForm', label: '漫画分类' },
];
```

