# Flexbox

## Flexbox是什么

### Flexbox是什么

1. Flexbox模块提供了一个有效的布局方式，即使不知道视窗大小或者未知元素情况之下都可以智能的，灵活的调整和分配元素和空间两者之关的关系
2. 简单的理解，就是可以自动调整，计算元素在容器空间中的大小

### 如何开始使用Flexbox

1. 第一件事是：声明一个Flex容器

2. 在父元素中显式的设置**display:flex**或者**display:inline-flex**

3. 设置flex的元素会自动变为flex容器，其子元素变为flex项目

4. 举例

	- html

		```
		<ul> <!--parent element-->
		  <li></li> <!--first child element-->
		  <li></li> <!--second child element-->
		  <li></li> <!--third child element-->
		</ul>
		```

	- css

		```css
		ul {
		  display:flex; /*或者 inline-flex*/
		}
		li {
		  width: 100px;
		  height: 100px;
		  background-color: #8cacea;
		  margin: 8px;
		}
		```

	- 效果：本应垂直摆列的li，变为水平排列，类似于float感觉![img](media/93a161ec92a4ed463f493f35b2667e86.png?lastModify=1545017622)

### flex容器与flex项目

1. Flex容器（Flex Container）：父元素显式设置了display:flex
2. Flex项目（Flex Items）：Flex容器内的子元素

## Flex容器属性

### 注意：

1. **因为是容器属性，故这些是设置在display:flex元素的样式**
2. Flex,布局自带等高布局特性

### flex-direction

1. 控制Flex项目沿着主轴（Main Axis）的排列方向。

2. 让你决定Flex项目如何排列。它可以是行（水平）、列（垂直）或者行和列的反向

	```css
	/* ul 是一个flex容器 */
	ul {
	  flex-direction: row || column || row-reverse || column-reverse;
	}
	```

3. flex的水平与垂直方向，常常被称为主轴与侧轴方向![img](media/123a68df8e960f9b9615196d97c2b0b9.png?lastModify=1545017622)

4. 主轴就是水平方向，从左到右（默认方向）；侧轴则是垂直方向，从上到下

5. flex-direction：row（默认值）![img](media/9b46109ec9e3f29c86a1b0f7743e7a58.png?lastModify=1545017622)

6. flex-direction：column；垂直排列，从上到下![img](media/0d22446974fdbf45ad3684b48cfa42cf.png?lastModify=1545017622)

### flex-wrap

1. 是否允许flex项目换行

2. 默认值为nowrap，不换行，即Flex容器会一直容纳所有子元素的排列，即使浏览器出现了水平滚动条（当Flex容器中添加了很多个Flex项目，至使Flex容器的宽度大于视窗宽度）。

	```css
	ul {  flex-wrap: wrap || nowrap || wrap-reverse;  }
	```

	![img](media/eb144458661357c204c9e45c0c411e9b.png?lastModify=1545017622)

3. flex-wrap：wrap

	- Flex项目现在显示的宽度是他们的默认宽度。也没有必要强迫一行有多少个Flex项目![img](media/4bda7f181de0a987698bf0f27de3308c.png?lastModify=1545017622)

4. flex-wrap：wrap-reverse

	- Flex项目在容器中多行排列，只是方向是反的。![img](media/c721ea3137476372d03a7dd6795e8236.png?lastModify=1545017622)

### flex-flow

1. 是flex-direction和flex-wrap两个属性的速记属性。
2. 类似于border

![img](media/9436988be9c56b47853faa4c394a9d5a.png?lastModify=1545017622)

### justify-content

1. 定义flex项目在主轴上的对齐方式

	```css
	ul {  justify-content: flex-start || flex-end || center || space-between ||space-around  }
	```

2. justify-content:flex-start（默认值）

	- flex-start让所有Flex项目靠Main-Axis开始边缘（左对齐）。![img](media/cdeb98bdfee7279445027b0d6e2249cc.png?lastModify=1545017622)

3. justify-content: flex-end

	- 让所有Flex项目靠Main-Axis结束边缘（右对齐）![img](media/112796ad9402d797e9e8415281044be3.png?lastModify=1545017622)

4. justify-content: center![img](media/91f94c1965f628f0e12850bcfdc933bf.png?lastModify=1545017622)

5. justify-content: space-between

	- 让除了第一个和最一个Flex项目的两者间间距相同（两端对齐）![img](media/6f7bb42dcbe835387d43eb5587b56c3c.png?lastModify=1545017622)

6. justify-content: space-around

	- 让每个Flex项目具有相同的空间![img](media/eac93e4b2318b1699099ff05760d46b0.png?lastModify=1545017622)

### align-items

1. 用来控制Flex项目在Cross-Axis对齐方式

	```css
	ul {  align-items: flex-start || flex-end || center || stretch || baseline  }
	```

