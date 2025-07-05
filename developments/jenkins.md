### 本地安装jenkins并挂载到指定文件夹
```bash
docker run -d --name jenkins -p 9090:8080 -p 50000:50000 -v "D:/jenkins:/var/jenkins_home" --restart=on-failure jenkins/jenkins:lts-jdk21
```
