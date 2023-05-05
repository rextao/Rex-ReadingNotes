# 使用方式

```javascript
const {
    syncToRouter,
} = useSyncRouter(searchForm, {
    afterDataUpdate: async () => {
        await getList();
    },
    type: {
        uid: 'arrayString', // 会将uid转换为数组，数组每一项为string
    },
    omitKey: ['totol'] // 忽略传的某个key，不进行路由同步
});
```

# 举例
## 同步多个ref值
```javascript
const currentPanel = ref('video');
const title = ref('');
const statusText = ref('');
const {
    syncToRouter,
} = useSyncRouter(
    {
        tab: currentPanel,
        hashTagName: title,
        statusText,
    }, 
    {
        afterDataUpdate: async () => {
            // 设置默认值
            if (!currentPanel.value) {
                currentPanel.value = 'video';
            }
        },
});
```



# 问题处理

1. 如何处理首次声明为null的情况

   - 通过配置指定类型
   - 自动识别为string（console.warn，提醒注意）

2. 不能直接暴露ts，可能调用方build错误

   - 利用tsc，将ts转为 es5的文件

3. 需要有declare文件，否则会导致ts项目引入时报错

4. 纯ts项目，如何生成ts声明文件

   ```json
   // tsconfig.json
   {
     "declaration": true,
     "declarationDir": "./types",
   }
   // package.json
   {
     "version": "0.0.10",
       
     "main": "dist/index.js",
     "types": "types/index.d.ts",
     "files": [
       "src",
       "dist",
       "types"
     ],
     "scripts": {
       "build": "tsc"
     },
   }
   ```

   

# 遇到的问题

1. 有同学根本不声明searchfom，或利用delete做数据清空，导致同步失效；

# 调研

1. https://github.com/sindresorhus/query-string
   - 由于是基于vue-router，其实无
2. https://github.com/unshiftio/querystringify
   - 是无法递归stringify对象的
