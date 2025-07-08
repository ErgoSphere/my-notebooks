- 已有打包好的前端项目生成镜像运行
  1. 在dist文件夹同级目录下创建`Dockerfile`
  ```Dockerfile
  From nginx:alpine
  
  # 删除默认的 Nginx 配置文件(可选)
  RUN rm /etc/nginx/conf.d/default.conf

  COPY ./dist /usr/share/nginx/html

  EXPOSE 80

  CMD["nginx", "-g", "daemon off;"]
  ```
  2. 构建docker镜像
  ```bash
  docker build -t my-app .
  ```
  3. 运行docker窗口
  ```
  docker run -d -p 8080:80 my-app
  ```
