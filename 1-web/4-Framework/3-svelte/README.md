无虚拟dom

1. 不利用虚拟dom，在运行期间diff出哪些变化，然后执行render函数；而是在编译期间直接针对变化生成可应用函数

2. 虽然共识是没有Virtual Dom，但Svelte 在做两个列表间的更新时，为了运行高效，也需要对列表进行diff，因为编译期间是无法知道我将会对列表怎么操作

3. 编译到原生 DOM 并不比编译到 Virtual DOM 快，Svelte 快就快在编译时就区分了静态和动态内容，vue3也这么做了

4. 

   

核心思想在于『通过静态编译减少框架运行时的代码量』

1. Svelte 组件编译后，运行时代码都包含在里面了，除了引入这个组件本身，你不需要再额外引入一个所谓的框架运行时，但并不是说没有运行时
2. 将模板编译为命令式 (imperative) 的原生 DOM 操作，不需要进行diff/patch操作
3. 对于特定的逻辑，如if/else切换等，依然有对应的运行时代码，但某个功能没用到，对应的代码不会被编译到结果里去



潜在风险

1. 大型应用的性能有待观察
2. 项目里的组件越多，代码量的差异就会逐渐缩小，使用的功能越多，最终在实际生产项目中能有多少尺寸优势，其实很难说
3. 



# reactive

1. Svelte 的响应方案是采用一种 Bitmask-based change tracking 的机制配合赋值语句实现的

2. 把变量进行编号，然后使用二进制位来存储变量是否为脏。当检测到你脚本中出现赋值语句时，调用 makeDirty 函数将变量标记为脏，然后开启刷新队列/入队更新操作，执行更新。

3. 缺点：

   - 由于是基于赋值语句的，例如数组的 push/pop 之类的，`delete obj.foo `之类的，总之除了赋值啥都不行

   - 粒度不够细，如你有一个对象 `obj`，Svelte 只会给这个 `obj` 变量进行编号，并不会给 obj 对象下的属性编号，因此对`obj.foo`赋值与`obj.far`赋值对Svelte是一致的，

     - 因此即使模板中没有使用 `obj.foo`，但是模板中使用了` obj.bar`，那么当你给 obj.foo 赋值时仍然会触发更新

     - 需要使用位运算来判断你为哪个变量“赋值”了，还要检测值是否真的发生了变化，因此会生成很多守卫代码

       ```javascript
       p(ctx, [dirty]) {
         if (dirty & /*obj*/ 1 && t1_value !== (t1_value = /*obj*/ ctx[0].name + "")) set_data(t1, t1_value);
       },
       ```

       

## 源码

1. 从源码角度看数据更新过程

2. 在https://svelte.dev/repl/hello-world?version=3.38.2，可以直接查看svelte组件的js编译结果

3. 以如下例子

   ```html
   <script>
       let obj = {
   			name: 'world'
   		};
       function setName () {
           obj.name = 'fesky'
       }
   </script>
   
   <h1 on:click={setName}>Hello {obj.name}!</h1>
   ```

4. 编译结果

   ```javascript
   function create_fragment(ctx) {
     // 暂略，变量声明
     return {
       c() {
         h1 = element("h1");
         t0 = text("Hello ");
         t1 = text(t1_value);
         t2 = text("!");
       },
       m(target, anchor) {
         insert(target, h1, anchor);
         append(h1, t0);
         append(h1, t1);
         append(h1, t2);
   
         if (!mounted) {
           dispose = listen(h1, "click", /*setName*/ ctx[1]);
           mounted = true;
         }
       },
       p(ctx, [dirty]) {
         if (dirty & /*obj*/ 1 && t1_value !== (t1_value = /*obj*/ ctx[0].name + "")) set_data(t1, t1_value);
       },
       i: noop,
       o: noop,
       d(detaching) {
         if (detaching) detach(h1);
         mounted = false;
         dispose();
       }
     };// 返回数据类型为 Fragment
   }
   
   function instance($$self, $$props, $$invalidate) {
     let obj = { name: "world" };
   
     function setName() {
       $$invalidate(0, obj.name = "fesky", obj);
     }
   
     return [obj, setName];
   }
   
   class App extends SvelteComponent {
     constructor(options) {
       super();
       init(this, options, instance, create_fragment, safe_not_equal, {});
     }
   }
   
   export default App;
   
   // 类型声明
   interface Fragment {
     key: string|null;
     first: null;
     /* create  */ c: () => void;
     /* claim   */ l: (nodes: any) => void;
     /* hydrate */ h: () => void;
     /* mount   */ m: (target: HTMLElement, anchor: any) => void;
     /* update  */ p: (ctx: any, dirty: any) => void;
     /* measure */ r: () => void;
     /* fix     */ f: () => void;
     /* animate */ a: () => void;
     /* intro   */ i: (local: any) => void;
     /* outro   */ o: (local: any) => void;
     /* destroy */ d: (detaching: 0|1) => void;
   }
   ```

   

### instance 函数

