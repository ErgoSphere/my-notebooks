### Vue基本原理
- 创建实例时，Vue遍历data属性，使用``Object.defineProperty``(Vue2)/``Proxy``(Vue3)对其进行包装，定义``getter/setter``，在内部追踪相关依赖。当属性被访问修改时通知变化。每个组件实例有相应的``wathcer``，它在组件渲染过程中把属性记为依赖，当依赖项的``setter``被调用时，会通知``watcher``重新计算，使其相关联的组件更新
  - 2.0: 通过数据劫持***发布者-订阅者***的方式实现 ⇒ ```Object.defineProperty``` ⇒ 将每个数据读写转化为```getter/setter```， 对象上有```get()```、```set()```
    ```js
    const book = {}
    let name = ''
    Object.defineProperty(book, 'name', { 
      set: function(v) {
        name = v
      },
      get: function() {
        return `${name}!` 
      }
    })
    book.name = 'fake'
    console.log(book.name) // 'fake!'
    ```
    - 初始化时，``Object.defineProperty``给每个属性建立``getter/setter``，每个独立使用一个``Dep``作为收集器
    - 建立一个``watcher``添加到``Dep``中，当属性``set``时，由``Dep``通知``watcher``更新页面，``get``时通过``Dep``查找相关``watcher``
    - 无法通过直接赋值修改对象值与```getter/setter```初始化有关，浏览器对```Object.observe```支持较差，实际是未作递归的观察，原因为运行速度太差
    - ES5特性，且无法补丁实现，所以不支持IE8及更低版本
    - 不能检测到对象属性的添加或删除
    - 当实例上的```data```被使用```Object.freeze()```时，将阻止修改现有的property，意味着响应系统无法再追踪变化
    - ref:
      - https://my.oschina.net/u/4386652/blog/4281447
      - https://juejin.cn/post/6844903479044112391
      - https://www.huaweicloud.com/articles/d9c3ab01500c3343fd240da6cc65c8c6.html
  - 3.0
    ```js
    function reactive(target) {
      const handler = {
        get(target, key, receiver) {
          // 收集依赖
          if (typeof target[key] === 'object' && target[key] !== null) {
            // 对嵌套对象也进行响应式处理
            return reactive(target[key])
          }
          return target[key]
        },
        set(target, key, value, receiver) {
          // 修改值时触发，通知更新
          target[key] = value
          // 这里可以执行更新逻辑，触发视图的重新渲染
          return true
        }
      }
      return new Proxy(target, handler)
    }
    ``` 
- ``Object.defineProperty``到``Proxy``的迁移优劣：
  - ``Object.defineProperty``: 
    - 兼容性更佳
    - 只能遍历对象属性进行更改
    - 嵌套对象的深层次响应式追踪可能有性能问题
  - ``Proxy``:
    - 可以直接监听任意类型的对象（数组，函数，另一人代理等）
    - 通够直接代理整个对象及其嵌套属性，不需要给每个属性添加``getter/setter``
    - 返回一个新对象，可以只操作新对象以达到目的
    - ES6语法，可能有兼容性问题

---
### Vue3运行机制概述
- DOM操作方式
  ```mermaid
  graph LR
  
  A(document) --- B[&lt;html&gt;]
  B --- C[&lt;head&gt;] --- E[&lt;title&gt;]
  B --- D[&lt;body&gt;] --- F[&lt;h1&gt;]
  ```
  ```js
  let item = document.getElementsByTagName('h1')[0]
  item.textContent = 'change content'
  ```
- 虚拟DOM过程
  - 使用虚拟DOM的好处：
    - 让组件的渲染逻辑从真实DOM中解耦
    - 可以直接重用框架运行在其他环境中
    - 允许第三方创建自定义渲染``createRenderer()``，不仅仅是浏览器上，包括iOS和Android等，也可以渲染到WebGL上而非DOM节点
    - 提供了以编程的方式构造、检查、克隆及操作所需DOM操作的能力

