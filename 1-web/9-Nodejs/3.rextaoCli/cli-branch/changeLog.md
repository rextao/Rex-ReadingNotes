# changeLog
## 20201109
1. 更好changelog顺序，最早的在最后
2. masterBranch，用于配置主分支非develop与master的

## 20200721
1. 默认删除fix分支

## 20200708
1. 更新下逻辑，删除 本地删除和远程删除的confirm

## 2020113
1. 新增branchCache.localMerged 与branchCache.res
1. 将判断远程分支且在本地分支的逻辑提到getMergedAndLocal，数据保存在上面两个变量中

## 20191126
1. 增加判断当前要删除的分支是否在本文件夹存在，否则不删除，避免远程删除后，本地无分支删除出错

## 20191017
1. 修改删除逻辑，测试删除无问题

## 20191008
1. 增加错误提示
1. 使用process.cwd()，获取命令执行目录




