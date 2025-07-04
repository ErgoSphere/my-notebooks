### git commands
- 确定当前工作区域
  ```cmd
  git status 
  ```
- 工作区转入暂存区
  ```cmd
  git add [file-name]
  ```
- 暂存区转入git
  ```cmd
  git commit -m '[commit-message1]' -m '[commit-message2]'
  git commit -am '[multiple-commit-message]'
  // 仅提交修改或删除的文件，不提交新增文件
  git commit -amend -m '[commit-message]'
  ```
- 删除工作区文件
  ```cmd
  git rm -f [file-name]
   ```
- 初始化新的git仓库
  ```
  git init
  ```
- 将远程仓库同步到本地
  ```
  git clone [remote-address]
  ```
- 当前项目添加远程仓库
  ```
  git remote add [remote-name] [remote-url]
  ```
- 创建新分支
  ```
  git branch [branch-name]
  ```
- 本地仓库同步到远程仓库
  ```
  git push 
  git push -u [remote-name] [branch-name]
  // 同时设置默认remote-name为main的远程仓库
  git push -u main branch_a
  ```
- 切换分支
  ```
  git checkout [branch-name]
  // 创建新分支并切换到这个分支
  git checkout -b [new-branch-name]
  ```
- 分支a的所有提交应用到分支b
  ```
  git checkout b
  git merge a
  // or
  git merge a b
  ```
- 其他分支合并到当前分支
  ```
  git merge -squash
  ```
- 待合并分支上的多个commit合成新的commit放入当前分支（消减多个分支提交记录）
  ```
  git merge --no-ff
  ```
- 某提交应用到当前分支
  ``` 
  git cherry-pick [commit-hash1] [commit-hash2] [...]
  ```
  `cherry-pick`的应用顺序: 1覆盖当前文件，2覆盖已应用了1的文件，依次类推 
- 本地仓库删除commit
  ```
   git reset --hard [commit-id] //回滚到commid-id
  ```
- 拉取远程新增分支
  ```
  git fetch [shortname] [branch-name]
  ```
- 拉取分支最新代码
  ```
  git pull [shortname] [branch-name]
  ```
- 配置用户名和邮箱
  ```
  git config user.name xxx
  git config user.email xxx@xxx.com
  ```
- 保存当前修改或删除的工作进度。当需要把分支代码发布到线上，但此分支里加入了其它未提交代码，这个时候就可以把这些未提交代码存到栈里
  ```
  git stash
  // 从当前栈中检出最近一次记录并创建新分支
  git stash branch [new-branch-name]
  ```
- ``merge``和``rebase``（变基）的区别
  ```
  // 把feature-branch的提交合并到main，保留分支的历史记录，可看到合并轨迹
  git checkout main
  git merge feature-branch
  // 把feature-branch的提交重新应用到main的最新提交上，不会创建合并提交，像是所有提交都基于main开发一样
  git checkout feature-branch
  git rebase main
  ```
  - rebase适用于个人开发分支想要同步主分支最新代码的状况
  - 多人协作时开发分支如已推送到远程，rebase会改变提交哈希，可能导致代码冲突
