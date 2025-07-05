### 本地安装jenkins并挂载到指定文件夹
```bash
docker run -d --name jenkins -p 9090:8080 -p 50000:50000 -v "D:/jenkins:/var/jenkins_home" --restart=on-failure jenkins/jenkins:lts-jdk21
```

### 推送代码到远程仓库 → 本地 Jenkins 自动检测到变更 → 自动触发流水线 → 构建并部署到本地 Docker 容器 <前端示例>
1. Jenkins安装插件：
   - `NodeJS`
   - `Pipeline`
   - `Git`
2. 本地运行nginx窗口，挂载前端部署目录，如
   ```bash
   docker run -d --name frontend-nginx -p 8081:80 -v D:/docker-nginx/html:/usr/share/nginx/html nginx
   ```
3. 配置凭据（SSH-KEY方式）
  - 私有仓库添加SSH-KEY
  - Jenkins: Security → Credentials → Add Credentials → Domains Globale → SSH username with private key
  - 测试连接：

4. Jenkins新建流水线任务：Pipeline script from SCM
5. 添加触发器：仓库设置Webhook 
