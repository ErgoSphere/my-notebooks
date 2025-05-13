### ``HTTP``/``HTTPS``([ref](https://juejin.cn/post/6844903471565504526))
- ``HTTP``：超文本转输协议，明文方式发送，无数据加密，不适合传输敏感信息。是TCP的一种
  - ``HTTP缓存``：
    - web缓存发现请求的资源被存储的时候，会拦截请求，返回该资源拷贝，而不会去源服务器重新下载
    - 种类：
      - 私有缓存（浏览器缓存）
      - 共享缓存（代理缓存）
    - 常见的HTTP缓存只能存储``GET``响应
    - 缓存控制
      - ``cache-control``: 请求头和响应头都支持
        ```
        Cache-Control: no-store //不得缓存任何请求和响应内容
        Cache-Control: no-cache //缓存但重新验证，请求会发至服务器，服务器验证所描述缓存是否过期，未过期则使用本地缓存副本
        Cache-Control: public
        Cache-Control: private // 默认
        Cache-Control: max-age=3156000 //最大缓存时间，距离请求发起的时间秒数
        Cache-Control: must-revalidate //必须验证
        ```
      - Pragma头：效果与``Cache-Control: no-cache``相同，但不能完全替代，用于兼容
      - 缓存驱逐：资源过了过期时间后，不会直接删除。当客户端发起一个请求，缓存检索到有对应的已过期副本，会先将此请求附加``If-None-Match``头，发给服务器，若服务器返回304（响应无实体信息）则表示副本是新鲜的，可以节省一些带宽，如判读已过期，则带有该资源的实体返回
      - 缓存寿命：先看``max-age``，没有则看``Expires``（比较Expires和头Date属性的值），两者都没有则看``Last-Modified``(``寿命 = (Date - Last-Modified) * 10%``)
      - 更新：``URL + 版本号/时间戳``
      - ``Vary``：``当前请求 Vary = 缓存请求头 Vary = 缓存响应头 Vary``，才使用缓存的响应。``Vary: User-Agent``可避免缓存服务器错误地把移动端内容输出到桌面端
- ``HTTPS``：安全套接字层超文本转输协议，在HTTP的基础上加入了SSL协议，SSL（security sockets layer）依靠证书难证服务器身份，为通信加密。
  - 作用：建立信息安全通道，确认网站真实性, 客户端TLS来解析证书
  - 优点：安全性，谷歌SEO针对HTTPS有排名提升
  - 缺点：会使页面加载时间延长至50%，增加10%到20%的耗电，影响缓存，增加数据开销和功耗，加密范围比较有限，SSL证书信用链体系不安全，SSL需要绑定IP但不能在同一IP上绑定多个域名
  - 加密方式：
    - 加密方式通过``SSL/TLS``协议实现，核心是结合``非对称加密``和``对称加密``的混合加密机制，并依赖``数字证数``验证身份
      - ``非对称加密``：安全性高，速度慢，交换密钥并验证服务器身份。算法如``RSA``、``ECDSA``、``DH``(密钥交换)
        1. 客户端发起请求：浏览器向服务器发送支持的``SSL/TLS``版本和加密算法列表
        2. 服务器返回证书：
           - 服务器发送数字证书，含公钥、域名、颁发机构、有效期等信息
           - 证书由CA（证书颁发机构）签发，浏览器内置信息的CA根证书
        3. 客户端验证证书：
           - 检查证书上是否过期、域名是否匹配、颁发机构是否受信任
           - 用CA的公钥验证证书的数字签名，确保证书未被篡改
      - ``对称加密``：速度快，加密大量数据，即加密实际传输的HTTP数据。算法如``AES-256``、``ChaCha20``（高效加密数据）
        1. 生成会话密钥：客户端生成一个随机数作为对称加密的会话密钥（如AES密钥）
        2. 加密会话密钥：用服务器的公钥（来自证书）加密会话密钥，发送给服务器
        3. 服务器解密密钥：服务器用私钥解密，获取会话密钥
        4. 对称加密通信：双方用会话密钥加密后续数据传输
  - 完整HTTPS握手流程
    1. 客户端发送支持的加密套件和随机数
    2. 服务器选择加密套件，发送证书和随机数
    3. 客户端验证证书，生成会话密钥，并用服务器公钥加密（非对称加密）发送
    4. 双方确认使用对称加密，完成握手
    5. 后续数据通过非对称加密传输
  - 关键安全机制
    - 证书链验证：确保服务器身份合法
    - 加密算法协商：使用双方支持的算法
    - 完整性校验：通过HMAC防止数据篡改
