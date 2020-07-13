# 常用

```html
        <ks-el-dialog
            :title="dialogTitle"
            :visible.sync="dialogShow"
            v-if="dialogShow"
        >
            <component
                v-if="dialogShow"
                :is="dialogComponent"
            ></component>
        </ks-el-dialog>
```

```javascript
data() {
        return {
            dialogTitle: '',
            dialogComponent: '',
            dialogShow: false,
        };
    },
      
        handleClickEdit() {
            Object.assign(this, {
                dialogTitle: '',
                dialogComponent: '',
                dialogShow: true,
            });
        }
```

