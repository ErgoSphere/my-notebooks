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
- jenkins内需要的插件：
   - `GitLab Authentication plugin`
   - `GitLab Plugin`
   - `GitLab API Plugin`
   - `Nodejs Plugin`
   - `Publish Over SSH`
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
- jenkins新建任务：
   1. 新建自由风格任务
   2. 源码管理选择git，填入Repository URL和Credentials。Credentials添加凭据时选择为全局，类型为`SSH Username with private key`, Username填入gitlab用户名，Private Key填入上面生成的私钥。可指定Branches to build
   3. Enviroment内选择`Provide Node & npm bin/ folder to PATH，指定Nodejs版本，避免build过程中出现版本太老构建失败问题
      - 指定nodejs版本：系统管理 > 全局工具配置 > Nodejs安装 > 新增安装 > install from nodejs.org
   4. 配置执行shell：推荐将项目构建和镜像构建都放在jenkins上进行，构建日志清晰，dockerfile仅做dist拷贝和容器nginx配置
      ```bash
      #!/bin/bash
      echo "清理旧容器、旧镜像和旧依赖包"
      docker stop web-container || true
      docker rm web-container || true
      docker rmi web-image || true
      rm -rf node_modules

      echo "安装依赖包"
      npm i

      echo "构建项目"
      npm run build

      echo "构建镜像"
      docker build -t web-image:v1 .

      echo "运行容器"
      docker run -d --name web-container -p [对外端口]:80 web-image:v1  # 不指定版本时解析为web-image:latest
      ```
      - 确保jenkins用户对docker有权限执行：加入docker用户组
         ```bash
         # 1. 检查docker组是否存在
         getent group docker
         # >>> docker:x:998: username1,username2
         # 2. 没有就创建
         sudo groupadd docker
         # 3. 添加jenkins
         sudo usermod -aG docker jenkins
         # 4. 重启jenkins
         sudo systemctl restart jenkins
         # 5. 验证权限是否生效
         sudo su -jenkins
         docker ps
         ```
- 项目文件根目录增加`Dockerfile`, Docker内的nginx作为静态资源服务器来提供前端打包的静态文件产物
  ```Dockerfile
  FROM nginx:alpine

  # 此处均为容器内部
  COPY ./dist /usr/share/nginx/html

  # 需要更改nginx配置的话上下文增加容器内nginx.conf，注意相对路径
  # COPY nginx.conf /etc/nginx/nginx.conf

  EXPOSE 80

  CMD["nginx", "-g", "daemon off;"]
  ```
- 服务器`nginx.conf`配置转发请求
   ```bash
   server {
      listen [外部访问端口号] defalut_server;
      listen [::]:[外部访问端口号] defalut_server;
      server_name _;

      location / {
          proxy_pass http://127.0.0.1:1689;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
   }
   ```
   配置完成后重启nginx
   ```bash
   sudo nginx -s reload
   ```
- 其他问题整理
  - 
