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