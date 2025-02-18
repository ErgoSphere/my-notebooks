### 浏览器渲染页面的两种模式
可由``document.compatMode``获取
- ``CSS1Compat``: 标准模型
- ``BackCompat``: 怪异模型

---
### ``<script>``中的``async``及``defer``属性
``async``及``defer``异步加载，不阻塞页面解析
- ``<script>``为默认方式，当js脚本下载和执行时会使浏览器停止对HTML页面的处理，直到下载和执行完成后才继续渲染页面
- 多个文件异步加载时， ``async``无序加载， ``defer``按顺序加载
- ``aynsc``文件与js脚本的``加载``和``执行``为同时并行进行的异步执行;``defer``与js脚本的``加载``并行执行，而``执行``在文档所有元素解析完之后，``DOMContentLoaded``之前
- 当``<script>``标签未设置``src``属性时，``async``和``defer``无效
- 设置了``async``或``defer``的``<script>``引入的脚本内含``document.write()``时，会无视并抛出``A call to document.write() from an asynchronously-loaded external script was ignored``

| 功能    | script | script async | script defer |
|-------|--------|-------------|--------------|
| 处理方式  | 停止页面处理 | 并行页面处理 | 并行页面处理 |
| 执行顺序  | 按引入顺序  | 无序   | 按引入顺序 |
| DOM依赖 | 否      | 否   | 等待DOM解析完毕    |

---
###  内容安全策略CSP
- 本质为建立白名单，只需配置规则，拦截则由浏览器自身实现，可以通过这种方式减少xss攻击
- 开启：
   - 设置http request header的``Content-Security-Policy``
    ```
    //只许加载本站资源
    Content-Security-Policy:default-src 'self'
    //只许加载HTTPS协议的图片
    Content-Security-Policy:img-src https://*
    //允许任何来源
    Content-Security-Policy:child-src 'none'
    //禁止内部包含的脚本代码使用eval()，但如果脚本代码创建了worker，这个worker上下文中执行的代码是可以使用eval()的
    Content-Security-Policy:script-src 'self'
    ```
    - 使用``meta``标签
    ```html
    <meta http-equiv="Content-Security-Policy" />
    ```

---
###  安全防范 [Ref](https://juejin.cn/post/6844904020562165773)
1. XSS注入
    - CSP开启白名单：设置HTTP Header 的 Content-Security-Policy
    - 使用转义字符
2. CSRF
    - Get请求不对数据修改
    - 不让第三方访问到用户cookie或者使用``SameSite cookies``
      ```
      // Strict: 仅允许第一方发送cookie
      // Lax：cookie仅在url定向时携带（如点击一个link），在通常的跨域请求中不发送（如加载图片）
      // None：cookie在任何情况下都会被发送
      Set-Cookie: sessionId=abc234; SameSite=Strict
      ```
    - 阻止第三方请求接口
    - 请求时附带证信息，如验证码或者 csrf token
    - 指定允许跨域的资源
      ```
      Access-Control-Allow-Origin: https://trustedwebsite.com
      ```
3. 点击劫持

---
###  html渲染和canvas渲染性能
- DOM渲染更易于构建复杂场景，但需要性能成本，需要经过层层规则计算（保留模式）
- Canvas不储存额外的渲染信息，允许直接发送绘图命令到GPU，直接由显卡渲染（直接模式）

---