- HTTP和HTTPS区别：
  - HTTPS需要到ca申请证书，免费较少
  - HTTP明文转输，HTTPS加密
  - 两者使用了完全不同的连接方式，端口不一样，HTTP为80，HTTP为443
  - HTTP连接简单无状态， HTTPS更安全
- http请求头:
  - ``:method:``, ``:authority:``,``:path:``, ``:scheme:``是因为使用http2协议传输且可以压缩传输体积

---
###  TCP握手(3)/挥手(4)：
1. client发送报文1（询问）
2. server回应报文2，携带对报文1的回应以及询问client是否做好通讯准备
3. client发送报文3，回应对server报文2中的询问
> ---数据传输---
4. client发送报文4（FIN），用于关闭client到server的传送
5. server接收后发送报文5（ACK），确认报文4的操作（报文4序号加1）
6. server关闭连接，发送报文6（FIN）
7. client对报文5回应，序号加1（ACK）

---
### 服务器响应码
| 分类  | 次级                           | 含义                       | 
|-----|------------------------------|--------------------------|
| 1xx |                              | 请求已被接收，继续处理              | 
|  | 100 Continue                 | 继续，客户端可以继续请求             | 
|  | ✳️ 101 Switching Protocals   | 服务器切换协议，如Websocket       | 
|  | 102 Processing               | 服务器已接受请求，但仍在处理           | 
| 2xx |                              | 成功，请求已成功被服务器接收、理解、处理     | 
|  | ✳️ 200 Continue              | 请求成功                     | 
|  | 201 Created                  | 资源创建成功（如POST请求）          | 
|  | 202 Accepted                 | 已接受请求，但未完成处理             | 
|  | 204 No Content               | 请求成功，但无返回内容              | 
|  | ✳️ 206 Partial Content       | 服务器返回部分内容（用于断点续传）        | 
| 3xx |                              | 重定向，需要客户端执行额外操作          | 
|  | 301 Moved Permanently        | 资源永久重定向（SEO）             | 
|  | 302 Found                    | 资源临时重定向（继续访问原地址）         | 
|  | 303 See Other                | 客户端应访问其它URL              | 
|  | ✳️ 304 Not Modified          | 资源未修改（用于缓存）              | 
|  | 307 Temporary Redirect       | 临时重定向，和302类似，但不能变更请求方法   | 
|  | 308 Permanent Redirect       | 资源永久重定向，和301类似，但不能变更请求方法 | 
| 4xx |                              | 客户端错误                    | 
|     | ✳️ 400 Bad Request           | 客户端请求无盗墓笔记               |
|     | ✳️ 401 Unauthorized          | 未授权（需身份验证）               |
|     | ✳️ 403 Forbidden             | 服务器拒绝请求（权限不足）            |
|     | ✳️ 404 Not Found             | 资源未找到                    |
|     | 405 Method Not Allow         | 请求方法不允许（如``DELETE``禁用）   |
|     | ✳️ 408 Request Timeout       | 请求超时                     |
|     | 409 Conflict                 | 请求冲突（如数据版本冲突）            |
|     | 410 Gone                     | 资源已被永久删除                 |
|     | 413 Payload Too Large        | 请求体过大                    |
|     | 415 Unsupport Media Type     | 不支持的媒体类型                 |
|     | 429 Too Many Request         | 请求过多（触发限流）               |
| 5xx |                              | 服务器错误                    | 
|     | ✳️ 500 Internal Server Error | 服务器内部错误                  |
|     | 501 Not Implemented          | 服务器不支持该请求方法              |
|     | ✳️ 502 Bad Gateway           | 网关错误（如Nginx代理后端服务器宕机）    |
|     | ✳️ 503 Service Unavailable   | 服务器暂不可用（过载/维护）           |
|     | ✳️ 504 Gateway Timeout       | 网关超时                     |
|     | 505 HTTP Version Not Support | 不支持的HTTP版本               |

---
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
### 安全防范 [Ref](https://juejin.cn/post/6844904020562165773)
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

