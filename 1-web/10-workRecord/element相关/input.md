# input

## 知识点

### 回车搜索

```
@keyup.enter.native="handleSearch"
```

### 替换input框选中文本

```
handleTagClick(item) {
    const { content } = this.searchForm;
    if (this.selectPos[0]) {
        const [ selectionStart, selectionEnd ] = this.selectPos;
        const start = content.substring(0, selectionStart);
        const end = content.substring(selectionEnd);
        this.searchForm.content = `${start}{$${item}}${end}`;
    }
},
handleInputBlur() {
    this.selectWord = '';
    const textarea = this.$refs.input.$refs.textarea;
    const { selectionStart, selectionEnd } = textarea;
    this.selectPos = [selectionStart, selectionEnd];
},
```



# 