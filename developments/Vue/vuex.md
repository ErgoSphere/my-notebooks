###  vuex页面刷新数据丢失处理
- store的数据保存在运行内存中，刷新时会重载实例，被重新初始化
- 解决：
    - localStorage: 生命周期永久
    - sessionStorage: 生命周期仅在当前会话有效，在同源窗口中始终存在，只要浏览器窗口未关闭，刷新或进入同源另一页面都会存在。直至关闭窗口时销毁。同时独立打开同一窗口同一页面，sessionStorage不一致。
    - cookie: 生命周期只存在于设置的过期时间之前，即使窗口或浏览器关闭。存放数据大小限制（浏览器限制），不能储存大数据且不易读取。
- vue作为SPA在一个页面上跳转路由，sessionStorage较为合适
    - sessionStorage可以保证打开页面时sessionStorage数据为空