---
### 输入网址后浏览器做了什么事(浏览器渲染过程)
- **请求过程**
    1. 搜索浏览器自身DNS缓存，如有缓存直接访问已缓存的IP地址
    2. 无缓存，搜索系统自身DNS缓存，读取HOST文件，是否有DNS IP地址映射
    3. 向运营商发送DNS解析请求，获得IP地址
    4. 向IP地址所在server进行3次TCP握手建立连接
    5. 建立连接之后向server发送HTTP请求
    6. server接收请求后将处理结果发回，如HTML页面代码等
    7. client的内核和JS引擎解析和渲染页面，内含的JS，CSS，图片等资源也将通过HTTP请求进行加载
    8. client根椐拿到的资源进行页面渲染呈现给用户，如无后续操作则向服务器端发起TCP四次挥手断开
- **渲染过程**（上述7, 8时进行）
    1. 解析收到的文档，根椐文档的内容构建DOM树（DOM元素 + 属性节点）
    2. 根椐CSS生成CSSOM规则树
    3. 根椐DOM树和CSSOM规则树生成渲染树（render tree）。渲染对象为渲染树的节点，是一个含大小颜色的矩形。渲染对象与DOM对象相对应（非一对一），不可见的DOM对象不会被插入渲染树。
    4. 生成渲染树后，浏览器会根椐渲染树进行布局（回流/自动重排）
    5. 布局完成后进行绘制（对象paint）
- **浏览器渲染方式**： Flow Based Layout
- 由于浏览器使用流式布局，对Render Tree的计算通常只需要遍历一次就可以完成，但``<table>``及其内部元素除外，他们可能需要多次计算，通常要花**3**倍于同等元素的时间


---
### 浏览器缓存：
被动缓存网络资源，由浏览器自动管理（根椐``HTTP头``或者``Service Worker``策略），为短期保存，内容为非结构化资源文件（二进制、文本等）
- ``Service Worker``: 需要用https访问
- memory cache: 内存中的缓存，随着进程释放（tab关闭）而消失
- disk cache
- push cache: HTTP/2内容，仅存在于session中

---
### 浏览器存储
主动存储应用数据，由开发者显示读写，可长期保存或者会话级（``SessionStorage``）保存，内容为结构化数据（字符串，对象等）
- ``cookie``
  - 随HTTP请求自动发送到服务器，适用于存储和服务器交换的数据
  - 可以设置为持续时间或者基于session
  - 明确区分域名
  - 容量小（4KB左右）
  - 可以通过设置为``HttpOnly``来防止XSS攻击；也可通过设置``Secure``来保证仅使用HTTPS来发送cookie
  - 可用于会话管理、用户追踪
- ``Web Storage``: 更大容量
  - ``sessionStorage``：会话级存储
    - 适用于有时效性的存储
    - 当当前标签和窗口关闭时会被清理
    - 存储容量``cookie`` < ``sessionStorage`` < ``localStorage``
  - ``localStorage``
    - 适用于长期存储，浏览器关闭后仍保留
    - 和同一域名内所有窗口标签所共有
    - 三者之中拥有最大的存储容量（取决于不同浏览器）
- ``IndexedDB``
  - 异步操作（同步操作曾用于web workers，现已从规范中移除）
  - 仅以``key-value``形式存储
  - 何时触发``onupgradeneeded``
    - 首次创建数据库时
    - 升级数据库版本时
  - ``createIndex``的作用：
    - 提高查询效率
    - 支持排序过滤
    - 支持复杂查询

| 存储       | ``Cookie``                | ``sessionStorage`` | ``localStorage``   |
|----------|-----------------------|----------------|----------------|
| 初始化      | 客户端/服务器端(``set-cookie``)  | 客户端        | 客户端     |
| 生命周期     | 自设定                   | 标签页/窗口关闭  | 手动删除    |
| 是否向服务器发送 | 是，通过请求头的``cookie``        | 否     | 否            |
| 数据访问     | 同域窗口/标签页              | 同域窗口/标签页  | 同一标签页 |
| 安全性      | JS不能个性Http不涉及Only的``cookie`` | 不涉及           | 不涉及    |


---
### 网站性能优化
1. 合并请求资源：如雪碧图，文件合并，base64
2. DNS缓存/缓存策略
3. 延迟加载，减少首屏加载: 如将图片地址存在data属性中，当滚动到可视区域时再赋值src
4. 用户行为触发
5. CDN
6. Gzip
7. 减少cookie大小

