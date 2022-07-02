## MacOS管理升级node

---
- 升级
  1. 安装```node```管理模块```n```
     ```
     sudo npm install -g n
     ```
  2. 安装想要升级的版本
     ```
     sudo n 18.4.0
     sudo n latest
     ```
- 查询版本列表
  ```
  $ n
  ```
- 查询版本路径
  ```
  n which 18.4.0
  /usr/local/n/versions/node/18.4.0/bin/node
  ```
- 移除某版本
  ```
  sudo n rm 18.4.0
  ```
- 指定以某版本执行文件
  ```
  n use 
  ```
- 以某个版本运行文件
  ```
  n run 18.4.0 --debug some.js
  ```
  
#### refs: https://github.com/tj/n
