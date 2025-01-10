### 浏览器渲染页面的两种模式
可由``document.compatMode``获取
- ``CSS1Compat``: 标准模型
- ``BackCompat``: 怪异模型

---
### ``<script>``中的``defer``及``async``属性
``defer``及``async``异步加载，不阻塞页面解析
- 多个文件异步加载时， ``async``无序加载， ``defer``按顺序加载
- ``aynsc``文件与js脚本的``加载``和``执行``为同时并行进行的异步执行;``defer``与js脚本的``加载``并行执行，而``执行``在文档所有元素解析完之后，``DOMContentLoaded``之前