# 概述

1. 使用lerna优雅地管理多个package
2. 主要问题，如module-1是依赖module-2的。如果module-2有修改，需要发布。那么你的工作有这些。
   - 修改module-2版本号，发布。
   - 修改module-1的依赖关系，修改module-1的版本号，发布。
   - 如果有很多package，工作量将相当大
3. 