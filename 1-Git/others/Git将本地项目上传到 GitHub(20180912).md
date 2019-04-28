---
typora-copy-images-to: imgs
---

原文地址 https://segmentfault.com/a/1190000011909294

# 准备工作

## 安装 Git

![](imgs/2611022046-5a0279459e51f_articlex.png)

## 在 github 创建账号： 

1. [https://github.com/](https://github.com/)

# 步骤

## 创建本地仓库

1. ![](imgs/3102988681-5a027af599c37_articlex.png)

## 把文件夹变为git可管理的仓库

1. 打开Git Bash
2. 进入这个文件夹
3. git init

## 添加文件到缓存区

1. 将需要上传的文件复制到这个文件夹
2. git add .   
3. 将所有新复制的文件添加到缓存区

## 提交项目

1. git commit 把项目提交到仓库
2. ![](imgs/3118665773-5a02802682493_articlex.png)

## github的SSH加密

### 创建 SSH KEY

1. $ ssh-keygen -t rsa -C "youremail@example.com"
2. 然后再github添加ssh key![](imgs/3213003056-5a02811e13854_articlex.png)

## github创建仓库

1. 在 Github 上创建一个 Git 仓库![](imgs/3916709582-5a0281e1a7f10_articlex.png)

## 关联本地仓库

1. 根据创建好的 Git 仓库页面的提示，可以在本地 GitHubTest 仓库的命令行输入：例：$ git remote add origin [https://github.com/guyibang/T...](https://github.com/guyibang/TEST2.git))![](imgs/3882263931-5a0289485e756_articlex.png)![](imgs/3182561927-5a0288bfb28f4_articlex.png)

## 推送

1. $ git push -u origin master![](imgs/3507538020-5a028a82c2381_articlex.png)

