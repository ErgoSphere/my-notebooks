### Webpack开启gzip
```js
const CompressionWebpackPlugin = require("compression-webpack-plugin")
configureWebpack: config => {
  return {
    plugins: [
      new CompressionWebpackPlugin({
        test: /\.(js|css)(\?.*)?$/i
      })
    ]
  }
}
```

---
### webpack打包慢解决
- 减少文件依赖嵌套深度
- 使用尽可能少的处理(loader, plugin)
- DLL处理第三方包
- 多线程打包（webpack-parallel-uglify-plugin）
- 关闭sourcemap
- 减少代码体积，压缩代码
- 优化resolve.extensions, resolve.modules, resolve.alias
- 使用include和exclude
- 设置babel-loader缓存

---
### webpack作用
- 模块打包
- 编译兼容：如通过<code>Loader</code>对代码<code>polyfill</code>, 编译转换.less, .vue等浏览器无法识别的格式文件
- 能力扩展：通过<code>Plugin</code>机制实现代码压缩等功能

---
### webpack打包流程
1. 读取webpack的配置参数
2. 启动webpack, 创建`Compiler`对象并开始解析项目
  - `compiler`是一个全局单例，负责把控整个打包的构建流程。暴露出和webpack整个生命周期相关的钩子`compiler-hooks`
  - `compilation`对象是每次构建的上下文对象，每次热更新和重构，`compiler`对会重新生成一个新的`compilation`象负责本次更新的构建，暴露出和模块依赖有关的事件钩子<code>compilation-hooks</code>
3. 从入口文件(`entry`)开始解析，找到导入的依赖模块，遍历分析，形成依赖关系树
    - 模块间的依赖关系来自AST语法树
4. 对不同文件类型的依赖使用相应的`Loader`编译，最终转为Javascript文件
5. 整个过程中webpack会通过发布订阅模式，向外抛出一些`hooks`，webpack plugin可能过监听这个关键的事件点，执行插件任务。

---
### webpack5 bundle
打包后的立即执行函数里边只有三个变量和一个方法
- `__webpack_modules__`： 存放编译后的各个文件模块的JS内容
- `__webpack_module_cache__`：模块缓存
- `__webpack_require__`: webpack内部实现的一套依赖函数，把ES Module或CommonJS规范的引入/导出模块，替换成自己的来实现，从而实现缓存机制及抹平不同规范间的一些差异性

---
### Webpack Loader （负责文件转换）
本质为一个函数，webpack内部默认只能够处理JS模块代码，在打包过程中，会默认把所有文件都当作JS代码进行解析，因此当项目含非JS类型的文件时，我们需要先对其转换，才能继续执行打包任务
```js
//loader配置
//webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /^regexp$/,
        use: [
          {
            loader: "loader-name-a"
          },
          {
            loader: "loader-name-b"
          }
        ]
      }
    ]
  }
}
```
针对每个文件类型支持配置多个loader，当webpack在转换该文件类型时，会按顺序链式调用每一个loader, 前一个loader的返回作为下一个loader的入参，所以开发loader要遵循一些规范，例如返回值必须是标准的JS代码字符串，保证下一个loader的正常工作

loader函数中的this上下文由webpack提供，这个this指向一个叫<code>loaderContext</code>的<code>loader-runner</code>的特有对象

---
### Webpack plugin（负责功能扩展）开发
- 插件必须是一个**函数**或**包含<code>apply</code>方法的对象**，这样才能访问compiler实例
- 传给每个插件的compiler和compilation对象都是**同一个引用**，如果在一个插件中修改了它们身上的属性将会影响后面的插件
- 异步事件的处理必须在插件处理完任务时回调通知webpack进入下一流程，否则会卡住
```js
//plugin开发例子
class MyPlugin {
  apply (compiler) {
    compiler.hooks.emit.tap("MyPlugin", compilation => {})
  }
}
```

---
### source map是什么，生产环境如何使用？
- source map是将编译打包压缩后的代码映射回源代码的过程
- 线上环境处理方案：
  - hidden-source-map: 借且第三方平台Sentry使用
  - nosources-source-map: 仅显示具体行数以及查看源代码的错误栈，安全性比sourcemap高
  - sourcemap: 通过nginx设置将.map文件对白名单开放

---
### webpack监听模式及原理
- 开启方式：
    - 启动webpack命令时带上`--watch`参数
    - 在webpack.config.js中设置watch: true
- 缺点：每次都要手动刷新浏览器
- 原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生变化，先缓存起来，等<code>aggregateTimeout</code>后执行

---
### webpack热更新原理
- HMR(Hot Module Replacement)，WDS(webpack-dev-server)
- 客户端从服务端拉更新后的文件(chunk diff)，实际上WDS与浏览器间维持一个websocket，当本地资源变化时，WDS向浏览器摄像头更新，带上构建时的hash，让客户端与上次资源进行对比。客户端比对出差异后向WDS发送Ajax请求获取更改内容（文件列表、hash），客户端借助这些信息继续向WDS发起jsonp请求获取该chunk的增量更新。拿到增量后由HotModulePlugin来完成处理

---
### 文件指纹
- 指打包后输出的文件名后缀
    - Hash: 和项目构建有关，只要项目文件有修改，hash就会变
    - Chunkhash：和webpack打包的chunk有关，不同的entry生成不同的Chunkhash
    - Contenthash: 根椐文件内容定义，文件内容不变，Contenthash不变