---
### 实现不同组件间数据交流的方法
1. 父子组件：父 ⇒ 子 ``defineProps``, 子 ⇒ 父 ``defineEmits``
2. ``vuex``(2.x)/``pinia``(3.x)
3. 通过根实例或者父组件实例
   - 2.x: 每个new Vue实例的子组件中，根实例可通过``$root``访问, 父组件实例可通过``$parent``访问
   - 3.x: 不再在实例上暴露``$root``和``$parent``，而是采用``getCurrentInstance``来管理
     ```js
     import { getCurrentInstance } from 'vue'
     export default {
       setup () {
         const instance = getCurrentInstance()
         const root = instance?.appContext.config.globalProperties
       }
     }
     ```
4. 通过ref访问子组件实例或子元素
5. 依赖注入，指定父组件可提供给后代组件数据/方法， 父``provide``， 多层子``inject``
6. vue.prototype["object_name"]
7. 构建event bus
   ```js
   // bus.js
   import Vue from 'developments/Vue/vue'

   const bus = new Vue()
   export default bus
   // component a
   bus.$emit('event-name', params)
   // component b
   bus.$on('event-name', res => {
   })
   ```
   
---
### computed默认只有getter，但可以自定义setter
```js
new Vue({
 data: {
  a: 1
 },
 computed: {
  counter: {
   get: function () {
    return "nyanyanya"
   },
   set: function () {
    this.a = 2
   }
  }
 }
})
```

---
### v-for
- v-if与v-for同时使用时，v-for具有更高优先级
- v-for遍历时，按Object.keys()结果遍历，但不保证在不同的JS引擎下都一致

