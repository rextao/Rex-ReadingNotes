

# 使用解答

## 	删除远程仓库分支

1. git branch -r -d origin/branch-name
2. git push origin :branch-name
3. 注意第二条，origin与branch有空格

## 获取远程分支

1. git checkout -b wt-comment-operation origin/wt-comment-operation



## 多个git账户访问不同仓库

1. 在 ~/.ssh 目录下新建config文件：`touch config`

2. ssh-keygen -t rsa -C "[youname@xxxxxxx.com](mailto:youname@xxxxxx.com)",注意命名rsa文件

3. pbcopy < ~/.ssh/id_rsa.pub  #复制ssh-key

4. 在config文件中添加编辑配置:`sudo vim config`,举例

   ```
   Host gitlab
     HostName gitlab.com
     User *****@**.com
     IdentityFile ~/.ssh/gitlab/id_rsa
   Host github
     HostName github.com
     User *****@**.com
     IdentityFile ~/.ssh/github/id_rsa
   ```

   - Host是自己的辨认标识，可以随便写
   - HostName是仓库的host地址
   - User是仓库账户邮箱
   -  IdentityFile 是对应的密钥存储的路径

## 撤销操作

### 注意：操作不可逆

### git commit --amend

1. 作用1：重新编辑上次提交说明，要求暂存区无新内容

2. 作用2：补提漏提文件

   ```
   $ git commit -m 'initial commit'
   $ git add test.js
   $ git commit --amend
   ```

   - 补提test.js文件
   - 上面的三条命令最终只是产生一个提交

### 取消已暂存文件或取消文件修改

1. 在输入命令后，命令行会有提示

### 撤销pull内容

1. 运行`git reflog`命令查看你的历史变更记录
2. 运行 `git reset --hard 40a9a83`，回到某个位置
3. 注意：本地内容要commit后，pull出现问题，可以回退，如果没有commit则不行

### 撤销上次commit

1. git reset的作用是修改HEAD的位置，即将HEAD指向的位置改变为之前存在的某个版本

2. `git reset --soft HEAD~1`

   - --mixed  会保留源码,只是将git commit和index 信息（代码需要重新git add才能commit）回退到了某个版本.

   - --soft   保留源码,只回退到commit信息到某个版本.不涉及index的回退,如果还需要提交,直接commit即可.

   - --hard    源码也会回退到某个版本,commit和index 都会回退到某个版本.(注意,这种方式是改变本地代码仓库源码)

     



## 如何整理远程分支的commit

###问题描述 

1. 可能有过多的commit，push时候会显得比较乱

### 处理方式

1. `git rebase -i HEAD~4     `

   - 4  表示要合并的条数，根据自行需要输入
   - 如自己只提交2条，输入HEAD~4，会带上别人的提交记录
   - 如带上别人的提交记录，在push时会一同push上去

2. 一命令行会显示4条最近提交的信息，如：

   ```
   pick f7f3f6d changed my name a bit
   pick 310154e updated README formatting and added blame
   pick a5f4a0d added cat-file
   pick a1f4a0d sssss cat-file
   ```

   - 这命令下会有命令注释信息，如更改pick为s或d等，会有对应的操作

### 压制(Squashing)提交

1.  可以将上述的pick更改为s

2. 注意：不能更改首条为s，如果首条为s，则会rebase会有提示信息，让continue或abort

3. 当你保存之后，你就拥有了一个包含前三次提交的全部变更的单一提交

   ```
   pick 310154e updated README formatting and added blame
   s a5f4a0d added cat-file
   s a1f4a0d sssss cat-file
   ```

4. 当你保存之后，你就拥有了一个包含前三次提交的全部变更的单一提交

### 重排提交

1. 如commit记录有别人的提交记录，并且在自己的前面，不想要，可以重排

   ```
   pick a1f4a0d sssss cat-file
   pick 310154e updated README formatting and added blame
   pick a5f4a0d added cat-file
   ```

2. 然后再利用d，s等命令，对commit进行处理

### 最后

