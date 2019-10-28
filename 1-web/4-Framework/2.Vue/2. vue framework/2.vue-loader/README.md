#  Scoped CSS

## /deep/

1. 使用 `scoped` 后，父组件的样式将不会渗透到子组件中

2. 这种情况下你可以使用 `/deep/` 或 `::v-deep` 或`>>>`

   ```html
   <style scoped>
   .a >>> .b { /* ... */ }
   </style>
   ```

   上述代码会被解析为

   ```css
   .a[data-v-f3f3eg9] .b { /* ... */ }
   ```

3. 这个转换通过PostCss进行的，而不是polyfill