---
### 全局组件
- 全局组组件的注册行为必须在根实例化前发生，props的验证会在组件实例创建前进行
- 组件props的type可为自定义函数([参考](https://cn.vuejs.org/v2/guide/components-props.html))

---
### 插槽
DEMO: [https://github.com/ErgoSphere/vue-virtual-scroller](https://github.com/ErgoSphere/vue-virtual-scroller)

---
### 生命周期
- 2.x
  1. beforeCreated: 什么都不干
  2. created: 初始化data，实际已做好绑定，但$el仍为undefined
  3. beforeMounted: 编译好模板，生成DOM(实际为替换DIV)
  4. mounted: 挂载， 旧$el被新$el替换完毕
  5. beforeUpdate: 更新视图之前，未渲染，在这里更改状态不会触发重渲染
  6. updated: 视图更新
  7. beforeDestroyed: 销毁实例前，实例仍可用
  8. destroyed: 当前实例和子实例销毁完成后（服务端渲染期不可用）
- 3.x
  1. ``setup``: 创建阶段，包含了``beforeCreate``和``created``，无权访问``this``
     - ``beforeCreate``：在组件实例创建前，此时``data``和``computed``都未被初始化，无法访问组件数据
     - ``created``: 组件实例创建完成，可访问``data``、``computed``、``methods``
  2. ``beforeMount``： 组件挂载到DOM之前，``render``函数执行前。此时模板已解析，组件``data``和``computed``被初始化
  3. ``mounted``： 组件挂载到DOM之后，``render``函数**第一次**执行后。组件被创建并插入DOM中，可以进行部分DOM操作（获取DOM元素尺寸，添加事件监听等）
  4. ``beforeUpdate``： 响应式数据发生变化，组件DOM未更新前。当组件数据（``data``/``props``）变化，需要组件重新渲染时会触发此钩子，此时仍能访问旧DOM
  5. ``updated``：组件DOM更新完成后
  6. ``beforeUnmount``：组件销毁前，可以在此阶段做清理工作（清除定时器/取消网络请求/解除事件监听等）
  7. ``unmounted``：组件销毁后，组件实例和DOM元素都被销毁后

---
### [Vue 2.x 升级 Vue 3.x](https://github.com/ErgoSphere/es-plugins/blob/master/src/views/Comprehensive/VueMigrating.vue)

---
### 使用innerHTML等原生方法后样式失效
样式标签应为<style lang="scss"></style>，不可以使用scoped属性

---
### vue prototype 全局变量动态更新
以vuex存储状态更新值为例
```js
Vue.mixin({
 computed: {
  LOCALE: function() {
   return store.state.sys.info ? store.state.sys.info.lang_packet: {}
  }
 }
})
new Vue({
 components: { App },
 router,
 store,
 template: "<App/>"
}).$mount("#app")
```

---
### 父子组件生命周期顺序
1. 加载渲染：父beforeCreate → 父created → 父beforeMount → 子beforeCreate → 子created → 子beforeMount → 子mounted → 父mounted
2. 子组件更新：父beforeUpdate → 子beforeUpdate → 子updated → 父updated
3. 父组件更新：父beforeUpdate → 父updated
4. 销毁：父beforeDestroy → 子beforeDestroy → 子destroyed → 父destroyed

---
### Vue打包vendor过大解决
- vue-router懒加载
- gzip压缩
- CDN引入js和css
- webpack配置external，不打包第三方库
- 配置DLLPlugin和DLLReferencePlugin，将引用依赖提取

---
### Vue的模板语法引擎？
- Vue使用的Mustache模板引擎（双大括号语法）

---
### keep-alive使用注意
- 初次进入：created → mounted → activated
- 退出时触发deactivated
- 再次进入仅触发activated

---
### vue动态组件 + keep-alive
```
<keep-alive>
<component :is="current"></component>
</keep-alive>
<script>
import ComponentA from "./ComponentA"
import ComponentB from "./ComponentB"
export default {
 components: {
  ComponentA,
  ComponentB
 },
 
 data () {
  return {
   current: "ComponentA"
  }
 }
}
</script>
```

---
### Vue diff算法（未够详细解答
- 实现
  1. 由真实DOM生成虚拟DOM树
  2. 当某个DOM节点数据变化时，生成一个新的VNode
  3. 新的VNode和旧的oldVNode进行对比
  4. 通过patch函数给真实DOM打补丁
- 优点: Vue的虚拟DOM更新为**异步更新队列**，如想马上拿到DOM更新后的DOM信息，使用<code>Vue.nextTick</code>
- Vue diff算法只作同层级元素比较，不跨级

---
### vue性能优化
- 避免响应所有数据：在data的数据都会增加getter, setter且收集watcher，不需要响应的数据可直接定义在实例上
- 纯展示不改变的大量数据用<code>Object.freeze</code>来冻结，避免vue劫持数据
 ```js
 export default {
  data : () => ({
   users: {}
  }),
  async created() {
   const users = await axios.get("/api/users")
   this.users = Object.freeze(users)
  }
 }
 ```

---
### ``watch()``和``watchEffect()``的区别
- ``watch()``需要先定义源，``watchEffect()``直接获取函数
  ```js
  watch(() => state.count, (newVal, oldVal) => {})
  watchEffect(() => {})
  ```
  
---
### ``nextTick``原理及简单实现
- 基于异步任务队列和微任务实现，确保DOM更新(Vue中DOM为异步更新)后再执行回调
- 先检查当前是否支持``Promise``，不支持则使用``MutationObserver``或``setTimeout``来模拟
```js
let callbacks = [], pending = false
function nextTick(cb) {
  callbacks.push(cb)
  if(!pending) {
    pending = true
    Promise.resolve().then(flushCallbacks) // 用微任务队列来回调
  }
}
function flushCallbacks() {
  callbacks.forEach(cb => cb()) // 执行回调
  callbacks = []
  pending = false
}
```

---
### ``v-if``、``v-show``、``v-html``原理
- ``v-if``调用``addIfCondition``，在生成``vnode``会根据条件判断是否忽略对应节点，``render``时是否渲染（完全销毁和重建DOM）
- ``v-show``会生成``vnode``，``render``时也渲染成真实节点，在渲染过程中修改``display``的值（元素始终在DOM中）
- ``v-html``先移除节点下的所有节点，调用``html``方法，通过``addProp``添加``innerHTML``属性，设置``innerHTML``为``v-html``的值。有``XSS``攻击风险