###  vuex页面刷新数据丢失处理
- store的数据保存在运行内存中，刷新时会重载实例，被重新初始化
- 解决：
    - localStorage: 生命周期永久
    - sessionStorage: 生命周期仅在当前会话有效，在同源窗口中始终存在，只要浏览器窗口未关闭，刷新或进入同源另一页面都会存在。直至关闭窗口时销毁。同时独立打开同一窗口同一页面，sessionStorage不一致。
    - cookie: 生命周期只存在于设置的过期时间之前，即使窗口或浏览器关闭。存放数据大小限制（浏览器限制），不能储存大数据且不易读取。
- vue作为SPA在一个页面上跳转路由，sessionStorage较为合适
    - sessionStorage可以保证打开页面时sessionStorage数据为空

---
### vuex实现方式
- 通过``Vue.mixin``在``beforeCreated``的时候注入``$store``对象

---
### Vuex和Pinia的区别
| 对比项   | Vuex                        | Pinia             | 
|-------|-----------------------------|-------------------|
| 写法    | Mutation + Action           | 不强制Mutation       | 
| API风格 | Options API                 | Composition API   | 
| TS支持  | 需要手动定义                      | 默认支持              | 
| 模块化   | 需``namespaced``             | 直接``defineStore`` | 
| 持久化   | 额外需要``vuex-persistedstate`` | 不强制Mutation       | 
| 性能    | Mutation有额外开销               | 更轻量，更快            | 