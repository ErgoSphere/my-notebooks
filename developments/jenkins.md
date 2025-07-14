### 本地安装jenkins并挂载到指定文件夹
```bash
docker run -d --name jenkins -p 9090:8080 -p 50000:50000 -v "D:/jenkins:/var/jenkins_home" --restart=on-failure jenkins/jenkins:lts-jdk21
```

---
### 推送代码到远程仓库 → 本地 Jenkins 自动检测到变更 → 自动触发流水线 → 构建并部署到本地 Docker 容器 <前端示例, gitlab>
1. Jenkins安装插件：
   - `NodeJS`
   - `Pipeline`
   - `Git`
2. Jenkins 的构建节点（或容器）内，执行
   ```bash
   ssh -T git@gitlab.com
   ```
   预期输出应该是：Welcome to Gitlab, xxx
3. 本地运行nginx窗口，挂载前端部署目录，如
   ```bash
   docker run -d --name jenkins -p 9090:8080 -p 50000:50000 -v "D:/jenkins:/var/jenkins_home" -v "D:/jenkins/.ssh/known_hosts" --restart=on-failure jenkins/jenkins:lts-jdk21
   ```
4. 配置凭据（SSH-KEY方式）
  - 私有仓库添加SSH-KEY
  - Jenkins: Security → Credentials → Add Credentials → Domains Globale → SSH username with private key
  - 测试连接：

5. Jenkins新建流水线任务：Pipeline script from SCM
6. 添加触发器：仓库设置Webhook 

---
### 服务器部署jenkins，连接gitlab，自动部署到服务器
- ssh-key配置：生成服务器上jenkins用的户的ssh-key（不等同于服务器ssh-key）, 公钥填至gitlab用户上，私钥在jenkins内配置
   - 生成服务器jenkins用户ssh-key并复制
     ```bash
     sudo su - jenkins
     ssh-keygen -t rsa -b 4096 -C "jenkins@server.ip"
     # 生成过程略...
     cat ~/.ssh/id_rsa.pub # 公钥
     cat ~/.ssh/id_rsa.pub # 私钥
     ```
      - `stderr: No ED25519 host key is known for gitlab.com and you have requested strict checking`: gitlab的公钥未被jenkins所信任，需要将gitlab公钥添加到jenkins的`known_host`里
         ```bash
         sudo su - jenkins
         ssh-keyscan gitlab.com >> ~/.ssh/known_hosts
         ```
      - 进行上述步骤后扔提示未被信任，说明jenkins可能未在预期环境中运行git命令，或者使用了自己的ssh环境变量/路径，未加载`known_host`：将在jenkins用户下的gitlab主机密钥添加到系统全局`known_host`
         ```bash
         ### 必须在root权限下执行
         ssh-keyscan -t ed25519 gitlab.com | sudo tee -a /etc/ssh/ssh_known_hosts
         ```