1. 在`init`函数汇中，会对当前实例的`ctx`进行赋值，即：

   ```javascript
   const $$: T$$ = component.$$ = {};
   $$.ctx = instance
     ? instance(component, options.props || {}, (i, ret, ...rest) => {
     const value = rest.length ? rest[0] : ret;
     if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
       if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
       if (ready) make_dirty(component, i);
     }
     return ret;
   })
   : [];
   ```

   - 即组件ctx是instance函数执行的返回结果
   - 是一个数组

2. 因此对于上述例子，instance函数会返回挂载在template的上的`ctx = [obj, setName]`

### mount挂载函数

1. `init`函数某个时机，会执行`create_fragment`中的`m`函数

   ```javascript
   m(target, anchor) {
     insert(target, h1, anchor);
     append(h1, t0);
     append(h1, t1);
     append(h1, t2);
   
     if (!mounted) {
       dispose = listen(h1, "click", /*setName*/ ctx[1]);
       mounted = true;
     }
   },
   ```

   - `insert/append`是dom操作的抽象

2. 首次挂载，会直接在h1上绑定click函数，对应执行方式是`ctx[1]`，即`instance`返回结果数组的`setName`方法

   ```javascript
   function instance($$self, $$props, $$invalidate) {
   	let obj = { name: "world" };
   
   	function setName() {
   		$$invalidate(0, obj.name = "fesky", obj);
   	}
   
   	return [obj, setName];
   }
   ```



### 脏数据跟踪

1. Svelte 使用位掩码（bitMask）的技术来跟踪哪些数据是脏的
2. 举个例子，假设有 `A`、`B`、`C`、`D` 四个值，那么二进制 `0000 0001` 表示第一个值 `A` 发生了改变，`0000 0010` 表示第二个值 `B` 发生了改变，以此类推。这种表示方法可以最大程度利用空间，比如十进制数字 `3` （转变为二进制 `0000 0011`）就可以表示 `A`、`B` 两个数据是脏数据，其余数据都是干净的
3. `JavaScript` 中的二进制有 `31` 位限制（`32`位，减去 `1` 位用来存放正负符号），如果采用二进制位存储的方法，那么一个 `Svelte` 组件中最多只能存放 `31` 个数据。所以，`Svelte` 采用数组（在 `Svelte` 中这个数组被叫作 `component.?.dirty`）来存放，因此，dirty数组，每一项可以表示31个数据是否为脏，超出的部分放到数组中的下一项



#### $$invalidate

1. 因此，根据上述介绍，在点击事件触发时，只需要标记`obj`为脏，然后更新组件时，去执行相应的`update`方法

2. 根据`instance`函数的`$$.ctx`定义，`$$invalidate`函数为

   ```javascript
   const $$: T$$ = component.$$ = {};
   $$.ctx = instance
     ? instance(component, options.props || {}, $$invalidate)
   : [];
   // 实际的$$invalidate
   // setName的调用为：$$invalidate(0, obj.name = "fesky", obj);
   $$invalidate =  (i, ret, ...rest) => {
     const value = rest.length ? rest[0] : ret;
     if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
       if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
       if (ready) make_dirty(component, i);
     }
     return ret;
   }
   ```

3. `make_dirty`

   ```javascript
   function make_dirty(component, i) {
     if (component.$$.dirty[0] === -1) {
       dirty_components.push(component);
       // 在 microTask 中触发更新，遍历所有 dirty_component， 更新 DOM 节点
       schedule_update();
       component.$$.dirty.fill(0);
     }
     // 重新标记dirty
     component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
   }
   ```

   - **`(i / 31) | 0`**：数组下标 `i` 除以 31，然后向下取整
   - **`(1 << (i % 31))`**：用 `i` 对 `31` 取模，然后做左移操作
   - 用dirty数组，存储脏数据

4. 当触发更新时，会遍历所有的`dirty_component`，执行update方法，理解为，进行脏检查，检查具体是哪个值发生了变化

   ```javascript
   let t3_value = /*obj*/ ctx[0].name + "";
   p(ctx, [dirty]) {
     if (dirty & /*obj*/ 1 && t3_value !== (t3_value = /*obj*/ ctx[0].name + "")) 
       // 设置 text.data;
       set_data(t3, t3_value);
   },
   ```

   - `dirty & /*obj*/ 1`：针对脏数据obj



## 小结

1. 在模板中使用到的数据，会被`instance函数`返回为数组

   ```javascript
   function instance($$self, $$props, $$invalidate) {
   	let obj = { name: "world" };
   
   	function setName() {
   		$$invalidate(0, obj.name = "fesky", obj);
   	}
   
   	return [obj, setName];
   }
   ```

2. `component.$$.dirty`会用二进制的方式，标记哪个变量为脏数据

3. 在update时，会循环有脏数据的组件，执行`update`方法

4. 因此，实际在编译期间，会做很多工作，识别哪些数据在模板中，哪些数据是动态数据，包裹`$$invalidate`函数，进行脏值处理





# 优势

1. 非常适合用来做活动页，一个简单的活动页却要用`React`那么重的框架多少有点委屈自己。所以对于一些营销团队，想在`bundle size`上有较大的突破的话，`Svelte`是绝对可以作为你的备选方案的。

2. 社区对于`Svelte`还有一个很好的用法是使用它去做`Web Component`，好处也很明显：

   - 使用框架开发，更容易维护
   - 无框架依赖，可实现跨框架使用
   - 体积小

   ## 