2. align-items：stretch（默认值）

	- 让所有的Flex项目高度和Flex容器高度一样![img](media/f224fd9464dcc2bf9336adc972dd20a4.png?lastModify=1545017622)

3. align-items：flex-start

	- 让所有Flex项目靠Cross-Axis开始边缘（顶部对齐）![img](media/9b4b2d585bbd26d326f0130b85e7d69e.png?lastModify=1545017622)

4. align-items：flex-end

	- 让所有Flex项目靠Cross-Axis结束边缘（底部对齐）。![img](media/9f8512391eb48b50d398fd8dd6d5b292.png?lastModify=1545017622)

5. align-items：center

	- 让Flex项目在Cross-Axis中间（居中对齐）![img](media/1e82330b98d241e9ce1427d3b07e4397.png?lastModify=1545017622)

6. align-items：baseline

	- 让所有Flex项目在Cross-Axis上沿着他们自己的基线对齐![img](media/09b06cae53519303b0ddb6fd75ad39eb.png?lastModify=1545017622)

### align-content

1. **处理Flex项目多行排列的排列方式问题**
2. align-content：stretch
	- 会拉伸Flex项目，让他们沿着Cross-Axis适应Flex容器可用的空间
	- item之间有空隙是因为有margin值
	- ![img](media/56d0b8e33f2659df9ceff37f476ceab7.png?lastModify=1545017622)
3. align-content：flex-start
	- 让多行Flex项目靠Cross-Axis开始边缘。沿着Cross-Axis从上到下排列![img](media/40550edfe01e6809f8d5421feb714c0e.png?lastModify=1545017622)
4. align-content：flex-end
	- 让多行Flex项目靠着Cross-Axis结束位置![img](media/5669c24726740e1084e0768656a11679.png?lastModify=1545017622)
5. align-content：center![img](media/00db3febdda240bff9c6973d716d6bf1.png?lastModify=1545017622)

## Flex项目属性

### order

1. 允许Flex项目在一个Flex容器中重新排序

2. 可以改变Flex项目的顺序，从一个位置移动到另一个地方，这不会影响源代码

3. order属性的默认值是0

4. 例如：

	```css
	<ul>
	  <li>1</li>
	  <li>2</li>
	  <li>3</li>
	  <li>4</li>
	</ul>
	```

	![img](media/2648a0cc933009c34e91a58af62c5cc3.png?lastModify=1545017622)

	- 如因为某些原因，在不改变HTML文档源码情况之下，想把Flex项目一从1变成最后

		```css
		li:nth-child(1){
		  order: 1; /*设置一个比0更大的值*/
		}
		```

		![img](media/46ba6a34a67f0d14ab1bff1ee1ad0d9b.png?lastModify=1545017622)

### flex-grow

1. 控制Flex项目在容器有多余的空间如何放大（扩展）
2. **弹性布局默认不改变项目的宽度。**
3. 如其他item也具有此属性，则按flex-grow的比例分割空余空间
4. flex-grow属性值设置为0，表示Flex项目不会增长，填充Flex容器可用空间

  - 比如html，并添加css后得到如下样子

       ```html
       <ul>
         <li>I am a simple list</li>
       </ul>
       ```

       ```css
       ul {
         display: flex;
       }
       ```

       ![img](media/3496aa87e8c751b3213ec44020f6d031.png?lastModify=1545017622)

4. 如果把flex-grow的值设置为1，会发生：

	- 现在Flex项目扩展了，占据了Flex容器所有可用空间
	- 如果你试着调整你浏览器的大小，Flex项目也会缩小，以适应新的屏幕宽度。![img](media/6bd8cab369736ad357d27a7f91e957a6.png?lastModify=1545017622)


### flex-shrink

1. 控制Flex项目在容器在没有额外空间又如何缩小。
2. 初始值为1
3. 如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。
   - 比如外容器600px，abc分别是300，600，300（总和1200px）,3个容器会等比例缩小到150,300,150（总和600px）
4. 如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。

### flex-basis

1. 指定Flex项目的初始大小
2. 默认的值是auto
3. flex-basis可以取任何用于width属性的任何值。比如 % || em || rem ||px等。
4. **注意：如果flex-basis属性的值是0时，也需要使用单位。即flex-basis:0px不能写成flex-basis:0。**
5. flex-basis为默认值auto情况：
	- Flex项目宽度的计算是基于内容的多少来自动计算（很明显，加上了padding值）。![img](media/d648ee9a93dad88dfa237bed693b7691.png?lastModify=1545017622)![img](media/443184b54f5d829d4ee84368af699d2f.png?lastModify=1545017622)
	-  如果你增加Flex项目中的内容，它可以自动调整大小。![img](media/62bbb0c3a050093c457d300da48b9b4b.png?lastModify=1545017622)![img](media/7279fd71a95d40082c51d1b62dbd0686.png?lastModify=1545017622)
