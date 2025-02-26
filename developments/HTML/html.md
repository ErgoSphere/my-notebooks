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
    - CSP开启白名单：设置HTTP Header的``Content-Security-Policy``
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
### html渲染和canvas渲染性能
- DOM渲染更易于构建复杂场景，但需要性能成本，需要经过层层规则计算（保留模式）
- Canvas不储存额外的渲染信息，允许直接发送绘图命令到GPU，直接由显卡渲染（直接模式）

---
### CDN使用时无跨域限制的原因
- 通过HTML标签加载：``<script>``、``<link>``、``<img>``等标签直接引入静态资源（``Javascript``、``CSS``、图片）。浏览器允许跨域加载嵌入类资源，但限制通过脚本（``XMLHttpRequest``/``fetch``）主动发起跨域请求
- CDN配置了``CORS``响应头
- 特殊情况：
  - 字体文件（``@font-face``）请求的资源会触发跨域检查
  - 通过``<canvas>``操作跨域图片时，会触发``画布污染``: [具体](#canvas画布污染)
    

---
### ``canvas``画布污染
- 从跨域资源加载图像并绘制到``<canvas>``上时，如果跨域资源没正确设置``CORS``时，浏览器会认为该图像不可信，从而污染画布
- 无法调用``getImageData``、``toBlob``、``toDataURL``等方法来读取画布上的内容或导出数据（抛出``SecurityError``）
- 解决：
  - 正确配置``CORS``
    ```
    Access-Control-Allow-Origin: *
    // or 指定特定源
    Access-Control-Allow-Origin: https://one-domain.com
    ```
  - 使用JS加载图像时设置``Image``对象的``crossOrigin``属性
    - ``crossOrigin``的值:
      - ``anonymous``: 不发送身份验证信息
      - ``use-credentials``: 发送凭据
      - 指定域名
    ```js
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = 'https://some.com/a.jpeg'
    ```

---
### cookie可以实现不同域共享吗
- 默认情况下，cookie无法跨域共享
- 特殊实现：
  - 同一父域的不同子域：使用``document.domain``来修改当前域名，使共在相同父域下共享
    ```js
    // 两个子域 sub1.example.com 和 sub2.example.com
    // 在sub1和sub2上都设置
    document.domain = 'example.com'
    ```
  - 设置``Access-Control-Allow-Credentials``和``withCredentials``实现跨域cookie传递：
    1. 服务器配置``CORS``头：服务器必须在响应中设置``Access-Control-Allow-Origin``为允许的源，并且设置``Access-Control-Allow-Credentials``为``true``，以允许携带凭证
       ```
       // domain2的服务器设置
       Access-Control-Allow-Origin: https://domain1.com
       Access-Control-Allow-Credentials
       ```
       ``Access-Control-Allow-Origin``不能设置为通配符``*``，必须指定具体源
    2. 客户端设置``withCredentials``为``true``，告诉浏览器发送凭证
       ```js
       // fetch
       fetch('https://domain2.com/api', {
         method: 'GET',
         credentials: 'include'
       })
       // XMLHttpRequest
       let xhr = new XMLHttpRequest()
       xhr.open('GET', 'https://domain2.com/api')
       xhr.withCredentials = true
       xhr.send()
       ```
  - 通过第三方共享：``OAuth``、``OpenID Connect``或者类似机制，使用授权服务器作为中介，通过令牌共享用户身份，而不直接依赖cookie
  - 通过URL参数传递cookie（不推荐）

---
### DOM ``attribute`` vs DOM ``property``
- ``attribute``是dom元素在文档中作为html标签拥有的属性
- ``property``是dom元素在js中的对象属性
