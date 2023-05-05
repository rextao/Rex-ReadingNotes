:is

1. 看成是一种CSS书写语法糖，可以简化复杂且重复选择器的书写，如

   ```css
   .active > .class-a,
   .active > .class-b,
   .active > .class-c {
     display: block;
   }
   ```

   简化为：

   ```css
   active > :is(.class-a, .class-b, .class-c) {
     display: block;
   }
   ```

2. 优先级是由括号内选择器的优先级决定的



:where

1. 和`:is()`伪类的语法、作用一模一样，优先级是0！！



[:has](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:has)

1. `a:has(> img) { display: block; }`
   - 匹配子元素是 `<img>` 元素的 `<a>` 元素会被匹配，而关系更远的后代元素则不考虑。
2. `:has()` 伪类不能被嵌套在另一个 `:has()` 内
3. 可以做什么：https://mp.weixin.qq.com/s/OOUG_XA-YFByqTcWJurJxg
   - 表单必填*、拖拽区域、多层hover、评级组件、日期选择范围



:focus-visible

1. 键盘访问触发的元素聚焦才是`:focus-visible`所表示的聚焦

2. 链接元素`<a>`鼠标点击的时候是不会有焦点轮廓的，但是键盘访问的时候会出现，这是非常符合预期的体验

3. chrome在如下场景，鼠标点击也会出现焦点轮廓

   - 设置了背景的`<button>`按钮；
   - HTML5 `<summary>`元素；
   - 设置了HTML `tabindex`属性的元素；

4. 直接设置` outline: 0`，会导致鼠标与键盘访问都没有交点轮廓，因此，chrome可以这么解决上述问题

   ```css
   :focus:not(:focus-visible) {
       outline: 0;
   }
   ```




::part

1. 用来改变Shadow DOM元素样式

