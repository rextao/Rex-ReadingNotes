# npx

## 简化模块调用

1. 如在项目安装一个模块，如想在命令行使用需要`node-modules/.bin/mocha --version`

2. npx想要解决的就是这个问题，利用npx可以

   `npx mocha --version`

## 避免全局安装模块

1. `npx create-react-app my-react-app`运行create-react-app但不安装
2. 会下载使用后删除create-react-app，之后再次执行上述命令，会再次下载
3. `--no-install`参数会强制使用本地模块，如本地没有，会报错`npx --no-install http-server`
4. `--ignore-existing`参数强制使用远程模块

# npm、yarn、pnpm区别

### NPM

1. npm 是 Node.js 能够如此成功的主要原因之一。npm 团队做了很多的工作，以确保 npm 保持向后兼容，并在不同的环境中保持一致。

2. npm 是围绕着[语义版本控制（semver）](http://semver.org/)的思想而设计的

3. 语义版本控制：给定一个版本号：主版本号. 次版本号. 补丁版本号

   - 主版本号： 当 API 发生改变，并与之前的版本不兼容的时候
   - 次版本号： 当增加了功能，但是向后兼容的时候
   - 补丁版本号： 当做了向后兼容的缺陷修复的时候

4. npm的问题

   - 大多数 npm 库都严重依赖于其他 npm 库，这会导致嵌套依赖关系，并增加无法匹配相应版本的几率。
   - 为了解决这个问题，npm 提供了 [`shrinkwrap`](https://docs.npmjs.com/cli/shrinkwrap)命令。

5. `npm 2`会安装每一个包所依赖的所有依赖项。如果我们有这么一个项目，它依赖项目 A，项目 A 依赖项目 B，项目 B 依赖项目 C，那么依赖树将如下所示：

   ```
   node_modules
   - package-A
   -- node_modules
   --- package-B
   ----- node_modules
   ------ package-C
   -------- some-really-really-really-long-file-name-in-package-c.js
   ```

   - 很多程序无法处理超过 260 个字符的文件路径名。

6. `npm 3`采用了扁平依赖关系树来解决这个问题：

   ```
   node_modules
   - package-A
   - package-B
   - package-C
   -- some-file-name-in-package-c.js
   ```

   - 主要缺点：npm 必须首先遍历所有的项目依赖关系，然后再决定如何生成扁平的`node_modules`目录结构。
   - npm 必须为所有使用到的模块构建一个完整的依赖关系树，这是一个耗时的操作

### Yarn(33.3k)

1. Yarn 一开始的主要目标是解决由于语义版本控制而导致的 npm 安装的不确定性问题。
   - 每个 yarn 安装都会生成一个类似于`npm-shrinkwrap.json`的`yarn.lock`文件，而且它是默认创建的。
   - 除了常规信息之外，`yarn.lock`文件还包含要安装的内容的校验和，以确保使用的库的版本相同。
2. yarn 无需互联网连接就能安装本地缓存的依赖项，它提供了离线模式，npm不可以
3. yarn 还提供了一些其他改进，例如，它允许合并项目中使用到的所有的包的许可证。

### pnpm(5k)

1. pnpm 运行起来非常的快，甚至超过了 npm 和 yarn
2. 它采用了一种巧妙的方法，利用硬链接和符号链接来避免复制所有本地缓存源文件，这是 yarn 的最大的性能弱点之一。
3. 使用链接并不容易，会带来一堆问题需要考虑。

