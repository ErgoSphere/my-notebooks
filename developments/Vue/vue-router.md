### ``hash``模式vs``history``模式
- ``hash``模式
  - 用``#``后面的部份标记网页的不同部份或者状态。当``hash``发生改变时网页不重新加载，通过监听window的``hashchange``事件触发操作，因此可以在单页应用中切换不同的视力或者状态而不需要重载
    ```js
    location.hash = '/hashpath'
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1)
    })
    ```
  - 相对简单不需要服务器端进行特殊配置，服务器只需返回一个HTML页面，所有资源（如Javascript和CSS）通过相对路径引入页面，简化了部署和服务器配置过程
  - 兼容性广泛，几乎所有现代和老旧的浏览器都可正确处理hash部份并触发``hashchange``事件，适用于需要在老浏览器中运行或者支持旧平台的应用程序项目中
  - URL可读性差，无法直观理解页面状态，对用户复制、分享页面时的操作带来困惑
  - SEO差，无法直接索引，需要引入额外的技术和策略去处理SEO（SSR解决）
  - 不支持直接访问特定状态的页面，要访问时需要输入完整的hash部份内容
  - 缺乏后退与刷新功能
- ``history``模式
  - 使用``HTML5``的``History API``来管理URL变化(``pushState``, ``replaceState``)。通过``History API`` 动态地改变URL路径，且在浏览器历史记录中添加相应条目。当URL改变时，浏览器会向服务器发送请求或者新的页面，此时服务器也能获取到相应URL进行处理
  - 更符合传统URL形式，可读性和分享性更好
  - 对SEO更友好
  - 需要服务器端的配置来处理每个路径的请求，保证直接访问某一路径能返回正确的页面内容。在单页应用下，服务器端仅有一个``index.html``，匹配不到路径时会提示404
    - node服务器
      ```js
      const path = require('path')
      const history = require('connect-history-api-fallback')
      const express = require('express')
      const app = express()
      app.use(history()) // 注册history模式中间件
      app.use(express.static(path.join(__dirname, '../web'))) // 处理表态资源中间件，假设网站根目录../web
      app.listen(9095, () => {
        console.log('service start, port 9095')
      })
      ```
    - ``nginx``代理：修改配置文件添加history mode support
      ```text
      location / {
        root html;
        index index.html index.html
        # 尝试读取当前请求路径$uri, 如果读不到则读$uri/这个文件夹下的首页
        # 都读不到就返回根目录中的index.html
        try_files $uri $uri/ /index.html
      }
      ```
  - 支持后退与刷新（``popstate``处理）

---
### ``vue-router``实现原理
1. 通过``Vue.observable``在``router``实例上创建一个保存当前路由的监控对象``current``
2. 浏览器地址变化时，修改``current``
3. 在``router-view``组件中监听``current``变化，当变化时获取用户注册的相应``component``，并用``h()``将``component``渲染为``vnodes``，更新页面视图
```js
// 3.x
const router = new VueRouter({
  mode: 'history'
})
// 4.x
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory() || createWebHashHistory()
})
```

---
### 实现切换路由时保存草稿
- ``onBeforeRouteLeave``
- ``keep-alive``