---
### Get请求传参长度限制
- HTTP协议未作规定，最大长度是浏览器和服务器限制URI的长度，不同的浏览器和服务器限制的长度不一样
- 要支持IE，则最大长度为2083byte，若只支持chrome，则最大长度为8182byte

---
### ``URL``和``URI``的区别
- URI：统一资源标识符，http://www.xxx.com/html/html1, 命名机制+主机名+资源自身路径
- URL：统一资源定位器，http://www.11.com:9000/aaa, schema://host:port/path, schema有http, ftp, gopher等
- URN：统一资源命名：mailto:java-net@java.sun.com
- URL和URN是URI的子集

---
### 浏览器是单进程吗？进程和线程的区别？
- 浏览器有单进程也有多进程，现代浏览器几乎都是多进程，开一个tab页即为开一个进程
- 进程(process)：一个具有独立功能的各班以在一个数据集上的一次动态执行过程，是操作系统分配资源的最小单位，进程间相互独立
- 线程(thread): 程序执行中一个单一的顺序控制流，是程序执行的最小单位
- 浏览器内核为多线程
  - GUI渲染线程
  - Javascript引擎线程
  - 定时触发器线程
  - 事件触发线程
  - 异步http请求线程

---
### 跨域方法
- 同源策略：协议，域名，端口全都一致
- 方法：
  - 以下三个标签允许跨域加载资源: ``<img>``、``<script>``、``<link>``
  - JSONP:
    - 仅支持``GET``方法
    - 客户端通过``<script>``标签发起跨域请求，服务器返回一段JS代码，客户端通过执行这段代码获取数据
    - 调用失败时无不会返回HTTP状态码
    - 不安全（xss）
    ```js
    function jsonp ({url, params, cb}) {
      return new Promise((resolve, reject) => {
        let script = document.createElement("script")
        window[cb] = function(data) {
          resolve(data)
          document.body.removeChild("script")
        }
        params = {...params, cb}
        let arr = []
        for(let key in params) {
          arr.push(`${key}=${params[key]}`)
        }
        script.src = `${url}?${arr.join("&")}`
        document.body.appendChild(script)
      })
    }
    jsonp({
      url: "",
      params: {a: "1"},
      cb: "show"
      }).then(res => {
        console.log(res)
      })
    ```
  - CORS: 需浏览器和服务器（设置响应头）同时支持，几乎所有浏览器都支持，ie8和9需通过``XDomainRequest``实现
    - 当浏览器发起跨域请求时，浏览器先发送一个**预检请求**（``OPTIONS``请求），以确定服务器是否允许跨域。如果允许则发送实际请求，并附带相应响应头
  - 代理PROXY：通过代理服务器转发请求。前端将请求发送到同源服务器，服务器再将请求转发至目标服务器
  - ``Websocket``:
    - ``Websocket``协议本身不受同源策略限制
    - 安全性由服务器检查``Origin``头，且使用``wss://``协议
  - ``iframe`` + ``postMessage``
    - 使用``iframe``嵌入不同域的网页，父页面通过``postMessage``向``iframe``发送消息
    - ``iframe``页面通过监听``message``事件接收并处理父页面发来的消息

---
### 数据存储类型
- 持久化存储：只有用户选择清理才会被清理
- 临时存储：当最近一次使用时Storage limits达到限制时会被自动清理（LRU Policy）
  - LRU Policy: 磁盘空间满时，配额管理器按最近最少使用的源开始清理，直到浏览器不再超过限制

---
### 预检请求（Preflight Request）
由浏览器自动发送的一个``OPTIONS``请求：
- 询问服务器是否允许当前网页对目标资源进行跨域请求
- 防止潜在的CSRF
  - 服务器响应（返回``Access-Control-*``头）通过本次预检后浏览器才发送真正的``POST``请求
- 当请求**不属于**简单请求时才触发预检
  - 简单请求：
    - 方法：``GET``、``POST``、``HEAD``
    - ``Content-Type``: ``text/plain``、``application/x-www-form-urlencoded``、``multipart/form-data``
    - 无自定义头部：不能有如``Authorization``、``X-Custom-Header``等
- 如果接口频繁被调用并触发预检，可设置响应头缓存``Access-Control-Max-Age``，如设置为600时即为600秒内不重复发预检
