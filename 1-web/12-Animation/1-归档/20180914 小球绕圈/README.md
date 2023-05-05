# 小球绕圈

## 知识丰富

### currentColor

1. ie9+=，表示的是当前color值

### border

1. 经常使用border配置边，忘记了有border-style，border-color，border-width，可以分别表示上右下左的边框
2. border-radius设置后，会使线条两端变细，如要实现一头细，或者两头都宽，需要使用border-color:transparent来进行处理，![1536890537559](介绍.assets/1536890537559.png)

## 构建方法

1. 为了保证适应性，修改font-size就可以实现放大缩小，使用em与百分数确定位置
2. 然后，使用before来确定位置（但实际上在放大缩小时，还是会有偏差）
3. 使用animation-direction: reverse; 可以直接反方向旋转