6. 设置flex-basis：150px![img](media/fd08740998711458926e49c34d5436be.png?lastModify=1545017622)

### flex

#### 概述

1. 是flex-grow、flex-shrink和flex-basis三个属性的速记（简写）。

2. 注意顺序，可以记忆为GSB

3. 如只有单个值，一个无单位数，会被理解为flex-grow值，一个有效宽度，则被理解为flex-basis

4. flex少一个值：形成一个绝对flex项目或相对flex项目（之后介绍）

  ```css
  /* 这是一个绝对的Flex项目 */
  li {
    flex: 1 1; /*flex-basis 默认值为 0*/
  }
  /* 这是一个相对的Flex项目 */
  li {
    flex-basis: 200px; /* 只设置了flex-basis的值 */
  }
  ```

  

#### flex: 0 1 auto

1. 相当于写了flex默认属性值以及所有的Flex项目都是默认行为

2. flex-basis设置为auto，这意味着Flex项目的初始宽度计算是基于内容的大小。

3. flex-grow设置为0。这意味着flex-grow不会改变Flex项目的初始宽度

4. flex-shrink的值是1。也就是说，Flex项目在必要时会缩小

5. ![img](media/e1dd25232bdc8a8a65cad352e8050ae6.png?lastModify=1545017622)![img](media/ca31772abd53e61025405f9f4776c0c9.png?lastModify=1545017622)

	

#### flex: 0 0 auto

1. **这个相当于flex: none**
2. 伸展和收缩开关都被关掉了。
3. 这两个弹性项目的宽度是不同的。因为宽度是基于内容宽度而自动计算的![img](media/aa94ea607f91df2dd7ee4c852fda9f2f.png?lastModify=1545017622)
4. 缩放一下浏览器，你会注意到弹性项目不会收缩其宽度![img](media/06960a5ef89f1427d1da2fa6f11144e9.png?lastModify=1545017622)

#### flex: 1 1 auto

1. 自动计算初始化宽度，但是如果有必要，会伸展或者收缩以适应整个可用宽度
2. 项目会填满可用空间，在缩放浏览器时也会随之收缩。![img](media/76a47c0bf7234141b46923beb26a8c18.png?lastModify=1545017622)



#### flex: "positive number"

1. 将弹性项目的初始宽度设置为零（嗯？没有宽度？），伸展项目以填满可用空间，并且最后只要有可能就收缩项目。

2. 弹性项目的宽度被根据 flex-grow 值的比例来计算

  ```css
  li {
    flex: 2 1 0; / *与 flex: 2相同 */
  }
  ```

3. 这里有两个弹性项目。一个的 flex-grow 属性值是 1，另一个是 2

  - 它是这样工作的：前一个占 1/3 的可用空间，后一个占 2/3 的可用空间

    ```html
    <ul>
      <li>I am One</li>
      <li>I am Two</li>
    </ul>
    ```

    ```css
    ul {
      display: flex;
    }
    /* 第一个弹性项目 */
    li:nth-child(1) {
      flex: 2 1 0; /* 与写成 flex: 2 相同*/
    }
    /* 第二个弹性项目 */
    li:nth-child(2){
      flex: 1 1 0;
      background-color: #8cacea;
    }
    ```

    ![img](media/6bb73c688e0ecf3dc6d707c701e95e7f.png?lastModify=1545017622)

4. **特别注意**：如外容器宽1200px，item设置flex:1，当item有padding时

   ```html
   <div class="flex-parent">
     <div class="flex-item abc" >
       flex-item
     </div>
     <div class="flex-item">
       flex-item
     </div>
     <div class="flex-item">
       flex-item
     </div>
   </div>
   <style>
     .flex-parent {
       display: flex;
       width:1200px;
     }
     .flex-item {
       flex:1;
     }
     .abc {
       padding:0 120px;
       background: red;
     }
   </style>
   ```

   - 计算逻辑为：3 * item  + 120 = 1200，实际每个item内容是320px，但第一个容器实际占560px，是无法实现列等宽的

### align-self

1. 改变一个弹性项目沿着侧轴的位置，而不影响相邻的弹性项目

2. 对某个具体的flex项目设置沿侧轴位置

	```css
	li:first-of-type {
	  align-self: auto || flex-start || flex-end || center || baseline || stretch
	}
	```

3. 比如如下form，在button中增加一个图片，将button和input都撑高了

	```html
	<form action="#">
	    <input type="email" placeholder="Enter your email">
	    <button type="button">
	<svg>  <!-- a smiley icon -->  </svg>
	</button>
	</form>
	```

	![img](media/b1db4643fdab5dfa3b35fc1082a743af.png?lastModify=1545017622)