1. 最后执行git push -f`
2. 覆盖远程的提交记录

## 如何fork项目并pull request

1. 主要是针对github项目，公司项目相当都在一个库，使用不同分支进行操作
2. 先fork一个项目
3. 然后git clone到本地，最好是在分支进行更改代码
4. 然后再master上，运行git merge dev合并分支
5. git push 'fork的地址'，这样可以将代码提交到自己github上
6. 然后利用pull request，将更改提交

## 强制拉取代码

1. git fetch --all
2. git reset --hard origin/master
3. git pull



## 修改 COMMIT 的用户名与邮箱

1. 解决公司与个人github两个用户，commit错了情况

2. 项目内设置user与email

   ```bash
   git config user.name "Author Name"
   git config user.email email@address.com
   ```

3. 修改远端commit错误的用户名

   ```bash
   git rebase -i HEAD~15
   git commit --amend --reset-author --no-edit
   git rebase --continue
   ```

   

## 获取某个分支某个目录

`git checkout [commitId ] [path]`



# 命令介绍

## clone

1. clone 最新一次提交，减少克隆时间

   - ```
     git clone --depth=1 https://github.com/user/repo.git
     ```

## commit

1. 修改提交用户
   - `git commit --amend --author="abc <abc@xxxxxxxx.com>" --no-edit`

## merge

1. 假如新建分支mywork，origin同时有一些提交

   ![img](GIt使用问题.assets/rebase1.png)

2. 使用merge得到的结果

   ![img](GIt使用问题.assets/rebase2.png)

   - 实际是当前分支mywork会进行合并提交，即git创建一个新提交c7，来包含两者的区别

## rebase

### 概述

1. rebase处理是将mywork的提交都先撤销，暂时存在一个地方，然后合并origin的全部提交，最后将撤销的提交恢复回来

   ![img](GIt使用问题.assets/rebase4.png)

2. 如出现冲突，也会停下来，让解决冲突，然后运行`git rebase --continue`继续rebase

### 缺陷

1. c5和c5' 内容是完全一样的，但两者的hash ID是不一致的，即是不同的提交，因为之前的C5的源是C2，而C5’的源是C4
2. 不要rebase线上的，因为，如果有人是从C5切出来的分支，进行rebase，可能c5就不存在了

## stash

1. 主要是新功能做到一半不想提交，需要做另一件事时候

### git stash

1. 保存工作进度，执行后，获得一个干净的工作区
2. 使用`git stash save 'message...'`可以添加一些注释
3. 可以执行多次

### git stash list

1. 显示保存进度的列表

### git stash pop [--index] [stash_id]

1. 获取保存的工作进度，恢复后悔删除当前进度

### git stash apply [–index] [stash_id]

1. 获取保存的工作进度，但不会删除

### git stash drop [stash_id]

1. 删除一个存储进度，如不指定id则删除最新的

### git stash clear

1. 删除所有存储的进度

## log

### git log filename

1. 可以看到fileName相关的commit记录

### git log --oneline

1. 一行显示log

## config

### 查看config信息

1. `git config --global --list`

### 别名（简写）

```console
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```



## fetch

1. 从远程获取最新到本地，不会自动merge
2. git pull ：拉取后会自动合并



## Tag

1. 行为类似于分支（例如，您可以检出它们），但是一旦使用完毕，我们将不会删除它们。它们通常用于标记特定的版本
   - 用某种方式记录某个重要提交，记录hash是可以的。。但听起来很可怕
2. 添加： `git tag -a v1 -m 'xxxxxxxx'`
   - 创建带注释tag，但这只是在本地
3. push到远端： `git push origin v1` 或`git push  origin --tags`（会push全部标签）
4. 检出： `git checkout v1`
5. 删除： `git tag -d v1`
6. 查看： `git tag` 或`git tag -l *-test`



## cherry-pick

### 概述

1. 获取某一个分支的单笔提交，并作为一个新的提交引入到你当前分支上

### 语法

1. `git cherry-pick <commit-id>`

   - 到master上，可以pick任意commit，到master上

2. `git cherry-pick -x <commit_id>`

   - -x 参数，表示保留原提交的作者信息进行提交。

3. 范围获取

   ```
   git cherry-pick 371c2…971209 // (2,5]
   git cherry-pick 371c2^…971209 // [2,5]
   ```

### 使用场景

1. 但并不总是最佳实践，可能导致重复提交，而传统的合并则是首选。
2. 团队协作
   - 两个部门之间可能存在一些共享代码。
   - 后端创建了一个前端也需要利用的数据结构。
   - 前端可以使用git cherry-pick来选择快速使用这个数据结构
3. bug修复
   - 如发现问题，可以在当前分支进行快速修复
   - 然后去主干上挑选此commit，达到修复bug的目的
   - 但通常使用新建fix分支来解决，避免多提交无用文件
4. 

### 注意

1. 应该是主要针对本地分支的，如果pull下来的commit id，直接使用此命令，会提示`The previous cherry-pick is now empty, possibly due to conflict resolution`

## blame

1. `git blame <file-name>`
   - 查看某段代码是谁写的

## ci

1. 帮助捕获由大多数 npm 用户的增量安装的本地环境引起的错误或不一致
2. 必须有package-lock.json， 且package.json与lock要保持一致，否则会显示错误退出
3. 如果a `node_modules`已经存在，它将在`npm ci`开始安装之前自动删除。



branch

1. branch显示时间

```
git branch --sort=committerdate --format='%(refname:lstrip=2)    %(committerdate:format:%Y-%m-%d %H:%M)'
```

