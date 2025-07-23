### 本地docker部署项目时能正常访问，但部署至服务器二级域名之后`Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.`
- 服务器在启用二级路径如https://xxx.xxx.xxx/yyy/index时，会导致资源访问路径错误
- 解决，在`vite.config.js`中指定资源引用前缀`base`
  ```js
  {
    base: '/yyy/',
    plugins: [...]
  }
  ```
