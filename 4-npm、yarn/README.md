# node安装后常用配置

1. 配置淘宝镜像：`npm config set registry https://registry.npm.taobao.org`
2. 检测镜像是否配置成功：`npm congfig get registry`
3. 更改npm全局模块安装位置与cache默认安装位置
   - `npm config set prefix "XXX\nodejs\node_global"`
   - `npm config set cache "XXX\nodejs\node_cache"`
4. 设置环境变量
   - NODE_PATH = XXX\Node\nodejs
   - PATH = %NODE_PATH%\node_global;
5. 测试安装是否成功：`npm install -g express-generator`
6. 安装好后，在cmd中输入
   - express --help



7、查询.npmrc文件所在位置

cmd中输入，npm config list可以查看npmrc文件位置



# npm 命令

1. `npm config list`：查询.npmrc文件所在位置



## yarn相关

1. 查看yarn包安装位置：yarn global bin

