### 确定当前工作区域
```bash
git status 
```
### 工作区转入暂存区
```bash
git add [file-name]
```
### 暂存区转入git
```cmd
git commit -m '[commit-message1]' -m '[commit-message2]'
git commit -am '[multiple-commit-message]'
# 仅提交修改或删除的文件，不提交新增文件
git commit -amend -m '[commit-message]'
```
### 删除工作区文件
```cmd
git rm -f [file-name]
```
### 初始化新的git仓库
```
git init
```
### 将远程仓库同步到本地
```
git clone <remote-address>
```
### 当前项目添加远程仓库
```
git remote add <shortname> <remote-url>
```
### 创建新分支
```
git branch <branch-name>
# 以当前分支为模板创建新分支
git checkout -b <new-branch-name>
```
### 本地仓库同步到远程仓库
```
git push 
git push -u <shortname> <branch-name>
```
### 切换分支
```
git checkout <branch-name>
```
### 分支a的所有提交应用到分支b
```
git checkout b
git merge a
// or
git merge a b
```
### 其他分支合并到当前分支
```
git merge -squash
```
### 某提交应用到当前分支
```
# 应用顺序: 1覆盖当前文件，2覆盖已应用了1的文件，依次类推 
git cherry-pick [commit-hash1] [commit-hash2] [...]
```
### 本地仓库删除commit
```
# 回滚到commid-id
git reset --hard [commit-id] 
```
### 拉取远程新增分支
```
git fetch <shortname> <branch-name>
```
### 拉取分支最新代码
```
# 会跳过merge
git pull <shortname> <branch-name>
```
### 配置用户名和邮箱
```
git config user.name xxx
git config user.email xxx@xxx.com
```
### 保存当前修改或删除的工作进度。当需要把分支代码发布到线上，但此分支里加入了其它未提交代码，这个时候就可以把这些未提交代码存到栈里
```
# 推入暂存区
git stash -u
# 从栈中检出
git stash pop
# 从当前栈中检出最近一次记录并创建新分支
git stash branch <new-branch-name>
```
### ``merge``和``rebase``（变基）的区别
```
# 把feature-branch的提交合并到main，保留分支的历史记录，可看到合并轨迹
git checkout main
git merge feature-branch
# 把feature-branch的提交重新应用到main的最新提交上，不会创建合并提交，像是所有提交都基于main开发一样
git checkout feature-branch
git rebase main
```
- rebase适用于个人开发分支想要同步主分支最新代码的状况
- 多人协作时开发分支如已推送到远程，rebase会改变提交哈希，可能导致代码冲突
### 回滚至上个提交/指定commit
```
# 回滚提交
git reset --hard HEAD~1 # 回退上一个提交
git reset --hard [commit-hash]
  
# 强制推送至远程覆盖提交
git push <shortname> <branch-name> --force
```
### 本地分支落后于远程分支，git不允许直接push的解决
- 方法一：先合并远程分支再push(推荐，更安全)
  ```
  git pull <shortname> <branch-name> --rebase #先把远程提交拉下来变基到本地提交前，--rebase比pull更合适，避免合并提交污染历史
  git push <shortname> <branch-name>
  ```
- 方法二：强制推送（只适合单人开发）
### 开发中，别人更新了[branch-name1]，而自己在[branch-name2]中开发，希望保持线性历史：
```
git checkout <branch-name2>
git fetch <shortname>
git rebase <shortname>/<branch-name1> #等于把<branch-name2>上的提交搬到最新的<branch-name1>之后
 ```
### 合并多个commit为一个
 ```
 git rebase -i HEAD~3 # 合并最近3个提交
 ```
进入交互后看到类似
```
pick  abc123  commit message 1
pick  def456  commit message 2
pick  ghi789  commit message 3
```
把后面的改成 `squash` 或 `s`，只保留第一个是 `pick`
```
pick   abc123  commit message 1
squash def456  commit message 2
squash ghi789  commit message 3
```
然后保存退出（通常是 Vim：按 `Esc`，输入 `:wq` 回车）
### 合并远程a分支到本地b分支
```
git fetch origin
git checkout b
git merge origin/a
```
### 修改当前分支名称
```
git branch -m <new-branch-name>
```
### 删除分支
```
git push <shortname> --delete <branch-name> # 远程
git branch -d <branch-name> # 本地
```
### `fetch`和`pull`的区别
- 多人协作开发时，`fetch + merge`更安全
- 个人项目中可以用`pull`快速同步，如果想让历史记录整洁，可以用`git pull --rebase`
### 仅推送a到远程未存在的b
```
git push origin a:b
# 本地不切换分支
git push origin a:refs/heads/b
```
### 修改远程仓库地址
```
git remote set-url origin <new-remote-address>
```
### 删除远程仓库关联
```
git remote remove <shortname>
```
### 将B分支开发的内容合并到A分支上，并将B分支上的commits合并，只在A分支上显示一条记录(不追踪历史记录)，最后将B分支状态与A分支状态同步
```
git checkout A
git merge --squash B
git commit "squash merge B"

git checkout B
git reset --hard A
```
