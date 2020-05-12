# 知识总结

## table固定表头高度自适应

### 描述

1. table组件，固定表头则高度为固定值，不能针对不同分辨率进行自适应，如果设置的过高，table外面会有个滚动条，滚动外侧滚动条表头不固定

### 解决

1. 将tableHeight作为高度传入组件

   ```html
   <script>
     mounted() {
       this.$nextTick(() => {
         this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 160;
       });
     }
   </script>
   ```

2. 注意：

   - 在mounted中是无法直接获取table的高度，虽然子组件的mount先执行，但是并未渲染到页面上，故无法通过refs获取真实的table高

### 结论

1. 子父组件生命周期的执行顺序
2. 虽然执行了挂载，但页面dom有了，不代表样式有了

## 同步路由的排序到table上

```vue
<ks-el-table
             :default-sort="sortDefault"
        @sort-change="handleSortChange"
             >
</ks-el-table>
<script>
  methods: {
    sortTable() {
      // this.model.filters会同步路由参数到这里面
      const { desc, sortField } = this.model.filters;
      const order = desc ? 'descending' : '"ascending"';
      this.sortDefault = {
        prop: sortField,
        order: order
      };
    },
  }
</script>
```



## 如何通过配置产生不同的slot

```html
// 父级
<template #operate>
  asdasdasd
</template>
// 子
<template v-else-if="column.slot">
  <slot :name="column.slot"></slot>
</template>
```



# 问题处理

## props有数据传入，但不渲染

1. 经常会使用如下方式对list进行赋值

   ```javascript
   Object.assign(this.list, data)
   ```

2. 这样的方式，不会触发list响应式，需要`this.list = data`

# 封装

## 行超过一定高度显示popover

### 支持

1. 行超过某个高度，显示popover
   - bugs：理论应该低于某个值后，不显示popover
2. 可以根据row的某个数据设置行颜色

```html
<template>
  <ks-el-table
               :data="list"
               :row-class-name="rowClassName"
               @sort-change="handleSortChange"
               >
    <ks-el-table-column
                        v-for="item in config"
                        align="center"
                        :prop="item.prop"
                        :key="item.prop"
                        :sortable="item.sortable"
                        :label="item.label"
                        :width="item.width"
                        >
      <template slot-scope="scope">
        <div :class="getClass(item.className, scope.row)">
          <template v-if="item.type === 'time'">
            {{scope.row[item.prop] | datetime}}
          </template>
          <template v-else-if="item.type === 'img'">
            <ks-el-popover
                           placement="right"
                           trigger="hover"
                           >
              <img
                   class="co-img"
                   :src="scope.row[item.prop]"
                   :alt="item.label"
                   />
              <img
                   class="co-img-preview"
                   slot="reference"
                   :src="scope.row[item.prop]"
                   />
            </ks-el-popover>
          </template>
          <template v-else-if="item.type === 'popover'">
            <ks-el-popover
                           placement="top"
                           trigger="hover"
                           popper-class="misc-sentence-table__popover"
                           >
              {{scope.row[item.prop]}}
              <div slot="reference" class="popover-ref">
                {{scope.row[item.prop]}}
              </div>
            </ks-el-popover>
          </template>
          <template v-else>
            {{scope.row[item.prop]}}
          </template>
        </div>
      </template>
    </ks-el-table-column>
    <slot></slot>
  </ks-el-table>
</template>

<script>
  import { Table, TableColumn, Popover } from '@ks/ks-element-ui';
  export default {
    name: 'sentence-table',
    components: {
      KsElTable: Table,
      KsElTableColumn: TableColumn,
      KsElPopover: Popover,
    },
    props: {
      config: {
        type: Array,
        default: () => []
      },
      list: {
        type: Array,
        default: () => []
      },
      rowClassName: {
        type: [String, Function],
        default: () => {}
      },
    },
    methods: {
      getClass(className, row) {
        if (typeof className === 'function') {
          return className(row);
        }
        return className || '';
      },
      handleSortChange(payload) {
        this.$emit('sort-change', payload);
      },
    },
  };
</script>
<style lang="less">
  .misc-sentence-table__popover {
    width: 500px;
  }
</style>
<style lang="less" scoped>
  /deep/ .el-table__row .cell{
    max-height: 95px;
    overflow: hidden;
  }
  .co-img {
    max-width: 500px;
    max-height: 500px;
    &-preview {
      max-width: 50px;
      max-height: 50px;
      padding: 4px;
    }
  }
</style>

```

1. 可以根据row的某个数据设置行颜色

   ```javascript
   [
     {
       prop: 'statusName',
       label: '状态',
       sortable: 'custom',
       className: row => {
         if (row.status === ONLINE_STATUS) {
           return 'success';
         }
         return '';
       }
     },
     {
       prop: 'content',
       label: '口令内容',
       width: '450px',
       type: 'popover',
     },
   ]
   ```

   ```css
     /deep/ .success {
       color: #67C23A;
       font-weight: 900;
     }
   ```

