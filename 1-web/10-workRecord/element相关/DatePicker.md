# 知识总结

## 限制选择日期范围(如只能选一周)

```javascript
data(){
  return {
    choiceDate: '',
    pickOptions: {
      onPick: ({ maxDate, minDate }) => {
        this.choiceDate = minDate.getTime();
        if (maxDate) {
          this.choiceDate = '';
        }
      },
      disabledDate: time => {
        if (this.choiceDate) {
          const one = 14 * 24 * 3600 * 1000;
          const minTime = this.choiceDate - one;
          const maxTime = this.choiceDate + one;
          return time.getTime() < minTime || time.getTime() > maxTime;
        }
        return false;
      }
    },
  }
}
```



## 通过Conputed属性转换数组

1. datePick绑定v-model返回是数组，但有时提交时需要用startTIme和endTime提交

   ```vue
   <ks-el-date-picker
                      type="datetimerange"
                      v-model="dispatchTime"
                      >
   </ks-el-date-picker>
   <script>
       computed: {
           dispatchTime: {
               get() {
                   const { beginTime, endTime } = this.searchForm;
                   return beginTime && endTime ? [beginTime, endTime] : [];
               },
               set(value) {
                   this.searchForm.beginTime = value && value[0] && new Date(value[0]).getTime();
                   this.searchForm.endTime = value && value[1] && new Date(value[1]).getTime();
               }
           },
       },
   </script>
   ```

2. 实际是，在设置值时，会调用set方法，val分别设置在beginTime与endTime中；当修改时，获取的数据data中包含beginTime与endTime，在通过get方法转换为数组

# 封装





