## vue3 hooks

---
- ### ref:
    - https://juejin.cn/post/7066951709678895141
    - https://juejin.cn/post/6844903877574295560
    - https://juejin.cn/post/6844903865108676615
    - https://juejin.cn/post/7083401842733875208
- ### 定义：从组件剥离出来的，与组件状态相关的变量的定义和逻辑操作函数文件。可随时被引入和调用，高内聚低耦合
    - 基于组合式API
    - 只能在```setup```内使用
    - 引用时将响应式变量或者方法显式解构暴露出来如：```const {nameRef，Fn} = useXX()``
    - 可灵活传递任何参数来改变逻辑 ```const {...} = useXX(param1, param2)```
- ### 命名规范：
  - 参考react hooks的命名方式，以```use-``开头
- ### 为什么要使用
  - 跨组件代码难以复用
  - 组件较大时，维护困难，细度划分时，嵌套层次太深，影响性能
  - 类组件```this```不可控，逻辑分散，不容易理解
  - 如果使用```mixin```作组件状态共享时，数据来源不明，无法多次引入，同名覆盖，逻辑互相嵌套且不能相互消费
- 用意：
  - 可以整合关联业务代码为复数组件所使用
  - 业务逻辑和组件页面剥离后代码可读性更高
      - vue2 mixin:
          - 难以追溯的方法与属性
          - 同名方法覆盖
          - 无法两次mixin同一文件：可用动态生成完成能力利用，但增加了程序的复杂性
        ```js
        export default {
          mixins: [a, b, c],
          mounted () {
            console.log(this.name) // 无法判断来源于谁，如果有几个功能同时定义name作为属性，则会出现值覆盖
          }
        }
        ```
      - vue3 hooks:
    ```js
    const { name } = useName() // 来源清晰
    const { name: firstName } = useName() // 内部变量在闭包内，返回亦是支持定义别名，无重名及覆盖问题
    const { name: lastName } = useName() // 多次复用
    ```
- 代码组织： 可将关联业务逻辑组织在一个hooks内部，响应变量和方法在一起定义和调用

- ### Hook vs Utils
  - hook着重的是对业务逻辑的复用，有响应式状态；utils强调的是单一操作的公共方法，无状态