- JS的指纹设置: output filename, chunkhash
```js
module.exports = {
  entry: {
    app: "./src/app.js",
    search: "./src/search.js"
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
  }
}
```
- CSS的指纹设置: MiniCssExtractPlugin filename， contenthash
```js
module.exports = {
  entry: {
    app: "./src/app.js",
    search: "./src/search.js"
  },
  output: {
    filename: '[name][chunkhash:8].js',
    path: __dirname + '/dist'
  },
  plugins: [
    new MiniCssExtractPlgin({
      filename: `[name][contenthash:8].css`
    })
  ]
}
```
- 图片的指纹设置：file-loader name, hash

---
### webpack打包pc端自适配插件
```
yarn add lib-flexible-computer px2rem-loader postcss-px2rem --dev
```
```js
//main.js
import "lib-flexible-computer"
//vue.config.js，webpack
module.exports = {
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require("postcss-px2rem")({
            remUnit: 192 //设计稿尺寸/10
          })
        ]
      }
    },
  },
}
```

---
### ``webpack`` vs ``vite``
- 启动速度：
  - ``webpack``：冷启动慢，依赖越多越慢，因为启动时需要遍历所有依赖，生成完整``bundle``
  - ``vite``: 冷启动快，启动时权启动服务器，不打包代码
- 热更新：
  - ``webpack``：修改文件后，重新构建更新``bundle``
  - ``vite``: 利用``ES Module``和``HTTP缓存``，按需编译修改的模块
- 资源加载：
  - ``webpack``：所有资源通过打包后的``bundle``加载
  - ``vite``: 通过``<script type="module">``引入，按需请求文件

| 功能     | ``webpack``                 | ``vite``                   | 
|--------|-----------------------------|----------------------------|
| 底层机制   | 基于``bundle``                | 基于``ES Module``            |
| 启动速度   | 冷启动慢                        | 冷启动快                       |
| 适用性    | 复杂，定制化程度高的工程                | 快速迭代开发的轻量工程       | 
| 开发环境构建 | 全量打包生成``bundle``            | 按需编译                       |
| 生产环境构建 | 全量打包 + 优化                   | ``Rollup``打包（默认）或保留``ESM`` |
| 输出格式   | 多种支持(``CommonJS``、``ESM``等) | 默认``ESM``，传统格式打包需插件        |
| 浏览器支持  | 支持``IE``等旧浏览器               | 对浏览器版本有要求，仅支持现代浏览器         |


---
###  ES6转ES5思路及babel原理
- 代码字符串解析成AST（抽象语法树/Abstract Syntax Tree）: ES6 AST → ES5 AST → 再次生成代码字符串
- babel转译：解析parse → 转换transfer(babel-traverse) → 生成generate (babel-generator)

---
### Tree Shaking
- Webpack在打包时移除无用代码的优化技术，基本ES Module的静态分析，只保留被实际使用的代码，从而减小打包体积
- 仅支持ESM的引入方式，不支持CommonJS
- 生产环境下，默认开启Tree Shaking
- 不能直接对CSS进行Tree Shaking，因为CSS（声明式）本身不具有模块的``import/export``引用关系，可借助plugin去除未使用的CSS
  - ``purgecss-webpack-plugin``
  - TailwindCSS自带Tree Shaking机制（``tailwind.config.js``）
  - 使用vue + vite的话可以用``vite-plugin-purgecss``

---
### 打包优化
- ``babel-runtime``：用于优化``Babel``转译后的代码，减少代码冗余。原理是将一些常见的``Babel``转译辅助代码提取到外部模块，而不是在每个文件中重复生成。
  - 帮助处理``Polyfill``：``babel-runtime``提供了一个共享的库来存放一些polyfill（如兼容新特性Promise、Map等功能至老浏览器的代码），以便不同文件间共享
  - 帮助处理辅助函数：``Babel``转译中生成的一些辅助函数（``_extends``、``_objectspread``等），将这些函数从模块中提取出来集中到一个地方，避免重复代码增加体积
  - ``regenerator-runtime``支持：如果使用了``async/await``等生成器函数，``babel-runtime``还会自动提供支持``regenerator-runtime``，减少重复包含该库的情况
  ```json
  {
    "plugin": [
      "@babel/plugin-transform-runtime"
    ]
  }
  ```  
  
---
### 如何修改第三方npm包
- 补丁方案``patch-package``：在``node_modules``找到要修改的包，修改内容后运行``patch-package``创建``patch``文件
  ```
  npm i patch-package postinstall
  ```
  ```
  npm patch-package package-name
  ```
  运行后在项目根目录下创建一个``patches``文件夹并生成一个名为``package-name+version.patch``的文件，在``package.json``中加入
  ```
  "script": {
    "postinstall": "patch-package"
  }
  ```
  
---
### 优化
- [打包优化](#打包优化)
- `webpack-merge`: 当区分基础/开发/生产环境配置时，在打包时合并
- `SplitChunksPlugin`: 分割代码，可将公共依赖提取到单独的chunk中，配合浏览器缓存，减少重复加载
- `TerserPlugin`: 压缩代码
- `tree-shaking`: 仅打包用到的模块和代码
- 配置`externals`：将大型库`lodash`等配置为外部依赖，避免打包到最终bundle中
- `webpack-bundle-analyzer`: 分析打包结果
- `cache-loader/HardSourceWebpackPlugin`: 缓存构建结果，提高二次构建速度