4. align-self为对齐属性![img](media/14b4fdc4ba64d9328c12dbef8e1195dc.png?lastModify=1545017622)

5. 如果一行多个元素，都要这么设置太麻烦，可以使用父级的容器属性align-items（属性详情见上面）

	```css
	form {
	    display: flex;
	    align-items: center;
	}
	```

## 绝对和相对Flex项目

### 概述

1. 一个相对Flex项目内的间距是根据它的内容大小来计算的。而在绝对Flex项目中，只根据flex 属性来计算，而不是内容

### 相对Flex项目

```html
<ul>
  <li>
    This is just some random text  to buttress the point being explained.
    Some more random text to buttress the point being explained.
  </li>

  <li>This is just a shorter random text.</li>
</ul>
```

```css
ul {
  display: flex; /*触发弹性盒*/
}

li {
  flex: auto; /*记住这与 flex: 1 1 auto; 相同*/
  border: 2px solid red;
  margin: 2em;
}
```

![img](media/c280922dae2b5f2d3dcc023a3c47724b.png?lastModify=1545017622)

### 结果说明

1. Flex项目的初始宽度是被自动计算的（flex-basis:auto），然后会伸展以适应可用空间（flex-grow: 1）
2. 因为被自动计算，故Flex项目的内容大小不相同。因此，Flex项目的大小就会不相等

### 绝对Flex项目

1. 将li样式改为：

2. 由于flex-basis：0，故宽度不会基于内容大小而计算，而是基于flex-grow按比值计算

	```css
	li {
	  flex: 1 ; /*与 flex: 1 1 0 相同*/
	}
	```

![img](media/df24155a0d1c09136003f85a5f26b4d9.png?lastModify=1545017622)

## Auto-margin 对齐

### 概述

1. **当在Flex项目上使用 margin: auto 时，值为 auto的方向（左、右或者二者都是）会占据所有剩余空间。**

	- 与普通div的margin类似

		```html
		<ul>
		  <li>Branding</li>
		  <li>Home</li>
		  <li>Services</li>
		  <li>About</li>
		  <li>Contact</li>
		</ul>
		<style>
		ul {
		  display: flex;
		}
		li {
		  flex: 0 0 auto;
		}
		</style>
		```

2. 得到如下结果

	- 因为flex-grow：不会延伸
	- flex-basis：auto，按内容大小
	- Flex项目向Main-Axis的开头对齐（这是默认行为）。
	- 由于项目被对齐到Main-Axis开头，右边就有一些多余的空间。![img](media/d600c25f7865f3e22da02b6dc0ae92f8.png?lastModify=1545017622)

### 一个元素设置margin-right: auto;

1. 根据红字介绍，会在第一个item右侧占用全部额外空间

	```css
	li:nth-child(1) {  margin-right: auto; /只应用到右外边距/  }
	```

	![img](media/077773fcd2e2ce59c3ef07b62f8648a8.png?lastModify=1545017622)

### 设置margin：auto

1. 让一个Flex项目的两边都用自动外边距对齐![img](media/b05748d139955acc5af273abc7c299ab.png?lastModify=1545017622)
2. 当在一个Flex项目上使用自动外边距（margin: auto）时，justify-content属性就不起作用了。

## 切换flex-direction会发生什么？

1. 对于如下代码，开始效果为：

	```html
	<ul>
	  <li></li>
	  <li></li>
	  <li></li>
	</ul>
	```

	![img](media/0770960dc82a3dbddd73aa29d4653810.png?lastModify=1545017622)

2. 如切换direction![img](media/060795dd2a7a692e2883c99aedc41f7f.png?lastModify=1545017622)

3. 如设置了flex-basis：100px会得到：![img](media/77a27b437694c2346cb680e5fccf7896.png?lastModify=1545017622)

	- flex-basis 属性定义每个Flex项目的初始宽度

4. **在切换 flex-direction时，请注意，影响Main-Axis的每一个属性现在会影响新Main-Axis。像 flex-basis这种会影响Main-Axis上Flex项目宽度的属性，现在会影响项目的高度，而不是宽度。**







问题

1. flex子元素撑开父元素，flex-shrink无效
   - 浏览器默认为flex容器的子元素设置了 "min-width: auto;min-height: auto", 即flex子元素的最小宽度高度不能小于其内容的宽高，可以设置min-width: 0



# 举例

1. item无限占满一行

   ```css
   .preview_list__item {
         flex: 1;
         /*避免撑开父级*/
         width: 0;
         display: flex;
         align-items: center;
         flex-flow: row nowrap;
         overflow-x: auto;
         &::-webkit-scrollbar {
             width: 0;
             display: none;
         }
         .item {
         }
     }

